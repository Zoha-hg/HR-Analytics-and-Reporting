// Department
// Department_id
// Department name
// Employee array
// manager

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    department_id: { type: Number, required: true, trim: true, unique: true},
    department_name: { type: String, required: true, trim: true},
    employees: 
    [
        {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
        }
    ],
    manager: 
    {
        type: Schema.Types.ObjectId,
        ref: 'Manager',
        // required: true
    }
});

module.exports = departmentSchema;
