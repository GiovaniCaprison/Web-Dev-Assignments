const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    title: String,
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    homeAddress: {
        addressLine1: { type: String, required: true },
        addressLine2: String,
        town: { type: String, required: true },
        countyCity: { type: String, required: true },
        eircode: String
    },
    shippingAddress: {
        addressLine1: { type: String, required: true },
        addressLine2: String,
        town: { type: String, required: true },
        countyCity: { type: String, required: true },
        eircode: String
    }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
