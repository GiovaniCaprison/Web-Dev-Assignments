const mongoose = require('mongoose');
const Order = require('../models/order.js');

async function updateOrder(customerId, newDetails) {
    try {
        const updatedOrder = await Order.findOneAndUpdate({ customerId: customerId }, newDetails, { new: true }).populate('items');
        if (updatedOrder) {
            console.log(`Order Updated Successfully:\nOrder ID: ${updatedOrder._id}\nCustomer ID: ${updatedOrder.customerId}\nTotal Price: $${updatedOrder.totalPrice}`);
            updatedOrder.items.forEach(item => {
                console.log(`\tItem: ${item.model} by ${item.manufacturer} - $${item.price}`);
            });
            console.log('--------------------------------------');
            return updatedOrder;
        } else {
            console.log('No order found with that Customer ID');
        }
    } catch (error) {
        console.error('Error Updating Order:', error);
    }
}

module.exports = updateOrder;
