import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
  PRIMARY_ADMIN_EMAIL,
} from '../firebase';
import { INITIAL_PRODUCTS, Product } from '../data/products';
import { formatINR } from '../config/site';
import {
  CmsEventCategory,
  CmsFaqItem,
  CmsHighlightStory,
  CmsMediaItem,
  CmsQuoteEnquiry,
  DEFAULT_EVENT_CATEGORIES,
  DEFAULT_FAQ_ITEMS,
  DEFAULT_HIGHLIGHT_STORIES,
  DEFAULT_MEDIA_ITEMS,
  DEFAULT_SITE_SETTINGS,
  SiteSettingsData,
} from '../data/cmsDefaults';

export interface QuoteCartItem {
  productId: string;
  quantity: number;
  widthFt?: number;
  heightFt?: number;
  fiveHourBlocks?: number;
}

export interface EventQuoteDetails {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventType: string;
  eventDate: string;
  rentalDays: number;
  venue: string;
  audienceSize: string;
  additionalRequirements: string;
}

export interface ItemPriceEstimate {
  isValid: boolean;
  isQuoteOnly: boolean;
  minSubtotal: number;
  maxSubtotal: number;
  calculationSummary: string;
  validationMessage?: string;
}

interface QuoteContextValue {
  // Auth & Cloud Admin
  currentUser: User | null;
  isAuthReady: boolean;
  isCloudAdmin: boolean;
  isSyncingCloud: boolean;
  lastCloudSyncStatus: string | null;
  signInAdminWithGoogle: () => Promise<void>;
  signOutAdmin: () => Promise<void>;
  syncAllToCloud: () => Promise<void>;

  // Site Settings & Sections CMS
  siteSettings: SiteSettingsData;
  updateSiteSettings: (updates: Partial<SiteSettingsData>) => Promise<void>;
  mediaItems: CmsMediaItem[];
  upsertMediaItem: (item: CmsMediaItem) => Promise<void>;
  deleteMediaItem: (id: string) => Promise<void>;
  eventCategories: CmsEventCategory[];
  updateEventCategories: (categories: CmsEventCategory[]) => void;
  highlightStories: CmsHighlightStory[];
  updateHighlightStories: (stories: CmsHighlightStory[]) => void;
  faqItems: CmsFaqItem[];
  updateFaqItems: (faqs: CmsFaqItem[]) => void;

  // Products Catalogue CMS
  products: Product[];
  upsertProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  bulkAdjustProductPrices: (percentageChange: number, categoryFilter?: string) => Promise<void>;
  updateProductRate: (
    productId: string,
    updates: { minPrice: number; maxPrice: number; requestQuoteOnly?: boolean }
  ) => void;
  resetProductsToDefault: () => void;

  // Enquiries Inbox
  enquiries: CmsQuoteEnquiry[];
  logQuoteEnquiry: (
    input: Omit<CmsQuoteEnquiry, 'id' | 'status' | 'createdBy' | 'createdAtIso'>
  ) => Promise<void>;
  updateEnquiryStatus: (id: string, status: CmsQuoteEnquiry['status']) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;

  // Backup & Restore
  exportFullWebsiteData: () => string;
  importFullWebsiteData: (jsonString: string) => boolean;
  resetEntireWebsiteToDefaults: () => void;

  // Quote Builder Cart
  cartItems: QuoteCartItem[];
  eventDetails: EventQuoteDetails;
  isQuoteDrawerOpen: boolean;
  setIsQuoteDrawerOpen: (open: boolean) => void;
  addToQuote: (
    productId: string,
    options?: { quantity?: number; widthFt?: number; heightFt?: number; fiveHourBlocks?: number }
  ) => void;
  removeFromQuote: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  updateItemDimensions: (productId: string, widthFt?: number, heightFt?: number) => void;
  updateItemFiveHourBlocks: (productId: string, blocks: number) => void;
  updateEventDetails: (updates: Partial<EventQuoteDetails>) => void;
  clearCart: () => void;
  totalItemCount: number;
  getItemEstimate: (item: QuoteCartItem) => ItemPriceEstimate;
  cartTotals: {
    minTotal: number;
    maxTotal: number;
    hasUnconfirmedItems: boolean;
    hasInvalidDimensionItems: boolean;
  };
  buildWhatsAppQuoteMessage: () => string;
  getWhatsAppQuoteUrl: () => string;
}

