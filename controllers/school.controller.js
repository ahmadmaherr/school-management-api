const School = require("../models/schools");

const config = require('../config/index.config');
const cache = require('../cache/cache.dbh')({
    prefix: config.dotEnv.CACHE_PREFIX,
    url: config.dotEnv.CACHE_REDIS
});

const getAllSchools = async (req, res) => {
    try {
        // Attempt to fetch schools data from cache
        let schools = await cache.key.get({ 
            key: 'allSchools' 
        });
        if (schools) {
            // Cache hit, parse the JSON string to an object
            schools = JSON.parse(schools);
        } else {
            // Cache miss, fetch from MongoDB
            schools = await School.find();
            // Cache the fetched schools data for future use
            await cache.key.set({ 
                key: 'allSchools', 
                data: JSON.stringify(schools), 
                ttl: 3600 
            }); // Adjust TTL as needed
        }
        res.status(200).json({ 
            schools 
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Something went wrong.' + error.message 
        });
    }
};


const getSchoolById = async (req, res) => {
    try {
        const { schoolId } = req.params;
        // Attempt to fetch the school's data from cache
        let school = await cache.key.get({ 
            key: `school:${schoolId}` 
        });

        if (school) {
            // Cache hit, parse the JSON string to an object
            school = JSON.parse(school);
        } else {
            // Cache miss, fetch from MongoDB
            school = await School.findById(schoolId);
            if (!school) {
                return res.status(404).json({ 
                    error: 'School not found.' 
                });
            }
            // Cache the fetched school data for future use
            await cache.key.set({ 
                key: `school:${schoolId}`, 
                data: JSON.stringify(school), 
                ttl: 3600 
            }); // Adjust TTL as needed
        }
        res.status(200).json({ 
            school 
        });
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

            await cache.del('allSchools'); // Invalidate the cache of all schools

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

        await cache.del('allSchools'); // Invalidate the cache of all schools

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

        await cache.del('allSchools'); // Invalidate the cache of all schools

        res.status(200).json({ 
            message: 'School deleted successfully.', 
            school: deletedSchool 
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.' + error.message });
    }
};


module.exports = { getAllSchools, getSchoolById ,createSchool, updateSchool, deleteSchool };