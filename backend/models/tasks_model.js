// Tasks
// Task_id
// Start time
// End time
// Assigned_to (employee_id) –might not need
// Assigned_by (manager)
// Completed (bool)

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    task_id: { type: Number, required: true, trim: true, unique: true},
    title: { type: String, required: true, trim: true},
    start_time: { type: Date, required: true, trim: true},
    end_time: { type: Date, trim: true},
    assigned_to: 
    {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    assigned_by: 
    {
        type: Schema.Types.ObjectId,
        ref: 'Manager',
        required: true
    },
    skills:
    [{
        skill: { type: String, required: true, trim: true },
        rating: { type: Number, min: 1, max: 5 }    
    }],
    completion_status: {
        type: String,
        required: true,
        trim: true,
        enum: ['not started', 'in progress', 'completed'],
        default: 'not started'
    },
    evaluation_status: {
        type: String,
        required: true,
        trim: true,
        enum: ['pending', 'completed', 'evaluate'],
        default: 'pending'
    },

});

module.exports = taskSchema;