const CART_STORAGE_KEY = 'liveon_connect_quote_cart_v1';
const EVENT_STORAGE_KEY = 'liveon_connect_event_details_v1';
const PRODUCTS_STORAGE_KEY = 'liveon_connect_products_v3';
const SITE_SETTINGS_STORAGE_KEY = 'liveon_connect_site_settings_v1';
const MEDIA_ITEMS_STORAGE_KEY = 'liveon_connect_media_items_v1';
const EVENT_CATEGORIES_STORAGE_KEY = 'liveon_connect_event_categories_v1';
const HIGHLIGHT_STORIES_STORAGE_KEY = 'liveon_connect_highlight_stories_v1';
const FAQ_ITEMS_STORAGE_KEY = 'liveon_connect_faq_items_v1';
const ENQUIRIES_STORAGE_KEY = 'liveon_connect_enquiries_v1';

const VALID_ID_REGEX = /^[a-zA-Z0-9_\-]+$/;

function sanitizeId(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 128);
  return cleaned && VALID_ID_REGEX.test(cleaned) ? cleaned : `item-${Date.now()}`;
}

function clampString(val: string | undefined, minLen: number, maxLen: number, fallback: string): string {
  const trimmed = (val ?? '').trim();
  const effective = trimmed.length >= minLen ? trimmed : fallback;
  return effective.slice(0, maxLen);
}

const DEFAULT_EVENT_DETAILS: EventQuoteDetails = {
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  eventType: 'Corporate Conference / Summit',
  eventDate: '',
  rentalDays: 1,
  venue: '',
  audienceSize: '',
  additionalRequirements: '',
};

