import { Schema, model, models } from 'mongoose';

const CampusSchema = new Schema({
    title: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const Campus = models.Campus || model('Campus', CampusSchema);

export default Campus;