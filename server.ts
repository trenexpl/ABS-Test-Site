import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { CATALOG_ITEMS } from './src/data/catalog.ts';
import type {
  DeliveryTier,
  ExpressWindow,
  LoyaltyTransaction,
  MemberUser,
  OrderRecord,
} from './src/types.ts';
import { EXPRESS_DELIVERY_FEE, EXPRESS_WINDOWS, STANDARD_DELIVERY_WINDOW } from './src/types.ts';

interface StoredMember extends MemberUser {
  passwordHash: string;
}

interface StoreData {
  members: StoredMember[];
  sessions: Record<string, string>;
  guestOrders: OrderRecord[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(':');
  if (!salt || !key) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(key, 'hex');
  if (derived.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derived, keyBuf);
}

function computeTier(lifetimePoints: number): MemberUser['tier'] {
  if (lifetimePoints >= 2500) return 'Master Patissier';
  if (lifetimePoints >= 800) return 'Atelier Member';
  return 'Home Baker';
}

function createInitialStore(): StoreData {
  const demoOrders: OrderRecord[] = [
    {
      id: 'ord-seed-1024',
      orderNumber: 'CC-1024',
      createdAt: '2026-11-02T10:15:00.000Z',
      customerName: 'Claire Tan',
      customerEmail: 'claire.tan@example.com',
      customerPhone: '+65 9123 4567',
      deliveryAddress: '48 Tiong Bahru Road, #04-12',
      postalCode: '168792',
      deliveryDate: '2026-11-04',
      deliveryTier: 'express',
      deliveryWindow: '10:00 AM – 12:00 PM',
      deliveryFee: 15,
      subtotal: 60,
      pointsRedeemed: 0,
      discountAmount: 0,
      total: 75,
      pointsEarned: 750,
      status: 'Delivered',
      items: [
        {
          itemId: 'pack-matcha-mochi',
          title: 'Uji Matcha Mochi Muffin Easy Pack',
          categoryLabel: 'Bakers Easy Pack',
          price: 36,
          quantity: 1,
        },
        {
          itemId: 'mould-silicone-madeleine',
          title: '12-Cavity Platinum Silicone Madeleine Mould',
          categoryLabel: 'Mould & Bakeware',
          price: 24,
          quantity: 1,
        },
      ],
    },
    {
      id: 'ord-seed-1038',
      orderNumber: 'CC-1038',
      createdAt: '2026-11-12T14:30:00.000Z',
      customerName: 'Claire Tan',
      customerEmail: 'claire.tan@example.com',
      customerPhone: '+65 9123 4567',
      deliveryAddress: '48 Tiong Bahru Road, #04-12',
      postalCode: '168792',
      deliveryDate: '2026-11-15',
      deliveryTier: 'standard',
      deliveryWindow: STANDARD_DELIVERY_WINDOW,
      deliveryFee: 0,
      subtotal: 34,
      pointsRedeemed: 0,
      discountAmount: 0,
      total: 34,
      pointsEarned: 340,
      status: 'Delivered',
      items: [
        {
          itemId: 'pack-french-financier',
          title: 'Brown-Butter Almond Financier Easy Pack',
          categoryLabel: 'Bakers Easy Pack',
          price: 34,
          quantity: 1,
        },
      ],
    },
  ];

  const demoHistory: LoyaltyTransaction[] = [
    {
      id: 'tx-seed-3',
      date: '2026-11-12',
      description: 'Order #CC-1038 · Brown-Butter Almond Financier Easy Pack',
      pointsDelta: 340,
      orderNumber: 'CC-1038',
    },
    {
      id: 'tx-seed-2',
      date: '2026-11-02',
      description: 'Order #CC-1024 · Matcha Pack & Madeleine Mould',
      pointsDelta: 750,
      orderNumber: 'CC-1024',
    },
    {
      id: 'tx-seed-1',
      date: '2026-10-18',
      description: 'Welcome Member Bonus',
      pointsDelta: 150,
    },
  ];

  return {
    members: [
      {
        id: 'mem-claire-tan',
        name: 'Claire Tan',
        email: 'claire.tan@example.com',
        passwordHash: hashPassword('bakewithus'),
        joinedAt: '2026-10-18',
        loyaltyPoints: 1240,
        lifetimePoints: 1240,
        tier: 'Atelier Member',
        pointsHistory: demoHistory,
        orders: demoOrders,
      },
    ],
    sessions: {},
    guestOrders: [],
  };
}

function loadStore(): StoreData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    const initial = createInitialStore();
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    return JSON.parse(raw) as StoreData;
  } catch {
    const fallback = createInitialStore();
    fs.writeFileSync(STORE_PATH, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

function saveStore(store: StoreData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

function sanitizeMember(member: StoredMember): MemberUser {
  const { passwordHash: _ignored, ...safe } = member;
  return safe;
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  const result: Record<string, string> = {};
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = decodeURIComponent(part.slice(idx + 1).trim());
    result[key] = val;
  }
  return result;
}

function getTokenFromRequest(req: express.Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  const cookies = parseCookies(req.headers.cookie);
  return cookies.cc_session ?? null;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/catalog', (_req, res) => {
    res.json({ items: CATALOG_ITEMS });
  });

  app.get('/api/auth/me', (req, res) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      res.json({ member: null });
      return;
    }
    const store = loadStore();
    const memberId = store.sessions[token];
    if (!memberId) {
      res.json({ member: null });
      return;
    }
    const member = store.members.find((m) => m.id === memberId);
    if (!member) {
      res.json({ member: null });
      return;
    }
    res.json({ member: sanitizeMember(member) });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    const cleanName = (name ?? '').trim();
    const cleanEmail = (email ?? '').trim().toLowerCase();
    const cleanPassword = password ?? '';

    if (cleanName.length < 2) {
      res.status(400).json({ error: 'Please enter your full name.' });
      return;
    }
    if (!cleanEmail.includes('@') || cleanEmail.length < 5) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    if (cleanPassword.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' });
      return;
    }

    const store = loadStore();
    if (store.members.some((m) => m.email === cleanEmail)) {
      res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const welcomeBonus = 150;
    const newMember: StoredMember = {
      id: `mem-${crypto.randomUUID().slice(0, 8)}`,
      name: cleanName,
      email: cleanEmail,
      passwordHash: hashPassword(cleanPassword),
      joinedAt: today,
      loyaltyPoints: welcomeBonus,
      lifetimePoints: welcomeBonus,
      tier: 'Home Baker',
      pointsHistory: [
        {
          id: `tx-${crypto.randomUUID().slice(0, 8)}`,
          date: today,
          description: 'Welcome Member Bonus',
          pointsDelta: welcomeBonus,
        },
      ],
      orders: [],
    };

    const token = crypto.randomBytes(24).toString('hex');
    store.members.push(newMember);
    store.sessions[token] = newMember.id;
    saveStore(store);

    res.setHeader(
      'Set-Cookie',
      `cc_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
    );
    res.status(201).json({ token, member: sanitizeMember(newMember) });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };
    const cleanEmail = (email ?? '').trim().toLowerCase();
    const cleanPassword = password ?? '';

    const store = loadStore();
    const member = store.members.find((m) => m.email === cleanEmail);
    if (!member || !verifyPassword(cleanPassword, member.passwordHash)) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = crypto.randomBytes(24).toString('hex');
    store.sessions[token] = member.id;
    saveStore(store);

    res.setHeader(
      'Set-Cookie',
      `cc_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
    );
    res.json({ token, member: sanitizeMember(member) });
  });

  app.post('/api/auth/logout', (req, res) => {
    const token = getTokenFromRequest(req);
    if (token) {
      const store = loadStore();
      delete store.sessions[token];
      saveStore(store);
    }
    res.setHeader('Set-Cookie', 'cc_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
    res.json({ ok: true });
  });

  app.post('/api/orders', (req, res) => {
    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      postalCode,
      deliveryDate,
      deliveryTier,
      expressWindow,
      redeemPoints,
    } = req.body as {
      items?: { itemId: string; quantity: number; selectedDate?: string }[];
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
      deliveryAddress?: string;
      postalCode?: string;
      deliveryDate?: string;
      deliveryTier?: DeliveryTier;
      expressWindow?: ExpressWindow;
      redeemPoints?: number;
    };

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Your bag is empty.' });
      return;
    }
    if (!customerName?.trim() || !customerEmail?.trim() || !deliveryAddress?.trim() || !postalCode?.trim()) {
      res.status(400).json({ error: 'Please complete all contact and delivery address fields.' });
      return;
    }
    if (!deliveryDate || !/^\d{4}-\d{2}-\d{2}$/.test(deliveryDate)) {
      res.status(400).json({ error: 'Please select a valid delivery date.' });
      return;
    }

    const tier: DeliveryTier = deliveryTier === 'express' ? 'express' : 'standard';
    let resolvedWindow = STANDARD_DELIVERY_WINDOW;
    let deliveryFee = 0;

    if (tier === 'express') {
      if (!expressWindow || !EXPRESS_WINDOWS.includes(expressWindow)) {
        res.status(400).json({ error: 'Please select an express 2-hour delivery timing window.' });
        return;
      }
      resolvedWindow = expressWindow;
      deliveryFee = EXPRESS_DELIVERY_FEE;
    }

    const resolvedItems: OrderRecord['items'] = [];
    let subtotal = 0;

    for (const entry of items) {
      const catalogItem = CATALOG_ITEMS.find((c) => c.id === entry.itemId);
      if (!catalogItem) {
        res.status(400).json({ error: `Unknown item in bag: ${entry.itemId}` });
        return;
      }
      const qty = Math.max(1, Math.min(20, Math.floor(Number(entry.quantity) || 1)));
      subtotal += catalogItem.price * qty;
      resolvedItems.push({
        itemId: catalogItem.id,
        title: catalogItem.title,
        categoryLabel: catalogItem.categoryLabel,
        price: catalogItem.price,
        quantity: qty,
        selectedDate: entry.selectedDate,
      });
    }

    const store = loadStore();
    const token = getTokenFromRequest(req);
    const memberId = token ? store.sessions[token] : undefined;
    const member = memberId ? store.members.find((m) => m.id === memberId) : undefined;

    let pointsRedeemed = 0;
    let discountAmount = 0;

    if (member && redeemPoints && redeemPoints >= 100) {
      const requestedUnits = Math.floor(redeemPoints / 100) * 100;
      const maxRedeemableForOrder = Math.floor((subtotal + deliveryFee) * 100);
      const safeRedeem = Math.min(requestedUnits, member.loyaltyPoints - (member.loyaltyPoints % 100), maxRedeemableForOrder);
      if (safeRedeem >= 100) {
        pointsRedeemed = safeRedeem;
        discountAmount = safeRedeem / 100;
      }
    }

    const total = Math.max(0, Number((subtotal + deliveryFee - discountAmount).toFixed(2)));
    const pointsEarned = member ? Math.round(total * 10) : 0;

    const orderNum = `CC-${1040 + store.guestOrders.length + store.members.reduce((acc, m) => acc + m.orders.length, 0) + 1}`;
    const today = new Date().toISOString().slice(0, 10);

    const newOrder: OrderRecord = {
      id: `ord-${crypto.randomUUID().slice(0, 8)}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: (customerPhone ?? '').trim() || 'Not provided',
      deliveryAddress: deliveryAddress.trim(),
      postalCode: postalCode.trim(),
      deliveryDate,
      deliveryTier: tier,
      deliveryWindow: resolvedWindow,
      deliveryFee,
      subtotal: Number(subtotal.toFixed(2)),
      pointsRedeemed,
      discountAmount: Number(discountAmount.toFixed(2)),
      total,
      pointsEarned,
      status: 'Confirmed · Preparing Order',
      items: resolvedItems,
    };

    if (member) {
      if (pointsRedeemed > 0) {
        member.loyaltyPoints -= pointsRedeemed;
        member.pointsHistory.unshift({
          id: `tx-${crypto.randomUUID().slice(0, 8)}`,
          date: today,
          description: `Redeemed at checkout · Order #${orderNum}`,
          pointsDelta: -pointsRedeemed,
          orderNumber: orderNum,
        });
      }
      if (pointsEarned > 0) {
        member.loyaltyPoints += pointsEarned;
        member.lifetimePoints += pointsEarned;
        member.tier = computeTier(member.lifetimePoints);
        member.pointsHistory.unshift({
          id: `tx-${crypto.randomUUID().slice(0, 8)}`,
          date: today,
          description: `Order #${orderNum} · ${resolvedItems.length} item${resolvedItems.length > 1 ? 's' : ''}`,
          pointsDelta: pointsEarned,
          orderNumber: orderNum,
        });
      }
      member.orders.unshift(newOrder);
    } else {
      store.guestOrders.unshift(newOrder);
    }

    saveStore(store);

    res.status(201).json({
      order: newOrder,
      member: member ? sanitizeMember(member) : null,
    });
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Crumb & Co. server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
