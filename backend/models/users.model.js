const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true, trim: true, minlength: 3 },
    email: { type: String, required: true, trim: true, minlength: 3, unique: true},
    role: { type: String, required: true, trim: true, minlength: 3 },
    refreshToken: { type: String, required: false }  // Optional field for storing the refresh token
});

// const User = mongoose.model("User", userSchema);
module.exports = userSchema;