import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_PRODUCTS, Product } from '../data/products';
import { formatINR, siteConfig } from '../config/site';

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
  products: Product[];
  updateProductRate: (
    productId: string,
    updates: { minPrice: number; maxPrice: number; requestQuoteOnly?: boolean }
  ) => void;
  resetProductsToDefault: () => void;
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
const PRODUCTS_STORAGE_KEY = 'liveon_connect_products_v2';

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
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === INITIAL_PRODUCTS.length) {
          return INITIAL_PRODUCTS.map((initProd) => {
            const match = parsed.find((p: Product) => p.id === initProd.id);
            return match
              ? {
                  ...initProd,
                  minPrice: match.minPrice ?? initProd.minPrice,
                  maxPrice: match.maxPrice ?? initProd.maxPrice,
                  requestQuoteOnly: match.requestQuoteOnly ?? initProd.requestQuoteOnly,
                }
              : initProd;
          });
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_PRODUCTS;
  });

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

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore storage errors
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(eventDetails));
    } catch {
      // ignore storage errors
    }
  }, [eventDetails]);

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch {
      // ignore storage errors
    }
  }, [products]);

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
      `Hello ${siteConfig.businessName},`,
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
    return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <QuoteContext.Provider
      value={{
        products,
        updateProductRate,
        resetProductsToDefault,
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
