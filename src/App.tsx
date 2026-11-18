import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Calendar, Clock, Search, UserCheck } from 'lucide-react';
import { CATALOG_ITEMS } from './data/catalog.ts';
import type { CartItem, CatalogItem, CategoryId, MemberUser, OrderRecord } from './types.ts';
import { Header } from './components/Header.tsx';
import { ProductArtwork } from './components/ProductArtwork.tsx';
import { ProductModal } from './components/ProductModal.tsx';
import { CartCheckoutDrawer } from './components/CartCheckoutDrawer.tsx';
import { MembersPortal } from './components/MembersPortal.tsx';

const TOKEN_STORAGE_KEY = 'crumb_co_auth_token';
const CART_STORAGE_KEY = 'crumb_co_cart';

export default function App() {
  const [activeView, setActiveView] = useState<'store' | 'members'>('store');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const [authToken, setAuthToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const [member, setMember] = useState<MemberUser | null>(null);
  const catalogRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage quota issues
    }
  }, [cart]);

  useEffect(() => {
    async function restoreSession() {
      try {
        const headers: Record<string, string> = {};
        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`;
        }
        const res = await fetch('/api/auth/me', { headers });
        if (!res.ok) return;
        const data = (await res.json()) as { member: MemberUser | null };
        setMember(data.member);
        if (!data.member && authToken) {
          setAuthToken(null);
          localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
      } catch {
        // Ignore offline check
      }
    }
    restoreSession();
  }, [authToken]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CATALOG_ITEMS.filter((item) => {
      const catMatch = activeCategory === 'all' || item.category === activeCategory;
      if (!catMatch) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, searchQuery]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function handleSelectCategory(cat: CategoryId) {
    setActiveView('store');
    setActiveCategory(cat);
    window.setTimeout(() => {
      catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  }

  function handleAddToCart(item: CatalogItem, quantity = 1, selectedDate?: string) {
    const chosenDate = item.category === 'classes' ? selectedDate || item.classDates?.[0] : undefined;
    const cartKey = chosenDate ? `${item.id}::${chosenDate}` : item.id;

    setCart((prev) => {
      const existing = prev.find((c) => c.cartKey === cartKey);
      if (existing) {
        return prev.map((c) =>
          c.cartKey === cartKey ? { ...c, quantity: Math.min(20, c.quantity + quantity) } : c
        );
      }
      return [
        ...prev,
        {
          cartKey,
          itemId: item.id,
          title: item.title,
          category: item.category,
          categoryLabel: item.categoryLabel,
          price: item.price,
          quantity,
          artwork: item.artwork,
          selectedDate: chosenDate,
        },
      ];
    });
    setToastMessage(`Added ${item.title} to your bag`);
  }

  function handleUpdateQty(cartKey: string, delta: number) {
    setCart((prev) =>
      prev
        .map((c) => (c.cartKey === cartKey ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    );
  }

  function handleRemoveItem(cartKey: string) {
    setCart((prev) => prev.filter((c) => c.cartKey !== cartKey));
  }

  function handleClearCart() {
    setCart([]);
  }

  function handleAuthSuccess(loggedInMember: MemberUser, token: string) {
    setMember(loggedInMember);
    setAuthToken(token);
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch {
      // Ignore
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore
    }
    setMember(null);
    setAuthToken(null);
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }

  function handleOrderSuccess(_order: OrderRecord, updatedMember: MemberUser | null) {
    if (updatedMember) {
      setMember(updatedMember);
    }
  }

  const categoryTabs: { id: CategoryId; label: string }[] = [
    { id: 'all', label: 'All Collection' },
    { id: 'easy-packs', label: 'Bakers Easy Packs' },
    { id: 'classes', label: 'Baking Classes' },
    { id: 'premixes', label: 'Premixes' },
    { id: 'moulds', label: 'Moulds & Bakeware' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7] text-[#1D1B18]">
      <Header
        activeView={activeView}
        activeCategory={activeCategory}
        cartCount={cartCount}
        member={member}
        onSelectCategory={handleSelectCategory}
        onOpenMembers={() => {
          setActiveView('members');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onGoHome={() => {
          setActiveView('store');
          setActiveCategory('all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {activeView === 'members' ? (
        <div className="flex-1">
          <MembersPortal
            member={member}
            onAuthSuccess={handleAuthSuccess}
            onLogout={handleLogout}
            onBackToStore={() => setActiveView('store')}
          />
        </div>
      ) : (
        <main className="flex-1">
          {/* Section 1: Storefront Hero */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12 sm:pt-12 sm:pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-between py-2 space-y-6">
                <div className="space-y-4">
                  <p className="text-xs font-medium text-[#2E4A3D] tracking-wide">
                    Artisanal Baking Studio · Pre-Measured Kits &amp; Bakeware
                  </p>
                  <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1D1B18] leading-[1.08] tracking-tight [text-wrap:balance]">
                    Bake studio-grade pastries at home, weighed to the gram.
                  </h1>
                  <p className="text-base text-[#4D4943] leading-relaxed max-w-xl">
                    Book small-group hands-on baking classes or shop Bakers Easy Packs, small-batch premixes, and platinum silicone moulds—delivered on your chosen date and time slot.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('easy-packs')}
                    className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-[#2E4A3D] text-white text-sm font-medium hover:bg-[#233A2F] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>Explore Easy Packs</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('members');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-lg border border-[#D4CFC5] bg-white text-[#1D1B18] text-sm font-medium hover:border-[#2E4A3D] hover:bg-[#F3F2EE] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-[#2E4A3D]" aria-hidden="true" />
                    <span>
                      {member
                        ? `Member Points: ${member.loyaltyPoints.toLocaleString()} pts`
                        : 'Members Log In · Earn Points'}
                    </span>
                  </button>
                </div>

                {/* Full-width 3-column Trust & Delivery Summary Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E5E3DC] text-xs">
                  <div>
                    <div className="font-semibold text-[#1D1B18]">Standard Delivery</div>
                    <div className="text-[#625E57] mt-0.5 tabular-nums">10:00 AM – 6:00 PM ($0)</div>
                  </div>
                  <div>
                    <div className="font-semibold text-[#1D1B18]">Express 2-Hr Timing</div>
                    <div className="text-[#625E57] mt-0.5 tabular-nums">4 timed windows (+$15)</div>
                  </div>
                  <div>
                    <div className="font-semibold text-[#1D1B18]">Member Loyalty</div>
                    <div className="text-[#625E57] mt-0.5 tabular-nums">10 pts per $1 spent</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-[#E5E3DC] aspect-[4/3] lg:aspect-auto lg:min-h-[430px]">
                <ProductArtwork variant="hero" className="lg:h-full" />
              </div>
            </div>
          </section>

          {/* Section 2: Featured Collection Grid */}
          <section
            ref={catalogRef}
            id="collection"
            className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 border-t border-[#E5E3DC]"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div className="space-y-1.5">
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1D1B18]">
                  Studio Classes, Packs &amp; Bakeware
                </h2>
                <p className="text-sm text-[#625E57]">
                  Select any workshop to pick a studio date, or add pre-measured packs and moulds directly to your bag.
                </p>
              </div>

              <div className="relative w-full md:w-64">
                <Search
                  className="w-4 h-4 text-[#78746C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search packs, moulds, classes..."
                  aria-label="Search baking products and classes"
                  className="w-full h-10 pl-9 pr-3 text-sm rounded-lg border border-[#D9D5CC] bg-white text-[#1D1B18] placeholder:text-[#8C877E] focus:outline-none focus:border-[#2E4A3D]"
                />
              </div>
            </div>

            {/* Interactive Category Filter Tabs */}
            <div
              role="tablist"
              aria-label="Filter collection by category"
              className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EFEDE8] rounded-xl w-fit mb-8"
            >
              {categoryTabs.map((tab) => {
                const active = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-white text-[#1D1B18] shadow-xs'
                        : 'text-[#625E57] hover:text-[#1D1B18]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* 3-Column Product Grid */}
            {filteredItems.length === 0 ? (
              <div className="rounded-xl bg-white border border-[#E5E3DC] p-12 text-center space-y-2">
                <p className="font-display text-lg font-medium text-[#1D1B18]">
                  No matching items found
                </p>
                <p className="text-sm text-[#625E57]">
                  Try clearing your search or switching back to All Collection.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-2 px-4 py-2 text-xs font-medium rounded-lg border border-[#D9D5CC] bg-[#F9F9F7] hover:border-[#2E4A3D] cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredItems.map((item) => (
                  <article
                    key={item.id}
                    className="group bg-white border border-[#E5E3DC] rounded-xl overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="block w-full aspect-[4/3] bg-[#F1F0EB] overflow-hidden text-left cursor-pointer"
                    >
                      <ProductArtwork
                        variant={item.artwork}
                        className="transition-transform duration-200 group-hover:scale-[1.02]"
                      />
                    </button>

                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-xs text-[#6E6A63]">
                          <div className="flex items-center gap-1.5 truncate">
                            <span>{item.categoryLabel}</span>
                            <span aria-hidden="true">·</span>
                            <span>{item.metaLeft}</span>
                          </div>
                          {item.tag && (
                            <span className="text-[11px] font-medium text-[#2E4A3D] shrink-0">
                              {item.tag}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="text-left block w-full cursor-pointer"
                        >
                          <h3 className="text-base font-semibold text-[#1D1B18] group-hover:text-[#2E4A3D] transition-colors leading-snug">
                            {item.title}
                          </h3>
                        </button>

                        <p className="text-xs text-[#625E57] leading-relaxed line-clamp-2">
                          {item.subtitle}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#F0EEE8] flex items-center justify-between gap-3">
                        <span className="text-[15px] font-semibold text-[#1D1B18] tabular-nums">
                          ${item.price.toFixed(2)}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedItem(item)}
                            className="h-9 px-3 text-xs font-medium rounded-lg border border-[#D9D5CC] text-[#4D4943] hover:text-[#1D1B18] hover:border-[#A8A298] transition-colors whitespace-nowrap cursor-pointer"
                          >
                            {item.category === 'classes' ? 'Dates' : 'Details'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (item.category === 'classes') {
                                setSelectedItem(item);
                              } else {
                                handleAddToCart(item, 1);
                              }
                            }}
                            className="h-9 px-3.5 text-xs font-medium rounded-lg bg-[#2E4A3D] text-white hover:bg-[#233A2F] transition-colors whitespace-nowrap cursor-pointer"
                          >
                            {item.category === 'classes' ? 'Book Seat' : 'Add to Bag'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Section 3: Scheduled Delivery & Member Loyalty Club */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-[#E5E3DC]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-6 rounded-2xl bg-white border border-[#E5E3DC] p-7 sm:p-9 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-medium text-[#2E4A3D]">Flexible Checkout Scheduling</p>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1D1B18]">
                    Choose your exact delivery date and 2-hour window.
                  </h2>
                  <p className="text-sm text-[#4D4943] leading-relaxed">
                    Whether you are baking for a weekend dinner or gifting a mould set, select your preferred delivery date at checkout. Choose complimentary Standard Timing or upgrade to a guaranteed Express 2-hour window.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#F9F9F7] border border-[#E5E3DC] space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1D1B18]">
                      <Calendar className="w-4 h-4 text-[#2E4A3D]" aria-hidden="true" />
                      <span>Standard Timing ($0)</span>
                    </div>
                    <p className="text-xs text-[#625E57] tabular-nums">10:00 AM – 6:00 PM</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F9F9F7] border border-[#E5E3DC] space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1D1B18]">
                      <Clock className="w-4 h-4 text-[#2E4A3D]" aria-hidden="true" />
                      <span>Express Windows (+$15)</span>
                    </div>
                    <p className="text-xs text-[#625E57] tabular-nums">
                      10–12 · 12–2 · 2–4 · 4–6 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 rounded-2xl bg-[#2E4A3D] text-white p-7 sm:p-9 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-medium text-[#C5D8CD]">Crumb &amp; Co. Member Rewards</p>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
                    {member
                      ? `You have ${member.loyaltyPoints.toLocaleString()} loyalty points ready.`
                      : 'Earn 10 loyalty points for every $1 you spend.'}
                  </h2>
                  <p className="text-sm text-[#DDE7E1] leading-relaxed">
                    {member
                      ? 'Visit your member dashboard anytime to review your points ledger, past class bookings, and delivery schedules.'
                      : 'Sign in or join free in seconds. Track every earned point, view your past workshop bookings, and redeem points directly at checkout.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('members');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="h-11 px-5 rounded-lg bg-white text-[#1D1B18] text-sm font-medium hover:bg-[#F3F2EE] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {member ? 'Open My Loyalty Dashboard' : 'Members Log In / Join'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-[#E5E3DC] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#625E57]">
          <div className="space-y-1">
            <div className="font-display text-base font-semibold text-[#1D1B18]">Crumb &amp; Co.</div>
            <p>42 Joo Chiat Studio Lane · Open Tue–Sun, 9:30 AM – 7:00 PM</p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => handleSelectCategory('easy-packs')}
              className="hover:text-[#1D1B18] cursor-pointer"
            >
              Easy Packs
            </button>
            <button
              type="button"
              onClick={() => handleSelectCategory('classes')}
              className="hover:text-[#1D1B18] cursor-pointer"
            >
              Baking Classes
            </button>
            <button
              type="button"
              onClick={() => handleSelectCategory('premixes')}
              className="hover:text-[#1D1B18] cursor-pointer"
            >
              Premixes
            </button>
            <button
              type="button"
              onClick={() => handleSelectCategory('moulds')}
              className="hover:text-[#1D1B18] cursor-pointer"
            >
              Moulds
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('members');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#1D1B18] cursor-pointer"
            >
              Members Log In
            </button>
          </div>
        </div>
      </footer>

      {/* Toast confirmation */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-40 px-4 py-3 rounded-lg bg-[#1D1B18] text-white text-xs font-medium shadow-lg flex items-center gap-3"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setIsCartOpen(true);
            }}
            className="underline text-[#C5D8CD] hover:text-white cursor-pointer"
          >
            View Bag
          </button>
        </div>
      )}

      <ProductModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleAddToCart}
      />

      <CartCheckoutDrawer
        isOpen={isCartOpen}
        items={cart}
        member={member}
        authToken={authToken}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderSuccess={handleOrderSuccess}
        onOpenMembers={() => {
          setActiveView('members');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
