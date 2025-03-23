require('dotenv').config();
const sendEmailWithTemplate = require('./utils/sendEmailWithTemplate');

module.exports.handler = async (event) => {
  try {
    for (const record of event.Records) {
      const message = JSON.parse(record.Sns.Message);
      await sendEmailWithTemplate(message);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Emails processed successfully.' }),
    };
  } catch (error) {
    console.error('❌ Error in email processing Lambda:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Email processing failed.' }),
    };
  }
};
