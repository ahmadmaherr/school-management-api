const mongoose = require('mongoose')

const SchoolSchema = new mongoose.Schema({

name:{
    type : String,
    trim: true,
    minlength: 3,
    required: true
},

}, {
    timestamps: true
});

module.exports = mongoose.model('School', SchoolSchema);

