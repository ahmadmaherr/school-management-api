const User = require("../models/users");
const School = require("../models/schools");
const UserLogin = require("../models/userLogin");
const bcrypt = require("bcrypt");

const config = require('../config/index.config');
const cache = require('../cache/cache.dbh')({
    prefix: config.dotEnv.CACHE_PREFIX,
    url: config.dotEnv.CACHE_REDIS
});

const { createJWToken } = require('../auth/auth');


const signUp = async (req, res)=>{ 
    try{
        // Extract user data from the request body
        const { firstName, lastName, username, password, schoolName } = req.body;

        const school = await School.findOne({name: schoolName}); // Fetch all classes

        if( !school ){
            res.status(400).json({
                status: 400,
                message: "School not found"
            });
        }

        const newUser = await User.create({ 
            firstName,
            lastName,
            username,
            password,
            role: 'admin',
            _schoolId: school.id
        });

        if(newUser){
            let token = await createJWToken(newUser.id, newUser.username, newUser.role);

            // Insert login token record with device infomation
            const createUserLogin = await UserLogin.create({
                token,
                userId: newUser.id    
            });
        
            // Send a success response
            res.status(201).json({
                status: 201,
                message: "User created successfully",
                token: createUserLogin.token
            });
        }        

    } catch (err){
        res.json({
            status: 400,
            message: "Something went wrong, " + err.message
        });
    }
};

const login = async (req, res)=>{ 
    try{
        // Extract user data from the request body
        const { username, password } = req.body;

        const user = await User.findOne({ 
            username,
        });

        if(user){
            if (!(await bcrypt.compare(password, user.password))){
                res.status(200).json({
                    status: 200,
                    message: "Wrong username or password" 
                }); 
            }else{
                    // Insert login token record with device infomation
                    let token = await createJWToken(user.id, user.username, user.role);

                    await UserLogin.create({
                        token: token, 
                        userId: user.id
                    });

                    if(token){
                        // Send a success response
                        res.status(200).json({
                            status: 200,
                            message: "User logged in successfully",
                            token
                        });
                    }else{
                        res.status(400).json({
                            status: 400,
                            message: "Something went wrong"
                        });
                    }        
            }
        } else {
            res.status(200).json({
                status: 200,
                message: "Wrong username or password" 
            }); 
        }       

    } catch (err){
        res.status(400).json({
            status: 400,
            message: "Something went wrong, " + err.message
        });
    }
};

const changeRole = async (req, res)=>{ 
    try{
        // Extract user data from the request body
        if(req.user.role !== 'superadmin'){
            res.status(500).json({
                status: 500,
                message: 'unauthorized! you must be a superadmin',
            });
        }else{

            const { username, role } = req.body;

            const user = await User.findOneAndUpdate(
                { username },
                { role },
                { new: true }
            );
            
            if (!user) {
                return res.status(404).json({
                    status: 404,
                    message: 'User not found',
                });
            }

            res.status(200).json({
                status: 200,
                message: 'User role changed successfully',
                user,
            });
        }

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'An error occurred while changing user role',
        });
    }
};

module.exports = { signUp, login, changeRole };