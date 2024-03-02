const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  scope: { type: String, required: true },
  tokenType: { type: String, required: true },
  expiryDate: { type: Number, required: true }
});

module.exports = mongoose.model('Token', tokenSchema);
