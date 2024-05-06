const mongoose = require('mongoose');
const Customer = require('../models/customer');
const Order = require('../models/order');

async function deleteCustomerAndOrders(email) {
    console.log('Retrieving Customer and their Order\'s...');
    console.log();
    try {
        const customer = await Customer.findOne({ email: email });
        if (customer) {
            console.log(`Customer Found: ${customer.title} ${customer.firstName} ${customer.surname} - ${customer.email}`);
            const customerDeleted = await Customer.deleteOne({ _id: customer._id });
            console.log(`Customer deleted: ${customerDeleted.deletedCount > 0 ? 'Success' : 'Failed'}`);
            const ordersDeleted = await Order.deleteMany({ customerId: customer._id });
            console.log(`Orders deleted: ${ordersDeleted.deletedCount}`);
            console.log();
            console.log();
            console.log();
        } else {
            console.log(`No customer found with email: ${email}`);
        }
    } catch (error) {
        console.error('Error Deleting Customer:', error);
    }
}

module.exports = deleteCustomerAndOrders;
