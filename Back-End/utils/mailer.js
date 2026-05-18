const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendOTP = async function (email, otp, subject = "OTP Verification") {
    console.log("Sending OTP to:", email, "OTP:", otp);
    await resend.emails.send({
        from: 'Zync <onboarding@resend.dev>',
        to: email,
        subject: subject,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #4c3bcf;">Zync</h1>
                <p>Your OTP code is:</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center;">
                    <h2 style="color: #4c3bcf; font-size: 36px; letter-spacing: 8px;">${otp}</h2>
                </div>
                <p style="color: #999; font-size: 12px;">This OTP expires in ${process.env.OTP_EXPIRE_TIME} minutes.</p>
            </div>
        `,
    });
};