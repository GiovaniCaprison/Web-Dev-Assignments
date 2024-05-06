const mongoose = require('mongoose');
const Order = require('../models/order.js');

async function retrieveOrdersByCustomer(customerId) {
    console.log('Retrieving Orders by Customer...');
    console.log();
    try {
        const orders = await Order.find({ customerId: customerId }).populate('items');
        if (orders.length > 0) {
            console.log('Customer above has the following Order Details:');
            orders.forEach(order => {
                console.log(`Order ID: ${order._id}\nDate: ${order.purchaseDate}\nTotal Price: $${order.totalPrice}`);
                order.items.forEach(item => {
                    console.log(`\tItem: ${item.model} by ${item.manufacturer} - $${item.price}`);
                });
                console.log();
            });
            console.log();
            console.log();
        } else {
            console.log('No orders found for this customer');
        }
        return orders;
    } catch (error) {
        console.error('Error Retrieving Orders:', error);
    }
}

module.exports = retrieveOrdersByCustomer;

