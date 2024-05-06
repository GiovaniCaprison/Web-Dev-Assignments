const mongoose = require('mongoose');
const Order = require('../models/order');
const Item = require('../models/item');

async function createOrder(savedCustomer) {
    try {
        // Define the item details
        const itemDetails = {
            manufacturer: 'Apple',
            model: 'iPhone 12',
            price: 999
        };

        // Check if item already exists, if not, save new item
        let savedItem = await Item.findOne(itemDetails);
        if (!savedItem) {
            console.log('Items and/or price-points not yet reflected in our database. Updating....');
            console.log();
            savedItem = new Item(itemDetails);
            savedItem = await savedItem.save();
            console.log('New Item Created:');
            console.log('Manufacturer:', savedItem.manufacturer);
            console.log('Model:', savedItem.model);
            console.log('Price: $', savedItem.price);
            console.log();
            console.log();
            console.log();
        } else {
            console.log('Item already exists:', savedItem);
        }

        // Create and save the order
        const newOrder = new Order({
            customerId: savedCustomer._id,  // Reference the saved customer's ID
            items: [savedItem._id],         // Reference the saved item's ID
            purchaseDate: new Date(),
            totalPrice: savedItem.price     // Using the item's price as total for simplicity
        });
        console.log('Creating New Order...');
        console.log();
        const savedOrder = await newOrder.save();
        console.log('New Order Created with Item(s) ID:', savedOrder.items[0]);
        console.log('Total Price:', savedOrder.totalPrice);
        console.log('Customer Email:', savedCustomer.email);
        console.log('--------------------------------------');
    } catch (error) {
        console.error('Error in creating order or item:', error);
    }
}

module.exports = createOrder;
