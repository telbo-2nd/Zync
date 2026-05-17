const authValidator = require('../validators/authValidator');
const JWT = require('../utils/jwt');
const { generateOTP } = require('../utils/otpGenerator');
const { sendOTP } = require('../utils/mailer');
const User = require('../models/userModel');
const Follow = require('../models/followModel');
const Post = require('../models/postModel');
const AppError = require('../utils/AppError');
const bcrypt = require('bcrypt');

// Register
exports.register = async function (userData) {
    const { error, value } = authValidator.registerSchema.validate(userData, { abortEarly: false });
    if (error) throw new AppError(error.details.map(e => e.message).join(', '), 400);

    const { firstname, lastname, email, phone, password, username } = value;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new AppError("Email already registered", 400);

    const existingUserName = await User.findOne({ where: { username } });
    if (existingUserName) throw new AppError("Username already taken", 400);

    const OTP = generateOTP();
    const OTPExpireAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRE_TIME) * 60 * 1000);

    const user = await User.create({
        firstname, lastname, phone, email, password, username,
        OTP, OTPExpireAt, isVerified: false
    });

    await sendOTP(email, OTP);

    return {
        success: true,
        message: "Registration successful - please verify your email",
        user: { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email, phone: user.phone, username: user.username }
    };
};

// Login
exports.login = async function (userData) {
    const { error, value } = authValidator.loginSchema.validate(userData, { abortEarly: false });
    if (error) throw new AppError(error.details.map(e => e.message).join(', '), 400);

    const { email, password } = value;

    const user = await User.findOne({ where: { email } });
    if (!user) throw new AppError("Invalid email or password", 400);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError("Invalid email or password", 400);

    if (!user.isVerified) throw new AppError("Please verify your email first", 403);
    
    if (user.accountStatus !== 'active') 
        throw new AppError("Account is not active", 403);

    const token = JWT.generateToken({ id: user.id, email: user.email });

    return {
        success: true,
        message: "Login successful",
        token,
        user: { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email, phone: user.phone, username: user.username }
    };
};

// Verify OTP
exports.verifyOTP = async function (userData) {
    const { error, value } = authValidator.verifyOTPSchema.validate(userData, { abortEarly: false });
    if (error) throw new AppError(error.details.map(e => e.message).join(', '), 400);
    //here
    const { email, otp } = value;

    const user = await User.findOne({ where: { email } });
    if (!user) throw new AppError("Invalid email or OTP", 400);

    if (user.OTP !== otp) throw new AppError("Invalid OTP", 400);

    if (!user.OTPExpireAt || user.OTPExpireAt < Date.now())
        throw new AppError("OTP expired. Please request a new one", 400);

    user.isVerified = true;
    user.OTP = null;
    user.OTPExpireAt = null;
    await user.save();

    return { success: true, message: "Email verified successfully" };
};

// Resend OTP
exports.resendOTP = async function (userData) {
    const { error, value } = authValidator.resendOTPSchema.validate(userData, { abortEarly: false });
    if (error) throw new AppError(error.details.map(e => e.message).join(', '), 400);

    const { email } = value;

    const user = await User.findOne({ where: { email } });
    if (!user) throw new AppError("Invalid email", 400);

    //check if the user has an OTP or no if no don't send OTP and if yes check if it's expired or not
    if(!user.OTP){
        throw new AppError("No OTP to resend. Please request a new OTP", 400);
    }

    if (user.OTPExpireAt && user.OTPExpireAt > Date.now()) {
        const secondsLeft = Math.ceil((user.OTPExpireAt - Date.now()) / 1000);
        throw new AppError(`Please wait ${secondsLeft} seconds before requesting a new OTP`, 429);
    }
    //here
    const otp = generateOTP();
    const OTPExpireAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRE_TIME) * 60 * 1000);


    //here
    user.OTP = otp;
    user.OTPExpireAt = OTPExpireAt;
    await user.save();

    await sendOTP(email, otp);

    return { success: true, message: "OTP resent successfully" };
};

// Get Me
exports.getMe = async function (userId) {
    const user = await User.findByPk(userId);
    if (!user) throw new AppError("User not found", 404);
    const [followersCount, followingCount, postsCount] = await Promise.all([
        Follow.count({ where: { followedId: userId } }),
        Follow.count({ where: { followerId: userId } }),
        Post.count({ where: { userId } })
    ]);

    return {
        success: true,
        message: "User data retrieved successfully",
        user: {
            id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email, phone: user.phone, username: user.username,
            bio: user.bio, profilePicture: user.profilePicture,
            followersCount,
            followingCount,
            postsCount
        }
    };
};

// Forgot Password
exports.forgotPassword = async function (userData) {
    const { error, value } = authValidator.forgotPasswordSchema.validate(userData, { abortEarly: false });
    if (error) throw new AppError(error.details.map(e => e.message).join(', '), 400);

    const { email } = value;

    const user = await User.findOne({ where: { email } });


    if (!user) return { success: true, message: "If this email exists, an OTP will be sent" };

    if (!user.isVerified) throw new AppError("Please verify your email first", 400);

    if (user.accountStatus !== 'active') 
        throw new AppError("Account is not active", 403);

    // Cooldown check
    if (user.OTPExpireAt && user.OTPExpireAt > Date.now()) {
        const secondsLeft = Math.ceil((user.OTPExpireAt - Date.now()) / 1000);
        throw new AppError(`Please wait ${secondsLeft} seconds before requesting again`, 429);
    }

    const otp = generateOTP();
    const expireTime = new Date(Date.now() + parseInt(process.env.OTP_EXPIRE_TIME) * 60 * 1000);

    user.OTP = otp;
    user.OTPExpireAt = expireTime;
    await user.save();

    await sendOTP(email, otp, "Password Reset OTP");

    return { success: true, message: "Password reset OTP sent to email" };
};

// Reset Password
exports.resetPassword = async function (userData) {
    const { error, value } = authValidator.resetPasswordSchema.validate(userData, { abortEarly: false });
    if (error) throw new AppError(error.details.map(e => e.message).join(', '), 400);
    //here
    const { email, otp, newPassword } = value;

    const user = await User.findOne({ where: { email } });
    if (!user) throw new AppError("Invalid email", 400);
    //here
    if (user.OTP !== otp) throw new AppError("Invalid OTP", 400);
    if (!user.OTPExpireAt || user.OTPExpireAt < Date.now())
        throw new AppError("OTP expired. Please request a new one", 400);

    user.password = newPassword;
    user.OTP = null;
    user.OTPExpireAt = null;
    await user.save();

    return { success: true, message: "Password reset successfully" };
};

// Logout
exports.logout = async function () {
    return { success: true, message: "Logout successfully" };
};