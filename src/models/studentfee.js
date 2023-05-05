import { Schema, model, models } from 'mongoose';

const FeeSchema = new Schema({
    studentId: {
        type: String,
        required: true
    },
    class: {
        title: String,
        session: String
    },
    feeamount: Number,
    monthlyfee: Number,
    month: String,
    remainings: Number,
    campus: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const StudentFee = models.StudentFee || model('StudentFee', FeeSchema);

export default StudentFee;