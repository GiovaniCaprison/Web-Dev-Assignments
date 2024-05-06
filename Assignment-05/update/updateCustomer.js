const mongoose = require('mongoose');
const Customer = require('../models/customer.js');

async function updateCustomer(identifier, newDetails) {
    try {
        const updatedCustomer = await Customer.findOneAndUpdate({ email: identifier }, newDetails, { new: true });
        if (updatedCustomer) {
            console.log(`Customer found: ${identifier}. Updating...`);
            console.log();
            console.log(`Customer Updated Successfully:\nCustomer ID: ${updatedCustomer._id}\nName: ${updatedCustomer.title} ${updatedCustomer.firstName} ${updatedCustomer.surname}\nEmail: ${updatedCustomer.email}\nMobile: ${updatedCustomer.mobile}`);
            console.log(`Home Address: ${updatedCustomer.homeAddress.addressLine1}, ${updatedCustomer.homeAddress.town}, ${updatedCustomer.homeAddress.countyCity}`);
            console.log(`Shipping Address: ${updatedCustomer.shippingAddress.addressLine1}, ${updatedCustomer.shippingAddress.town}, ${updatedCustomer.shippingAddress.countyCity}`);
            console.log();
            console.log();
            console.log();
            return updatedCustomer;
        } else {
            console.log('No customer found with that email identifier');
        }
    } catch (error) {
        console.error('Error Updating Customer:', error);
    }
}

module.exports = updateCustomer;
