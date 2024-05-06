const mongoose = require('mongoose');
const Customer = require('../models/customer');

async function createCustomer() {
    try {
        const existingCustomer = await Customer.findOne({ mobile: '0871234567' });
        if (existingCustomer) {
            console.log(`Customer already exists with mobile: ${existingCustomer.mobile}.`);
            return existingCustomer;
        }
        const newCustomer = new Customer({
            title: 'Mr',
            firstName: 'John',
            surname: 'Doe',
            mobile: '0871234567',
            email: 'johndoe@example.com',
            homeAddress: {
                addressLine1: '1 Main Street',
                town: 'Dublin',
                countyCity: 'Dublin'
            },
            shippingAddress: {
                addressLine1: '1 Main Street',
                town: 'Dublin',
                countyCity: 'Dublin'
            }
        });
        const savedCustomer = await newCustomer.save();
        console.log('--------------------------------------');
        console.log('Creating Customer...');
        console.log();
        console.log(`New Customer Created:`);
        console.log(`Name: ${savedCustomer.firstName} ${savedCustomer.surname}`);
        console.log(`mail: ${savedCustomer.email}`);
        console.log(`Mobile: ${savedCustomer.mobile}`);
        console.log(`Home Address: ${savedCustomer.homeAddress.addressLine1}, ${savedCustomer.homeAddress.town}, ${savedCustomer.homeAddress.countyCity}`);
        console.log(`Shipping Address: ${savedCustomer.shippingAddress.addressLine1}, ${savedCustomer.shippingAddress.town}, ${savedCustomer.shippingAddress.countyCity}`);
        console.log();
        console.log();
        console.log();
        return savedCustomer;
    } catch (error) {
        console.error('Error in creating customer:', error);
    }
}

module.exports = createCustomer;
