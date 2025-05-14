import { Schema, model, Document } from 'mongoose';
import { IOrder, IOrderItem, IShippingAddress } from './order.interface';

// Sub-schema for Order Items
const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    name: { type: String },
    image: { type: String },
    color: { type: String },
    size: { type: String },
  },
  { _id: false },
);

// Sub-schema for Shipping Address
const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false },
);

// Main Order Schema
const OrderSchema = new Schema<IOrder & Document>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (products: IOrderItem[]) => products.length > 0,
        message: 'At least one product is required',
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    shippingAddress: {
      type: ShippingAddressSchema,
      required: true,
    },
    contactPhone: {
      type: String,
    },
    customerNote: {
      type: String,
    },
    couponCode: {
      type: String,
    },
    orderNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    trackingNumber: {
      type: String,
      default: null,
    },
    deliveryService: {
      type: String,
    },
    transactionId: {
      type: String,
      unique: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Pre-save hook to generate order number
OrderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    // Generate order number like #2025-00123 (year-sequence)
    const year = new Date().getFullYear();
    const lastOrder = await Order.findOne({ orderNumber: new RegExp(`^#${year}-`) })
      .sort({ orderNumber: -1 })
      .limit(1);

    let sequence = 1;
    if (lastOrder?.orderNumber) {
      const lastSequence = parseInt(lastOrder.orderNumber.split('-')[1]);
      if (!isNaN(lastSequence)) {
        sequence = lastSequence + 1;
      }
    }

    this.orderNumber = `#${year}-${sequence.toString().padStart(5, '0')}`;
  }
  next();
});

const Order = model<IOrder & Document>('Order', OrderSchema);
export default Order;
