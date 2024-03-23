const mongoose = require('mongoose');

const UserLoginSchema = new mongoose.Schema({
    token: { // auth token
        type: String,
        required: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    }
}, {
    timestamps: true
});

module.exports =  mongoose.model('UserLogin', UserLoginSchema);
