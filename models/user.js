const mongoose = require('mongoose');

/* User */
const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    first_name: {
        type: mongoose.Schema.Types.String
    },
    last_name: {
        type: mongoose.Schema.Types.String
    },
    username: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    confirmed: {
        type: mongoose.Schema.Types.Bool,
        default: false
    }
    isAdmin: {
        type: mongoose.Schema.Types.Bool,
        default: false
    }
});

module.exports = mongoose.model('users', userSchema);
