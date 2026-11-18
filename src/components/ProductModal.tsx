import { useEffect, useState } from 'react';
import { Calendar, Check, Minus, Plus, X } from 'lucide-react';
import type { CatalogItem } from '../types.ts';
import { ProductArtwork } from './ProductArtwork.tsx';

interface ProductModalProps {
  item: CatalogItem | null;
  onClose: () => void;
  onAddToCart: (item: CatalogItem, quantity: number, selectedDate?: string) => void;
}

export function ProductModal({ item, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSelectedDate(item.classDates?.[0] ?? '');
    }
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [item, onClose]);

  if (!item) return null;

  const estimatedPoints = Math.round(item.price * quantity * 10);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1B18]/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-[#E5E3DC] rounded-xl shadow-xl grid grid-cols-1 md:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-10 w-10 h-10 inline-flex items-center justify-center rounded-lg bg-white/90 border border-[#E5E3DC] text-[#1D1B18] hover:bg-[#F3F2EE] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Artwork */}
        <div className="md:col-span-6 bg-[#F1F0EB] aspect-[4/3] md:aspect-auto md:min-h-[420px]">
          <ProductArtwork variant={item.artwork} />
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-[#6E6A63]">
              <span>{item.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{item.metaLeft}</span>
              <span aria-hidden="true">·</span>
              <span>{item.metaRight}</span>
            </div>

            <div>
              <h2
                id="product-modal-title"
                className="font-display text-2xl sm:text-3xl font-semibold text-[#1D1B18] leading-tight"
              >
                {item.title}
              </h2>
              <p className="mt-2 text-xl font-semibold text-[#1D1B18] tabular-nums">
                ${item.price.toFixed(2)}
              </p>
            </div>

            <p className="text-sm text-[#4D4943] leading-relaxed">{item.description}</p>

            {/* What's Inside / Syllabus */}
            <div className="pt-2 border-t border-[#EAE8E1]">
              <h3 className="text-xs font-semibold tracking-wide text-[#6E6A63] mb-2.5">
                {item.category === 'classes' ? 'Workshop Includes' : 'What Is Inside'}
              </h3>
              <ul className="space-y-2">
                {item.includes.map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-sm text-[#35322E]">
                    <Check className="w-4 h-4 text-[#2E4A3D] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Class Session Date Selector */}
            {item.category === 'classes' && item.classDates && (
              <div className="pt-2 border-t border-[#EAE8E1]">
                <label className="block text-xs font-semibold text-[#6E6A63] mb-2">
                  Select Studio Session Date
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.classDates.map((dateOpt) => {
                    const active = selectedDate === dateOpt;
                    return (
                      <button
                        key={dateOpt}
                        type="button"
                        onClick={() => setSelectedDate(dateOpt)}
                        className={`flex items-center gap-2 px-3 py-2.5 text-xs font-medium rounded-lg border text-left transition-colors cursor-pointer ${
                          active
                            ? 'border-[#2E4A3D] bg-[#2E4A3D]/8 text-[#1D1B18]'
                            : 'border-[#DFDCD4] bg-white text-[#4D4943] hover:border-[#A8A298]'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#2E4A3D] shrink-0" aria-hidden="true" />
                        <span className="truncate">{dateOpt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quantity & Add to Bag CTA */}
          <div className="pt-4 border-t border-[#EAE8E1] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#625E57]">
              <span>Members earn loyalty points on purchase</span>
              <span className="font-medium text-[#2E4A3D] tabular-nums">
                +{estimatedPoints.toLocaleString()} pts
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center border border-[#D9D5CC] rounded-lg h-11 bg-[#F9F9F7]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-full inline-flex items-center justify-center text-[#4D4943] hover:text-[#1D1B18] cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-medium tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  aria-label="Increase quantity"
                  className="w-10 h-full inline-flex items-center justify-center text-[#4D4943] hover:text-[#1D1B18] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onAddToCart(item, quantity, item.category === 'classes' ? selectedDate : undefined);
                  onClose();
                }}
                className="flex-1 h-11 px-5 rounded-lg bg-[#2E4A3D] text-white text-sm font-medium hover:bg-[#233A2F] transition-colors cursor-pointer whitespace-nowrap"
              >
                Add to Bag · ${(item.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
