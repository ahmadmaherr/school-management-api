const mongoose = require('mongoose')

const ClassSchema = new mongoose.Schema({

name:{
    type : String,
    trim: true,
    minlength: 3
},

_schoolId:{
    type: mongoose.Types.ObjectId,
    required: true
}

}, {
    timestamps: true
});

module.exports = mongoose.model('Class', ClassSchema);

