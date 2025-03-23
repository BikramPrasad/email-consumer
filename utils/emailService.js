const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const sendEmail = async (templateName, templateData) => {
  try {
    // Choose correct template file
    const template = templateName === 'RECEIVER' ? 'toReceiver' : 'toSender';
    const templatePath = path.join(
      __dirname,
      '../templates',
      `${template}.ejs`
    );

    // Render EJS template
    const htmlContent = await ejs.renderFile(templatePath, templateData);

    // Setup SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Define mail options
    const mailOptions = {
      from: `"SwiftDrop" <${process.env.EMAIL_FROM}>`,
      to: templateData.to,
      subject: templateData?.title || 'SwiftDrop Notification',
      html: htmlContent,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
