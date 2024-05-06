const mongoose = require('mongoose');
const updateCustomer = require('../update/updateCustomer');
const updateOrder = require('../update/updateOrder');
const ensureItemsExist = require('../helpers/ensureItemsExist');
const DB_URL = '';

// Test update function with ensuring item existence
async function testUpdate(itemsToCheck) {

    const customer = await updateCustomer('johndoe@example.com', { mobile: '0876543210', 'homeAddress.countyCity': 'Cork' });
    // Check and create items if they do not exist
    const itemIds = await ensureItemsExist(itemsToCheck);
    if(customer) {
        console.log('Customers\' order found. Updating...');
        console.log();
        await updateOrder(customer._id, {items: itemIds, totalPrice: 2199});
    }
    else
        console.log('Customer not found');
}

if (require.main === module) {
    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => { console.log('MongoDB connected'); })
        .catch(err => console.error('MongoDB connection error:', err.message));
    const itemsToCheck = [
        { manufacturer: 'Apple', model: 'iPhone 12', price: 799 },
        { manufacturer: 'Samsung', model: 'Galaxy S21', price: 999 }
    ];
    testUpdate(itemsToCheck).then(() => {
        console.log('Test completed');
        mongoose.disconnect(); // Ensure to disconnect after testing
    }).catch(err => {
        console.error('Test failed:', err);
        mongoose.disconnect(); // Ensure to disconnect after an error
    });
}

module.exports = testUpdate;
