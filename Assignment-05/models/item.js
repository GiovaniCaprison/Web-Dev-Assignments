const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    manufacturer: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
