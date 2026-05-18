//req sequelize instance from dbConfig
const {sequelize} = require('../config/dbConfig');  
//import data Tyepes from sequelize
const {DataTypes} = require('sequelize');
//import bcrypt for password hashing
const bcrypt = require('bcrypt');
//import jwt for token generation
const {generateToken} = require('../utils/jwt');
//import dotenv
require('dotenv').config();

const OTP_LENGTH = process.env.OTP_LENGTH ?? 6;

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },

    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: [/^01[0-2,5]{1}[0-9]{8}$/, "Invalid Egyptian Phone Number"]
        }
    },

    OTP: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
        len: [OTP_LENGTH, OTP_LENGTH]
    }
    },

    OTPExpireAt: {
    type: DataTypes.DATE,
    },

    isVerified: {
    type: DataTypes.BOOLEAN,
    default: false,
    },

    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    accountStatus: {
        type: DataTypes.ENUM('active', 'suspended', 'deleted'),
        defaultValue: 'active'
    },
}, {
    timestamps : true,
    tableName: 'users',
    
    hooks: {
        beforeCreate : async (user) => {
            //hash password before saving to database
            user.password = await bcrypt.hash(user.password,  parseInt(process.env.HASH_SALT));        
        },
        beforeUpdate : async (user) => {
            //hash password before saving to database if password is changed
            if(user.changed('password')){
                user.password = await bcrypt.hash(user.password, parseInt(process.env.HASH_SALT));
            }
        }
    }
});

//token generation method
User.prototype.generateAuthToken = function() {
    return generateToken({ id: this.id, email: this.email });
};

module.exports = User;