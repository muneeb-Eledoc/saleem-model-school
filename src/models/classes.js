import { Schema, model, models } from 'mongoose';

const ClassesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    campus: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Classes = models.Classes || model('Classes', ClassesSchema);

export default Classes;