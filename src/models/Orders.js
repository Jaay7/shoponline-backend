import { Schema, model } from 'mongoose';

const OrdersSchema = new Schema({
  orderBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  orderProducts: [{
    _id: false,
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: Number,
  }],
  totalPrice: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['pending', 'delivered', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: String,
    default: new Date().toLocaleString(),
  }
});

const Orders = new model('Orders', OrdersSchema);

export default Orders;