const mongoose = require('mongoose');
const Class = require('./models/classes'); 
const School = require('./models/schools');
const Student = require('./models/students');
const User = require('./models/users'); 
const config = require('./config/index.config.js');
const bcrypt = require('bcrypt');

mongoose.connect(config.dotEnv.MONGO_URI).then(async () => {

console.log('Connected to MongoDB');
 
const users = await User.find();

if( users.length == 0 ){
    const schoolData = [
        { name: 'School A' },
        { name: 'School B' } 
    ];

    let createSchoolData = await School.insertMany(schoolData);
    console.log('Dummy school data inserted successfully');

    const classData = [
    { name: 'Class A', _schoolId: createSchoolData[0]._id.toString() },
    { name: 'Class B', _schoolId: createSchoolData[1]._id.toString() }
    ];

    let createClassData = await Class.insertMany(classData);
    console.log('Dummy class data inserted successfully');

    const studentData = [
        { firstName: 'John', lastName: 'Doe', birthdate: new Date('1990-01-01'), _classId: createClassData[0]._id.toString() },
        { firstName: 'Jane', lastName: 'Smith', birthdate: new Date('1995-05-15'), _classId: createClassData[1]._id.toString() }
    ];
        
    await Student.insertMany(studentData);
    console.log('Dummy student data inserted successfully');

    const userData = [
        { firstName: 'John', lastName: 'Doe', username: 'john.doe', password: 'password', role: 'admin', _schoolId: createSchoolData[0]._id.toString() },
        { firstName: 'Jane', lastName: 'Smith', username: 'jane.smith', password: 'password', role: 'superadmin', _schoolId: createSchoolData[0]._id.toString() }
    ];

    await Promise.all(userData.map(async (user) => {
        const salt = await bcrypt.genSalt(parseInt(config.dotEnv.BCRYPT_SALT));
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
    }));

    await User.insertMany(userData);
    console.log('Dummy user data inserted successfully');
}

console.log('disconnecting');

mongoose.disconnect();
}).catch(error => {
  console.error('Error connecting to MongoDB:', error);
});
