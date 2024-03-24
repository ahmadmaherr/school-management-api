const School = require("../models/schools");

const getAllSchools = async (req, res) => {
    try {
        const schools = await School.find(); // Fetch all schools

        res.status(200).json({ 
            schools 
        }); // Send schools in the response
    } catch (error) {
        res.status(500).json({ 
            error: 'Something went wrong.' + error.message 
        });
    }
};

const getSchoolById = async (req, res) => {
    try {
        const { schoolId } = req.params;

        // Fetch the school by ID
        const school = await School.findById(schoolId);

        if (!school) {
            return res.status(404).json({ 
                error: 'School not found.' 
            });
        }

        res.status(200).json({ 
            school 
        }); // Send school in the response
    } catch (error) {
        res.status(500).json({ 
            error: 'Something went wrong.' + error.message 
        });
    }
};


const createSchool = async (req, res) => {
    try {
        if(req.user.role !== 'superadmin'){
            res.status(500).json({
                status: 500,
                message: 'unauthorized! you must be a superadmin',
            });
        }else{
            // Extract data from the request body
            const { name } = req.body;

            // Validate input data (e.g., check if name and numberOfStudents are provided)
            if (!name) {
                return res.status(400).json({ 
                    error: 'Name is required.' 
                });
            }

            // Create a new class instance
            const newSchool = await School.create({
                name
            });

            res.status(201).json({ 
                message: 'School created successfully.', 
                class: newSchool
            });
        }
    } catch (error) {
        res.status(500).json({ 
            error: 'Something went wrong.' + error.message 
        });
    }
};

const updateSchool = async (req, res) => {
    try {
        // Check if user is a super admin
        if (req.user.role !== 'superadmin') {
            return res.status(500).json({
                status: 500,
                message: 'Unauthorized! You must be a superadmin.',
            });
        }

        const { schoolId } = req.params;
        const { name } = req.body;

        // Validate input data
        if (!name) {
            return res.status(400).json({ 
                error: 'Name is required.' 
            });
        }

        // Find and update the school by ID
        const updatedSchool = await School.findByIdAndUpdate(
            schoolId,
            { name },
            { new: true } // Return the updated school
        );

        if (!updatedSchool) {
            return res.status(404).json({ 
                error: 'School not found.' 
            });
        }

        res.status(200).json({ 
            message: 'School updated successfully.', 
            school: updatedSchool 
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Something went wrong.' + error.message 
        });
    }
};

const deleteSchool = async (req, res) => {
    try {
        // Check if user is a super admin
        if (req.user.role !== 'superadmin') {
            return res.status(500).json({
                status: 500,
                message: 'Unauthorized! You must be a superadmin.',
            });
        }

        const { schoolId } = req.params;

        // Find and delete the school by ID
        const deletedSchool = await School.findByIdAndDelete(schoolId);

        if (!deletedSchool) {
            return res.status(404).json({ 
                error: 'School not found.' 
            });
        }

        res.status(200).json({ 
            message: 'School deleted successfully.', 
            school: deletedSchool 
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.' + error.message });
    }
};


module.exports = { getAllSchools, getSchoolById ,createSchool, updateSchool, deleteSchool };