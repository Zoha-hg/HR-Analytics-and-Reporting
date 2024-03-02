// Daily Tracking
// Date id
// employee_id
// Tasks completed → tasks table array
// Evaluation form
// Hours worked
// Attendance?
// punctuality?

const mongoose = require("mongoose");   
const Schema = mongoose.Schema;

const dailyTrackingSchema = new Schema({
    date: { type: Date, required: true, trim: true},
    employee_id: 
    {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    tasks_completed: 
    [
        {
            type: Schema.Types.ObjectId,
            ref: 'Task',
        }
    ],
    evaluation_form: 
    {
        type: Schema.Types.ObjectId,
        ref: 'Feedback',
        required: true
    },
    hours_worked: { type: Number, required: true, trim: true},
    attendance: { type: Boolean, required: true, trim: true},
    punctuality: { type: Boolean, required: true, trim: true},
});

module.exports = dailyTrackingSchema;