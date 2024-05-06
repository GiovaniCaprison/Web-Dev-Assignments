const mongoose = require('mongoose');
const Customer = require('../models/customer.js');

async function retrieveCustomer(detail) {
    console.log('Retrieving Customer...');
    console.log();
    try {
        const query = {};
        if (detail.email) {
            query.email = detail.email;
        } else if (detail.mobile) {
            query.mobile = detail.mobile;
        }

        const customer = await Customer.findOne(query);
        if (customer) {
            console.log('Customer Retrieved Successfully:')
            console.log(`Customer ID: ${customer._id}\nName: ${customer.title} ${customer.firstName} ${customer.surname}\nEmail: ${customer.email}\nMobile: ${customer.mobile}`);
            console.log(`Home Address: ${customer.homeAddress.addressLine1}, ${customer.homeAddress.town}, ${customer.homeAddress.countyCity}`);
            console.log(`Shipping Address: ${customer.shippingAddress.addressLine1}, ${customer.shippingAddress.town}, ${customer.shippingAddress.countyCity}`);
            console.log();
            console.log();
            console.log();
            return customer;
        } else {
            console.log('No customer found with given details');
            return null;
        }
    } catch (error) {
        console.error('Error Retrieving Customer:', error);
    }
}

module.exports = retrieveCustomer;
