const mongoose = require('mongoose');
const databaseUrl = '';

mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

module.exports = mongoose;