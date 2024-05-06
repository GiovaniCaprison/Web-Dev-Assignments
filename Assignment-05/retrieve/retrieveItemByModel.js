const mongoose = require('mongoose');
const Item = require('../models/item.js');

async function retrieveItemByModel(model) {
    console.log('Retrieving Items by Model...');
    console.log();
    try {
        console.log(`Items in our database matching the given Model: '${model}'`);
        const items = await Item.find({ model: model });
        if (items.length > 0) {
            items.forEach(item => {
                console.log(`Name: ${item.model}\nManufacturer: ${item.manufacturer}\nPrice: $${item.price}`);
                console.log('--------------------------------------');
            });
        } else {
            console.log('No items found matching the given model');
        }
        return items;
    } catch (error) {
        console.error('Error Retrieving Items:', error);
    }
}

module.exports = retrieveItemByModel;
