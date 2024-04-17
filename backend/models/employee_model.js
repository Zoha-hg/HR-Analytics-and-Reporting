const e = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Employee
// employee_id
// full name
// age
// gender
// address
// phone number
// department -- reference to dept table
// daily performance → daily tracking
// feedback forms array

const employeeSchema = new Schema({
    employee_id: { type: Number, required: true, trim: true, unique: true},
    employee_name: { type: String, required: true, trim: true},
    department: 
    {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    gender: { type: String, required: true, trim: true},
    position: { type: String, required: true, trim: true},
    salary: { type: Number, required: true, trim: true},
    date_of_birth: { type: Date, required: true, trim: true},
    address: { type: String, required: true, trim: true},
    phone_number: { type: String, required: true, trim: true},
    years_of_experience: { type: Number, required: true, trim: true},
    date_started: { type: Date, required: true, trim: true},
    number_of_promotions: { type: Number},
    age: {type: Number},
    daily_performance: 
    [
        {
            type: Schema.Types.ObjectId,
            ref: 'DailyTracking',
        }
    ],
    feedback_forms: [{
        form: {
            type: Schema.Types.ObjectId,
            ref: 'Feedback',
        },
        filled: { type: Boolean, required: true },
        ratingList: [{type: Number}]
    }],
    tasks: 
    [
        {
            type: Schema.Types.ObjectId,
            ref: 'Task',
        }
    ]
});

module.exports = employeeSchema;