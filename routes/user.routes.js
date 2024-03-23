const { signUp, login, changeRole } = require("../controllers/user.controller");
const express = require("express");
const { verifyJWT_MW } = require("../auth/middleware");

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/login').post(login);
router.route('/changerole').put(verifyJWT_MW, changeRole);


module.exports = router;
 
 