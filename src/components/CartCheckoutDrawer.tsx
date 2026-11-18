import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import type {
  CartItem,
  DeliveryTier,
  ExpressWindow,
  MemberUser,
  OrderRecord,
} from '../types.ts';
import {
  EXPRESS_DELIVERY_FEE,
  EXPRESS_WINDOWS,
  STANDARD_DELIVERY_WINDOW,
} from '../types.ts';
import { ProductArtwork } from './ProductArtwork.tsx';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  member: MemberUser | null;
  authToken: string | null;
  onClose: () => void;
  onUpdateQty: (cartKey: string, delta: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onClearCart: () => void;
  onOrderSuccess: (order: OrderRecord, updatedMember: MemberUser | null) => void;
  onOpenMembers: () => void;
}

function getUpcomingDates(count: number): { iso: string; label: string; sub: string }[] {
  const results: { iso: string; label: string; sub: string }[] = [];
  const base = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    results.push({ iso, label: weekday, sub: monthDay });
  }
  return results;
}

export function CartCheckoutDrawer({
  isOpen,
  items,
  member,
  authToken,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOrderSuccess,
  onOpenMembers,
}: CartCheckoutDrawerProps) {
  const upcomingDates = useMemo(() => getUpcomingDates(5), []);
  const minDeliveryDate = upcomingDates[0]?.iso ?? '';

  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmation'>('bag');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(minDeliveryDate);
  const [deliveryTier, setDeliveryTier] = useState<DeliveryTier>('standard');
  const [expressWindow, setExpressWindow] = useState<ExpressWindow>('10:00 AM – 12:00 PM');
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    if (member) {
      setCustomerName((prev) => prev || member.name);
      setCustomerEmail((prev) => prev || member.email);
    }
  }, [member]);

  useEffect(() => {
    if (isOpen && items.length > 0 && step === 'confirmation') {
      setStep('bag');
      setConfirmedOrder(null);
    }
  }, [isOpen, items.length, step]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryTier === 'express' ? EXPRESS_DELIVERY_FEE : 0;
  const maxRedeemable = member
    ? Math.min(
        member.loyaltyPoints - (member.loyaltyPoints % 100),
        Math.floor((subtotal + deliveryFee) * 100)
      )
    : 0;
  const safeRedeemPoints = Math.min(redeemPoints, maxRedeemable);
  const discountAmount = safeRedeemPoints / 100;
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);
  const projectedPointsEarned = Math.round(total * 10);

  async function handleCheckoutSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: items.map((i) => ({
            itemId: i.itemId,
            quantity: i.quantity,
            selectedDate: i.selectedDate,
          })),
          customerName,
          customerEmail,
          customerPhone,
          deliveryAddress,
          postalCode,
          deliveryDate,
          deliveryTier,
          expressWindow: deliveryTier === 'express' ? expressWindow : undefined,
          redeemPoints: safeRedeemPoints,
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        order?: OrderRecord;
        member?: MemberUser | null;
      };

      if (!res.ok || !data.order) {
        setErrorMsg(data.error ?? 'Unable to complete checkout. Please check your details.');
        setSubmitting(false);
        return;
      }

      setConfirmedOrder(data.order);
      onOrderSuccess(data.order, data.member ?? null);
      onClearCart();
      setRedeemPoints(0);
      setStep('confirmation');
    } catch {
      setErrorMsg('Network error while submitting your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#472E22]/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Checkout"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#FFFDF9] h-full flex flex-col shadow-2xl border-l border-[#EAD5C2]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#EAD5C2] bg-[#FFF9F2] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('bag')}
                aria-label="Back to shopping bag"
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[#E2C6AF] bg-white text-[#6E4E3E] hover:text-[#472E22] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-display text-xl font-semibold text-[#472E22]">
              {step === 'bag' && 'Your Baking Bag'}
              {step === 'checkout' && 'Delivery Schedule & Checkout'}
              {step === 'confirmation' && 'Order Confirmed'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[#E2C6AF] bg-white text-[#6E4E3E] hover:text-[#472E22] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'bag' && (
            <>
              {items.length === 0 ? (
                <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center px-4">
                  <div className="w-12 h-12 rounded-full bg-[#F9EDE0] flex items-center justify-center mb-4">
                    <ShoppingBag className="w-5 h-5 text-[#C6583E]" />
                  </div>
                  <p className="font-display text-lg font-medium text-[#472E22]">
                    Your baking bag is empty
                  </p>
                  <p className="mt-1.5 text-sm text-[#7B5D4D] max-w-xs">
                    Explore our pre-measured Bakers Easy Packs, moulds, premixes, or book a studio workshop.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#F1DFCE]">
                  {items.map((item) => (
                    <div key={item.cartKey} className="py-4 flex gap-4">
                      <div className="w-24 h-20 rounded-lg overflow-hidden bg-[#F9EDE0] border border-[#EAD5C2] shrink-0">
                        <ProductArtwork variant={item.artwork} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs text-[#8C6A58]">{item.categoryLabel}</p>
                            <h3 className="text-sm font-semibold text-[#472E22] leading-snug">
                              {item.title}
                            </h3>
                            {item.selectedDate && (
                              <p className="mt-1 text-xs text-[#C6583E] font-medium">
                                Session: {item.selectedDate}
                              </p>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-[#472E22] tabular-nums shrink-0">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center border border-[#E2C6AF] rounded-md h-8 bg-[#FFF9F2]">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.cartKey, -1)}
                              aria-label={`Decrease quantity for ${item.title}`}
                              className="w-8 h-full inline-flex items-center justify-center text-[#6E4E3E] hover:text-[#472E22] cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center text-xs font-medium tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.cartKey, 1)}
                              aria-label={`Increase quantity for ${item.title}`}
                              className="w-8 h-full inline-flex items-center justify-center text-[#6E4E3E] hover:text-[#472E22] cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.cartKey)}
                            className="inline-flex items-center gap-1 text-xs text-[#8C6A58] hover:text-[#991B1B] transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-6">
              {!member && (
                <div className="p-3.5 rounded-lg bg-[#FDF0EB] border border-[#EED0C5] flex items-center justify-between gap-3">
                  <div className="text-xs text-[#6E4E3E]">
                    <span className="font-semibold text-[#472E22]">Earn +{projectedPointsEarned} loyalty points</span>{' '}
                    on this order when you sign in as a member.
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenMembers();
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-[#E2C6AF] text-[#472E22] hover:border-[#C6583E] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Members Log In
                  </button>
                </div>
              )}

              {/* Section 1: Delivery Date */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="delivery-date-input" className="text-sm font-semibold text-[#472E22] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#C6583E]" aria-hidden="true" />
                    <span>1. Select Delivery Date</span>
                  </label>
                  <span className="text-xs text-[#8C6A58] tabular-nums">{deliveryDate}</span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {upcomingDates.map((d) => {
                    const selected = deliveryDate === d.iso;
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        onClick={() => setDeliveryDate(d.iso)}
                        className={`py-2 px-1 rounded-lg border text-center transition-colors cursor-pointer ${
                          selected
                            ? 'border-[#C6583E] bg-[#C6583E] text-white'
                            : 'border-[#E7D0BC] bg-[#FFF9F2] text-[#472E22] hover:border-[#E47D61]'
                        }`}
                      >
                        <div className="text-[11px] opacity-85">{d.label}</div>
                        <div className="text-xs font-semibold mt-0.5 tabular-nums">{d.sub}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#7B5D4D] whitespace-nowrap">Or choose another date:</span>
                  <input
                    id="delivery-date-input"
                    type="date"
                    min={minDeliveryDate}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    required
                    className="flex-1 h-9 px-3 text-xs rounded-lg border border-[#E2C6AF] bg-white text-[#472E22] tabular-nums focus:outline-none focus:border-[#C6583E]"
                  />
                </div>
              </section>

              {/* Section 2: Delivery Timing (Standard vs Express +$15) */}
              <section className="space-y-3 pt-4 border-t border-[#F1DFCE]">
                <div className="text-sm font-semibold text-[#472E22] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C6583E]" aria-hidden="true" />
                  <span>2. Select Delivery Timing</span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDeliveryTier('standard')}
                    className={`p-3.5 rounded-lg border text-left transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                      deliveryTier === 'standard'
                        ? 'border-[#C6583E] bg-[#FDF0EB]'
                        : 'border-[#E7D0BC] bg-white hover:border-[#E47D61]'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-[#472E22]">
                        Standard Delivery Window
                      </div>
                      <div className="text-xs text-[#7B5D4D] mt-0.5 tabular-nums">
                        {STANDARD_DELIVERY_WINDOW} · All-day studio courier
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#66753D] tabular-nums shrink-0">
                      $0.00
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryTier('express')}
                    className={`p-3.5 rounded-lg border text-left transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                      deliveryTier === 'express'
                        ? 'border-[#C6583E] bg-[#FDF0EB]'
                        : 'border-[#E7D0BC] bg-white hover:border-[#E47D61]'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-[#472E22]">
                        Express Timed Delivery
                      </div>
                      <div className="text-xs text-[#7B5D4D] mt-0.5">
                        Guaranteed 2-hour arrival slot of your choice
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#472E22] tabular-nums shrink-0">
                      +${EXPRESS_DELIVERY_FEE.toFixed(2)}
                    </span>
                  </button>
                </div>

                {deliveryTier === 'express' && (
                  <div className="p-3.5 rounded-lg bg-[#FFF9F2] border border-[#EAD5C2] space-y-2.5">
                    <div className="text-xs font-semibold text-[#472E22]">
                      Choose your Express 2-hour window (+$15.00 fee)
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {EXPRESS_WINDOWS.map((slot) => {
                        const active = expressWindow === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setExpressWindow(slot)}
                            className={`h-10 px-3 rounded-lg border text-xs font-medium tabular-nums transition-colors cursor-pointer ${
                              active
                                ? 'border-[#C6583E] bg-[#C6583E] text-white'
                                : 'border-[#E2C6AF] bg-white text-[#472E22] hover:border-[#C6583E]'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>

              {/* Section 3: Member Loyalty Redemption */}
              {member && maxRedeemable >= 100 && (
                <section className="p-3.5 rounded-lg bg-[#F9EDE0] border border-[#EAD5C2] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#472E22]">
                      Redeem Loyalty Points ({member.loyaltyPoints.toLocaleString()} pts available)
                    </span>
                    <span className="text-[#66753D] font-semibold tabular-nums">
                      -${discountAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={maxRedeemable}
                      step={100}
                      value={safeRedeemPoints}
                      onChange={(e) => setRedeemPoints(Number(e.target.value))}
                      aria-label="Redeem loyalty points"
                      className="flex-1 accent-[#C6583E] cursor-pointer"
                    />
                    <span className="text-xs font-mono tabular-nums text-[#6E4E3E] w-20 text-right">
                      {safeRedeemPoints} pts
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7B5D4D]">100 pts = $1.00 off your order.</p>
                </section>
              )}

              {/* Section 4: Recipient & Address */}
              <section className="space-y-3 pt-4 border-t border-[#F1DFCE]">
                <div className="text-sm font-semibold text-[#472E22] flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C6583E]" aria-hidden="true" />
                  <span>3. Delivery Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#6E4E3E] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Claire Tan"
                      className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2C6AF] bg-white text-[#472E22] focus:outline-none focus:border-[#C6583E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6E4E3E] mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="claire@example.com"
                      className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2C6AF] bg-white text-[#472E22] focus:outline-none focus:border-[#C6583E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#6E4E3E] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+65 9123 4567"
                      className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2C6AF] bg-white text-[#472E22] focus:outline-none focus:border-[#C6583E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6E4E3E] mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="168792"
                      className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2C6AF] bg-white text-[#472E22] tabular-nums focus:outline-none focus:border-[#C6583E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#6E4E3E] mb-1">Street Address &amp; Unit</label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="48 Tiong Bahru Road, #04-12"
                    className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2C6AF] bg-white text-[#472E22] focus:outline-none focus:border-[#C6583E]"
                  />
                </div>
              </section>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B]">
                  {errorMsg}
                </div>
              )}
            </form>
          )}

          {step === 'confirmation' && confirmedOrder && (
            <div className="py-4 space-y-6">
              <div className="p-5 rounded-xl bg-[#F4F6ED] border border-[#D4DEC0] space-y-2">
                <div className="flex items-center gap-2 text-[#66753D]">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-semibold">Order #{confirmedOrder.orderNumber} Confirmed</span>
                </div>
                <p className="text-sm text-[#5D3D2E]">
                  Thank you, {confirmedOrder.customerName}. Your ATB Baking Studio order is scheduled and preparing for dispatch.
                </p>
              </div>

              <div className="rounded-xl border border-[#EAD5C2] divide-y divide-[#F1DFCE] text-sm">
                <div className="p-4 flex justify-between">
                  <span className="text-[#7B5D4D]">Scheduled Delivery Date</span>
                  <span className="font-medium text-[#472E22] tabular-nums">{confirmedOrder.deliveryDate}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-[#7B5D4D]">Delivery Timing</span>
                  <span className="font-medium text-[#472E22] tabular-nums text-right">
                    {confirmedOrder.deliveryTier === 'express' ? 'Express · ' : 'Standard · '}
                    {confirmedOrder.deliveryWindow}
                  </span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-[#7B5D4D]">Delivery Fee</span>
                  <span className="font-medium text-[#472E22] tabular-nums">
                    ${confirmedOrder.deliveryFee.toFixed(2)}
                  </span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-[#7B5D4D]">Total Paid</span>
                  <span className="font-semibold text-[#472E22] tabular-nums">
                    ${confirmedOrder.total.toFixed(2)}
                  </span>
                </div>
                {confirmedOrder.pointsEarned > 0 && (
                  <div className="p-4 flex justify-between bg-[#FFF9F2]">
                    <span className="text-[#66753D] font-medium">Loyalty Points Credited</span>
                    <span className="font-semibold text-[#66753D] tabular-nums">
                      +{confirmedOrder.pointsEarned.toLocaleString()} pts
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-[#8C6A58]">Items Ordered</h3>
                <ul className="space-y-2 text-sm">
                  {confirmedOrder.items.map((it, idx) => (
                    <li key={idx} className="flex justify-between gap-3">
                      <span className="text-[#5D3D2E]">
                        {it.quantity} × {it.title}
                        {it.selectedDate ? ` (${it.selectedDate})` : ''}
                      </span>
                      <span className="tabular-nums text-[#472E22] font-medium">
                        ${(it.price * it.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {member && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenMembers();
                  }}
                  className="w-full h-11 rounded-lg bg-[#C6583E] text-white text-sm font-medium hover:bg-[#B04A32] transition-colors cursor-pointer"
                >
                  View Updated Loyalty Points ({member.loyaltyPoints.toLocaleString()} pts)
                </button>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {step === 'bag' && items.length > 0 && (
          <div className="px-6 py-4 border-t border-[#EAD5C2] bg-[#FFF9F2] space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#7B5D4D]">Subtotal</span>
              <span className="font-semibold text-[#472E22] tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-[#8C6A58]">
              Choose Standard (10am–6pm) or Express 2-hour delivery timing at checkout.
            </p>
            <button
              type="button"
              onClick={() => setStep('checkout')}
              className="w-full h-11 rounded-lg bg-[#C6583E] text-white text-sm font-medium hover:bg-[#B04A32] transition-colors cursor-pointer"
            >
              Proceed to Delivery &amp; Checkout
            </button>
          </div>
        )}

        {step === 'checkout' && (
          <div className="px-6 py-4 border-t border-[#EAD5C2] bg-[#FFF9F2] space-y-3">
            <div className="space-y-1 text-xs text-[#7B5D4D]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums text-[#472E22]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  Delivery ({deliveryTier === 'express' ? `Express · ${expressWindow}` : `Standard · ${STANDARD_DELIVERY_WINDOW}`})
                </span>
                <span className="tabular-nums text-[#472E22]">${deliveryFee.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#66753D]">
                  <span>Loyalty Points Discount ({safeRedeemPoints} pts)</span>
                  <span className="tabular-nums">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-1.5 border-t border-[#EAD5C2] text-sm font-semibold text-[#472E22]">
                <span>Total</span>
                <span className="tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className="w-full h-11 rounded-lg bg-[#C6583E] text-white text-sm font-medium hover:bg-[#B04A32] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {submitting
                ? 'Confirming Order...'
                : `Confirm Order · $${total.toFixed(2)}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
