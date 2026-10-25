import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  X,
  SlidersHorizontal,
  Calendar,
  ShoppingBag,
  RotateCcw,
  Info,
  ArrowRight,
} from 'lucide-react';
import {
  PRODUCT_CATEGORIES,
  Product,
  ProductCategory,
} from '../data/products';
import { useQuote } from '../context/QuoteContext';
import { ProductCard } from '../components/ProductCard';
import { formatINR } from '../config/site';

type SortOption = 'default' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

const EVENT_TAG_LABELS: Record<string, string> = {
  corporate: 'Corporate Conferences & Summits',
  launches: 'Brand Launches & Town Halls',
  weddings: 'Weddings & Receptions',
  concerts: 'Concerts & Exhibitions',
};

export const CataloguePage: React.FC = () => {
  const {
    products,
    updateProductRate,
    resetProductsToDefault,
    eventDetails,
    updateEventDetails,
    totalItemCount,
    cartTotals,
    setIsQuoteDrawerOpen,
  } = useQuote();

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>(
    (searchParams.get('category') as ProductCategory) || 'All'
  );
  const [selectedEventTag, setSelectedEventTag] = useState<string>(
    searchParams.get('event') || 'all'
  );
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editMinPrice, setEditMinPrice] = useState<string>('');
  const [editMaxPrice, setEditMaxPrice] = useState<string>('');
  const [editQuoteOnly, setEditQuoteOnly] = useState<boolean>(false);

  // Sync URL query params when navigated from header search or footer links
  useEffect(() => {
    const qParam = searchParams.get('q');
    const catParam = searchParams.get('category') as ProductCategory | null;
    const eventParam = searchParams.get('event');

    if (qParam !== null) setSearchQuery(qParam);
    if (catParam && PRODUCT_CATEGORIES.includes(catParam)) {
      setSelectedCategory(catParam);
    } else if (!catParam) {
      setSelectedCategory('All');
    }
    if (eventParam && EVENT_TAG_LABELS[eventParam]) {
      setSelectedEventTag(eventParam);
    } else if (!eventParam) {
      setSelectedEventTag('all');
    }
  }, [searchParams]);

  // Dynamic category counts computed directly from actual product dataset
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    for (const cat of PRODUCT_CATEGORIES) {
      counts[cat] = products.filter((p) => p.category === cat).length;
    }
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = products.filter((product) => {
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      if (
        selectedEventTag !== 'all' &&
        !product.eventTags.includes(selectedEventTag as 'corporate' | 'launches' | 'weddings' | 'concerts')
      ) {
        return false;
      }
      if (q) {
        const haystack = [
          product.name,
          product.packageLabel || '',
          product.category,
          product.description,
          ...product.technicalSpecs,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      }
      return true;
    });

    if (sortBy === 'name-asc') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === 'name-desc') {
      return [...list].sort((a, b) => b.name.localeCompare(a.name));
    }
    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => {
        if (a.requestQuoteOnly && !b.requestQuoteOnly) return 1;
        if (!a.requestQuoteOnly && b.requestQuoteOnly) return -1;
        return a.minPrice - b.minPrice;
      });
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => {
        if (a.requestQuoteOnly && !b.requestQuoteOnly) return 1;
        if (!a.requestQuoteOnly && b.requestQuoteOnly) return -1;
        return b.maxPrice - a.maxPrice;
      });
    }
    return list;
  }, [products, searchQuery, selectedCategory, selectedEventTag, sortBy]);

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedEventTag('all');
    setSortBy('default');
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedEventTag !== 'all' ||
    sortBy !== 'default';

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditMinPrice(String(product.minPrice));
    setEditMaxPrice(String(product.maxPrice));
    setEditQuoteOnly(Boolean(product.requestQuoteOnly));
  };

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const min = Math.max(0, Number(editMinPrice) || 0);
    const max = Math.max(min, Number(editMaxPrice) || min);
    updateProductRate(editingProduct.id, {
      minPrice: min,
      maxPrice: max,
      requestQuoteOnly: editQuoteOnly,
    });
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Catalogue Header Banner */}
      <section className="bg-slate-950 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold tracking-widest text-sky-400 uppercase">
                LIVEON CONNECT · Complete Equipment Directory
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold mt-2">
                AV Rental Equipment Catalogue
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
                Explore {products.length} sound, lighting, LED wall, projection, display, mixer, special effects, and genset packages. Add items to your quote cart to generate an instant WhatsApp enquiry.
              </p>
            </div>

            {/* Event Date & Duration Context Input */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div>
                <label
                  htmlFor="catalogue-event-date"
                  className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  <span>Event Date (for Quote)</span>
                </label>
                <input
                  id="catalogue-event-date"
                  type="date"
                  value={eventDetails.eventDate}
                  onChange={(e) => updateEventDetails({ eventDate: e.target.value })}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label
                  htmlFor="catalogue-rental-days"
                  className="block text-[11px] font-semibold text-slate-400 mb-1"
                >
                  Rental Days
                </label>
                <input
                  id="catalogue-rental-days"
                  type="number"
                  min={1}
                  max={30}
                  value={eventDetails.rentalDays}
                  onChange={(e) =>
                    updateEventDetails({ rentalDays: Math.max(1, Number(e.target.value) || 1) })
                  }
                  className="w-20 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono-tabular focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8" id="categories">
        {/* Reference Pricing Notice Banner */}
        <div className="mb-6 p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900">Reference Rate Notice:</strong> Displayed prices are indicative reference rates (INR) and are editable using the <em>Edit Rate</em> control on any card. Final availability, transportation, setup, and confirmed LIVEON CONNECT rates are provided upon quote review.
            </p>
          </div>
          <button
            type="button"
            onClick={resetProductsToDefault}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-medium text-slate-600 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Reference Rates</span>
          </button>
        </div>

        {/* Search + Sort Controls */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across 52 products by name, model (e.g. QSC 12.2, JBL VRX, RCF 9007-AS, P2 LED, SQ7)..."
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Event Use-Case Selector */}
            <div className="sm:w-56">
              <select
                value={selectedEventTag}
                onChange={(e) => setSelectedEventTag(e.target.value)}
                aria-label="Filter by Event Type"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">All Event Types</option>
                <option value="corporate">Corporate Conferences</option>
                <option value="launches">Brand Launches &amp; Town Halls</option>
                <option value="weddings">Weddings &amp; Receptions</option>
                <option value="concerts">Concerts &amp; Exhibitions</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="sm:w-52 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort products"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="default">Sort: Category Default</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="price-asc">Rate: Low to High</option>
                <option value="price-desc">Rate: High to Low</option>
              </select>
            </div>
          </div>

          {/* Interactive Category Filter Buttons with Dynamic Counts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Equipment ({categoryCounts.All})
            </button>
            {PRODUCT_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category} ({categoryCounts[category] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Active Filter Bar & Result Count */}
        <div className="mt-5 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-800 font-mono-tabular">
              Showing {filteredProducts.length} of {products.length} products
            </span>

            {selectedCategory !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium cursor-pointer"
              >
                <span>Category: {selectedCategory}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {selectedEventTag !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedEventTag('all')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium cursor-pointer"
              >
                <span>Event: {EVENT_TAG_LABELS[selectedEventTag] || selectedEventTag}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {searchQuery.trim() !== '' && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium cursor-pointer"
              >
                <span>Search: &ldquo;{searchQuery.trim()}&rdquo;</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Product Grid or Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8">
            <h2 className="text-lg font-bold text-slate-900">
              No matching equipment found
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              We couldn&apos;t find any products matching your current search or filter selection. Try clearing your filters or searching for another keyword.
            </p>
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="mt-5 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEditRate={openEditModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom Quote Summary Bar when items are in Cart */}
      {totalItemCount > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-4xl mx-auto z-30 bg-slate-950 text-white rounded-xl border border-slate-700 shadow-2xl p-3.5 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-300">
                {totalItemCount} item(s) in Quote · {eventDetails.rentalDays} day(s)
              </div>
              <div className="text-sm sm:text-base font-bold font-mono-tabular text-white">
                Indicative:{' '}
                {cartTotals.minTotal === 0 && cartTotals.hasUnconfirmedItems
                  ? 'Request a Quote'
                  : cartTotals.minTotal === cartTotals.maxTotal
                  ? formatINR(cartTotals.minTotal)
                  : `${formatINR(cartTotals.minTotal)} – ${formatINR(cartTotals.maxTotal)}`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsQuoteDrawerOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white cursor-pointer whitespace-nowrap"
            >
              Quick View
            </button>
            <Link
              to="/quote"
              className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-xs font-semibold text-white flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Review &amp; Send Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Edit Indicative Rate Modal */}
      {editingProduct && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-semibold text-blue-700">
                  Customize Catalogue Rate
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingProduct.name}
                </h3>
                {editingProduct.packageLabel && (
                  <p className="text-xs text-slate-500">{editingProduct.packageLabel}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRate} className="space-y-4">
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <input
                  id="edit-quote-only"
                  type="checkbox"
                  checked={editQuoteOnly}
                  onChange={(e) => setEditQuoteOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-700 rounded"
                />
                <label htmlFor="edit-quote-only" className="text-xs font-semibold text-slate-800">
                  Mark rate as &ldquo;Request a Quote&rdquo; (hide numeric rate)
                </label>
              </div>

              {!editQuoteOnly && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Minimum Rate (₹ {editingProduct.pricingUnitLabel})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editMinPrice}
                      onChange={(e) => setEditMinPrice(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono-tabular"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Maximum Rate (₹ {editingProduct.pricingUnitLabel})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editMaxPrice}
                      onChange={(e) => setEditMaxPrice(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono-tabular"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-xs font-semibold text-white cursor-pointer"
                >
                  Save Reference Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
