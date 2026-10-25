import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  Plus,
  ShoppingBag,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Copy,
  Check,
} from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { formatINR, siteConfig } from '../config/site';
import { formatProductPriceRange } from '../data/products';
import { EquipmentImage } from '../components/EquipmentImage';

const EVENT_TYPES = [
  'Corporate Conference / Summit',
  'Brand Launch / Town Hall',
  'Wedding / Reception',
  'Concert / Live Show',
  'Exhibition / Trade Fair',
  'College / Cultural Fest',
  'Private Gathering / Other',
];

export const QuotePage: React.FC = () => {
  const {
    products,
    cartItems,
    eventDetails,
    removeFromQuote,
    updateItemQuantity,
    updateItemDimensions,
    updateItemFiveHourBlocks,
    updateEventDetails,
    clearCart,
    getItemEstimate,
    cartTotals,
    buildWhatsAppQuoteMessage,
    getWhatsAppQuoteUrl,
  } = useQuote();

  const [confirmClear, setConfirmClear] = useState(false);
  const [copiedPreview, setCopiedPreview] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(buildWhatsAppQuoteMessage());
      setCopiedPreview(true);
      setTimeout(() => setCopiedPreview(false), 2500);
    } catch {
      // ignore clipboard error
    }
  };

  const handleSendWhatsApp = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!eventDetails.customerName.trim() || !eventDetails.customerPhone.trim()) {
      e.preventDefault();
      setValidationError('Please enter your Name and Phone number before sending your WhatsApp quote request.');
      return;
    }
    if (cartTotals.hasInvalidDimensionItems) {
      e.preventDefault();
      setValidationError('Please enter valid width and height (ft) for the P2 LED Wall in your quote.');
      return;
    }
    setValidationError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Page Header */}
      <section className="bg-slate-950 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Equipment Catalogue</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Rental Quote Builder
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
            Configure your equipment quantities, rental duration, LED wall dimensions, and event details to generate a structured quotation request for {siteConfig.businessName}.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Selected Equipment Cart */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    1. Selected Rental Equipment ({cartItems.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Adjust quantities, P2 LED wall dimensions (sq ft), or Genset 5-hour blocks.
                  </p>
                </div>

                {cartItems.length > 0 && (
                  <div>
                    {!confirmClear ? (
                      <button
                        type="button"
                        onClick={() => setConfirmClear(true)}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear Cart</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg">
                        <span className="text-xs font-semibold text-rose-800">Confirm clear?</span>
                        <button
                          type="button"
                          onClick={() => {
                            clearCart();
                            setConfirmClear(false);
                          }}
                          className="px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-semibold cursor-pointer"
                        >
                          Yes, Clear All
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmClear(false)}
                          className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 text-xs font-medium cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      No equipment added to your quote yet
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                      Explore our 52-item catalogue to add speakers, mixers, lighting fixtures, LED walls, displays, or gensets.
                    </p>
                  </div>
                  <Link
                    to="/catalogue"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Browse Equipment Catalogue</span>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {cartItems.map((item) => {
                    const product = products.find((p) => p.id === item.productId);
                    if (!product) return null;
                    const estimate = getItemEstimate(item);

                    return (
                      <div key={item.productId} className="py-5 first:pt-4 last:pb-0">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="w-full sm:w-28 aspect-[3/2] rounded-lg overflow-hidden bg-slate-950 shrink-0">
                            <EquipmentImage
                              src={product.imagePath}
                              alt={product.name}
                              category={product.category}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-xs font-medium text-slate-500">
                                  {product.category} · {formatProductPriceRange(product)}
                                </div>
                                <h3 className="text-base font-bold text-slate-900">
                                  {product.name}
                                </h3>
                                {product.packageLabel && (
                                  <p className="text-xs font-semibold text-blue-700">
                                    {product.packageLabel}
                                  </p>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFromQuote(item.productId)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* P2 LED Wall Width & Height Inputs */}
                            {product.pricingUnit === 'sq_ft' && (
                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Wall Width (ft)
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="200"
                                    value={item.widthFt ?? ''}
                                    onChange={(e) =>
                                      updateItemDimensions(
                                        item.productId,
                                        Number(e.target.value),
                                        item.heightFt
                                      )
                                    }
                                    className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg font-mono-tabular"
                                    placeholder="e.g. 12"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Wall Height (ft)
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={item.heightFt ?? ''}
                                    onChange={(e) =>
                                      updateItemDimensions(
                                        item.productId,
                                        item.widthFt,
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg font-mono-tabular"
                                    placeholder="e.g. 8"
                                  />
                                </div>
                                {!estimate.isValid && (
                                  <p className="sm:col-span-2 text-xs text-rose-600 font-medium">
                                    {estimate.validationMessage}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Genset 5-Hour Block Controls */}
                            {product.pricingUnit === '5_hours' && (
                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                                <div>
                                  <div className="text-xs font-semibold text-slate-800">
                                    Confirmed 5-Hour Operational Blocks
                                  </div>
                                  <div className="text-[11px] text-slate-500">
                                    Genset is billed per 5-hour block (not daily)
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateItemFiveHourBlocks(
                                        item.productId,
                                        (item.fiveHourBlocks || 1) - 1
                                      )
                                    }
                                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold cursor-pointer"
                                  >
                                    −
                                  </button>
                                  <span className="text-xs font-bold font-mono-tabular px-2">
                                    {item.fiveHourBlocks || 1} block(s) ({(item.fiveHourBlocks || 1) * 5} hrs)
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateItemFiveHourBlocks(
                                        item.productId,
                                        (item.fiveHourBlocks || 1) + 1
                                      )
                                    }
                                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Quantity & Subtotal Row */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-600">
                                  Quantity:
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateItemQuantity(item.productId, item.quantity - 1)
                                    }
                                    className="w-8 h-8 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm cursor-pointer"
                                  >
                                    −
                                  </button>
                                  <span className="w-9 text-center text-sm font-bold font-mono-tabular">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateItemQuantity(item.productId, item.quantity + 1)
                                    }
                                    className="w-8 h-8 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-sm font-bold text-slate-900 font-mono-tabular">
                                  {estimate.isQuoteOnly
                                    ? 'Request a Quote'
                                    : !estimate.isValid
                                    ? 'Dimensions Required'
                                    : estimate.minSubtotal === estimate.maxSubtotal
                                    ? formatINR(estimate.minSubtotal)
                                    : `${formatINR(estimate.minSubtotal)} – ${formatINR(estimate.maxSubtotal)}`}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {estimate.calculationSummary}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {cartItems.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
                  <Link
                    to="/catalogue"
                    className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add More Equipment from Catalogue</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Event & Customer Details Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  2. Event &amp; Contact Information
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  These details will be included in your formatted WhatsApp quote message.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={eventDetails.customerName}
                    onChange={(e) => {
                      updateEventDetails({ customerName: e.target.value });
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={eventDetails.customerPhone}
                    onChange={(e) => {
                      updateEventDetails({ customerPhone: e.target.value });
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono-tabular"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Type
                  </label>
                  <select
                    value={eventDetails.eventType}
                    onChange={(e) => updateEventDetails({ eventType: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={eventDetails.eventDate}
                      onChange={(e) => updateEventDetails({ eventDate: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Rental Days
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={eventDetails.rentalDays}
                      onChange={(e) =>
                        updateEventDetails({ rentalDays: Math.max(1, Number(e.target.value) || 1) })
                      }
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg font-mono-tabular focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    value={eventDetails.venue}
                    onChange={(e) => updateEventDetails({ venue: e.target.value })}
                    placeholder="e.g. Hotel / Convention Centre, Kottayam"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expected Audience Size
                  </label>
                  <input
                    type="text"
                    value={eventDetails.audienceSize}
                    onChange={(e) => updateEventDetails({ audienceSize: e.target.value })}
                    placeholder="e.g. 250 guests"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Additional Requirements (Setup timing, live streaming, trussing, etc.)
                  </label>
                  <textarea
                    rows={3}
                    value={eventDetails.additionalRequirements}
                    onChange={(e) => updateEventDetails({ additionalRequirements: e.target.value })}
                    placeholder="Share stage dimensions, multi-cam live streaming requirements, indoor/outdoor details, or setup schedule..."
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quote Summary & WhatsApp Preview */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Quotation Summary (Indicative)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reference estimate based on selected quantities and duration.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Selected Equipment Packages</span>
                  <span className="font-mono-tabular font-semibold text-slate-900">
                    {cartItems.length} package(s)
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Rental Duration (Daily Gear)</span>
                  <span className="font-mono-tabular font-semibold text-slate-900">
                    {eventDetails.rentalDays} day(s)
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Transportation &amp; Venue Delivery</span>
                  <span className="font-semibold text-amber-700">To Be Confirmed</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Availability &amp; Final Rate Status</span>
                  <span className="font-semibold text-slate-800">Requires Confirmation</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                  <span className="text-base font-bold text-slate-900">
                    Estimated Equipment Cost
                  </span>
                  <span className="text-xl font-bold text-blue-700 font-mono-tabular">
                    {cartItems.length === 0
                      ? '₹0'
                      : cartTotals.minTotal === 0 && cartTotals.hasUnconfirmedItems
                      ? 'Request a Quote'
                      : cartTotals.minTotal === cartTotals.maxTotal
                      ? formatINR(cartTotals.minTotal)
                      : `${formatINR(cartTotals.minTotal)} – ${formatINR(cartTotals.maxTotal)}`}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>Important Quotation Notice</span>
                </div>
                <p className="leading-relaxed">
                  All prices shown are indicative reference figures and do not constitute a confirmed final quotation. Transportation, rigging, crew, and date availability will be confirmed by {siteConfig.businessName} on WhatsApp.
                </p>
              </div>

              {validationError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {validationError}
                </div>
              )}

              <div className="space-y-2.5">
                <a
                  href={getWhatsAppQuoteUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleSendWhatsApp}
                  className="w-full py-3.5 px-5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Send Quote Request via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedPreview ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied Quotation Text to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Formatted Quote Message</span>
                    </>
                  )}
                </button>
              </div>

              {/* Live WhatsApp Message Preview */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">
                    WhatsApp Message Preview
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono-tabular">
                    To: {siteConfig.whatsappDisplay}
                  </span>
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 text-[11px] font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-64">
                  {buildWhatsAppQuoteMessage()}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
