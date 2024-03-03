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
    start_time: { type: Date, required: true, trim: true, minlength: 3 },
    end_time: { type: Date, trim: true, minlength: 3 },
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
    completed: { type: Boolean, required: true, trim: true, minlength: 3 },
});

module.exports = taskSchema;
