import { useState } from 'react';
import { ArrowLeft, Award, Gift, LogOut, Package, Sparkles } from 'lucide-react';
import type { MemberUser } from '../types.ts';

interface MembersPortalProps {
  member: MemberUser | null;
  onAuthSuccess: (member: MemberUser, token: string) => void;
  onLogout: () => void;
  onBackToStore: () => void;
}

export function MembersPortal({
  member,
  onAuthSuccess,
  onLogout,
  onBackToStore,
}: MembersPortalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function submitAuth(targetEmail: string, targetPassword: string, targetMode: 'login' | 'register', targetName?: string) {
    setErrorMsg(null);
    setLoading(true);
    try {
      const endpoint = targetMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          targetMode === 'login'
            ? { email: targetEmail, password: targetPassword }
            : { name: targetName, email: targetEmail, password: targetPassword }
        ),
      });
      const data = (await res.json()) as {
        error?: string;
        member?: MemberUser;
        token?: string;
      };
      if (!res.ok || !data.member || !data.token) {
        setErrorMsg(data.error ?? 'Authentication failed. Please try again.');
        setLoading(false);
        return;
      }
      onAuthSuccess(data.member, data.token);
    } catch {
      setErrorMsg('Unable to reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitAuth(email, password, mode, name);
  }

  if (member) {
    const redeemableValue = (member.loyaltyPoints / 100).toFixed(2);
    const nextTierThreshold = member.lifetimePoints >= 2500 ? 2500 : member.lifetimePoints >= 800 ? 2500 : 800;
    const progressPct = Math.min(100, Math.round((member.lifetimePoints / nextTierThreshold) * 100));

    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#4D4943] hover:text-[#1D1B18] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 h-9 px-3.5 text-xs font-medium rounded-lg border border-[#D9D5CC] bg-white text-[#4D4943] hover:text-[#1D1B18] cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Member Loyalty Overview */}
        <section className="rounded-2xl bg-white border border-[#E5E3DC] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-3">
            <div className="text-xs text-[#6E6A63]">
              <span>Crumb &amp; Co. Member Club</span>
              <span aria-hidden="true"> · </span>
              <span>{member.tier}</span>
              <span aria-hidden="true"> · </span>
              <span>Member since {member.joinedAt}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1D1B18]">
              Welcome back, {member.name}
            </h1>
            <p className="text-sm text-[#4D4943] max-w-xl leading-relaxed">
              You earn 10 loyalty points for every $1 spent on baking classes, Bakers Easy Packs, premixes, and moulds. Redeem 100 points for $1.00 off at checkout.
            </p>

            <div className="pt-2 space-y-1.5 max-w-md">
              <div className="flex justify-between text-xs text-[#625E57]">
                <span>Tier progress ({member.tier})</span>
                <span className="tabular-nums">
                  {member.lifetimePoints.toLocaleString()} / {nextTierThreshold.toLocaleString()} lifetime pts
                </span>
              </div>
              <div className="h-2 rounded-full bg-[#ECEAE4] overflow-hidden">
                <div
                  className="h-full bg-[#2E4A3D] rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-5 rounded-xl bg-[#F5F4F0] border border-[#E5E3DC] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#625E57]">Available Loyalty Balance</span>
              <Award className="w-5 h-5 text-[#2E4A3D]" aria-hidden="true" />
            </div>
            <div>
              <div className="font-display text-4xl font-semibold text-[#1D1B18] tabular-nums">
                {member.loyaltyPoints.toLocaleString()} <span className="text-lg font-normal text-[#625E57]">pts</span>
              </div>
              <div className="mt-1 text-sm text-[#2E4A3D] font-medium tabular-nums">
                Worth ${redeemableValue} off your next order
              </div>
            </div>
            <button
              type="button"
              onClick={onBackToStore}
              className="w-full h-10 rounded-lg bg-[#2E4A3D] text-white text-sm font-medium hover:bg-[#233A2F] transition-colors cursor-pointer"
            >
              Shop Kits &amp; Book Classes
            </button>
          </div>
        </section>

        {/* Two-column Ledger & Order History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Points Activity Ledger */}
          <section className="lg:col-span-5 space-y-4">
            <h2 className="font-display text-xl font-semibold text-[#1D1B18]">
              Loyalty Points History
            </h2>
            <div className="rounded-xl bg-white border border-[#E5E3DC] divide-y divide-[#EAE8E1]">
              {member.pointsHistory.length === 0 ? (
                <div className="p-6 text-sm text-[#625E57]">No points activity recorded yet.</div>
              ) : (
                member.pointsHistory.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#1D1B18] leading-snug">
                        {tx.description}
                      </p>
                      <p className="text-xs text-[#6E6A63] mt-1 tabular-nums">{tx.date}</p>
                    </div>
                    <span
                      className={`text-sm font-semibold tabular-nums shrink-0 ${
                        tx.pointsDelta >= 0 ? 'text-[#2E4A3D]' : 'text-[#8C4A27]'
                      }`}
                    >
                      {tx.pointsDelta >= 0 ? `+${tx.pointsDelta}` : tx.pointsDelta} pts
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Past Orders & Class Bookings */}
          <section className="lg:col-span-7 space-y-4">
            <h2 className="font-display text-xl font-semibold text-[#1D1B18]">
              Orders &amp; Class Bookings
            </h2>
            <div className="space-y-4">
              {member.orders.length === 0 ? (
                <div className="rounded-xl bg-white border border-[#E5E3DC] p-6 text-sm text-[#625E57]">
                  You have not placed any orders yet. Earn 10 pts per $1 on your first purchase!
                </div>
              ) : (
                member.orders.map((ord) => (
                  <article
                    key={ord.id}
                    className="rounded-xl bg-white border border-[#E5E3DC] p-5 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EAE8E1]">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#1D1B18]">
                        <Package className="w-4 h-4 text-[#2E4A3D]" aria-hidden="true" />
                        <span className="font-mono">#{ord.orderNumber}</span>
                        <span className="text-xs font-normal text-[#6E6A63]">· {ord.status}</span>
                      </div>
                      <div className="text-xs font-medium text-[#2E4A3D] tabular-nums">
                        +{ord.pointsEarned.toLocaleString()} pts earned
                      </div>
                    </div>

                    <ul className="space-y-1.5 text-sm text-[#35322E]">
                      {ord.items.map((it, idx) => (
                        <li key={idx} className="flex justify-between gap-3">
                          <span>
                            {it.quantity} × {it.title}
                            {it.selectedDate ? ` (${it.selectedDate})` : ''}
                          </span>
                          <span className="tabular-nums text-[#625E57]">
                            ${(it.price * it.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-3 border-t border-[#EAE8E1] flex flex-wrap items-center justify-between gap-3 text-xs text-[#625E57]">
                      <div className="tabular-nums">
                        Delivery: <strong className="text-[#1D1B18]">{ord.deliveryDate}</strong> ·{' '}
                        {ord.deliveryTier === 'express' ? 'Express' : 'Standard'} ({ord.deliveryWindow})
                      </div>
                      <div className="text-sm font-semibold text-[#1D1B18] tabular-nums">
                        Total: ${ord.total.toFixed(2)}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <button
        type="button"
        onClick={onBackToStore}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#4D4943] hover:text-[#1D1B18] mb-8 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Storefront</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Login / Register Card */}
        <section className="lg:col-span-7 rounded-2xl bg-white border border-[#E5E3DC] p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-medium text-[#2E4A3D]">Crumb &amp; Co. Member Club</p>
            <h1 className="font-display text-3xl font-semibold text-[#1D1B18]">
              {mode === 'login' ? 'Members Log In' : 'Create a Member Account'}
            </h1>
            <p className="text-sm text-[#625E57]">
              Sign in to view your loyalty points balance, track studio class bookings, and redeem rewards at checkout.
            </p>
          </div>

          <div className="inline-flex p-1 bg-[#F3F2EE] rounded-lg">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#1D1B18] shadow-xs'
                  : 'text-[#625E57] hover:text-[#1D1B18]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#1D1B18] shadow-xs'
                  : 'text-[#625E57] hover:text-[#1D1B18]'
              }`}
            >
              Join Free (+150 pts)
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-[#4D4943] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Lim"
                  className="w-full h-11 px-3.5 text-sm rounded-lg border border-[#D9D5CC] bg-white focus:outline-none focus:border-[#2E4A3D]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#4D4943] mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="claire.tan@example.com"
                className="w-full h-11 px-3.5 text-sm rounded-lg border border-[#D9D5CC] bg-white focus:outline-none focus:border-[#2E4A3D]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4D4943] mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full h-11 px-3.5 text-sm rounded-lg border border-[#D9D5CC] bg-white focus:outline-none focus:border-[#2E4A3D]"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B]">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-[#2E4A3D] text-white text-sm font-medium hover:bg-[#233A2F] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {loading
                ? 'Please wait...'
                : mode === 'login'
                ? 'Log In to Member Portal'
                : 'Create Account & Claim 150 Pts'}
            </button>
          </form>

          {/* Instant Demo Member Sign-In */}
          <div className="pt-4 border-t border-[#EAE8E1] flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-[#625E57]">
              Demo account: <span className="font-mono text-[#1D1B18]">claire.tan@example.com</span> (1,240 pts)
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={() => submitAuth('claire.tan@example.com', 'bakewithus', 'login')}
              className="px-3.5 py-2 text-xs font-medium rounded-lg border border-[#D9D5CC] bg-[#F9F9F7] text-[#1D1B18] hover:border-[#2E4A3D] transition-colors cursor-pointer whitespace-nowrap"
            >
              Demo Member Log In
            </button>
          </div>
        </section>

        {/* Right: Loyalty Benefits Breakdown */}
        <aside className="lg:col-span-5 rounded-2xl bg-[#F2F1EC] border border-[#E5E3DC] p-6 sm:p-8 space-y-6">
          <h2 className="font-display text-2xl font-semibold text-[#1D1B18]">
            How Loyalty Points Work
          </h2>

          <div className="space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E3DC] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#2E4A3D]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1D1B18]">Earn 10 Points per $1 Spent</h3>
                <p className="text-xs text-[#625E57] mt-1 leading-relaxed">
                  Every Bakers Easy Pack, studio baking class, premix pouch, and silicone mould earns points automatically at checkout.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E3DC] flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4 text-[#2E4A3D]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1D1B18]">Instant Checkout Redemption</h3>
                <p className="text-xs text-[#625E57] mt-1 leading-relaxed">
                  Redeem in 100-point increments (100 pts = $1.00 off) directly inside the checkout drawer on any future order.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E3DC] flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 text-[#2E4A3D]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1D1B18]">150 Welcome Bonus Points</h3>
                <p className="text-xs text-[#625E57] mt-1 leading-relaxed">
                  New members receive 150 points immediately upon registration—ready to apply toward your first bake pack or class.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
