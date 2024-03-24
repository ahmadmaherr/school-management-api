const Student = require('../models/students'); 
const Class = require('../models/classes'); 
const User = require('../models/users'); 
const moment = require("moment"); 

const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json({ 
            students 
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Something went wrong.' + error.message 
        });
    }
};

const getStudentById = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findById(studentId);
        res.status(200).json({ 
            student 
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Something went wrong.' + error.message 
        });
    }
};

const createStudent = async (req, res) => {
    try {
        const { firstName, lastName, birthdate, _classId } = req.body;

        const userInstance = await User.findById(req.user.id);

        // Check if the user belongs to the school of the class they are creating a student for
        const classInstance = await Class.findOne({ 
            _id: _classId, 
            _schoolId: userInstance._schoolId.toString() 
        });

        if(!classInstance){
            return res.status(400).json({ 
                error: 'Class not found' 
            });

        }

        if( userInstance._schoolId.toString() !== classInstance._schoolId.toString() ){
            return res.status(500).json({
                status: 500,
                message: 'Unauthorized! You can only modify classes in your school.',
            });
        }

        if ( !classInstance ) {
            return res.status(403).json({ 
                error: 'Unauthorized! You do not have access to this school.' 
            });
        }

        //Create a new student instance
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

const updateStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { firstName, lastName, birthdate, _classId } = req.body;

        const userInstance = await User.findById(req.user.id);

        // Check if the user belongs to the school of the class they are creating a student for
        const classInstance = await Class.findOne({ 
            _id: _classId, 
            _schoolId: userInstance._schoolId.toString() 
        });

        if( userInstance._schoolId.toString() !== classInstance?._schoolId.toString() ){
            return res.status(500).json({
                status: 500,
                message: 'Unauthorized! You can only modify classes in your school.',
            });
        }

        if (!classInstance) {
            return res.status(403).json({ 
                error: 'Unauthorized! You do not have access to this school.' 
            });
        }

        const updatedStudent = await Student.findByIdAndUpdate(studentId, {
            firstName,
            lastName,
            birthdate: moment(birthdate, 'DD/MM/YYYY').toDate(),
            _classId
        }, 
        { 
            new: true 
        });

        res.status(200).json({ 
            message: 'Student updated successfully.', 
            student: updatedStudent 
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Something went wrong.' + error.message 
        });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        const userInstance = await User.findById(req.user.id);

        // Check if the user belongs to the school of the class they are creating a student for
        const classInstance = await Class.findOne({ 
            _id: _classId, 
            _schoolId: userInstance._schoolId.toString() 
        });

        if( userInstance._schoolId.toString() !== classInstance?._schoolId.toString() ){
            return res.status(500).json({
                status: 500,
                message: 'Unauthorized! You can only modify classes in your school.',
            });
        }

        if (!classInstance) {
            return res.status(403).json({ 
                error: 'Unauthorized! You do not have access to this school.' 
            });
        }

        await Student.findByIdAndDelete(studentId);
        res.status(200).json({ 
            message: 'Student deleted successfully.' 
        });
    } catch (error) {
        res.status(500).json({
             error: 'Something went wrong.' + error.message 
        });
    }
};

module.exports = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent };
