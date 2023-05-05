import { Schema, model, models } from 'mongoose';

const studentSchema = new Schema({
  name: String,
  fathername: String,
  fathercnic: String,
  picture: String,
  bayformnumber: String,
  address: String,
  whatsappnumber: String,
  phonenumber: String,
  email: String,
  gender: String,
  dateofbirth: String,
  monthlyfee: Number,
  registrationfee: Number,
  medium: String,
  rn: Number,
  classes: {
    type: Array
  },
  isActive: {
    type: Boolean,
    default: true
  },
  campus: String
}, {
    timestamps: true
});

const Student = models.Student || model('Student', studentSchema);

export default Student;