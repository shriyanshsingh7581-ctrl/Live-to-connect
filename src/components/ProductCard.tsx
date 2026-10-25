import React, { useState } from 'react';
import { Plus, Check, SlidersHorizontal } from 'lucide-react';
import { Product, ProductCategory, formatProductPriceRange } from '../data/products';
import { useQuote } from '../context/QuoteContext';
import { EquipmentImage } from './EquipmentImage';
import { formatINR } from '../config/site';

interface ProductCardProps {
  product: Product;
  onEditRate?: (product: Product) => void;
}

interface CategoryColorTheme {
  topBar: string;
  studioBg: string;
  subGroupText: string;
  priceText: string;
  buttonIdle: string;
  buttonAdded: string;
  badgeBg: string;
  hoverBorder: string;
}

export const CATEGORY_COLOR_THEMES: Record<ProductCategory, CategoryColorTheme> = {
  'Sound Systems': {
    topBar: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500',
    studioBg: 'bg-[radial-gradient(80%_80%_at_50%_40%,#ffffff,#E0E7FF)]',
    subGroupText: 'text-blue-700',
    priceText: 'text-indigo-950',
    buttonIdle:
      'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xs',
    buttonAdded: 'bg-gradient-to-r from-indigo-700 to-blue-800 text-white',
    badgeBg: 'bg-gradient-to-r from-blue-600 to-indigo-700',
    hoverBorder: 'hover:border-blue-400',
  },
  Lighting: {
    topBar: 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600',
    studioBg: 'bg-[radial-gradient(80%_80%_at_50%_40%,#ffffff,#FFEDD5)]',
    subGroupText: 'text-orange-600',
    priceText: 'text-rose-950',
    buttonIdle:
      'bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white shadow-xs',
    buttonAdded: 'bg-gradient-to-r from-rose-600 to-orange-700 text-white',
    badgeBg: 'bg-gradient-to-r from-amber-500 to-rose-600',
    hoverBorder: 'hover:border-orange-400',
  },
  'LED Walls': {
    topBar: 'bg-gradient-to-r from-rose-600 via-fuchsia-600 to-cyan-500',
    studioBg: 'bg-[radial-gradient(80%_80%_at_50%_40%,#ffffff,#FAE8FF)]',
    subGroupText: 'text-fuchsia-700',
    priceText: 'text-purple-950',
    buttonIdle:
      'bg-gradient-to-r from-rose-600 via-fuchsia-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white shadow-xs',
    buttonAdded: 'bg-gradient-to-r from-purple-700 to-fuchsia-700 text-white',
    badgeBg: 'bg-gradient-to-r from-rose-600 via-fuchsia-600 to-blue-600',
    hoverBorder: 'hover:border-fuchsia-400',
  },
  'TVs & Displays': {
    topBar: 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600',
    studioBg: 'bg-[radial-gradient(80%_80%_at_50%_40%,#ffffff,#E0F2FE)]',
    subGroupText: 'text-sky-700',
    priceText: 'text-sky-950',
    buttonIdle:
      'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-xs',
    buttonAdded: 'bg-gradient-to-r from-blue-700 to-cyan-700 text-white',
    badgeBg: 'bg-gradient-to-r from-cyan-500 to-blue-600',
    hoverBorder: 'hover:border-cyan-400',
  },
  Projectors: {
    topBar: 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600',
    studioBg: 'bg-[radial-gradient(80%_80%_at_50%_40%,#ffffff,#EDE9FE)]',
    subGroupText: 'text-violet-700',
    priceText: 'text-violet-950',
    buttonIdle:
      'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-xs',
    buttonAdded: 'bg-gradient-to-r from-purple-700 to-violet-800 text-white',
    badgeBg: 'bg-gradient-to-r from-violet-600 to-purple-600',
    hoverBorder: 'hover:border-violet-400',
  },
  'Mixers & Mics': {
    topBar: 'bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600',
    studioBg: 'bg-[radial-gradient(80%_80%_at_50%_40%,#ffffff,#FFE4E6)]',
    subGroupText: 'text-rose-600',
    priceText: 'text-rose-950',
    buttonIdle:
      'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-xs',
    buttonAdded: 'bg-gradient-to-r from-pink-700 to-rose-800 text-white',
    badgeBg: 'bg-gradient-to-r from-rose-600 to-pink-600',
    hoverBorder: 'hover:border-rose-400',
  },
  'AV Accessories': {
    topBar: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600',
    studioBg: 'bg-[radial-gradient(80%_80%_at_50%_40%,#ffffff,#D1FAE5)]',
    subGroupText: 'text-teal-700',
    priceText: 'text-emerald-950',
    buttonIdle:
      'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xs',
    buttonAdded: 'bg-gradient-to-r from-teal-700 to-emerald-800 text-white',
    badgeBg: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    hoverBorder: 'hover:border-teal-400',
  },
  'Special Effects': {
    topBar: 'bg-gradient-to-r from-fuchsia-600 via-pink-500 to-amber-500',
    studioBg: 'bg-[radial-gradient(80%_80%_at_50%_40%,#ffffff,#FCE7F3)]',
    subGroupText: 'text-pink-600',
    priceText: 'text-fuchsia-950',
    buttonIdle:
      'bg-gradient-to-r from-fuchsia-600 via-pink-600 to-orange-500 hover:from-fuchsia-700 hover:to-orange-600 text-white shadow-xs',
    buttonAdded: 'bg-gradient-to-r from-pink-700 to-fuchsia-800 text-white',
    badgeBg: 'bg-gradient-to-r from-fuchsia-600 to-orange-500',
    hoverBorder: 'hover:border-pink-400',
  },
  Genset: {
    topBar: 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500',
    studioBg: 'bg-[radial-gradient(80%_80%_at_50%_40%,#ffffff,#FEF3C7)]',
    subGroupText: 'text-amber-700',
    priceText: 'text-amber-950',
    buttonIdle:
      'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xs',
    buttonAdded: 'bg-gradient-to-r from-orange-700 to-amber-800 text-white',
    badgeBg: 'bg-gradient-to-r from-amber-500 to-orange-600',
    hoverBorder: 'hover:border-amber-400',
  },
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEditRate }) => {
  const { cartItems, addToQuote, updateItemQuantity } = useQuote();
  const existingItem = cartItems.find((item) => item.productId === product.id);
  const theme = CATEGORY_COLOR_THEMES[product.category];

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
    <article
      className={`group bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col transition-all duration-200 ${theme.hoverBorder} hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(124,58,237,0.3)]`}
    >
      {/* Category Top Color Accent Strip */}
      <div className={`h-1.5 w-full ${theme.topBar}`} />

      {/* Product Visual */}
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden ${
          product.isPhoto ? 'bg-slate-900 p-0' : `${theme.studioBg} p-4 grid place-items-center`
        }`}
      >
        <EquipmentImage
          src={product.imagePath}
          alt={product.name}
          category={product.category}
          className={
            product.isPhoto
              ? 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]'
              : 'w-full h-full max-h-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.04]'
          }
        />

        {product.badge && (
          <span
            className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md ${theme.badgeBg} text-white font-mono-tabular text-[10px] font-bold tracking-wider uppercase shadow-sm`}
          >
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
          <div
            className={`flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase ${theme.subGroupText} font-mono-tabular`}
          >
            <span>{product.subGroup || product.category}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-1">
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            {product.packageLabel || product.description}
          </p>

          {/* Special input for P2 LED Wall square-foot calculation */}
          {product.pricingUnit === 'sq_ft' && (
            <div className="mt-3.5 pt-3 border-t border-fuchsia-100">
              <div className="text-xs font-bold text-fuchsia-800 mb-2">
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
                    className="w-full px-2.5 py-1.5 text-sm border border-fuchsia-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 font-mono-tabular"
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
                    className="w-full px-2.5 py-1.5 text-sm border border-fuchsia-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 font-mono-tabular"
                    placeholder="Height"
                  />
                </div>
              </div>
              {hasValidArea && calculatedSqFt !== null ? (
                <div className="mt-2 text-xs text-slate-600 font-mono-tabular">
                  Indicative Area: <strong className="text-fuchsia-900">{calculatedSqFt} sq ft</strong>
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
            <div className="mt-3.5 pt-3 border-t border-amber-100">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-bold text-amber-800">
                  5-Hour Operational Blocks
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFiveHourBlocks((b) => Math.max(1, b - 1))}
                    className="w-7 h-7 rounded-md border border-amber-300 text-amber-900 hover:bg-amber-50 flex items-center justify-center text-sm font-semibold cursor-pointer"
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
                    className="w-7 h-7 rounded-md border border-amber-300 text-amber-900 hover:bg-amber-50 flex items-center justify-center text-sm font-semibold cursor-pointer"
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

        {/* Footer Price + Vibrant Add to Quote Button */}
        <div className="pt-3.5 mt-auto border-t border-dashed border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className={`text-[15px] font-bold ${theme.priceText} font-mono-tabular whitespace-nowrap`}>
            {formatProductPriceRange(product)}
          </div>

          {existingItem ? (
            <div className={`flex items-center gap-1 ${theme.buttonAdded} px-2 py-1 rounded-full shadow-xs`}>
              <button
                type="button"
                onClick={() => updateItemQuantity(product.id, existingItem.quantity - 1)}
                className="w-6 h-6 rounded-full hover:bg-black/20 font-bold text-xs flex items-center justify-center cursor-pointer"
                aria-label={`Decrease quantity of ${product.name}`}
              >
                −
              </button>
              <span className="px-1.5 text-xs font-bold font-mono-tabular flex items-center gap-1 whitespace-nowrap">
                <Check className="w-3.5 h-3.5" />
                Added · {existingItem.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateItemQuantity(product.id, existingItem.quantity + 1)}
                className="w-6 h-6 rounded-full hover:bg-black/20 font-bold text-xs flex items-center justify-center cursor-pointer"
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
              className={`px-3.5 py-2 rounded-full ${theme.buttonIdle} disabled:bg-slate-200 disabled:text-slate-400 text-xs font-bold flex items-center gap-1 transition-all whitespace-nowrap shrink-0 cursor-pointer`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
