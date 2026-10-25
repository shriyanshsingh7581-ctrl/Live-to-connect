import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  Plus,
  ShoppingBag,
  MessageCircle,
  AlertCircle,
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
    <div className="min-h-screen bg-[#060814] text-slate-100 pb-20">
      {/* Page Header */}
      <section className="relative intellio-grid-bg text-white py-12 sm:py-16 border-b border-white/[0.08] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 20% 35%, rgba(99, 102, 241, 0.2) 0%, transparent 45%), radial-gradient(circle at 80% 30%, rgba(217, 70, 239, 0.18) 0%, transparent 45%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 hover:text-indigo-200 mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Equipment Catalogue</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Rental <span className="led-text-gradient">Quote Builder</span>
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
            <div className="intellio-card rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    01. Selected Rental Equipment ({cartItems.length})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Adjust quantities, P2 LED wall dimensions (sq ft), or Genset 5-hour blocks.
                  </p>
                </div>

                {cartItems.length > 0 && (
                  <div>
                    {!confirmClear ? (
                      <button
                        type="button"
                        onClick={() => setConfirmClear(true)}
                        className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear Cart</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-rose-500/15 border border-rose-500/30 px-3 py-1.5 rounded-xl">
                        <span className="text-xs font-semibold text-rose-200">Confirm clear?</span>
                        <button
                          type="button"
                          onClick={() => {
                            clearCart();
                            setConfirmClear(false);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-semibold cursor-pointer"
                        >
                          Yes, Clear All
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmClear(false)}
                          className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-slate-200 text-xs font-medium cursor-pointer"
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
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 text-indigo-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      No equipment added to your quote yet
                    </h3>
                    <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
                      Explore our 52-item catalogue to add speakers, mixers, lighting fixtures, LED walls, displays, or gensets.
                    </p>
                  </div>
                  <Link
                    to="/catalogue"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl intellio-btn-primary text-white text-xs font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Browse Equipment Catalogue</span>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {cartItems.map((item) => {
                    const product = products.find((p) => p.id === item.productId);
                    if (!product) return null;
                    const estimate = getItemEstimate(item);

                    return (
                      <div key={item.productId} className="py-5 first:pt-4 last:pb-0">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="w-full sm:w-28 aspect-[3/2] rounded-xl overflow-hidden bg-white p-1.5 shrink-0 border border-white/10">
                            <EquipmentImage
                              src={product.imagePath}
                              alt={product.name}
                              category={product.category}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-xs font-medium text-indigo-300 font-mono-tabular">
                                  {product.category} · {formatProductPriceRange(product)}
                                </div>
                                <h3 className="text-base font-bold text-white">
                                  {product.name}
                                </h3>
                                {product.packageLabel && (
                                  <p className="text-xs font-medium text-slate-400">
                                    {product.packageLabel}
                                  </p>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFromQuote(item.productId)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* P2 LED Wall Width & Height Inputs */}
                            {product.pricingUnit === 'sq_ft' && (
                              <div className="p-3 rounded-xl bg-[#060814] border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                                    className="w-full px-3 py-1.5 text-sm bg-[#0B0E1E] text-white border border-white/15 rounded-lg font-mono-tabular"
                                    placeholder="e.g. 12"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                                    className="w-full px-3 py-1.5 text-sm bg-[#0B0E1E] text-white border border-white/15 rounded-lg font-mono-tabular"
                                    placeholder="e.g. 8"
                                  />
                                </div>
                                {!estimate.isValid && (
                                  <p className="sm:col-span-2 text-xs text-rose-400 font-medium">
                                    {estimate.validationMessage}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Genset 5-Hour Block Controls */}
                            {product.pricingUnit === '5_hours' && (
                              <div className="p-3 rounded-xl bg-[#060814] border border-white/10 flex items-center justify-between gap-4">
                                <div>
                                  <div className="text-xs font-semibold text-white">
                                    Confirmed 5-Hour Operational Blocks
                                  </div>
                                  <div className="text-[11px] text-slate-400">
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
                                    className="w-8 h-8 rounded-lg bg-[#0B0E1E] border border-white/15 text-white font-bold cursor-pointer"
                                  >
                                    −
                                  </button>
                                  <span className="text-xs font-bold font-mono-tabular px-2 text-white">
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
                                    className="w-8 h-8 rounded-lg bg-[#0B0E1E] border border-white/15 text-white font-bold cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Quantity & Subtotal Row */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-300">
                                  Quantity:
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateItemQuantity(item.productId, item.quantity - 1)
                                    }
                                    className="w-8 h-8 rounded-lg border border-white/15 bg-[#060814] hover:bg-white/10 text-white font-bold text-sm cursor-pointer"
                                  >
                                    −
                                  </button>
                                  <span className="w-9 text-center text-sm font-bold font-mono-tabular text-white">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateItemQuantity(item.productId, item.quantity + 1)
                                    }
                                    className="w-8 h-8 rounded-lg border border-white/15 bg-[#060814] hover:bg-white/10 text-white font-bold text-sm cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-sm font-bold text-white font-mono-tabular">
                                  {estimate.isQuoteOnly
                                    ? 'Request a Quote'
                                    : !estimate.isValid
                                    ? 'Dimensions Required'
                                    : estimate.minSubtotal === estimate.maxSubtotal
                                    ? formatINR(estimate.minSubtotal)
                                    : `${formatINR(estimate.minSubtotal)} – ${formatINR(estimate.maxSubtotal)}`}
                                </div>
                                <div className="text-[11px] text-slate-400">
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
                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                  <Link
                    to="/catalogue"
                    className="text-xs font-semibold text-indigo-300 hover:text-indigo-200 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add More Equipment from Catalogue</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Event & Customer Details Form */}
            <div className="intellio-card rounded-2xl p-6 space-y-5">
              <div>
                <h2 className="text-lg font-bold text-white">
                  02. Event &amp; Contact Information
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  These details will be included in your formatted WhatsApp quote message.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={eventDetails.customerName}
                    onChange={(e) => {
                      updateEventDetails({ customerName: e.target.value });
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#060814] text-white placeholder:text-slate-500 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone / WhatsApp Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={eventDetails.customerPhone}
                    onChange={(e) => {
                      updateEventDetails({ customerPhone: e.target.value });
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#060814] text-white placeholder:text-slate-500 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono-tabular"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Event Type
                  </label>
                  <select
                    value={eventDetails.eventType}
                    onChange={(e) => updateEventDetails({ eventType: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-white/15 rounded-xl bg-[#060814] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={eventDetails.eventDate}
                      onChange={(e) => updateEventDetails({ eventDate: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm bg-[#060814] text-white border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                      className="w-full px-3 py-2.5 text-sm bg-[#060814] text-white border border-white/15 rounded-xl font-mono-tabular focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    value={eventDetails.venue}
                    onChange={(e) => updateEventDetails({ venue: e.target.value })}
                    placeholder="e.g. Hotel / Convention Centre, Kottayam"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#060814] text-white placeholder:text-slate-500 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Expected Audience Size
                  </label>
                  <input
                    type="text"
                    value={eventDetails.audienceSize}
                    onChange={(e) => updateEventDetails({ audienceSize: e.target.value })}
                    placeholder="e.g. 250 guests"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#060814] text-white placeholder:text-slate-500 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Additional Requirements (Setup timing, live streaming, trussing, etc.)
                  </label>
                  <textarea
                    rows={3}
                    value={eventDetails.additionalRequirements}
                    onChange={(e) => updateEventDetails({ additionalRequirements: e.target.value })}
                    placeholder="Share stage dimensions, multi-cam live streaming requirements, indoor/outdoor details, or setup schedule..."
                    className="w-full px-3.5 py-2.5 text-sm bg-[#060814] text-white placeholder:text-slate-500 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quote Summary & WhatsApp Preview */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="intellio-card rounded-2xl p-6 space-y-5">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Quotation Summary (Indicative)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reference estimate based on selected quantities and duration.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-white/10 text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Selected Equipment Packages</span>
                  <span className="font-mono-tabular font-semibold text-white">
                    {cartItems.length} package(s)
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Rental Duration (Daily Gear)</span>
                  <span className="font-mono-tabular font-semibold text-white">
                    {eventDetails.rentalDays} day(s)
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Transportation &amp; Venue Delivery</span>
                  <span className="font-semibold text-amber-300">To Be Confirmed</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Availability &amp; Final Rate Status</span>
                  <span className="font-semibold text-indigo-300">Requires Confirmation</span>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
                  <span className="text-base font-bold text-white">
                    Estimated Equipment Cost
                  </span>
                  <span className="text-xl font-bold text-indigo-300 font-mono-tabular">
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

              <div className="p-3.5 rounded-xl bg-[#060814] border border-white/10 text-xs text-slate-300 space-y-1.5">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Important Quotation Notice</span>
                </div>
                <p className="leading-relaxed">
                  All prices shown are indicative reference figures and do not constitute a confirmed final quotation. Transportation, rigging, crew, and date availability will be confirmed by {siteConfig.businessName} on WhatsApp.
                </p>
              </div>

              {validationError && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200 font-medium">
                  {validationError}
                </div>
              )}

              <div className="space-y-2.5">
                <a
                  href={getWhatsAppQuoteUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleSendWhatsApp}
                  className="w-full py-3.5 px-5 rounded-xl intellio-btn-primary text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Send Quote Request via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="w-full py-2.5 px-4 rounded-xl border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedPreview ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
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
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300">
                    WhatsApp Message Preview
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono-tabular">
                    To: {siteConfig.whatsappDisplay}
                  </span>
                </div>
                <pre className="p-3.5 rounded-xl bg-[#050711] border border-white/10 text-slate-200 text-[11px] font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-64">
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
