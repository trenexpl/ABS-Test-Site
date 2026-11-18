import { ShoppingBag, User } from 'lucide-react';
import type { CategoryId, MemberUser } from '../types.ts';

interface HeaderProps {
  activeView: 'store' | 'members';
  activeCategory: CategoryId;
  cartCount: number;
  member: MemberUser | null;
  onSelectCategory: (cat: CategoryId) => void;
  onOpenMembers: () => void;
  onOpenCart: () => void;
  onGoHome: () => void;
}

export const STUDIO_LOGO_URL =
  '/assets/aistudio/WhatsApp_Image_2026-11-19_at_06.19.56_593c7b73.jpeg';

export function Header({
  activeView,
  activeCategory,
  cartCount,
  member,
  onSelectCategory,
  onOpenMembers,
  onOpenCart,
  onGoHome,
}: HeaderProps) {
  const navItems: { id: CategoryId; label: string }[] = [
    { id: 'easy-packs', label: 'Easy Packs' },
    { id: 'classes', label: 'Classes' },
    { id: 'premixes', label: 'Premixes' },
    { id: 'moulds', label: 'Moulds' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#FFF9F2]/95 backdrop-blur-sm border-b border-[#EAD5C2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-6 sm:gap-8">
        {/* Zone 1: Top-left Clickable Studio Logo (always routes to main page) */}
        <button
          type="button"
          onClick={onGoHome}
          aria-label="ATB Baking Studio — Go to main page"
          className="inline-flex items-center gap-3 text-left whitespace-nowrap shrink-0 cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C6583E]"
        >
          <img
            src={STUDIO_LOGO_URL}
            alt="ATB Baking Studio Logo"
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full object-cover border border-[#EAD5C2] bg-[#FFFDF9] shadow-xs transition-transform duration-150 group-hover:scale-105 shrink-0"
          />
          <span className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[#472E22] group-hover:text-[#C6583E] transition-colors">
            ATB Baking Studio
          </span>
        </button>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav aria-label="Primary categories" className="hidden md:flex items-center gap-6 lg:gap-7">
          {navItems.map((item) => {
            const isActive = activeView === 'store' && activeCategory === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectCategory(item.id)}
                className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C6583E] ${
                  isActive
                    ? 'text-[#472E22] border-[#C6583E]'
                    : 'text-[#7B5D4D] border-transparent hover:text-[#472E22] hover:border-[#E47D61]/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={onOpenMembers}
            className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C6583E] ${
              activeView === 'members'
                ? 'text-[#472E22] border-[#C6583E]'
                : 'text-[#7B5D4D] border-transparent hover:text-[#472E22] hover:border-[#E47D61]/60'
            }`}
          >
            Loyalty Club
          </button>
        </nav>

        {/* Zone 3: Members Log In & Bag Trigger */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenMembers}
            className="inline-flex items-center gap-2 h-10 px-3.5 sm:px-4 text-xs sm:text-sm font-medium rounded-lg border border-[#E2C6AF] bg-white text-[#472E22] hover:border-[#C6583E] hover:bg-[#FDF0EB] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6583E]"
          >
            <User className="w-4 h-4 text-[#C6583E]" aria-hidden="true" />
            {member ? (
              <span className="tabular-nums">
                {member.name.split(' ')[0]} · {member.loyaltyPoints.toLocaleString()} pts
              </span>
            ) : (
              <span>Members Log In</span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open shopping bag with ${cartCount} items`}
            className="inline-flex items-center gap-2 h-10 px-3.5 sm:px-4 text-xs sm:text-sm font-medium rounded-lg bg-[#C6583E] text-white hover:bg-[#B04A32] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6583E]"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span className="tabular-nums">Bag ({cartCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
}
