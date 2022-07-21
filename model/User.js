const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create the user Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        define: Date.now()
    }

});

module.exports = User = mongoose.model('user', UserSchema);