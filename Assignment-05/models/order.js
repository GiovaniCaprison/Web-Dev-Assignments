const mongoose = require('mongoose');

const oderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    purchaseDate: Date,
    totalPrice: Number
});

const Order = mongoose.model('Order', oderSchema);

module.exports = Order;
