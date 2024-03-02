// Manager
// employee_id
// full name
// age
// gender
// address
// phone number
// department
// team performance → department keh employees and their daily tracking?
// feedback forms

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const managerSchema = new Schema({
    employee_id: { type: Number, required: true, trim: true},
    employee_name: { type: String, required: true, trim: true},
    department: 
    {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    age: { type: Number, required: true, trim: true},
    gender: { type: String, required: true, trim: true},
    address: { type: String, required: true, trim: true},
    phone_number: { type: String, required: true, trim: true},
    team_performance: 
    [
        {
            type: Schema.Types.ObjectId,
            ref: 'DailyTracking',
        }
    ],
    feedback_forms: 
    [
        {
            type: Schema.Types.ObjectId,
            ref: 'Feedback',
        }
    ]
});

module.exports = managerSchema;