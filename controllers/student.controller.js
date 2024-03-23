const Student = require('../models/students'); 
const Class = require('../models/classes'); 
const User = require('../models/users'); 
const moment = require("moment"); // Import moment library for date formatting


const createStudent = async (req, res) => {
    try {
        const { firstName, lastName, birthdate, _classId } = req.body;

        // const userInstance = await User.findById(req.user.id);

        // // Check if the user belongs to the school of the class they are creating a student for
        // const classInstance = await Class.findOne({ _id: _classId, _schoolId: userInstance._schoolId.toString() });

        // if(userInstance._schoolId.toString() !== classInstance?._schoolId.toString() ){
        //     return res.status(500).json({
        //         status: 500,
        //         message: 'Unauthorized! You can only modify classes in your school.',
        //     });
        // }

        // if (!classInstance) {
        //     return res.status(403).json({ error: 'Unauthorized! You do not have access to this school.' });
        // }

        // Create a new student instance

        const newStudent = await Student.create({
            firstName,
            lastName,
            birthdate: moment(req.body.birthdate, 'DD/MM/YYYY').toDate(),
            _classId
        });

        res.status(201).json({ 
            message: 'Student created successfully.', 
            student: newStudent 
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Something went wrong.' + error.message 
        });
    }
};

module.exports = { createStudent };
