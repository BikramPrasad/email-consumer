const mongoose = require('mongoose');

const getCollection = (collectionName) => {
  if (!mongoose.connection.db) {
    throw new Error('MongoDB connection not initialized yet');
  }
  return mongoose.connection.db.collection(collectionName);
};

// ✅ Check if file exists by fileId
const checkIfFileExist = async (fileId) => {
  try {
    const collection = getCollection('files');
    const doc = await collection.findOne({ fileId: fileId });
    return doc !== null;
  } catch (err) {
    console.error('❌ Error checking file existence:', err);
    return false;
  }
};

// ✅ Get fileUrl and size from the 'files' collection
const getFileUrl = async (fileId) => {
  try {
    const fileCollection = getCollection('files');
    const emailCollection = getCollection('emails');

    const email = await emailCollection.findOne({
      fileId: fileId,
      status: 'INPROGRESS',
    });

    if (email !== null) {
      const doc = await fileCollection.findOne(
        { fileId: fileId },
        { projection: { fileUrl: 1, size: 1, _id: 0 } }
      );
      return doc;
    }

    return null;
  } catch (err) {
    console.error('❌ Error fetching fileUrl:', err);
    return null;
  }
};

// ✅ Update email status in the 'emails' collection
const updateEmailSentStatus = async (fileId, status) => {
  try {
    const collection = getCollection('emails');
    const result = await collection.updateOne(
      { fileId: fileId, status: 'INPROGRESS' },
      { $set: { status: status, updatedAt: new Date() } },
      { upsert: true }
    );
    return result;
  } catch (err) {
    console.error('❌ Error updating email sent status:', err);
    return null;
  }
};

module.exports = {
  checkIfFileExist,
  getFileUrl,
  updateEmailSentStatus,
};
