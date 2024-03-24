const Student = require('../models/students'); 
const Class = require('../models/classes'); 
const User = require('../models/users'); 
const moment = require("moment"); 

const config = require('../config/index.config');
const cache = require('../cache/cache.dbh')({
    prefix: config.dotEnv.CACHE_PREFIX,
    url: config.dotEnv.CACHE_REDIS
});

const getAllStudents = async (req, res) => {
    try {
        let students = await cache.key.get({ 
            key: 'allStudents' 
        });
        if (students) {
            // Parse the JSON string back to an object
            students = JSON.parse(students);
        } else {
            // Fetch from database if not found in cache
            students = await Student.find();
            // Cache the result for future requests
            await cache.key.set({ 
                key: 'allStudents', 
                data: JSON.stringify(students), 
                ttl: 3600 }); // Adjust TTL as needed
        }
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
        // Attempt to fetch student data from cache
        let student = await cache.key.get({ 
            key: `student:${studentId}` 
        });
        if (student) {
            // Cache hit, parse the JSON string to an object
            student = JSON.parse(student);
        } else {
            // Cache miss, fetch from MongoDB
            student = await Student.findById(studentId);
            if (!student) {
                return res.status(404).json({ 
                    error: 'Student not found.' 
                });
            }
            // Cache the fetched student data for future use
            await cache.key.set({ 
                key: `student:${studentId}`, 
                data: JSON.stringify(student), 
                ttl: 3600 
            }); // Adjust TTL as needed
        }
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

        await cache.key.delete({ 
            key: `studentsInClass:${_classId}` 
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

        await cache.key.delete({ 
            key: `student:${studentId}` 
        }); 

        await cache.key.delete({ 
            key: `studentsInClass:${_classId}` 
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
        const { _classId } = req.body;


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

        await cache.key.delete({ 
            key: `student:${studentId}` 
        });

        await cache.key.delete({ 
            key: 'allStudents' 
        });

    } catch (error) {
        res.status(500).json({
             error: 'Something went wrong.' + error.message 
        });
    }
};

module.exports = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent };
