const mongoose = require('mongoose');
const createCustomer = require('../create/createCustomer.js');
const createOrder = require('../create/createOrder.js');
const DB_URL = '';

async function testCreateCustomerOrderAndItem() {
    const customer = await createCustomer();  // Call function to test creation process
    await createOrder(customer);
}

// Execute the test function if this file is run directly
if (require.main === module) {
    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => { console.log('MongoDB connected'); })
        .catch(err => console.error('MongoDB connection error:', err.message));
    testCreateCustomerOrderAndItem().then(() => {
        console.log('Test completed');
        mongoose.disconnect(); // Ensure to disconnect after testing
    }).catch(err => {
        console.error('Test failed:', err);
        mongoose.disconnect(); // Ensure to disconnect after an error
    });
}

module.exports = testCreateCustomerOrderAndItem;  // Export function to be used in app.js