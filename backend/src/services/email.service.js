const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const getEmailTemplate = (title, message, buttonText, buttonUrl) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background-color: #080A12; color: #ffffff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; padding: 20px; text-align: center; }
            .header { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #4facfe; }
            .message { font-size: 16px; margin-bottom: 30px; line-height: 1.5; }
            .button { 
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                color: #ffffff;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                display: inline-block;
            }
            .footer { margin-top: 40px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">LovellyLilly AI</div>
            <h1>${title}</h1>
            <div class="message">${message}</div>
            <a href="${buttonUrl}" class="button">${buttonText}</a>
            <div class="footer">
                &copy; ${new Date().getFullYear()} LovellyLilly AI. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
};

exports.sendVerificationEmail = async (email, name, rawToken) => {
    const url = `${process.env.CLIENT_URL}/verify-email/${rawToken}`;
    const html = getEmailTemplate(
        "Verify Your Email",
        `Hi ${name}, welcome to LovellyLilly AI! Please click the button below to verify your email address.`,
        "Verify Email",
        url
    );

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Verify your email - LovellyLilly AI",
        html
    });
};

exports.sendPasswordResetEmail = async (email, name, rawToken) => {
    const url = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
    const html = getEmailTemplate(
        "Password Reset Request",
        `Hi ${name}, we received a request to reset your password. If you didn't make this request, you can safely ignore this email.`,
        "Reset Password",
        url
    );

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Reset your password - LovellyLilly AI",
        html
    });
};
