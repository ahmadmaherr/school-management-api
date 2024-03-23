const { createStudent } = require("../controllers/student.controller");
const express = require("express");
const { verifyJWT_MW } = require("../auth/middleware");

const router = express.Router();

// router.route('/').get(getAllStudents);
// router.route('/:studentId').get(getStudentById);
router.route('/').post(verifyJWT_MW, createStudent);
// router.route('/:studentId').put(verifyJWT_MW, updateStudent);
// router.route('/:studentId').delete(verifyJWT_MW, deleteStudent);

module.exports = router;
 
 