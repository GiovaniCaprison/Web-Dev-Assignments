const mongoose = require('mongoose');
const Item = require('../models/item');
async function deleteItem() {
    try {
        console.log('Retrieving Item(s)...');
        console.log();
        const result1 = await Item.findOne({ model: 'iPhone 12' });
        const result2 = await Item.findOne({ model: 'Galaxy S21' });
        const result3 = await Item.findOne({ model: 'iPhone 14' });
        await Item.deleteMany({ model: 'iPhone 12' });
        await Item.deleteMany({ model: 'Galaxy S21' });
        await Item.deleteMany({ model: 'iPhone 14' });
        console.log(`Item(s) Deleted: ${result1.model}, ${result1.manufacturer}, ${result1.price}`);
        console.log(`Item(s) Deleted: ${result2.model}, ${result2.manufacturer}, ${result2.price}`);
        console.log(`Item(s) Deleted: ${result3.model}, ${result3.manufacturer}, ${result3.price}`);
    } catch (error) {
        console.error('Error Deleting Item:', error);
    }
}

module.exports = deleteItem;