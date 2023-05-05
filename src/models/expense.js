import { Schema, model, models } from 'mongoose';

const ExpenseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    campus: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});

const Expense = models.Expense || model('Expense', ExpenseSchema);

export default Expense;