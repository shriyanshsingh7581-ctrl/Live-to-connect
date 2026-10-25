import React, { useState } from 'react';
import { ArrowRight, Check, SlidersHorizontal } from 'lucide-react';
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
    topBar: 'bg-[#6854fc]',
    studioBg: 'bg-[radial-gradient(80%_80%_at_50%_45%,#ffffff,#E2E6FF)]',
    subGroupText: 'text-[#8c7bff]',
    priceText: 'text-white',
    buttonIdle: 'intellio-outline-btn',
    buttonAdded: 'intellio-solid-btn',
    badgeBg: 'text-[#9d8fff]',
    hoverBorder: 'hover:border-[#7d6bff]',
  },
  Lighting: {
    topBar: 'bg-[#6854fc]',
    studioBg: 'bg-[radial-gradient(80%_80%_at_50%_45%,#ffffff,#E2E6FF)]',
    subGroupText: 'text-[#8c7bff]',
    priceText: 'text-white',
    buttonIdle: 'intellio-outline-btn',
    buttonAdded: 'intellio-solid-btn',
    badgeBg: 'text-[#9d8fff]',
    hoverBorder: 'hover:border-[#7d6bff]',
  },
  'LED Walls': {
    topBar: 'bg-[#6854fc]',
    studioBg: 'bg-[radial-gradient(80%_80%_at_50%_45%,#ffffff,#E2E6FF)]',
    subGroupText: 'text-[#8c7bff]',
    priceText: 'text-white',
    buttonIdle: 'intellio-outline-btn',
    buttonAdded: 'intellio-solid-btn',
    badgeBg: 'text-[#9d8fff]',
    hoverBorder: 'hover:border-[#7d6bff]',
  },
  'TVs & Displays': {
    topBar: 'bg-[#6854fc]',
    studioBg: 'bg-[radial-gradient(80%_80%_at_50%_45%,#ffffff,#E2E6FF)]',
    subGroupText: 'text-[#8c7bff]',
    priceText: 'text-white',
    buttonIdle: 'intellio-outline-btn',
    buttonAdded: 'intellio-solid-btn',
    badgeBg: 'text-[#9d8fff]',
    hoverBorder: 'hover:border-[#7d6bff]',
  },
  Projectors: {
    topBar: 'bg-[#6854fc]',
    studioBg: 'bg-[radial-gradient(80%_80%_at_50%_45%,#ffffff,#E2E6FF)]',
    subGroupText: 'text-[#8c7bff]',
    priceText: 'text-white',
    buttonIdle: 'intellio-outline-btn',
    buttonAdded: 'intellio-solid-btn',
    badgeBg: 'text-[#9d8fff]',
    hoverBorder: 'hover:border-[#7d6bff]',
  },
  'Mixers & Mics': {
    topBar: 'bg-[#6854fc]',
    studioBg: 'bg-[radial-gradient(80%_80%_at_50%_45%,#ffffff,#E2E6FF)]',
    subGroupText: 'text-[#8c7bff]',
    priceText: 'text-white',
    buttonIdle: 'intellio-outline-btn',
    buttonAdded: 'intellio-solid-btn',
    badgeBg: 'text-[#9d8fff]',
    hoverBorder: 'hover:border-[#7d6bff]',
  },
  'AV Accessories': {
    topBar: 'bg-[#6854fc]',
    studioBg: 'bg-[radial-gradient(80%_80%_at_50%_45%,#ffffff,#E2E6FF)]',
    subGroupText: 'text-[#8c7bff]',
    priceText: 'text-white',
    buttonIdle: 'intellio-outline-btn',
    buttonAdded: 'intellio-solid-btn',
    badgeBg: 'text-[#9d8fff]',
    hoverBorder: 'hover:border-[#7d6bff]',
  },
  'Special Effects': {
    topBar: 'bg-[#6854fc]',
    studioBg: 'bg-[radial-gradient(80%_80%_at_50%_45%,#ffffff,#E2E6FF)]',
    subGroupText: 'text-[#8c7bff]',
    priceText: 'text-white',
    buttonIdle: 'intellio-outline-btn',
    buttonAdded: 'intellio-solid-btn',
    badgeBg: 'text-[#9d8fff]',
    hoverBorder: 'hover:border-[#7d6bff]',
  },
  Genset: {
    topBar: 'bg-[#6854fc]',
    studioBg: 'bg-[radial-gradient(80%_80%_at_50%_45%,#ffffff,#E2E6FF)]',
    subGroupText: 'text-[#8c7bff]',
    priceText: 'text-white',
    buttonIdle: 'intellio-outline-btn',
    buttonAdded: 'intellio-solid-btn',
    badgeBg: 'text-[#9d8fff]',
    hoverBorder: 'hover:border-[#7d6bff]',
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
      className={`group intellio-card intellio-card-hover rounded-[26px] overflow-hidden flex flex-col p-3.5 sm:p-4 ${theme.hoverBorder}`}
    >
      {/* Product Visual Stage */}
      <div
        className={`relative aspect-[4/3] w-full rounded-[18px] overflow-hidden border border-[#6854fc]/35 ${
          product.isPhoto ? 'bg-[#090420] p-0' : `${theme.studioBg} p-4 grid place-items-center`
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

        {onEditRate && (
          <button
            type="button"
            onClick={() => onEditRate(product)}
            title="Edit indicative reference rate"
            className="absolute top-2.5 right-2.5 z-10 px-2.5 py-1 rounded-full bg-[#060216]/90 border border-[#6854fc]/50 text-white hover:bg-[#6854fc] text-xs font-medium flex items-center gap-1.5 backdrop-blur-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Edit Rate</span>
          </button>
        )}
      </div>

      {/* Card Body (Matching Intellio Card Layout from frame_09 & frame_15) */}
      <div className="pt-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Unboxed Metadata Line */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold tracking-wider font-mono-tabular">
            <span className={theme.subGroupText}>{product.subGroup || product.category}</span>
            {product.badge && (
              <>
                <span className="text-slate-500" aria-hidden="true">
                  ·
                </span>
                <span className={theme.badgeBg}>{product.badge}</span>
              </>
            )}
          </div>

          <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug mt-1">
            {product.name}
          </h3>

          {/* Double-checkmark style spec line inspired by frame_15 */}
          <div className="mt-2 flex items-start gap-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <Check className="w-4 h-4 text-[#6854fc] shrink-0 mt-0.5 stroke-[2.5]" />
            <span>{product.packageLabel || product.description}</span>
          </div>

          {/* Special input for P2 LED Wall square-foot calculation */}
          {product.pricingUnit === 'sq_ft' && (
            <div className="mt-3.5 pt-3 border-t border-[#6854fc]/25">
              <div className="text-xs font-semibold text-[#8c7bff] mb-2">
                Custom Wall Size Calculator (ft)
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    Width (ft)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    step="1"
                    value={widthFt}
                    onChange={(e) => setWidthFt(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-sm bg-[#060216] text-white border border-[#6854fc]/45 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6854fc] font-mono-tabular"
                    placeholder="Width"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    Height (ft)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-sm bg-[#060216] text-white border border-[#6854fc]/45 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6854fc] font-mono-tabular"
                    placeholder="Height"
                  />
                </div>
              </div>
              {hasValidArea && calculatedSqFt !== null ? (
                <div className="mt-2 text-xs text-slate-300 font-mono-tabular">
                  Indicative Area: <strong className="text-[#8c7bff]">{calculatedSqFt} sq ft</strong>
                  {!product.requestQuoteOnly && (
                    <span>
                      {' '}
                      · Est. {formatINR(calculatedSqFt * product.minPrice)}–
                      {formatINR(calculatedSqFt * product.maxPrice)}/day
                    </span>
                  )}
                </div>
              ) : (
                <div className="mt-2 text-xs text-rose-400">
                  Enter valid positive width and height in feet to calculate area.
                </div>
              )}
            </div>
          )}

          {/* Special input for Genset 5-hour billing blocks */}
          {product.pricingUnit === '5_hours' && (
            <div className="mt-3.5 pt-3 border-t border-[#6854fc]/25">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-semibold text-[#8c7bff]">
                  5-Hour Operational Blocks
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFiveHourBlocks((b) => Math.max(1, b - 1))}
                    className="w-7 h-7 rounded-full border border-[#6854fc]/45 bg-[#060216] text-white hover:bg-[#6854fc]/20 flex items-center justify-center text-sm font-semibold cursor-pointer"
                    aria-label="Decrease 5-hour blocks"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-xs font-mono-tabular font-semibold text-white">
                    {fiveHourBlocks}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFiveHourBlocks((b) => Math.min(20, b + 1))}
                    className="w-7 h-7 rounded-full border border-[#6854fc]/45 bg-[#060216] text-white hover:bg-[#6854fc]/20 flex items-center justify-center text-sm font-semibold cursor-pointer"
                    aria-label="Increase 5-hour blocks"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 font-mono-tabular">
                {fiveHourBlocks} block(s) = {fiveHourBlocks * 5} hours · Indicative:{' '}
                {product.requestQuoteOnly
                  ? 'Request a Quote'
                  : formatINR(product.minPrice * fiveHourBlocks)}
              </p>
            </div>
          )}
        </div>

        {/* Footer Price + Intellio Outlined Pill Action Button (matching frame_15) */}
        <div className="pt-3.5 mt-auto border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
          <div className="font-display text-lg sm:text-xl font-bold text-white font-mono-tabular whitespace-nowrap">
            {formatProductPriceRange(product)}
          </div>

          {existingItem ? (
            <div className="flex items-center gap-1 intellio-solid-btn px-2.5 py-1.5">
              <button
                type="button"
                onClick={() => updateItemQuantity(product.id, existingItem.quantity - 1)}
                className="w-6 h-6 rounded-full hover:bg-black/25 font-bold text-xs flex items-center justify-center cursor-pointer"
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
                className="w-6 h-6 rounded-full hover:bg-black/25 font-bold text-xs flex items-center justify-center cursor-pointer"
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
              className="px-4 py-2 intellio-outline-btn disabled:opacity-40 text-xs sm:text-sm flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Add Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
