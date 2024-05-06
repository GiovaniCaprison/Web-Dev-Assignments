const mongoose = require('mongoose');
const Item = require('../models/item.js');
const createItem = require('../create/createItem');

// Function to ensure items exist by checking manufacturer and model
async function ensureItemsExist(items) {
    const validatedItems = [];

    for (const {manufacturer, model, price} of items) {
        let item = await Item.findOne({ manufacturer, model, price });
        if (!item) {
            await createItem(manufacturer, model, price);
            item = await Item.findOne({ manufacturer, model, price });
        }
        validatedItems.push(item._id); // Collect the ID of the existing or newly created item
    }

    return validatedItems;
}

module.exports = ensureItemsExist;