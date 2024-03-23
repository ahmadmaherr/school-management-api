const { createClass, getClassById, getAllClasses, updateClass, deleteClass } = require("../controllers/class.controller");
const express = require("express");
const { verifyJWT_MW } = require("../auth/middleware");

const router = express.Router();

router.route('/').get(getAllClasses);
router.route('/:classId').get(getClassById);
router.route('/').post(verifyJWT_MW, createClass);
router.route('/:classId').put(verifyJWT_MW, updateClass);
router.route('/:classId').delete(verifyJWT_MW, deleteClass);

module.exports = router;
 
 