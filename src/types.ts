export type CategoryId = 'all' | 'easy-packs' | 'classes' | 'premixes' | 'moulds';

export type ProductCategory = 'easy-packs' | 'classes' | 'premixes' | 'moulds';

export type ArtworkVariant =
  | 'hero'
  | 'brownie-pack'
  | 'matcha-pack'
  | 'financier-pack'
  | 'macaron-class'
  | 'cheesecake-class'
  | 'brioche-class'
  | 'chiffon-premix'
  | 'hokkaido-premix'
  | 'speculoos-premix'
  | 'madeleine-mould'
  | 'cake-pan'
  | 'canele-mould';

export interface CatalogItem {
  id: string;
  slug: string;
  title: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  subtitle: string;
  metaLeft: string;
  metaRight: string;
  tag?: string;
  description: string;
  includes: string[];
  artwork: ArtworkVariant;
  classDates?: string[];
  duration?: string;
  skillLevel?: string;
}

export interface CartItem {
  cartKey: string;
  itemId: string;
  title: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  quantity: number;
  artwork: ArtworkVariant;
  selectedDate?: string;
}

export type DeliveryTier = 'standard' | 'express';

export type ExpressWindow =
  | '10:00 AM – 12:00 PM'
  | '12:00 PM – 2:00 PM'
  | '2:00 PM – 4:00 PM'
  | '4:00 PM – 6:00 PM';

export const EXPRESS_WINDOWS: ExpressWindow[] = [
  '10:00 AM – 12:00 PM',
  '12:00 PM – 2:00 PM',
  '2:00 PM – 4:00 PM',
  '4:00 PM – 6:00 PM',
];

export const STANDARD_DELIVERY_WINDOW = '10:00 AM – 6:00 PM';
export const EXPRESS_DELIVERY_FEE = 15;

export interface LoyaltyTransaction {
  id: string;
  date: string;
  description: string;
  pointsDelta: number;
  orderNumber?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  postalCode: string;
  deliveryDate: string;
  deliveryTier: DeliveryTier;
  deliveryWindow: string;
  deliveryFee: number;
  subtotal: number;
  pointsRedeemed: number;
  discountAmount: number;
  total: number;
  pointsEarned: number;
  status: string;
  items: {
    itemId: string;
    title: string;
    categoryLabel: string;
    price: number;
    quantity: number;
    selectedDate?: string;
  }[];
}

export interface MemberUser {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  loyaltyPoints: number;
  lifetimePoints: number;
  tier: 'Home Baker' | 'Atelier Member' | 'Master Patissier';
  pointsHistory: LoyaltyTransaction[];
  orders: OrderRecord[];
}
