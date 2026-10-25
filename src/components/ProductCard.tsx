import React, { useState } from 'react';
import { Plus, Check, SlidersHorizontal } from 'lucide-react';
import { Product, formatProductPriceRange } from '../data/products';
import { useQuote } from '../context/QuoteContext';
import { EquipmentImage } from './EquipmentImage';
import { formatINR } from '../config/site';

interface ProductCardProps {
  product: Product;
  onEditRate?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEditRate }) => {
  const { cartItems, addToQuote, updateItemQuantity } = useQuote();
  const existingItem = cartItems.find((item) => item.productId === product.id);

  // Local dimension state for P2 LED Wall square-foot calculator on the card
  const [widthFt, setWidthFt] = useState<string>(
    String(existingItem?.widthFt ?? product.quantityRules.defaultWidthFt ?? 12)
  );
  const [heightFt, setHeightFt] = useState<string>(
    String(existingItem?.heightFt ?? product.quantityRules.defaultHeightFt ?? 8)
  );
  // Local 5-hour block state for Genset
  const [fiveHourBlocks, setFiveHourBlocks] = useState<number>(
    existingItem?.fiveHourBlocks ?? 1
  );

  const parsedWidth = Number(widthFt);
  const parsedHeight = Number(heightFt);
  const hasValidArea =
    product.pricingUnit === 'sq_ft' &&
    Number.isFinite(parsedWidth) &&
    Number.isFinite(parsedHeight) &&
    parsedWidth > 0 &&
    parsedHeight > 0;
  const calculatedSqFt = hasValidArea ? Math.round(parsedWidth * parsedHeight * 100) / 100 : null;

  const handleAdd = () => {
    if (product.pricingUnit === 'sq_ft') {
      if (!hasValidArea) return;
      addToQuote(product.id, {
        quantity: 1,
        widthFt: parsedWidth,
        heightFt: parsedHeight,
      });
      return;
    }
    if (product.pricingUnit === '5_hours') {
      addToQuote(product.id, {
        quantity: 1,
        fiveHourBlocks: Math.max(1, fiveHourBlocks),
      });
      return;
    }
    addToQuote(product.id, { quantity: 1 });
  };

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-200 hover:border-blue-600/50 hover:shadow-[0_18px_40px_-24px_rgba(30,40,120,0.35)]">
      {/* Product Visual — Matches EventWave .ph (studio cutout vs full photo) */}
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden ${
          product.isPhoto
            ? 'bg-slate-900 p-0'
            : 'bg-[radial-gradient(80%_80%_at_50%_40%,#ffffff,#EEF0F8)] p-4 grid place-items-center'
        }`}
      >
        <EquipmentImage
          src={product.imagePath}
          alt={product.name}
          category={product.category}
          className={
            product.isPhoto
              ? 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]'
              : 'w-full h-full max-h-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.03]'
          }
        />

        {product.badge && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-slate-950 text-white font-mono-tabular text-[10px] font-semibold tracking-wider uppercase">
            {product.badge}
          </span>
        )}

        {onEditRate && (
          <button
            type="button"
            onClick={() => onEditRate(product)}
            title="Edit indicative reference rate"
            className="absolute top-3 right-3 z-10 px-2.5 py-1.5 rounded-lg bg-slate-900/80 text-slate-100 hover:text-white hover:bg-slate-900 text-xs font-medium flex items-center gap-1.5 backdrop-blur-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Edit Rate</span>
          </button>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-blue-700 font-mono-tabular">
            <span>{product.subGroup || product.category}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 leading-snug mt-1">
            {product.name}
          </h3>

          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            {product.packageLabel || product.description}
          </p>

          {/* Special input for P2 LED Wall square-foot calculation */}
          {product.pricingUnit === 'sq_ft' && (
            <div className="mt-3.5 pt-3 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-700 mb-2">
                Custom Wall Size Calculator (ft)
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Width (ft)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    step="1"
                    value={widthFt}
                    onChange={(e) => setWidthFt(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono-tabular"
                    placeholder="Width"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Height (ft)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono-tabular"
                    placeholder="Height"
                  />
                </div>
              </div>
              {hasValidArea && calculatedSqFt !== null ? (
                <div className="mt-2 text-xs text-slate-600 font-mono-tabular">
                  Indicative Area: <strong className="text-slate-900">{calculatedSqFt} sq ft</strong>
                  {!product.requestQuoteOnly && (
                    <span>
                      {' '}
                      · Est. {formatINR(calculatedSqFt * product.minPrice)}–
                      {formatINR(calculatedSqFt * product.maxPrice)}/day
                    </span>
                  )}
                </div>
              ) : (
                <div className="mt-2 text-xs text-rose-600">
                  Enter valid positive width and height in feet to calculate area.
                </div>
              )}
            </div>
          )}

          {/* Special input for Genset 5-hour billing blocks */}
          {product.pricingUnit === '5_hours' && (
            <div className="mt-3.5 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-semibold text-slate-700">
                  5-Hour Operational Blocks
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFiveHourBlocks((b) => Math.max(1, b - 1))}
                    className="w-7 h-7 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center text-sm font-semibold cursor-pointer"
                    aria-label="Decrease 5-hour blocks"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-xs font-mono-tabular font-semibold text-slate-900">
                    {fiveHourBlocks}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFiveHourBlocks((b) => Math.min(20, b + 1))}
                    className="w-7 h-7 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center text-sm font-semibold cursor-pointer"
                    aria-label="Increase 5-hour blocks"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-mono-tabular">
                {fiveHourBlocks} block(s) = {fiveHourBlocks * 5} hours · Indicative:{' '}
                {product.requestQuoteOnly
                  ? 'Request a Quote'
                  : formatINR(product.minPrice * fiveHourBlocks)}
              </p>
            </div>
          )}
        </div>

        {/* Footer Price + Add to Quote Button (matches EventWave dashed border top) */}
        <div className="pt-3.5 mt-auto border-t border-dashed border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className="text-[15px] font-semibold text-slate-900 font-mono-tabular whitespace-nowrap">
            {formatProductPriceRange(product)}
          </div>

          {existingItem ? (
            <div className="flex items-center gap-1 bg-blue-700 text-white px-2 py-1 rounded-full">
              <button
                type="button"
                onClick={() => updateItemQuantity(product.id, existingItem.quantity - 1)}
                className="w-6 h-6 rounded-full hover:bg-blue-800 font-bold text-xs flex items-center justify-center cursor-pointer"
                aria-label={`Decrease quantity of ${product.name}`}
              >
                −
              </button>
              <span className="px-1.5 text-xs font-semibold font-mono-tabular flex items-center gap-1 whitespace-nowrap">
                <Check className="w-3.5 h-3.5" />
                Added · {existingItem.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateItemQuantity(product.id, existingItem.quantity + 1)}
                className="w-6 h-6 rounded-full hover:bg-blue-800 font-bold text-xs flex items-center justify-center cursor-pointer"
                aria-label={`Increase quantity of ${product.name}`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={product.pricingUnit === 'sq_ft' && !hasValidArea}
              className="px-3.5 py-2 rounded-full border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white disabled:border-slate-300 disabled:text-slate-400 text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Quote</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
