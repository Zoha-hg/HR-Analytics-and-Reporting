// HR TABLe 
//employee_id
// full name
// age
// gender
// address
// phone number
// Department

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hrSchema = new Schema({
    employee_id: { type: Number, required: true, trim: true, unique: true},
    employee_name: { type: String, required: true, trim: true},
    date_of_birth: { type: Date, required: true, trim: true},
    gender: { type: String, required: true, trim: true},
    address: {type: String, required: true, trim: true},
    phone_number: {type: String, required: true, trim: true},
    age: {type: Number},
    department: 
    {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    }
});

module.exports = hrSchema;