const QuoteContext = createContext<QuoteContextValue | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [lastCloudSyncStatus, setLastCloudSyncStatus] = useState<string | null>(null);

  const isCloudAdmin = Boolean(
    currentUser &&
      currentUser.emailVerified &&
      currentUser.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()
  );

  // 2. Site Settings & Sections State
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData>(() => {
    try {
      const saved = localStorage.getItem(SITE_SETTINGS_STORAGE_KEY);
      if (saved) return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const [mediaItems, setMediaItems] = useState<CmsMediaItem[]>(() => {
    try {
      const saved = localStorage.getItem(MEDIA_ITEMS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_MEDIA_ITEMS;
  });

  const [eventCategories, setEventCategories] = useState<CmsEventCategory[]>(() => {
    try {
      const saved = localStorage.getItem(EVENT_CATEGORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_EVENT_CATEGORIES;
  });

  const [highlightStories, setHighlightStories] = useState<CmsHighlightStory[]>(() => {
    try {
      const saved = localStorage.getItem(HIGHLIGHT_STORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_HIGHLIGHT_STORIES;
  });

  const [faqItems, setFaqItems] = useState<CmsFaqItem[]>(() => {
    try {
      const saved = localStorage.getItem(FAQ_ITEMS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_FAQ_ITEMS;
  });

  // 3. Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_PRODUCTS;
  });

  // 4. Enquiries State
  const [enquiries, setEnquiries] = useState<CmsQuoteEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // 5. Quote Cart State
  const [cartItems, setCartItems] = useState<QuoteCartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });

  const [eventDetails, setEventDetails] = useState<EventQuoteDetails>(() => {
    try {
      const saved = localStorage.getItem(EVENT_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_EVENT_DETAILS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_EVENT_DETAILS;
  });

  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Firestore Listeners for Live Public Config, Catalogue & Media
  useEffect(() => {
    if (!isAuthReady) return;

    const unsubConfig = onSnapshot(
      doc(db, 'siteConfig', 'main'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setSiteSettings((prev) => ({
            ...prev,
            businessName: data.businessName || prev.businessName,
            tagline: data.tagline || prev.tagline,
            phone: data.phone || prev.phone,
            whatsappNumber: data.whatsappNumber || prev.whatsappNumber,
            email: data.email || prev.email,
            addressFull: data.addressFull || prev.addressFull,
            instagramUrl: data.instagramUrl || prev.instagramUrl,
            logoPath: data.logoPath || prev.logoPath,
            heroBadge: data.heroBadge || prev.heroBadge,
            heroTitle: data.heroTitle || prev.heroTitle,
            heroAccent: data.heroAccent || prev.heroAccent,
            heroSubtitle: data.heroSubtitle || prev.heroSubtitle,
          }));
        }
      },
      (err) => {
        // Non-fatal if doc doesn't exist yet
        console.warn('SiteConfig listener note:', err.message);
      }
    );

    const prodQuery = query(collection(db, 'catalogueProducts'), where('minPrice', '>=', 0));
    const unsubProducts = onSnapshot(
      prodQuery,
      (snap) => {
        if (!snap.empty) {
          const cloudProds: Product[] = snap.docs.map((d) => {
            const data = d.data();
            const existingMatch = INITIAL_PRODUCTS.find((ip) => ip.id === data.id);
            return {
              id: data.id,
              name: data.name,
              category: data.category,
              description: data.description,
              imagePath: data.imagePath,
              minPrice: Number(data.minPrice) || 0,
              maxPrice: Number(data.maxPrice) || 0,
              pricingUnit: data.pricingUnit || 'day',
              pricingUnitLabel: data.pricingUnitLabel || '/ day',
              availabilityStatus: data.availabilityStatus || 'Subject to Confirmation',
              requestQuoteOnly: Boolean(data.requestQuoteOnly),
              featured: Boolean(data.featured),
              packageLabel: data.packageLabel || undefined,
              subGroup: data.subGroup || existingMatch?.subGroup,
              badge: data.badge || undefined,
              technicalSpecs: Array.isArray(data.technicalSpecs) ? data.technicalSpecs : [],
              eventTags: Array.isArray(data.eventTags) ? data.eventTags : ['corporate'],
              quantityRules: existingMatch?.quantityRules || {
                minQuantity: 1,
                maxQuantity: 20,
                step: 1,
                requiresDimensions: data.pricingUnit === 'sq_ft',
                defaultWidthFt: data.pricingUnit === 'sq_ft' ? 12 : undefined,
                defaultHeightFt: data.pricingUnit === 'sq_ft' ? 8 : undefined,
                usesFiveHourBlocks: data.pricingUnit === '5_hours',
              },
            };
          });
          setProducts(cloudProds);
        }
      },
      (err) => {
        console.warn('Products listener note:', err.message);
      }
    );

    const mediaQuery = query(collection(db, 'mediaItems'), where('sortOrder', '>=', 0));
    const unsubMedia = onSnapshot(
      mediaQuery,
      (snap) => {
        if (!snap.empty) {
          const cloudMedia: CmsMediaItem[] = snap.docs
            .map((d) => {
              const data = d.data();
              return {
                id: data.id,
                mediaType: data.mediaType,
                title: data.title,
                categoryOrTag: data.categoryOrTag,
                caption: data.caption,
                src: data.src,
                poster: data.poster || '',
                span: data.span || 'lg:col-span-4',
                sortOrder: Number(data.sortOrder) || 0,
              };
            })
            .sort((a, b) => a.sortOrder - b.sortOrder);
          setMediaItems(cloudMedia);
        }
      },
      (err) => {
        console.warn('Media listener note:', err.message);
      }
    );

    return () => {
      unsubConfig();
      unsubProducts();
      unsubMedia();
    };
  }, [isAuthReady]);

  // Firestore Listener for Admin Enquiries
  useEffect(() => {
    if (!isAuthReady || !isCloudAdmin) return;

    const unsubEnquiries = onSnapshot(
      collection(db, 'quoteEnquiries'),
      (snap) => {
        if (!snap.empty) {
          const list: CmsQuoteEnquiry[] = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id,
              customerName: data.customerName,
              customerPhone: data.customerPhone,
              customerEmail: data.customerEmail || '',
              eventType: data.eventType,
              eventDate: data.eventDate || '',
              venue: data.venue || '',
              equipmentSummary: data.equipmentSummary,
              estimatedTotal: data.estimatedTotal,
              status: data.status || 'new',
              createdBy: data.createdBy || '',
              createdAtIso: data.createdAt?.toDate
                ? data.createdAt.toDate().toISOString()
                : new Date().toISOString(),
            };
          });
          setEnquiries(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'quoteEnquiries');
      }
    );

    return () => unsubEnquiries();
  }, [isAuthReady, isCloudAdmin]);

  // LocalStorage Sync
  useEffect(() => {
    try {
      localStorage.setItem(SITE_SETTINGS_STORAGE_KEY, JSON.stringify(siteSettings));
    } catch {
      // ignore
    }
  }, [siteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(MEDIA_ITEMS_STORAGE_KEY, JSON.stringify(mediaItems));
    } catch {
      // ignore
    }
  }, [mediaItems]);

  useEffect(() => {
    try {
      localStorage.setItem(EVENT_CATEGORIES_STORAGE_KEY, JSON.stringify(eventCategories));
    } catch {
      // ignore
    }
  }, [eventCategories]);

  useEffect(() => {
    try {
      localStorage.setItem(HIGHLIGHT_STORIES_STORAGE_KEY, JSON.stringify(highlightStories));
    } catch {
      // ignore
    }
  }, [highlightStories]);

  useEffect(() => {
    try {
      localStorage.setItem(FAQ_ITEMS_STORAGE_KEY, JSON.stringify(faqItems));
    } catch {
      // ignore
    }
  }, [faqItems]);

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(enquiries));
    } catch {
      // ignore
    }
  }, [enquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(eventDetails));
    } catch {
      // ignore
    }
  }, [eventDetails]);

  // Auth Actions
  const signInAdminWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signOutAdmin = async () => {
    await signOut(auth);
  };

  // Write Helper for Site Settings to Firestore
  const saveSiteSettingsToCloud = async (nextSettings: SiteSettingsData) => {
    if (!isCloudAdmin || !currentUser) return;
    const path = 'siteConfig/main';
    try {
      const cleanWhatsapp = nextSettings.whatsappNumber.replace(/[^0-9]/g, '').slice(0, 20) || '918590952476';
      await setDoc(doc(db, 'siteConfig', 'main'), {
        businessName: clampString(nextSettings.businessName, 1, 120, 'LIVEON CONNECT'),
        tagline: clampString(nextSettings.tagline, 1, 200, 'LED WALL, LIVE STREAMING, SOUND COMPANY'),
        phone: clampString(nextSettings.phone, 5, 40, '+91 8590952476'),
        whatsappNumber: cleanWhatsapp.length >= 8 ? cleanWhatsapp : '918590952476',
        email: clampString(nextSettings.email, 5, 120, 'Liveonconnect@gmail.com'),
        addressFull: clampString(nextSettings.addressFull, 5, 300, 'Manimala, Kottayam, Kerala – 686543, India'),
        instagramUrl: clampString(nextSettings.instagramUrl, 5, 500, 'https://www.instagram.com/liveonconnect'),
        logoPath: clampString(nextSettings.logoPath, 1, 500, '/images/liveon-connect-logo.png'),
        heroBadge: clampString(nextSettings.heroBadge, 1, 150, DEFAULT_SITE_SETTINGS.heroBadge),
        heroTitle: clampString(nextSettings.heroTitle, 1, 200, DEFAULT_SITE_SETTINGS.heroTitle),
        heroAccent: clampString(nextSettings.heroAccent, 1, 100, DEFAULT_SITE_SETTINGS.heroAccent),
        heroSubtitle: clampString(nextSettings.heroSubtitle, 1, 600, DEFAULT_SITE_SETTINGS.heroSubtitle),
        updatedBy: currentUser.uid,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const updateSiteSettings = async (updates: Partial<SiteSettingsData>) => {
    const next: SiteSettingsData = {
      ...siteSettings,
      ...updates,
      whatsappNumber:
        updates.whatsappNumber !== undefined
          ? updates.whatsappNumber.replace(/[^0-9]/g, '') || siteSettings.whatsappNumber
          : siteSettings.whatsappNumber,
    };
    setSiteSettings(next);
    if (isCloudAdmin) {
      await saveSiteSettingsToCloud(next);
      setLastCloudSyncStatus('Site settings synced to cloud');
    }
  };

  // Write Helper for Product to Firestore
  const saveProductToCloud = async (prod: Product) => {
    if (!isCloudAdmin || !currentUser) return;
    const safeId = sanitizeId(prod.id);
    const path = `catalogueProducts/${safeId}`;
    try {
      const minP = Math.max(0, Math.min(10000000, Math.round(Number(prod.minPrice) || 0)));
      const maxP = Math.max(minP, Math.min(10000000, Math.round(Number(prod.maxPrice) || minP)));
      const payload: Record<string, unknown> = {
        id: safeId,
        name: clampString(prod.name, 1, 160, 'AV Equipment'),
        category: prod.category,
        description: clampString(prod.description, 1, 1000, 'Professional AV rental equipment.'),
        imagePath: clampString(prod.imagePath, 1, 2000, '/img/spk-500-mics.webp'),
        minPrice: minP,
        maxPrice: maxP,
        pricingUnit: prod.pricingUnit || 'day',
        pricingUnitLabel: clampString(prod.pricingUnitLabel, 1, 40, '/ day'),
        availabilityStatus: prod.availabilityStatus || 'Subject to Confirmation',
        requestQuoteOnly: Boolean(prod.requestQuoteOnly),
        featured: Boolean(prod.featured),
        technicalSpecs: (prod.technicalSpecs || [])
          .slice(0, 10)
          .map((s) => String(s).slice(0, 200)),
        eventTags: (prod.eventTags || [])
          .filter((t) => ['corporate', 'launches', 'weddings', 'concerts'].includes(t))
          .slice(0, 4),
        updatedBy: currentUser.uid,
        updatedAt: serverTimestamp(),
      };
      if (prod.packageLabel) payload.packageLabel = prod.packageLabel.slice(0, 160);
      if (prod.subGroup) payload.subGroup = prod.subGroup.slice(0, 100);
      if (prod.badge) payload.badge = prod.badge.slice(0, 80);

      await setDoc(doc(db, 'catalogueProducts', safeId), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const upsertProduct = async (product: Product) => {
    const safeId = sanitizeId(product.id);
    const normalized: Product = {
      ...product,
      id: safeId,
      minPrice: Math.max(0, Number(product.minPrice) || 0),
      maxPrice: Math.max(Number(product.minPrice) || 0, Number(product.maxPrice) || 0),
    };
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === safeId);
      if (exists) {
        return prev.map((p) => (p.id === safeId ? normalized : p));
      }
      return [normalized, ...prev];
    });
    if (isCloudAdmin) {
      await saveProductToCloud(normalized);
      setLastCloudSyncStatus(`Saved "${normalized.name}" to cloud`);
    }
  };

  const deleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (isCloudAdmin) {
      const path = `catalogueProducts/${productId}`;
      try {
        await deleteDoc(doc(db, 'catalogueProducts', productId));
        setLastCloudSyncStatus('Deleted product from cloud');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    }
  };

  const bulkAdjustProductPrices = async (percentageChange: number, categoryFilter?: string) => {
    const factor = 1 + percentageChange / 100;
    const nextProducts = products.map((p) => {
      if (categoryFilter && categoryFilter !== 'ALL' && p.category !== categoryFilter) {
        return p;
      }
      const nextMin = Math.max(0, Math.round((p.minPrice * factor) / 50) * 50);
      const nextMax = Math.max(nextMin, Math.round((p.maxPrice * factor) / 50) * 50);
      return { ...p, minPrice: nextMin, maxPrice: nextMax };
    });
    setProducts(nextProducts);
  };

  // Media Item CRUD
  const saveMediaItemToCloud = async (item: CmsMediaItem) => {
    if (!isCloudAdmin || !currentUser) return;
    const safeId = sanitizeId(item.id);
    const path = `mediaItems/${safeId}`;
    try {
      await setDoc(doc(db, 'mediaItems', safeId), {
        id: safeId,
        mediaType: item.mediaType,
        title: clampString(item.title, 1, 200, 'LIVEON CONNECT Event Setup'),
        categoryOrTag: clampString(item.categoryOrTag, 1, 120, 'Live Production'),
        caption: clampString(item.caption, 1, 600, 'On-site audio-visual production setup.'),
        src: clampString(item.src, 1, 2000, '/assets/aistudio/IMG-20261025-WA0039_851e9d5d.jpg'),
        poster: (item.poster || '').slice(0, 2000),
        span: clampString(item.span, 1, 60, 'lg:col-span-4'),
        sortOrder: Math.max(0, Math.min(10000, Number(item.sortOrder) || 0)),
        updatedBy: currentUser.uid,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const upsertMediaItem = async (item: CmsMediaItem) => {
    const safeId = sanitizeId(item.id);
    const normalized: CmsMediaItem = { ...item, id: safeId };
    setMediaItems((prev) => {
      const exists = prev.some((m) => m.id === safeId);
      const updated = exists
        ? prev.map((m) => (m.id === safeId ? normalized : m))
        : [...prev, normalized];
      return updated.sort((a, b) => a.sortOrder - b.sortOrder);
    });
    if (isCloudAdmin) {
      await saveMediaItemToCloud(normalized);
      setLastCloudSyncStatus(`Saved media "${normalized.title}" to cloud`);
    }
  };

  const deleteMediaItem = async (id: string) => {
    setMediaItems((prev) => prev.filter((m) => m.id !== id));
    if (isCloudAdmin) {
      const path = `mediaItems/${id}`;
      try {
        await deleteDoc(doc(db, 'mediaItems', id));
        setLastCloudSyncStatus('Removed media item from cloud');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    }
  };

  const updateEventCategories = (categories: CmsEventCategory[]) => {
    setEventCategories(categories);
  };

  const updateHighlightStories = (stories: CmsHighlightStory[]) => {
    setHighlightStories(stories);
  };

  const updateFaqItems = (faqs: CmsFaqItem[]) => {
    setFaqItems(faqs);
  };

  // Sync Entire State to Cloud Firestore
  const syncAllToCloud = async () => {
    if (!isCloudAdmin || !currentUser) return;
    setIsSyncingCloud(true);
    try {
      await saveSiteSettingsToCloud(siteSettings);
      for (const prod of products) {
        await saveProductToCloud(prod);
      }
      for (const media of mediaItems) {
        await saveMediaItemToCloud(media);
      }
      setLastCloudSyncStatus(`All ${products.length} products & ${mediaItems.length} media items synced to Cloud!`);
    } finally {
      setIsSyncingCloud(false);
    }
  };

  // Enquiries CRUD
  const logQuoteEnquiry = async (
    input: Omit<CmsQuoteEnquiry, 'id' | 'status' | 'createdBy' | 'createdAtIso'>
  ) => {
    const safeId = `enq-${Date.now()}`;
    const newEnq: CmsQuoteEnquiry = {
      ...input,
      id: safeId,
      status: 'new',
      createdBy: currentUser?.uid || 'local-visitor',
      createdAtIso: new Date().toISOString(),
    };
    setEnquiries((prev) => [newEnq, ...prev]);

    if (currentUser && currentUser.emailVerified) {
      const path = `quoteEnquiries/${safeId}`;
      try {
        await setDoc(doc(db, 'quoteEnquiries', safeId), {
          id: safeId,
          customerName: clampString(input.customerName, 1, 120, 'Customer'),
          customerPhone: clampString(input.customerPhone, 5, 40, '+9100000000'),
          customerEmail: (input.customerEmail || '').slice(0, 120),
          eventType: clampString(input.eventType, 1, 120, 'General Event'),
          eventDate: (input.eventDate || '').slice(0, 60),
          venue: (input.venue || '').slice(0, 200),
          equipmentSummary: clampString(input.equipmentSummary, 1, 4000, 'General AV Enquiry'),
          estimatedTotal: clampString(input.estimatedTotal, 1, 200, 'To Be Confirmed'),
          status: 'new',
          createdBy: currentUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    }
  };

  const updateEnquiryStatus = async (id: string, status: CmsQuoteEnquiry['status']) => {
    const target = enquiries.find((e) => e.id === id);
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    if (isCloudAdmin && currentUser && target) {
      const path = `quoteEnquiries/${id}`;
      try {
        await setDoc(
          doc(db, 'quoteEnquiries', id),
          {
            status,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    }
  };

  const deleteEnquiry = async (id: string) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    if (isCloudAdmin) {
      const path = `quoteEnquiries/${id}`;
      try {
        await deleteDoc(doc(db, 'quoteEnquiries', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    }
  };

  // Backup Export / Import / Reset
  const exportFullWebsiteData = (): string => {
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        siteSettings,
        products,
        mediaItems,
        eventCategories,
        highlightStories,
        faqItems,
        enquiries,
      },
      null,
      2
    );
  };

  const importFullWebsiteData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.siteSettings) setSiteSettings({ ...DEFAULT_SITE_SETTINGS, ...parsed.siteSettings });
      if (Array.isArray(parsed.products) && parsed.products.length > 0) setProducts(parsed.products);
      if (Array.isArray(parsed.mediaItems) && parsed.mediaItems.length > 0) setMediaItems(parsed.mediaItems);
      if (Array.isArray(parsed.eventCategories)) setEventCategories(parsed.eventCategories);
      if (Array.isArray(parsed.highlightStories)) setHighlightStories(parsed.highlightStories);
      if (Array.isArray(parsed.faqItems)) setFaqItems(parsed.faqItems);
      if (Array.isArray(parsed.enquiries)) setEnquiries(parsed.enquiries);
      return true;
    } catch {
      return false;
    }
  };

  const resetEntireWebsiteToDefaults = () => {
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    setProducts(INITIAL_PRODUCTS);
    setMediaItems(DEFAULT_MEDIA_ITEMS);
    setEventCategories(DEFAULT_EVENT_CATEGORIES);
    setHighlightStories(DEFAULT_HIGHLIGHT_STORIES);
    setFaqItems(DEFAULT_FAQ_ITEMS);
    try {
      localStorage.removeItem(SITE_SETTINGS_STORAGE_KEY);
      localStorage.removeItem(PRODUCTS_STORAGE_KEY);
      localStorage.removeItem(MEDIA_ITEMS_STORAGE_KEY);
      localStorage.removeItem(EVENT_CATEGORIES_STORAGE_KEY);
      localStorage.removeItem(HIGHLIGHT_STORIES_STORAGE_KEY);
      localStorage.removeItem(FAQ_ITEMS_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const updateProductRate = (
    productId: string,
    updates: { minPrice: number; maxPrice: number; requestQuoteOnly?: boolean }
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              minPrice: Math.max(0, updates.minPrice),
              maxPrice: Math.max(updates.minPrice, updates.maxPrice),
              requestQuoteOnly: updates.requestQuoteOnly ?? p.requestQuoteOnly,
            }
          : p
      )
    );
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    try {
      localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const addToQuote = (
    productId: string,
    options?: { quantity?: number; widthFt?: number; heightFt?: number; fiveHourBlocks?: number }
  ) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: Math.min(
                  product.quantityRules.maxQuantity,
                  item.quantity + (options?.quantity ?? 1)
                ),
                widthFt: options?.widthFt ?? item.widthFt,
                heightFt: options?.heightFt ?? item.heightFt,
                fiveHourBlocks: options?.fiveHourBlocks ?? item.fiveHourBlocks,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          productId,
          quantity: options?.quantity ?? product.quantityRules.minQuantity,
          widthFt: options?.widthFt ?? product.quantityRules.defaultWidthFt,
          heightFt: options?.heightFt ?? product.quantityRules.defaultHeightFt,
          fiveHourBlocks:
            options?.fiveHourBlocks ?? (product.pricingUnit === '5_hours' ? 1 : undefined),
        },
      ];
    });
  };

  const removeFromQuote = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    if (quantity <= 0) {
      removeFromQuote(productId);
      return;
    }
    const clamped = Math.max(
      product.quantityRules.minQuantity,
      Math.min(product.quantityRules.maxQuantity, quantity)
    );
    setCartItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity: clamped } : item))
    );
  };

  const updateItemDimensions = (productId: string, widthFt?: number, heightFt?: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, widthFt, heightFt } : item
      )
    );
  };

  const updateItemFiveHourBlocks = (productId: string, blocks: number) => {
    const clamped = Math.max(1, Math.min(20, blocks));
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, fiveHourBlocks: clamped } : item
      )
    );
  };

  const updateEventDetails = (updates: Partial<EventQuoteDetails>) => {
    setEventDetails((prev) => ({
      ...prev,
      ...updates,
      rentalDays:
        updates.rentalDays !== undefined
          ? Math.max(1, Math.min(30, Number(updates.rentalDays) || 1))
          : prev.rentalDays,
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemEstimate = (item: QuoteCartItem): ItemPriceEstimate => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return {
        isValid: false,
        isQuoteOnly: true,
        minSubtotal: 0,
        maxSubtotal: 0,
        calculationSummary: 'Product not found',
      };
    }

    if (product.requestQuoteOnly) {
      return {
        isValid: true,
        isQuoteOnly: true,
        minSubtotal: 0,
        maxSubtotal: 0,
        calculationSummary: 'Rate marked as Request a Quote (requires business confirmation)',
      };
    }

    const days = Math.max(1, eventDetails.rentalDays || 1);

    if (product.pricingUnit === 'sq_ft') {
      const w = Number(item.widthFt);
      const h = Number(item.heightFt);
      if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
        return {
          isValid: false,
          isQuoteOnly: false,
          minSubtotal: 0,
          maxSubtotal: 0,
          calculationSummary: 'Enter valid width and height (ft) to calculate area estimate',
          validationMessage: 'Valid width (ft) and height (ft) are required for sq.ft calculation.',
        };
      }
      const areaSqFt = Math.round(w * h * 100) / 100;
      const minSub = Math.round(areaSqFt * product.minPrice * item.quantity * days);
      const maxSub = Math.round(areaSqFt * product.maxPrice * item.quantity * days);
      return {
        isValid: true,
        isQuoteOnly: false,
        minSubtotal: minSub,
        maxSubtotal: maxSub,
        calculationSummary: `${w} ft × ${h} ft = ${areaSqFt} sq ft × ${item.quantity} wall(s) × ${days} day(s)`,
      };
    }

    if (product.pricingUnit === '5_hours') {
      const blocks = Math.max(1, item.fiveHourBlocks || 1);
      const minSub = product.minPrice * item.quantity * blocks;
      const maxSub = product.maxPrice * item.quantity * blocks;
      return {
        isValid: true,
        isQuoteOnly: false,
        minSubtotal: minSub,
        maxSubtotal: maxSub,
        calculationSummary: `${item.quantity} unit(s) × ${blocks} block(s) of 5 hours (${blocks * 5} hrs total)`,
      };
    }

    // Standard daily rate
    const minSub = product.minPrice * item.quantity * days;
    const maxSub = product.maxPrice * item.quantity * days;
    return {
      isValid: true,
      isQuoteOnly: false,
      minSubtotal: minSub,
      maxSubtotal: maxSub,
      calculationSummary: `${item.quantity} unit(s) × ${days} rental day(s)`,
    };
  };

  const cartTotals = useMemo(() => {
    let minTotal = 0;
    let maxTotal = 0;
    let hasUnconfirmedItems = false;
    let hasInvalidDimensionItems = false;

    for (const item of cartItems) {
      const est = getItemEstimate(item);
      if (est.isQuoteOnly) {
        hasUnconfirmedItems = true;
      } else if (!est.isValid) {
        hasInvalidDimensionItems = true;
      } else {
        minTotal += est.minSubtotal;
        maxTotal += est.maxSubtotal;
      }
    }

    return {
      minTotal,
      maxTotal,
      hasUnconfirmedItems,
      hasInvalidDimensionItems,
    };
  }, [cartItems, products, eventDetails.rentalDays]);

  const totalItemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const buildWhatsAppQuoteMessage = (): string => {
    const days = Math.max(1, eventDetails.rentalDays || 1);

    const productLines =
      cartItems.length > 0
        ? cartItems
            .map((item, idx) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;
              const est = getItemEstimate(item);
              const label = product.packageLabel
                ? `${product.name} (${product.packageLabel})`
                : product.name;

              let estimateText = 'To Be Confirmed';
              if (!est.isQuoteOnly && est.isValid) {
                estimateText =
                  est.minSubtotal === est.maxSubtotal
                    ? formatINR(est.minSubtotal)
                    : `${formatINR(est.minSubtotal)}–${formatINR(est.maxSubtotal)}`;
              }

              if (product.pricingUnit === 'sq_ft') {
                const w = item.widthFt || 0;
                const h = item.heightFt || 0;
                const area = w > 0 && h > 0 ? `${w}x${h} ft (${w * h} sq ft)` : 'Dimensions TBC';
                return `${idx + 1}. ${label} — Qty: ${item.quantity}, Size: ${area}, Duration: ${days} day(s), Unit: ${product.pricingUnitLabel} [Indicative: ${estimateText}]`;
              }

              if (product.pricingUnit === '5_hours') {
                const blocks = item.fiveHourBlocks || 1;
                return `${idx + 1}. ${label} — Qty: ${item.quantity}, Duration: ${blocks} × 5-hour block(s) (${blocks * 5} hrs), Unit: ${product.pricingUnitLabel} [Indicative: ${estimateText}]`;
              }

              return `${idx + 1}. ${label} — Qty: ${item.quantity}, Duration: ${days} day(s), Unit: ${product.pricingUnitLabel} [Indicative: ${estimateText}]`;
            })
            .filter(Boolean)
            .join('\n')
        : 'No specific items selected yet — requesting general AV consultation.';

    let estimatedCostLine = 'To Be Confirmed';
    if (cartItems.length > 0 && (cartTotals.minTotal > 0 || cartTotals.maxTotal > 0)) {
      const rangeStr =
        cartTotals.minTotal === cartTotals.maxTotal
          ? formatINR(cartTotals.minTotal)
          : `${formatINR(cartTotals.minTotal)} – ${formatINR(cartTotals.maxTotal)}`;
      const suffix =
        cartTotals.hasUnconfirmedItems || cartTotals.hasInvalidDimensionItems
          ? ' (+ items requiring confirmation)'
          : ' (Indicative reference estimate; subject to confirmation)';
      estimatedCostLine = `${rangeStr}${suffix}`;
    }

    return [
      `Hello ${siteSettings.businessName},`,
      '',
      'I would like to request an audio-visual equipment rental quotation.',
      '',
      `Name: ${eventDetails.customerName.trim() || 'Not provided'}`,
      `Phone: ${eventDetails.customerPhone.trim() || 'Not provided'}`,
      `Event Type: ${eventDetails.eventType.trim() || 'Not specified'}`,
      `Event Date: ${eventDetails.eventDate.trim() || 'To Be Decided'} (${days} rental day${days > 1 ? 's' : ''})`,
      `Venue: ${eventDetails.venue.trim() || 'To Be Confirmed'}`,
      `Audience Size: ${eventDetails.audienceSize.trim() || 'Not specified'}`,
      '',
      'Equipment Required:',
      productLines,
      '',
      `Estimated Equipment Cost: ${estimatedCostLine}`,
      'Transportation: To Be Confirmed',
      `Additional Requirements: ${eventDetails.additionalRequirements.trim() || 'None specified'}`,
      '',
      'Please confirm availability and share your final quotation.',
      'Thank you.',
    ].join('\n');
  };

  const getWhatsAppQuoteUrl = (): string => {
    const msg = buildWhatsAppQuoteMessage();
    return `https://wa.me/${siteSettings.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <QuoteContext.Provider
      value={{
        currentUser,
        isAuthReady,
        isCloudAdmin,
        isSyncingCloud,
        lastCloudSyncStatus,
        signInAdminWithGoogle,
        signOutAdmin,
        syncAllToCloud,
        siteSettings,
        updateSiteSettings,
        mediaItems,
        upsertMediaItem,
        deleteMediaItem,
        eventCategories,
        updateEventCategories,
        highlightStories,
        updateHighlightStories,
        faqItems,
        updateFaqItems,
        products,
        upsertProduct,
        deleteProduct,
        bulkAdjustProductPrices,
        updateProductRate,
        resetProductsToDefault,
        enquiries,
        logQuoteEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        exportFullWebsiteData,
        importFullWebsiteData,
        resetEntireWebsiteToDefaults,
        cartItems,
        eventDetails,
        isQuoteDrawerOpen,
        setIsQuoteDrawerOpen,
        addToQuote,
        removeFromQuote,
        updateItemQuantity,
        updateItemDimensions,
        updateItemFiveHourBlocks,
        updateEventDetails,
        clearCart,
        totalItemCount,
        getItemEstimate,
        cartTotals,
        buildWhatsAppQuoteMessage,
        getWhatsAppQuoteUrl,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export function useQuote(): QuoteContextValue {
  const ctx = useContext(QuoteContext);
  if (!ctx) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return ctx;
}
