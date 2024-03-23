const { Router } = require('express');
const userRoutes = require('./user.routes');
const studentRoutes = require('./student.routes');
const classRoutes = require('./class.routes');
const schoolRoutes = require('./school.routes');


const routes = Router();

routes.use('/user', userRoutes);
routes.use('/student', studentRoutes);
routes.use('/class', classRoutes)
routes.use('/school', schoolRoutes)


module.exports = routes;
