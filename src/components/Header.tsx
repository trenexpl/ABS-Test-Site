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
    <header className="sticky top-0 z-30 bg-[#F9F9F7]/95 backdrop-blur-sm border-b border-[#E5E3DC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={onGoHome}
          className="font-display text-xl font-semibold tracking-tight text-[#1D1B18] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E4A3D]"
        >
          Crumb &amp; Co.
        </button>

        {/* Zone 2: 4–5 Concise Single-Line Navigation Links */}
        <nav aria-label="Primary categories" className="hidden md:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive = activeView === 'store' && activeCategory === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectCategory(item.id)}
                className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E4A3D] ${
                  isActive
                    ? 'text-[#1D1B18] border-[#2E4A3D]'
                    : 'text-[#625E57] border-transparent hover:text-[#1D1B18] hover:border-[#C8C3B8]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={onOpenMembers}
            className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E4A3D] ${
              activeView === 'members'
                ? 'text-[#1D1B18] border-[#2E4A3D]'
                : 'text-[#625E57] border-transparent hover:text-[#1D1B18] hover:border-[#C8C3B8]'
            }`}
          >
            Loyalty Club
          </button>
        </nav>

        {/* Zone 3: Members Log In & Bag Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenMembers}
            className="inline-flex items-center gap-2 h-10 px-4 text-sm font-medium rounded-lg border border-[#D9D5CC] bg-white text-[#1D1B18] hover:border-[#2E4A3D] hover:bg-[#F3F2EE] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E4A3D]"
          >
            <User className="w-4 h-4 text-[#2E4A3D]" aria-hidden="true" />
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
            className="inline-flex items-center gap-2 h-10 px-4 text-sm font-medium rounded-lg bg-[#2E4A3D] text-white hover:bg-[#233A2F] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E4A3D]"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span className="tabular-nums">Bag ({cartCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
}
