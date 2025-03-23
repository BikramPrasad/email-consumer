const connectToDB = require('../utils/db');
const sendEmail = require('../utils/emailService');
const {
  checkIfFileExist,
  getFileUrl,
  updateEmailSentStatus,
} = require('./emailDbOps');

const TEMPLATE = {
  RECEIVER: 'RECEIVER',
  SENDER: 'SENDER',
};

const sendEmailWithTemplate = async (message) => {
  try {
    await connectToDB();
    const { to = [], from, title, fileId, message: customMessage } = message;

    const fileExists = await checkIfFileExist(fileId);
    if (!fileExists) {
      console.warn(
        `⚠️ File with ID "${fileId}" does not exist. Skipping email.`
      );
      return;
    }

    const fileData = await getFileUrl(fileId);
    if (!fileData) {
      console.warn(
        `⚠️ File with ID "${fileId}" does not exist. Skipping email.`
      );
      return;
    }

    const baseEmailData = {
      title,
      message: customMessage,
      fileUrl: fileData?.fileUrl,
      fileSize: `${(fileData?.size / (1024 * 1024)).toFixed(2)} MB`,
    };

    // Send all receiver emails in parallel
    const receiverEmailPromises = to.map((recipient) => {
      const receiverData = {
        ...baseEmailData,
        to: recipient,
        from,
      };
      return sendEmail(TEMPLATE.RECEIVER, receiverData);
    });

    await Promise.all(receiverEmailPromises);

    await updateEmailSentStatus(fileId, 'SENT');

    // Send confirmation email to sender
    const senderData = {
      ...baseEmailData,
      to: from,
      username: from.split('@')[0],
      others: to.join(','),
    };
    await sendEmail(TEMPLATE.SENDER, senderData);
  } catch (error) {
    console.error('❌ Error sending email with template:', error);
    throw error;
  }
};

module.exports = sendEmailWithTemplate;
