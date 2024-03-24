const Class = require("../models/classes");
const User = require("../models/users");

const config = require('../config/index.config');
const cache = require('../cache/cache.dbh')({
    prefix: config.dotEnv.CACHE_PREFIX,
    url: config.dotEnv.CACHE_REDIS
});

const getAllClasses = async (req, res) => {
    try {
        // Using key.get based on your module structure for async operation
        let classes = await cache.key.get({ 
            key: 'allClasses' 
        });
        if (classes) {
            // Cache hit, parse the data
            classes = JSON.parse(classes);
        } else {
            // Cache miss, fetch from MongoDB
            classes = await Class.find();
            // Cache the fetched classes data, consider stringify and expiration handling
            await cache.key.set({ 
                key: 'allClasses', 
                data: JSON.stringify(classes), 
                ttl: 3600 
            }); // Example: Set TTL as needed
        }
        res.status(200).json({ 
            classes 
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Something went wrong.' + error.message 
        });
    }
};


const getClassById = async (req, res) => {
    try {
        const { classId } = req.params;
        let classInstance = await cache.key.get({ 
            key: `class:${classId}` 
        });

        if (classInstance) {
            classInstance = JSON.parse(classInstance);
        } else {
            // Fetch the class by ID from MongoDB if not found in cache
            classInstance = await Class.findById(classId);

            if (!classInstance) {
                return res.status(404).json({ 
                    error: 'Class not found.' 
                });
            }

            // Cache the fetched class data for future use
            await cache.key.set({ 
                key: `class:${classId}`, 
                data: JSON.stringify(classInstance), 
                ttl: 3600 
            }); 
        }

        res.status(200).json({ 
            class: classInstance 
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Something went wrong.' + error.message 
        });
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
                return res.status(400).json({ 
                    error: 'Name and schoolId are required fields.' 
                });
            }

            // Create a new class instance
            const newClass = await Class.create({
                name,
                _schoolId: schoolId 
            });

            // Invalidate the cache for all classes
            await cache.key.delete({ 
                key: 'allClasses' 
            });

            // Optionally, if caching classes by school, invalidate that specific cache too
            await cache.key.delete({ 
                key: `classesInSchool:${schoolId}` 
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
        
        const classInstance = await Class.findById(classId);

        const userInstance = await User.findById(req.user.id);

        if(userInstance._schoolId.toString() !== classInstance._schoolId.toString() ){
            return res.status(500).json({
                status: 500,
                message: 'Unauthorized! You can only modify classes in your school.',
            });
        }

        // Validate input data
        if (!name || !schoolId) {
            return res.status(400).json({ 
                error: 'Name and schoolId are required fields.' 
            });
        }

        // Find and update the class by ID
        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            { name, _schoolId: schoolId },
            { new: true } // Return the updated class
        );

        // After class update
        if (!updatedClass) {
            return res.status(404).json({ 
                error: 'Class not found.' 
            });
        }

        // Invalidate the cache for the specific class
        await cache.key.delete({ 
            key: `class:${classId}` 
        });

        // Invalidate or update the cache for all classes if maintained
        await cache.key.delete({ key: 'allClasses' });

        // Invalidate or update cache for classes in the specific school if maintained
        await cache.key.delete({ key: `classesInSchool:${schoolId}` });

        res.status(200).json({ 
            message: 'Class updated successfully.', 
            class: updatedClass 
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Something went wrong.' + error.message 
        });
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

        const classInstance = await Class.findById(classId);

        const userInstance = await User.findById(req.user.id);

        if(userInstance._schoolId.toString() !== classInstance._schoolId.toString()  ){
            return res.status(500).json({
                status: 500,
                message: 'Unauthorized! You can only delete classes in your school.',
            });
        }

        // Find and delete the class by ID
        const deletedClass = await Class.findByIdAndDelete(classId);

        await cache.key.delete({ 
            key: `class:${classId}` 
        });

        // Invalidate or update the cache for all classes if maintained
        await cache.key.delete({ 
            key: 'allClasses' 
        });

        // Invalidate or update cache for classes in the specific school if maintained
        await cache.key.delete({ 
            key: `classesInSchool:${schoolId}` 
        });

        if (!deletedClass) {
            return res.status(404).json({ 
                error: 'Class not found.' 
            });
        }

        res.status(200).json({ 
            message: 'Class deleted successfully.', 
            class: deletedClass 
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Something went wrong.' + error.message 
        });
    }
};

module.exports = { getAllClasses, getClassById, createClass, updateClass, deleteClass };