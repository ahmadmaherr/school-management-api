const jwt                   = require('jsonwebtoken');
const config                = require('../config/index.config.js');
const _                     = require('lodash');
const userLogin             = require('../models/userLogin.js');

async function verifyJWTToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.dotEnv.JWT_SECRET, async (err, decodedToken) => {
            if (err || !decodedToken) {
                return reject(err);
            }

            try {
                const { username, role } = decodedToken;

                decodedToken.username = username;
                decodedToken.role = role;

                resolve(decodedToken);
            } catch (error) {
                reject(error); // Reject with the error if userLogin creation fails
            }
        });
    });
}

async function createJWToken(id, username, role) {
    let expiresIn = 15552000; // 180 Days (60 x 60 x 24 x 180)

    let token = jwt.sign({
        id,
        username,
        role
    }, config.dotEnv.JWT_SECRET, {
            expiresIn,
            algorithm: 'HS256'
    });

    return token;
}

module.exports = {
    verifyJWTToken,
    createJWToken
}
