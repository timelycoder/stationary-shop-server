import { Types } from 'mongoose';

export interface IOrder {
  _id?: string;
  userId: Types.ObjectId;
  products: IOrderItem[];
  totalAmount: number;
  shippingCost?: number;
  shippingAddress: IShippingAddress;
  contactPhone?: string;
  customerNote?: string;
  couponCode?: string;
  // Order number for human reference (e.g., #2025-00123)
  orderNumber?: string;
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  trackingNumber: string | null;
  deliveryService?: string;
  transactionId: string;

  isPaid?: boolean;
  deliveredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
  color?: string;
  size?: string;
}

export interface IShippingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}
