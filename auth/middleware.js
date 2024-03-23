const { verifyJWTToken } = require('./auth');

function verifyJWT_MW(req, res, next) {
    let token = req.headers.auth;
    verifyJWTToken(token)
            .then((decodedToken) => {
                req.user = decodedToken;
                next()
            })
            .catch((err) => {
                res.send({
                    status: 400,
                    errorMessage: 'Invalid auth token provided.'
                });
            });
}

module.exports = { verifyJWT_MW }

  