const Class = require("../models/classes");
const User = require("../models/users");


const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find(); // Fetch all classes

        res.status(200).json({ classes }); // Send classes in the response
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.' + error.message });
    }
};

const getClassById = async (req, res) => {
    try {
        const { classId } = req.params;

        // Fetch the class by ID
        const classInstance = await Class.findById(classId);

        if (!classInstance) {
            return res.status(404).json({ error: 'Class not found.' });
        }

        res.status(200).json({ class: classInstance }); // Send class in the response
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.' + error.message });
    }
};

const createClass = async (req, res) => {
    try {
        if(req.user.role !== 'superadmin' && req.user.role !== 'admin'){
            res.status(500).json({
                status: 500,
                message: 'unauthorized! you must be superadmin or admin',
            });
        }else{
            // Extract data from the request body
            const { name, schoolId } = req.body;

            const userInstance = await User.findById(req.user.id);

            if(userInstance._schoolId.toString() !== schoolId ){
                return res.status(500).json({
                    status: 500,
                    message: 'Unauthorized! You can only modify classes in your school.',
                });
            }

            // Validate input data (e.g., check if name and numberOfStudents are provided)
            if (!name || !schoolId) {
                return res.status(400).json({ error: 'Name and schoolId are required fields.' });
            }

            // Create a new class instance
            const newClass = await Class.create({
                name,
                _schoolId: schoolId 
            });

            res.status(201).json({ 
                message: 'Class created successfully.', 
                class: newClass 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            error: 'Something went wrong.' + error.message 
        });
    }
};

const updateClass = async (req, res) => {
    try {
        // Check if user is an admin or super admin
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(500).json({
                status: 500,
                message: 'Unauthorized! You must be an admin or superadmin.',
            });
        }

        const { classId } = req.params;
        const { name, schoolId } = req.body;

        const userInstance = await User.findById(req.user.id);

        if(userInstance._schoolId.toString() !== schoolId ){
            return res.status(500).json({
                status: 500,
                message: 'Unauthorized! You can only modify classes in your school.',
            });
        }

        // Validate input data
        if (!name || !schoolId) {
            return res.status(400).json({ error: 'Name and schoolId are required fields.' });
        }

        // Find and update the class by ID
        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            { name, _schoolId: schoolId },
            { new: true } // Return the updated class
        );

        if (!updatedClass) {
            return res.status(404).json({ error: 'Class not found.' });
        }

        res.status(200).json({ 
            message: 'Class updated successfully.', 
            class: updatedClass 
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.' + error.message });
    }
};

const deleteClass = async (req, res) => {
    try {
        // Check if user is an admin or super admin
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(500).json({
                status: 500,
                message: 'Unauthorized! You must be an admin or superadmin.',
            });
        }

        const { classId } = req.params;
        const { schoolId } = req.body;

        const userInstance = await User.findById(req.user.id);

        if(userInstance._schoolId.toString() !== schoolId ){
            return res.status(500).json({
                status: 500,
                message: 'Unauthorized! You can only modify classes in your school.',
            });
        }

        // Find and delete the class by ID
        const deletedClass = await Class.findByIdAndDelete(classId);

        if (!deletedClass) {
            return res.status(404).json({ error: 'Class not found.' });
        }

        res.status(200).json({ 
            message: 'Class deleted successfully.', 
            class: deletedClass 
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.' + error.message });
    }
};

module.exports = { getAllClasses, getClassById, createClass, updateClass, deleteClass };