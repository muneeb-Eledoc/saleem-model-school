import { Schema, model, models } from 'mongoose';

const EmployeeSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    phoneNumber: Number,
    whatsappnumber: Number,
    password: String,
    picture: String,
    campus: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

const Employee = models.Employee || model('Employee', EmployeeSchema);

export default Employee;