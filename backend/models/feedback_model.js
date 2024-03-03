// Feedback Form (to check employee satisfaction)
// Form_id
// Filled (bool)
// Title
// Description
// Start time
// End time
// Questions [array]
// Mandatory? – r we doing this

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    form_id: { type: Number, required: true, trim: true, unique: true},
    filled: { type: Boolean, required: true, trim: true, minlength: 3 },
    title: { type: String, required: true, trim: true, minlength: 3 },
    description: { type: String, required: true, trim: true, minlength: 3 },
    start_time: { type: Date, required: true, trim: true, minlength: 3 },
    end_time: { type: Date, required: true, trim: true, minlength: 3 },
    questions: {
        type: [
            {
                question_id: { type: Number},
                question: { type: String, required: true },
                rating: { type: Number, min: 0, max: 5 }
            }
        ],
        required: true
    }
});

module.exports = feedbackSchema
