const { createSchool, getAllSchools, getSchoolById, updateSchool, deleteSchool } = require("../controllers/school.controller");
const express = require("express");
const { verifyJWT_MW } = require("../auth/middleware");

const router = express.Router();

router.route('/').get(getAllSchools);
router.route('/:schoolId').get(getSchoolById);
router.route('/').post(verifyJWT_MW, createSchool);
router.route('/:schoolId').put(verifyJWT_MW, updateSchool);
router.route('/:schoolId').delete(verifyJWT_MW, deleteSchool);

module.exports = router;
 
 