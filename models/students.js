const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({

firstName:{
    type : String,
    trim: true,
    minlength: 3
},

lastName:{
    type : String,
    trim: true
},

birthdate: {
    type: Date, // Use the Date type for birthdate
    required: true
},

_classId:{
    type: mongoose.Types.ObjectId,
    required: true
}

}, {
    timestamps: true
});


module.exports = mongoose.model('Student', StudentSchema)
