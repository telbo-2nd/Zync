require("dotenv").config();

// Req NodeMailer
const nodemailer = require("nodemailer");
console.log("Mail config:", {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS ? "✅ exists" : "❌ missing"
});
// Create Transport
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: true, 
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false, 
    },
});

// Send OTP
exports.sendOTP = function (email, otp, subject = "OTP Verification") {
    console.log("Sending OTP to:", email, "OTP:", otp);
    return transporter.sendMail({
        to: email,
        from: process.env.MAIL_USER,
        subject: subject,
        text: `Your OTP is ${otp}`,
        html: `<h1>Your OTP is ${otp}</h1>`,
    });
};
