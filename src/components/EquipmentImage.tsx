import React, { useState } from 'react';
import { Speaker, Lightbulb, Monitor, Tv, Projector, Sliders, Cable, Sparkles, Zap } from 'lucide-react';
import { ProductCategory } from '../data/products';

interface EquipmentImageProps {
  src: string;
  alt: string;
  category?: ProductCategory;
  className?: string;
}

export const EquipmentImage: React.FC<EquipmentImageProps> = ({
  src,
  alt,
  category,
  className = 'w-full h-full object-cover',
}) => {
  const [hasError, setHasError] = useState(false);

  const renderCategoryIcon = () => {
    const iconProps = { className: 'w-10 h-10 text-sky-400 stroke-[1.75]' };
    switch (category) {
      case 'Sound Systems':
        return <Speaker {...iconProps} />;
      case 'Lighting':
        return <Lightbulb {...iconProps} />;
      case 'LED Walls':
        return <Monitor {...iconProps} />;
      case 'TVs & Displays':
        return <Tv {...iconProps} />;
      case 'Projectors':
        return <Projector {...iconProps} />;
      case 'Mixers & Mics':
        return <Sliders {...iconProps} />;
      case 'AV Accessories':
        return <Cable {...iconProps} />;
      case 'Special Effects':
        return <Sparkles {...iconProps} />;
      case 'Genset':
        return <Zap {...iconProps} />;
      default:
        return <Monitor {...iconProps} />;
    }
  };

  if (hasError) {
    return (
      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center mb-3">
          {renderCategoryIcon()}
        </div>
        <span className="text-xs font-medium text-slate-300 line-clamp-1">{alt}</span>
        {category && <span className="text-[11px] text-slate-400 mt-0.5">{category}</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
