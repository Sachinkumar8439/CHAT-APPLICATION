const {myemail , myapppassword } = process.env;

const nodemailer = require('nodemailer');
function genrateotp (){
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}


// Step 3: Create a function to send an email
async function sendmail(email,otp) {
    try {
        // Step 4: Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: myemail, // Replace with your email
                pass: myapppassword,  // Replace with your email password or app-specific password
            }
        });

        // Step 5: Set up email options
        const mailOptions = {
            from: email, // Sender address
            to: myemail,    // List of recipients
            subject: 'password reset OTP', // Subject line
            text: `hey! check there if you are trying to reset password.\nyour pasword reset OTP:${otp} `, // Plain text body
            // html: '<p>This is an HTML email body</p>' // HTML body (optional)
        };

        // Step 6: Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};


module.exports = {
genrateotp,
sendmail,
};