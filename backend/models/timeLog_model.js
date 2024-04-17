const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const timeLogSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    duration: { type: Number },
});

module.exports = mongoose.model("TimeLog", timeLogSchema);
