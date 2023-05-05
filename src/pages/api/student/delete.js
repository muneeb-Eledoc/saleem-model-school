import connectDB from "@/middleware/mongoos"
import Student from "@/models/student"
import StudentFee from "@/models/studentfee"

async function handler(req, res) {

    if (req.method === 'DELETE') {
        await Student.deleteOne({
            _id: req.query.studentId
        })
        await StudentFee.deleteMany({
            studentId: req.query.studentId
        })
        res.status(200).json({
            message: 'Student has been deleted.'
        })
    }


}

export default connectDB(handler)