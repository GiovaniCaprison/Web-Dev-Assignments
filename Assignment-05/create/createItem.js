const mongoose = require('mongoose');
const Item = require('../models/item');

async function createItem(manufacturer, model, price) {
    try {
        const existingItem = await Item.findOne({ manufacturer: manufacturer, model: model, price: price});
        if (existingItem) {
            console.log(`Item already exists: ${existingItem.manufacturer} ${existingItem.model} at $${existingItem.price}`);
            return existingItem._id;
        }
        const newItem = new Item({
            manufacturer: manufacturer,
            model: model,
            price: price
        });
        const savedItem = await newItem.save();
        console.log('Items and/or price-points not yet reflected in our database. Updating....')
        console.log();
        console.log(`New Item Created: ${savedItem.manufacturer}, ${savedItem.model}, Price: $${savedItem.price}`);
        console.log();
        console.log();
        console.log();
        return savedItem._id;
    } catch (error) {
        console.error('Error Creating Item:', error);
        return null;
    }
}

module.exports = createItem;

