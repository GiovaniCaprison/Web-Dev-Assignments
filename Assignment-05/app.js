const mongoose= require('mongoose');
const testCreate = require("./tests/testCreate");
const testRetrieval = require("./tests/testRetrieval");
const testUpdate = require("./tests/testUpdate");
const testDelete = require("./tests/testDelete");
const DB_URL = '';
const itemsToCheckAndAddToOrder = [
    { manufacturer: 'Apple', model: 'iPhone 14', price: 1200 },
    { manufacturer: 'Samsung', model: 'Galaxy S21', price: 999 }
];


// This will run all tests in sequence, use ./tests to run individual tests on CRUD operations
async function app() {
    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => { console.log('MongoDB connected'); })
        .catch(err => console.error('MongoDB connection error:', err.message));
    await testCreate();
    await testRetrieval();
    await testUpdate(itemsToCheckAndAddToOrder);
    await testRetrieval();
    await testDelete();
    await mongoose.disconnect();
}

app();
