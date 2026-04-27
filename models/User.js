const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin:  { type: Boolean, default: false },

    isActive:        { type: Boolean, default: false },
    activationToken: { type: String, default: null },
    email: { type: String, default: null }
});

module.exports = mongoose.model('User', userSchema);