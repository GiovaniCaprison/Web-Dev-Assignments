const mongoose = require('mongoose');
const retrieveCustomer = require("../retrieve/retrieveCustomer.js");
const retrieveItemByModel = require("../retrieve/retrieveItemByModel.js");
const retrieveOrdersByCustomer = require("../retrieve/retrieveOrdersByCustomer.js");
const DB_URL = '';

// Test retrieval functions
async function testRetrieval() {
    const customer = await retrieveCustomer({ email: 'johndoe@example.com' });
    if (customer) {
        const orders = await retrieveOrdersByCustomer(customer._id);
        const items = await retrieveItemByModel('iPhone 12');
    }
}

// Execute the test function if this file is run directly
if (require.main === module) {
    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => { console.log('MongoDB connected'); })
        .catch(err => console.error('MongoDB connection error:', err.message));
    testRetrieval().then(() => {
        console.log('Test completed');
        mongoose.disconnect(); // Ensure to disconnect after testing
    }).catch(err => {
        console.error('Test failed:', err);
        mongoose.disconnect(); // Ensure to disconnect after an error
    });
}

module.exports = testRetrieval;

