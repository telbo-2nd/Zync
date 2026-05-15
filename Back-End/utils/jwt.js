const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET =process.env.JWT_SECRET_KEY;
const EXPIRE = process.env.JWT_EXPIRES_AT;
exports.generateToken = function( user ) {

    return jwt.sign(user,SECRET,{expiresIn:EXPIRE});

}
exports.verifyToken = function(token) {
    try {
        const user =jwt.verify(token, SECRET);
        // console.log("SECRET:", SECRET);
        return user;    
    } catch (error) {
        return null;
    }
}