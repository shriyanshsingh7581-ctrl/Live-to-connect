import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, MessageCircle, AlertCircle } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { formatINR } from '../config/site';

export const QuoteDrawer: React.FC = () => {
  const {
    products,
    cartItems,
    eventDetails,
    isQuoteDrawerOpen,
    setIsQuoteDrawerOpen,
    removeFromQuote,
    updateItemQuantity,
    updateItemDimensions,
    updateItemFiveHourBlocks,
    updateEventDetails,
    clearCart,
    getItemEstimate,
    cartTotals,
    getWhatsAppQuoteUrl,
  } = useQuote();

  const [confirmClear, setConfirmClear] = useState(false);

  if (!isQuoteDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Rental Quote Cart">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsQuoteDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-950 text-white">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-sky-400" />
              <div>
                <h2 className="text-base font-bold">Rental Quote Builder</h2>
                <p className="text-xs text-slate-400">
                  {cartItems.length} equipment package(s) selected
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsQuoteDrawerOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close quote drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Quick Rental Duration Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-4">
              <div>
                <label htmlFor="drawer-rental-days" className="block text-xs font-bold text-slate-800">
                  Rental Duration (Days)
                </label>
                <span className="text-[11px] text-slate-500">
                  Applies to daily-rate equipment
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    updateEventDetails({ rentalDays: Math.max(1, eventDetails.rentalDays - 1) })
                  }
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold text-sm flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                >
                  −
                </button>
                <input
                  id="drawer-rental-days"
                  type="number"
                  min={1}
                  max={30}
                  value={eventDetails.rentalDays}
                  onChange={(e) => updateEventDetails({ rentalDays: Number(e.target.value) || 1 })}
                  className="w-12 text-center py-1 text-sm font-bold font-mono-tabular border border-slate-300 rounded-lg bg-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    updateEventDetails({ rentalDays: Math.min(30, eventDetails.rentalDays + 1) })
                  }
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold text-sm flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Your quote list is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Browse our 52 sound, lighting, LED wall, and AV rental items to build an instant estimate.
                </p>
                <Link
                  to="/catalogue"
                  onClick={() => setIsQuoteDrawerOpen(false)}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold"
                >
                  <span>Browse Catalogue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;
                  const estimate = getItemEstimate(item);

                  return (
                    <div
                      key={item.productId}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[11px] font-medium text-slate-500">
                            {product.category}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900">{product.name}</h4>
                          {product.packageLabel && (
                            <p className="text-xs text-blue-700 font-medium">
                              {product.packageLabel}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromQuote(item.productId)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                          aria-label={`Remove ${product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* P2 LED Wall Dimensions in Drawer */}
                      {product.pricingUnit === 'sq_ft' && (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div>
                            <label className="block text-[10px] text-slate-500">Width (ft)</label>
                            <input
                              type="number"
                              min="1"
                              value={item.widthFt ?? ''}
                              onChange={(e) =>
                                updateItemDimensions(
                                  item.productId,
                                  Number(e.target.value),
                                  item.heightFt
                                )
                              }
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono-tabular"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500">Height (ft)</label>
                            <input
                              type="number"
                              min="1"
                              value={item.heightFt ?? ''}
                              onChange={(e) =>
                                updateItemDimensions(
                                  item.productId,
                                  item.widthFt,
                                  Number(e.target.value)
                                )
                              }
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono-tabular"
                            />
                          </div>
                        </div>
                      )}

                      {/* Genset 5-Hour Blocks in Drawer */}
                      {product.pricingUnit === '5_hours' && (
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs text-slate-600">5-Hour Blocks:</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateItemFiveHourBlocks(
                                  item.productId,
                                  (item.fiveHourBlocks || 1) - 1
                                )
                              }
                              className="w-6 h-6 rounded border border-slate-300 text-xs font-bold cursor-pointer"
                            >
                              −
                            </button>
                            <span className="text-xs font-mono-tabular font-semibold px-1.5">
                              {item.fiveHourBlocks || 1} ({(item.fiveHourBlocks || 1) * 5} hrs)
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateItemFiveHourBlocks(
                                  item.productId,
                                  (item.fiveHourBlocks || 1) + 1
                                )
                              }
                              className="w-6 h-6 rounded border border-slate-300 text-xs font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                            className="w-7 h-7 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                          >
                            −
                          </button>
                          <span className="px-2 text-xs font-bold font-mono-tabular">
                            Qty: {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                            className="w-7 h-7 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-900 font-mono-tabular">
                            {estimate.isQuoteOnly
                              ? 'Request a Quote'
                              : !estimate.isValid
                              ? 'Enter valid dimensions'
                              : estimate.minSubtotal === estimate.maxSubtotal
                              ? formatINR(estimate.minSubtotal)
                              : `${formatINR(estimate.minSubtotal)}–${formatINR(estimate.maxSubtotal)}`}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {estimate.calculationSummary}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Clear Cart with Confirmation */}
                <div className="pt-2 flex justify-end">
                  {!confirmClear ? (
                    <button
                      type="button"
                      onClick={() => setConfirmClear(true)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Quote List</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg">
                      <span className="text-xs text-rose-800 font-medium">Remove all items?</span>
                      <button
                        type="button"
                        onClick={() => {
                          clearCart();
                          setConfirmClear(false);
                        }}
                        className="px-2 py-0.5 rounded bg-rose-600 text-white text-xs font-semibold cursor-pointer"
                      >
                        Yes, Clear
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmClear(false)}
                        className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-300 text-xs font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Transportation &amp; Crew</span>
                  <span className="font-semibold text-slate-800">To Be Confirmed</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    Indicative Equipment Total
                  </span>
                  <span className="text-base font-bold text-blue-700 font-mono-tabular">
                    {cartTotals.minTotal === 0 && cartTotals.hasUnconfirmedItems
                      ? 'Request a Quote'
                      : cartTotals.minTotal === cartTotals.maxTotal
                      ? formatINR(cartTotals.minTotal)
                      : `${formatINR(cartTotals.minTotal)} – ${formatINR(cartTotals.maxTotal)}`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 flex items-start gap-1 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    Reference estimate only. Final pricing and date availability require confirmation from LIVEON CONNECT.
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Link
                  to="/quote"
                  onClick={() => setIsQuoteDrawerOpen(false)}
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Complete Event Details &amp; Send Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={getWhatsAppQuoteUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Quick Send via WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
