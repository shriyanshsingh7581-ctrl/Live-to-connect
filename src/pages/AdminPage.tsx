import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings,
  Package,
  Video,
  Image as ImageIcon,
  FileText,
  Inbox,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Upload,
  Download,
  RefreshCw,
  Cloud,
  LogIn,
  LogOut,
  Search,
  Star,
  ArrowUpRight,
  MessageCircle,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import {
  BUILT_IN_PHOTO_ASSETS,
  BUILT_IN_VIDEO_ASSETS,
  CmsMediaItem,
  SiteSettingsData,
} from '../data/cmsDefaults';
import {
  formatProductPriceRange,
  PricingUnit,
  Product,
  PRODUCT_CATEGORIES,
  ProductCategory,
} from '../data/products';
import { EquipmentImage } from '../components/EquipmentImage';

type AdminTab = 'catalogue' | 'videos' | 'photos' | 'content' | 'enquiries';

export const AdminPage: React.FC = () => {
  const {
    currentUser,
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
    resetProductsToDefault,
    enquiries,
    updateEnquiryStatus,
    deleteEnquiry,
    exportFullWebsiteData,
    importFullWebsiteData,
    resetEntireWebsiteToDefaults,
  } = useQuote();

  const [activeTab, setActiveTab] = useState<AdminTab>('catalogue');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Catalogue Tab State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [specsText, setSpecsText] = useState('');
  const [bulkPercent, setBulkPercent] = useState<string>('10');

  // Media (Videos & Photos) Modal State
  const [editingMedia, setEditingMedia] = useState<CmsMediaItem | null>(null);

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettingsData>(siteSettings);

  // Confirm Reset State
  const [confirmFactoryReset, setConfirmFactoryReset] = useState(false);

  const fileImportRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Compress uploaded image file into a clean data URL (<250KB) so it works in localStorage & Firestore
  const handleImageFileUpload = (
    file: File,
    onResult: (dataUrl: string) => void
  ) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 960;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          onResult(compressed);
          showToast('Photo uploaded & optimized!');
        }
      };
      img.src = String(ev.target?.result || '');
    };
    reader.readAsDataURL(file);
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.packageLabel && p.packageLabel.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const heroVideos = mediaItems.filter((m) => m.mediaType === 'hero_video');
  const productionVideos = mediaItems.filter((m) => m.mediaType === 'production_video');
  const fieldPhotos = mediaItems.filter((m) => m.mediaType === 'field_photo');

  const openCreateProductModal = () => {
    const newProd: Product = {
      id: `custom-gear-${Date.now()}`,
      name: '',
      packageLabel: '',
      subGroup: 'Custom Package',
      badge: 'New',
      isPhoto: true,
      category: 'Sound Systems',
      description: '',
      imagePath: '/img/spk-500-mics.webp',
      minPrice: 2000,
      maxPrice: 2500,
      pricingUnit: 'day',
      pricingUnitLabel: '/ day',
      technicalSpecs: ['Professional grade AV equipment', 'Tested prior to venue dispatch'],
      availabilityStatus: 'Subject to Confirmation',
      requestQuoteOnly: false,
      featured: false,
      eventTags: ['corporate', 'weddings'],
      quantityRules: { minQuantity: 1, maxQuantity: 20, step: 1 },
    };
    setEditingProduct(newProd);
    setSpecsText(newProd.technicalSpecs.join('\n'));
    setIsCreatingProduct(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct({ ...prod });
    setSpecsText((prod.technicalSpecs || []).join('\n'));
    setIsCreatingProduct(false);
  };

  const handleSaveProductModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editingProduct.name.trim()) {
      showToast('Please enter a product name.');
      return;
    }
    const unitLabelMap: Record<PricingUnit, string> = {
      day: '/ day',
      sq_ft: '/ sq ft',
      '5_hours': '/ 5 hours',
    };
    const finalProd: Product = {
      ...editingProduct,
      name: editingProduct.name.trim(),
      description: editingProduct.description.trim() || 'Professional AV rental equipment.',
      pricingUnitLabel: unitLabelMap[editingProduct.pricingUnit] || '/ day',
      technicalSpecs: specsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 10),
      quantityRules: {
        minQuantity: 1,
        maxQuantity: 20,
        step: 1,
        requiresDimensions: editingProduct.pricingUnit === 'sq_ft',
        defaultWidthFt: editingProduct.pricingUnit === 'sq_ft' ? 12 : undefined,
        defaultHeightFt: editingProduct.pricingUnit === 'sq_ft' ? 8 : undefined,
        usesFiveHourBlocks: editingProduct.pricingUnit === '5_hours',
      },
    };
    await upsertProduct(finalProd);
    setEditingProduct(null);
    showToast(isCreatingProduct ? 'New product added to catalogue!' : 'Product updated successfully!');
  };

  const openCreateMediaModal = (mediaType: CmsMediaItem['mediaType']) => {
    const isVideo = mediaType !== 'field_photo';
    setEditingMedia({
      id: `${mediaType}-${Date.now()}`,
      mediaType,
      title: '',
      categoryOrTag:
        mediaType === 'hero_video'
          ? 'Live Production Reel'
          : mediaType === 'production_video'
          ? `0${productionVideos.length + 1}. Live Event Setup`
          : 'On-Site Production',
      caption: '',
      src: isVideo
        ? BUILT_IN_VIDEO_ASSETS[0].path
        : BUILT_IN_PHOTO_ASSETS[0].path,
      poster: isVideo ? BUILT_IN_PHOTO_ASSETS[0].path : '',
      span:
        mediaType === 'production_video'
          ? 'md:col-span-6'
          : mediaType === 'field_photo'
          ? 'lg:col-span-4'
          : 'col-span-12',
      sortOrder:
        mediaType === 'hero_video'
          ? heroVideos.length + 1
          : mediaType === 'production_video'
          ? productionVideos.length + 1
          : fieldPhotos.length + 1,
    });
  };

  const handleSaveMediaModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedia) return;
    if (!editingMedia.title.trim()) {
      showToast('Please enter a title.');
      return;
    }
    await upsertMediaItem({
      ...editingMedia,
      title: editingMedia.title.trim(),
      caption: editingMedia.caption.trim() || editingMedia.title.trim(),
    });
    setEditingMedia(null);
    showToast('Media item saved!');
  };

  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings(settingsForm);
    showToast('Website settings & hero content saved!');
  };

  const handleDownloadBackup = () => {
    const json = exportFullWebsiteData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `liveon-connect-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Full website backup downloaded!');
  };

  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = importFullWebsiteData(String(ev.target?.result || ''));
      if (ok) {
        showToast('Backup restored successfully!');
      } else {
        showToast('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#060216] text-white pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-full bg-[#6854fc] text-white font-display font-bold text-base shadow-[0_10px_35px_rgba(104,84,252,0.8)] flex items-center gap-2.5 border border-white/25">
          <Check className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Control Header */}
      <section className="relative intellio-hero-beams border-b border-[#6854fc]/35 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6854fc]/20 border border-[#6854fc]/50 text-xs font-mono-tabular text-[#a594ff] mb-3">
                <Settings className="w-3.5 h-3.5" />
                <span>A-TO-Z MASTER ADMIN CONTROL PANEL</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">
                Manage <span className="text-[#6854fc]">{siteSettings.businessName}</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl">
                Control all {products.length} rental products, prices, live event videos, field photos, hero text, FAQs, contact details, and customer enquiries from one place.
              </p>
            </div>

            {/* Cloud Auth & Backup Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5">
              {currentUser ? (
                <div className="flex flex-wrap items-center gap-2.5 bg-[#0b0426] border border-[#6854fc]/50 rounded-2xl p-2.5">
                  <div className="px-2">
                    <div className="text-[11px] font-mono-tabular text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isCloudAdmin ? 'Verified Cloud Admin' : 'Signed In'}</span>
                    </div>
                    <div className="text-xs font-semibold text-white truncate max-w-[180px]">
                      {currentUser.email}
                    </div>
                  </div>
                  {isCloudAdmin && (
                    <button
                      type="button"
                      disabled={isSyncingCloud}
                      onClick={async () => {
                        await syncAllToCloud();
                        showToast('All website data synced to Firebase Cloud!');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#6854fc] hover:bg-[#7b6aff] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Cloud className="w-4 h-4" />
                      <span>{isSyncingCloud ? 'Syncing...' : 'Sync All to Cloud'}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={signOutAdmin}
                    className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 text-xs cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={signInAdminWithGoogle}
                  className="px-5 py-2.5 intellio-solid-btn text-sm flex items-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Admin Google Sign-In (Cloud Sync)</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleDownloadBackup}
                className="px-4 py-2.5 rounded-full bg-[#0b0426] hover:bg-[#6854fc]/20 border border-[#6854fc]/50 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#8c7bff]" />
                <span>Export Backup</span>
              </button>

              <button
                type="button"
                onClick={() => fileImportRef.current?.click()}
                className="px-4 py-2.5 rounded-full bg-[#0b0426] hover:bg-[#6854fc]/20 border border-[#6854fc]/50 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-[#8c7bff]" />
                <span>Import Backup</span>
              </button>
              <input
                ref={fileImportRef}
                type="file"
                accept=".json"
                onChange={handleImportBackupFile}
                className="hidden"
              />

              <Link
                to="/"
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center gap-1.5"
              >
                <span>View Live Website</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {lastCloudSyncStatus && (
            <div className="text-xs text-emerald-300 font-mono-tabular flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{lastCloudSyncStatus}</span>
            </div>
          )}

          {/* 5 Main Admin Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('catalogue')}
              className={`px-5 py-3 rounded-2xl font-display font-bold text-base flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'catalogue'
                  ? 'bg-[#6854fc] text-white shadow-[0_0_25px_rgba(104,84,252,0.6)]'
                  : 'bg-[#0b0426] text-slate-300 border border-[#6854fc]/35 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>1. Products &amp; Prices ({products.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('videos')}
              className={`px-5 py-3 rounded-2xl font-display font-bold text-base flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-[#6854fc] text-white shadow-[0_0_25px_rgba(104,84,252,0.6)]'
                  : 'bg-[#0b0426] text-slate-300 border border-[#6854fc]/35 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>2. Live Videos ({heroVideos.length + productionVideos.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('photos')}
              className={`px-5 py-3 rounded-2xl font-display font-bold text-base flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-[#6854fc] text-white shadow-[0_0_25px_rgba(104,84,252,0.6)]'
                  : 'bg-[#0b0426] text-slate-300 border border-[#6854fc]/35 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>3. Event Photos Gallery ({fieldPhotos.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSettingsForm(siteSettings);
                setActiveTab('content');
              }}
              className={`px-5 py-3 rounded-2xl font-display font-bold text-base flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-[#6854fc] text-white shadow-[0_0_25px_rgba(104,84,252,0.6)]'
                  : 'bg-[#0b0426] text-slate-300 border border-[#6854fc]/35 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>4. Website Text, Hero, Contact &amp; FAQs</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('enquiries')}
              className={`px-5 py-3 rounded-2xl font-display font-bold text-base flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'enquiries'
                  ? 'bg-[#6854fc] text-white shadow-[0_0_25px_rgba(104,84,252,0.6)]'
                  : 'bg-[#0b0426] text-slate-300 border border-[#6854fc]/35 hover:text-white'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>5. Customer Enquiries ({enquiries.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Tab Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ===================================================================
            TAB 1: PRODUCTS & PRICES MANAGER (ALL 52+ ITEMS)
           =================================================================== */}
        {activeTab === 'catalogue' && (
          <div className="space-y-6">
            {/* Top Controls: Search, Category Filter, Add Product & Bulk Price Adjust */}
            <div className="intellio-card rounded-[28px] p-5 sm:p-6 space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#8c7bff] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search any speaker, LED wall, Sharpy light, mixer, projector..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6854fc]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={openCreateProductModal}
                    className="px-5 py-3 intellio-solid-btn text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Equipment Product</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      resetProductsToDefault();
                      showToast('Reset catalogue to default 52 products!');
                    }}
                    className="px-4 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Default Rates</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'ALL'
                      ? 'bg-[#6854fc] text-white'
                      : 'bg-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  All Categories ({products.length})
                </button>
                {PRODUCT_CATEGORIES.map((cat) => {
                  const count = products.filter((p) => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#6854fc] text-white'
                          : 'bg-white/5 text-slate-300 hover:text-white'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Bulk Percentage Rate Adjuster */}
              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Percent className="w-4 h-4 text-[#8c7bff]" />
                  <span>
                    <strong>Bulk Price Adjuster</strong> (applies to{' '}
                    {selectedCategory === 'ALL' ? 'all products' : selectedCategory}):
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="number"
                    value={bulkPercent}
                    onChange={(e) => setBulkPercent(e.target.value)}
                    className="w-20 px-3 py-1.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-xs font-mono-tabular text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const pct = Number(bulkPercent) || 0;
                      bulkAdjustProductPrices(pct, selectedCategory);
                      showToast(`Adjusted ${selectedCategory} prices by ${pct > 0 ? '+' : ''}${pct}%`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#6854fc]/25 hover:bg-[#6854fc] border border-[#6854fc]/60 text-xs font-semibold text-white cursor-pointer"
                  >
                    Apply % Change
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      bulkAdjustProductPrices(10, selectedCategory);
                      showToast(`Increased ${selectedCategory} rates by +10%`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-semibold text-emerald-300 cursor-pointer"
                  >
                    +10% Rates
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      bulkAdjustProductPrices(-10, selectedCategory);
                      showToast(`Decreased ${selectedCategory} rates by -10%`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-semibold text-amber-300 cursor-pointer"
                  >
                    -10% Rates
                  </button>
                </div>
              </div>
            </div>

            {/* Product List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="intellio-card rounded-[24px] p-4 flex flex-col justify-between gap-4"
                >
                  <div className="flex gap-3.5">
                    <div className="w-24 h-20 rounded-xl bg-white p-1.5 shrink-0 border border-white/10 overflow-hidden">
                      <EquipmentImage
                        src={product.imagePath}
                        alt={product.name}
                        category={product.category}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-mono-tabular text-[#8c7bff] font-semibold truncate">
                          {product.category}
                        </span>
                        {product.featured && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-amber-400" /> Home
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-lg font-bold text-white truncate">
                        {product.name}
                      </h3>
                      {product.packageLabel && (
                        <p className="text-xs text-slate-400 truncate">{product.packageLabel}</p>
                      )}
                      <div className="text-sm font-mono-tabular font-bold text-emerald-300 mt-1">
                        {formatProductPriceRange(product)}
                      </div>
                    </div>
                  </div>

                  {/* Quick Inline Rate Editor */}
                  <div className="p-3 rounded-xl bg-[#060216] border border-[#6854fc]/30 space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">
                          Min Price (₹)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={product.minPrice}
                          onChange={(e) => {
                            const val = Math.max(0, Number(e.target.value) || 0);
                            upsertProduct({
                              ...product,
                              minPrice: val,
                              maxPrice: Math.max(val, product.maxPrice),
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#0b0426] border border-white/15 text-xs font-mono-tabular text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">
                          Max Price (₹)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={product.maxPrice}
                          onChange={(e) => {
                            const val = Math.max(product.minPrice, Number(e.target.value) || 0);
                            upsertProduct({
                              ...product,
                              maxPrice: val,
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#0b0426] border border-white/15 text-xs font-mono-tabular text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <label className="inline-flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(product.requestQuoteOnly)}
                          onChange={(e) =>
                            upsertProduct({
                              ...product,
                              requestQuoteOnly: e.target.checked,
                            })
                          }
                          className="rounded border-white/20 bg-[#0b0426] text-[#6854fc]"
                        />
                        <span>Quote Only</span>
                      </label>

                      <label className="inline-flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(product.featured)}
                          onChange={(e) =>
                            upsertProduct({
                              ...product,
                              featured: e.target.checked,
                            })
                          }
                          className="rounded border-white/20 bg-[#0b0426] text-[#6854fc]"
                        />
                        <span>Featured</span>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => openEditProductModal(product)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#6854fc]/20 hover:bg-[#6854fc] border border-[#6854fc]/50 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Full Edit (Photo / Specs / Text)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteProduct(product.id);
                        showToast(`Removed "${product.name}"`);
                      }}
                      className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/35 text-rose-300 cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: LIVE VIDEOS MANAGER (HERO REELS + PRODUCTION VIDEOS)
           =================================================================== */}
        {activeTab === 'videos' && (
          <div className="space-y-10">
            {/* Section A: Top Hero Video Switcher Reels */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    A. Top Hero Video Switcher Reels ({heroVideos.length})
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300">
                    These videos appear in the top Hero video player with the &ldquo;Live Reel 01, 02...&rdquo; switcher buttons.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openCreateMediaModal('hero_video')}
                  className="px-5 py-2.5 intellio-solid-btn text-sm flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Hero Video Reel</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {heroVideos.map((vid, idx) => (
                  <div
                    key={vid.id}
                    className="intellio-card rounded-[26px] p-4 sm:p-5 flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono-tabular text-[#8c7bff] font-semibold">
                          Live Reel 0{idx + 1} · {vid.categoryOrTag}
                        </span>
                        <h3 className="font-display text-xl font-bold text-white">
                          {vid.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingMedia({ ...vid })}
                          className="p-2 rounded-xl bg-[#6854fc]/20 hover:bg-[#6854fc] text-white cursor-pointer"
                          title="Edit Video"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteMediaItem(vid.id);
                            showToast('Hero video removed');
                          }}
                          className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 cursor-pointer"
                          title="Delete Video"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="rounded-2xl overflow-hidden aspect-video bg-[#050112] border border-[#6854fc]/35">
                      <video
                        src={vid.src}
                        poster={vid.poster}
                        controls
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section B: Live Production Portfolio Videos */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    B. Live Production Portfolio Videos ({productionVideos.length})
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300">
                    These videos appear in the &ldquo;Live Production Portfolio&rdquo; grid on the Home page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openCreateMediaModal('production_video')}
                  className="px-5 py-2.5 intellio-solid-btn text-sm flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Production Video</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productionVideos.map((vid) => (
                  <div
                    key={vid.id}
                    className="intellio-card rounded-[26px] p-4 flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono-tabular text-[#8c7bff] font-semibold block">
                          {vid.categoryOrTag}
                        </span>
                        <h3 className="font-display text-lg font-bold text-white leading-snug">
                          {vid.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingMedia({ ...vid })}
                          className="p-2 rounded-xl bg-[#6854fc]/20 hover:bg-[#6854fc] text-white cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteMediaItem(vid.id);
                            showToast('Production video removed');
                          }}
                          className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl overflow-hidden aspect-video bg-[#050112] border border-[#6854fc]/35">
                      <video
                        src={vid.src}
                        poster={vid.poster}
                        controls
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{vid.caption}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 3: EVENT PHOTOS GALLERY MANAGER (13+ FIELD PHOTOS)
           =================================================================== */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  On-Site Field Production Photo Gallery ({fieldPhotos.length})
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Add new event photos from your phone/computer, edit titles &amp; technical descriptions, or remove photos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openCreateMediaModal('field_photo')}
                className="px-5 py-3 intellio-solid-btn text-sm flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Event Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fieldPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="intellio-card rounded-[26px] p-4 flex flex-col justify-between gap-3"
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#050112] border border-[#6854fc]/35">
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-[#08031d]/90 border border-[#6854fc]/60 text-[11px] font-mono-tabular text-[#a594ff]">
                      {photo.categoryOrTag}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display text-lg font-bold text-white">{photo.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{photo.caption}</p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setEditingMedia({ ...photo })}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#6854fc]/20 hover:bg-[#6854fc] text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Photo &amp; Text</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteMediaItem(photo.id);
                        showToast('Photo removed from gallery');
                      }}
                      className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: WEBSITE TEXT, HERO, CONTACT, EVENT CATEGORIES & FAQs
           =================================================================== */}
        {activeTab === 'content' && (
          <div className="space-y-10">
            {/* 1. Brand, Contact & Hero Text Form */}
            <form
              onSubmit={handleSaveSiteSettings}
              className="intellio-card rounded-[28px] p-6 sm:p-8 space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    1. Business Contact &amp; Home Hero Content
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Changes here update the Header, Footer, Hero Banner, Contact Page, and WhatsApp Quote Generator immediately.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 intellio-solid-btn text-sm flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Business &amp; Hero Settings</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.businessName}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, businessName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Official Tagline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, tagline: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Display Phone Number
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm font-mono-tabular text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    WhatsApp Number (Digits with Country Code)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                    }
                    placeholder="918590952476"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm font-mono-tabular text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    value={settingsForm.instagramUrl}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Business Address
                  </label>
                  <input
                    type="text"
                    value={settingsForm.addressFull}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, addressFull: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Brand Logo Path / URL
                  </label>
                  <input
                    type="text"
                    value={settingsForm.logoPath}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, logoPath: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hero Top Pill Badge
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroBadge}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, heroBadge: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hero Main Headline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroTitle}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, heroTitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hero Highlighted Purple Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroAccent}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, heroAccent: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hero Subheadline Description
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.heroSubtitle}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white"
                  />
                </div>
              </div>
            </form>

            {/* 2. Event Categories Editor (4 Cards on Home Page) */}
            <div className="intellio-card rounded-[28px] p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  2. Event Category Cards (Home Page)
                </h2>
                <p className="text-xs text-slate-300">
                  Edit the 4 main event category cards and their photos on the Home page.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {eventCategories.map((cat, idx) => (
                  <div
                    key={cat.id}
                    className="p-4 rounded-2xl bg-[#060216] border border-[#6854fc]/35 space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Eyebrow</label>
                        <input
                          type="text"
                          value={cat.eyebrow}
                          onChange={(e) => {
                            const next = [...eventCategories];
                            next[idx] = { ...cat, eyebrow: e.target.value };
                            updateEventCategories(next);
                          }}
                          className="w-full px-3 py-1.5 rounded-xl bg-[#0b0426] border border-white/15 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Title</label>
                        <input
                          type="text"
                          value={cat.title}
                          onChange={(e) => {
                            const next = [...eventCategories];
                            next[idx] = { ...cat, title: e.target.value };
                            updateEventCategories(next);
                          }}
                          className="w-full px-3 py-1.5 rounded-xl bg-[#0b0426] border border-white/15 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={cat.description}
                        onChange={(e) => {
                          const next = [...eventCategories];
                          next[idx] = { ...cat, description: e.target.value };
                          updateEventCategories(next);
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-[#0b0426] border border-white/15 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Choose Built-in Event Photo or Paste Image URL
                      </label>
                      <select
                        value={cat.image}
                        onChange={(e) => {
                          const next = [...eventCategories];
                          next[idx] = { ...cat, image: e.target.value };
                          updateEventCategories(next);
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-[#0b0426] border border-white/15 text-xs text-white mb-2"
                      >
                        {BUILT_IN_PHOTO_ASSETS.map((a) => (
                          <option key={a.path} value={a.path}>
                            {a.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={cat.image}
                        onChange={(e) => {
                          const next = [...eventCategories];
                          next[idx] = { ...cat, image: e.target.value };
                          updateEventCategories(next);
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-[#0b0426] border border-white/15 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. FAQ Editor (About Page) */}
            <div className="intellio-card rounded-[28px] p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    3. Frequently Asked Questions ({faqItems.length} FAQs on About Page)
                  </h2>
                  <p className="text-xs text-slate-300">
                    Add, edit, or remove FAQs displayed on the About Us page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    updateFaqItems([
                      ...faqItems,
                      {
                        id: `faq-${Date.now()}`,
                        category: 'General',
                        question: 'New Question?',
                        answer: 'Enter your answer here.',
                      },
                    ]);
                    showToast('Added new FAQ item!');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#6854fc] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-4">
                {faqItems.map((faq, idx) => (
                  <div
                    key={faq.id}
                    className="p-4 rounded-2xl bg-[#060216] border border-[#6854fc]/35 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={faq.category}
                        onChange={(e) => {
                          const next = [...faqItems];
                          next[idx] = { ...faq, category: e.target.value };
                          updateFaqItems(next);
                        }}
                        placeholder="Category"
                        className="w-44 px-3 py-1.5 rounded-xl bg-[#0b0426] border border-white/15 text-xs font-mono-tabular text-[#8c7bff]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          updateFaqItems(faqItems.filter((_, i) => i !== idx));
                          showToast('Removed FAQ item');
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/30 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const next = [...faqItems];
                        next[idx] = { ...faq, question: e.target.value };
                        updateFaqItems(next);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#0b0426] border border-white/15 text-sm font-bold text-white"
                    />
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => {
                        const next = [...faqItems];
                        next[idx] = { ...faq, answer: e.target.value };
                        updateFaqItems(next);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#0b0426] border border-white/15 text-xs text-slate-200"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Highlight Stories / Testimonials Editor */}
            <div className="intellio-card rounded-[28px] p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  4. Home Bottom Highlight Stories ({highlightStories.length})
                </h2>
                <p className="text-xs text-slate-300">
                  Edit the rotating quote cards at the bottom of the Home page.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {highlightStories.map((st, idx) => (
                  <div
                    key={st.id}
                    className="p-4 rounded-2xl bg-[#060216] border border-[#6854fc]/35 space-y-2.5"
                  >
                    <label className="block text-[11px] text-slate-400">Author / Title</label>
                    <input
                      type="text"
                      value={st.author}
                      onChange={(e) => {
                        const next = [...highlightStories];
                        next[idx] = { ...st, author: e.target.value };
                        updateHighlightStories(next);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#0b0426] border border-white/15 text-xs font-bold text-white"
                    />
                    <label className="block text-[11px] text-slate-400">Role / Subtitle</label>
                    <input
                      type="text"
                      value={st.role}
                      onChange={(e) => {
                        const next = [...highlightStories];
                        next[idx] = { ...st, role: e.target.value };
                        updateHighlightStories(next);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#0b0426] border border-white/15 text-xs text-slate-300"
                    />
                    <label className="block text-[11px] text-slate-400">Quote Text</label>
                    <textarea
                      rows={3}
                      value={st.quote}
                      onChange={(e) => {
                        const next = [...highlightStories];
                        next[idx] = { ...st, quote: e.target.value };
                        updateHighlightStories(next);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#0b0426] border border-white/15 text-xs text-slate-200"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Factory Reset Danger Zone */}
            <div className="p-6 rounded-[28px] bg-rose-950/20 border border-rose-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-bold text-rose-300">
                  Factory Reset Entire Website
                </h3>
                <p className="text-xs text-slate-300">
                  Restore all products, prices, videos, photos, and text back to the original LIVEON CONNECT defaults.
                </p>
              </div>
              {!confirmFactoryReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmFactoryReset(true)}
                  className="px-5 py-2.5 rounded-xl bg-rose-600/25 hover:bg-rose-600 border border-rose-500/50 text-xs font-bold text-white cursor-pointer shrink-0"
                >
                  Reset All to Defaults
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetEntireWebsiteToDefaults();
                      setSettingsForm(siteSettings);
                      setConfirmFactoryReset(false);
                      showToast('Website restored to factory defaults!');
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white cursor-pointer"
                  >
                    Confirm Full Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmFactoryReset(false)}
                    className="px-3 py-2 rounded-xl bg-white/10 text-xs text-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 5: CUSTOMER QUOTES & ENQUIRIES INBOX
           =================================================================== */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Customer Quote &amp; Enquiry Inbox ({enquiries.length})
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Every quote request or contact enquiry generated by visitors is logged here so you can follow up on WhatsApp.
                </p>
              </div>
            </div>

            {enquiries.length === 0 ? (
              <div className="intellio-card rounded-[28px] p-12 text-center space-y-3">
                <Inbox className="w-10 h-10 text-[#8c7bff] mx-auto" />
                <h3 className="font-display text-2xl font-bold text-white">
                  No Enquiries Logged Yet
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  When customers submit a quote on the Quote Builder page or Contact page, their details and equipment list will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {enquiries.map((enq) => {
                  const cleanCustomerPhone = enq.customerPhone.replace(/[^0-9]/g, '');
                  const replyText = `Hello ${enq.customerName}, thank you for contacting ${siteSettings.businessName} regarding your ${enq.eventType} (${enq.eventDate || 'upcoming date'}). Here is our confirmation regarding your requested equipment:\n\n${enq.equipmentSummary}`;
                  const waReplyUrl = `https://wa.me/${cleanCustomerPhone}?text=${encodeURIComponent(replyText)}`;

                  return (
                    <div
                      key={enq.id}
                      className="intellio-card rounded-[24px] p-5 sm:p-6 space-y-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-xl font-bold text-white">
                              {enq.customerName}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#6854fc]/25 border border-[#6854fc]/50 text-xs font-mono-tabular text-[#a594ff]">
                              {enq.eventType}
                            </span>
                          </div>
                          <div className="text-xs text-slate-300 mt-1 space-x-3">
                            <span>Phone: {enq.customerPhone}</span>
                            {enq.customerEmail && <span>· Email: {enq.customerEmail}</span>}
                            {enq.eventDate && <span>· Event Date: {enq.eventDate}</span>}
                            {enq.venue && <span>· Venue: {enq.venue}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={enq.status}
                            onChange={(e) =>
                              updateEnquiryStatus(
                                enq.id,
                                e.target.value as 'new' | 'contacted' | 'confirmed' | 'archived'
                              )
                            }
                            className="px-3 py-1.5 rounded-xl bg-[#060216] border border-[#6854fc]/50 text-xs font-semibold text-white"
                          >
                            <option value="new">Status: New</option>
                            <option value="contacted">Status: Contacted</option>
                            <option value="confirmed">Status: Confirmed</option>
                            <option value="archived">Status: Archived</option>
                          </select>

                          <a
                            href={waReplyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Reply on WhatsApp</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => deleteEnquiry(enq.id)}
                            className="p-1.5 rounded-xl bg-rose-500/15 text-rose-300 hover:bg-rose-500/30 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#060216] border border-white/10 text-xs text-slate-200 font-mono whitespace-pre-wrap">
                        {enq.equipmentSummary}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Estimated Cost: <strong className="text-indigo-300">{enq.estimatedTotal}</strong></span>
                        <span>Logged: {new Date(enq.createdAtIso).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* =====================================================================
          MODAL 1: CREATE / EDIT PRODUCT MODAL
         ===================================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-[28px] bg-[#0b0426] border-2 border-[#6854fc]/60 p-6 sm:p-8 space-y-5 max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-display text-2xl font-bold text-white">
                {isCreatingProduct ? 'Add New Equipment Product' : `Edit Product: ${editingProduct.name}`}
              </h2>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Package Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.packageLabel || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, packageLabel: e.target.value })
                    }
                    placeholder="e.g. 2 Top & 1 Sub · 100–150 Pax"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white"
                  >
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Billing Unit
                  </label>
                  <select
                    value={editingProduct.pricingUnit}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        pricingUnit: e.target.value as PricingUnit,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white"
                  >
                    <option value="day">Per Day (/ day)</option>
                    <option value="sq_ft">Per Square Foot (/ sq ft)</option>
                    <option value="5_hours">Per 5-Hour Block (/ 5 hours)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Minimum Rate (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.minPrice}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        minPrice: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm font-mono-tabular text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Maximum Rate (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.maxPrice}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        maxPrice: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm font-mono-tabular text-white"
                  />
                </div>
              </div>

              {/* Product Image Upload or URL */}
              <div className="p-4 rounded-2xl bg-[#060216] border border-[#6854fc]/35 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-xs font-semibold text-slate-300">
                    Product Photo URL or Upload from Device
                  </label>
                  <label className="px-3.5 py-1.5 rounded-xl bg-[#6854fc] hover:bg-[#7b6aff] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageFileUpload(file, (dataUrl) =>
                            setEditingProduct({ ...editingProduct, imagePath: dataUrl })
                          );
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={editingProduct.imagePath}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, imagePath: e.target.value })
                  }
                  placeholder="/img/spk-500-mics.webp or https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0b0426] border border-white/15 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Technical Specifications (One per line)
                </label>
                <textarea
                  rows={3}
                  value={specsText}
                  onChange={(e) => setSpecsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-xs font-mono text-white"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="inline-flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.featured)}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, featured: e.target.checked })
                    }
                  />
                  <span>Feature on Home Page</span>
                </label>

                <label className="inline-flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.requestQuoteOnly)}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        requestQuoteOnly: e.target.checked,
                      })
                    }
                  />
                  <span>Hide Rate (&ldquo;Request a Quote&rdquo; Only)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 text-xs font-semibold text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 intellio-solid-btn text-sm cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: CREATE / EDIT MEDIA (VIDEO OR FIELD PHOTO) MODAL
         ===================================================================== */}
      {editingMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-[28px] bg-[#0b0426] border-2 border-[#6854fc]/60 p-6 sm:p-8 space-y-5 max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-display text-2xl font-bold text-white">
                {editingMedia.mediaType === 'field_photo'
                  ? 'Edit Event Gallery Photo'
                  : 'Edit Live Event Video'}
              </h2>
              <button
                type="button"
                onClick={() => setEditingMedia(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMediaModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category Badge / Number Tag
                </label>
                <input
                  type="text"
                  value={editingMedia.categoryOrTag}
                  onChange={(e) =>
                    setEditingMedia({ ...editingMedia, categoryOrTag: e.target.value })
                  }
                  placeholder="e.g. FOH Control & LED Wall or 01. Live Auditorium Broadcast"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingMedia.title}
                  onChange={(e) =>
                    setEditingMedia({ ...editingMedia, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description / Technical Caption
                </label>
                <textarea
                  rows={2}
                  value={editingMedia.caption}
                  onChange={(e) =>
                    setEditingMedia({ ...editingMedia, caption: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-sm text-white"
                />
              </div>

              {editingMedia.mediaType !== 'field_photo' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Select Uploaded Event Video or Paste Video URL
                    </label>
                    <select
                      value={editingMedia.src}
                      onChange={(e) =>
                        setEditingMedia({ ...editingMedia, src: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-xs text-white mb-2"
                    >
                      {BUILT_IN_VIDEO_ASSETS.map((v) => (
                        <option key={v.path} value={v.path}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={editingMedia.src}
                      onChange={(e) =>
                        setEditingMedia({ ...editingMedia, src: e.target.value })
                      }
                      placeholder="/assets/aistudio/VID-... or https://..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Video Poster Thumbnail Photo
                    </label>
                    <select
                      value={editingMedia.poster}
                      onChange={(e) =>
                        setEditingMedia({ ...editingMedia, poster: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-xs text-white"
                    >
                      {BUILT_IN_PHOTO_ASSETS.map((p) => (
                        <option key={p.path} value={p.path}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-2xl bg-[#060216] border border-[#6854fc]/35 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Upload New Event Photo or Select Existing
                    </label>
                    <label className="px-3.5 py-1.5 rounded-xl bg-[#6854fc] hover:bg-[#7b6aff] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageFileUpload(file, (dataUrl) =>
                              setEditingMedia({ ...editingMedia, src: dataUrl })
                            );
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <select
                    value={editingMedia.src}
                    onChange={(e) =>
                      setEditingMedia({ ...editingMedia, src: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0b0426] border border-white/15 text-xs text-white"
                  >
                    {BUILT_IN_PHOTO_ASSETS.map((p) => (
                      <option key={p.path} value={p.path}>
                        {p.label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={editingMedia.src}
                    onChange={(e) =>
                      setEditingMedia({ ...editingMedia, src: e.target.value })
                    }
                    placeholder="Photo URL or path..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0b0426] border border-white/15 text-xs text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Card Width Layout
                  </label>
                  <select
                    value={editingMedia.span}
                    onChange={(e) =>
                      setEditingMedia({ ...editingMedia, span: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-xs text-white"
                  >
                    <option value="lg:col-span-4">1/3 Width Card (4 Columns)</option>
                    <option value="lg:col-span-5">5/12 Width Card (5 Columns)</option>
                    <option value="lg:col-span-6">Half Width Card (6 Columns)</option>
                    <option value="lg:col-span-7">7/12 Width Card (7 Columns)</option>
                    <option value="lg:col-span-12">Full Width Banner (12 Columns)</option>
                    <option value="md:col-span-4">Video 1/3 Width (md:col-span-4)</option>
                    <option value="md:col-span-6">Video Half Width (md:col-span-6)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Display Sort Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingMedia.sortOrder}
                    onChange={(e) =>
                      setEditingMedia({
                        ...editingMedia,
                        sortOrder: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#060216] border border-[#6854fc]/45 text-xs font-mono-tabular text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMedia(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 text-xs font-semibold text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 intellio-solid-btn text-sm cursor-pointer"
                >
                  Save Media Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
