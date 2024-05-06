const mongoose = require('mongoose');
const deleteCustomer = require('../delete/deleteCustomerAndOrders');
const deleteItem = require('../delete/deleteItem');
const DB_URL = '';

async function testDelete() {
    await deleteCustomer('johndoe@example.com');
    await deleteItem();
}

if (require.main === module) {
    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => { console.log('MongoDB connected'); })
        .catch(err => console.error('MongoDB connection error:', err.message));
    testDelete().then(() => {
        console.log('Test completed');
        mongoose.disconnect(); // Ensure to disconnect after testing
    }).catch(err => {
        console.error('Test failed:', err);
        mongoose.disconnect(); // Ensure to disconnect after an error
    });
}

module.exports = testDelete;