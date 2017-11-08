'use strict';

const mongoose = require('mongoose');

const database = mongoose.createConnection('mongodb://localhost/test');

database.on('connect',function () {
    console.log('Connected!!');
});

module.exports = database;