import connectDB from "@/middleware/mongoos"
import Student from "@/models/student"

async function handler(req, res) {

    if (!req.method === 'PUT') return

    const stu = await Student.findByIdAndUpdate(req.query.studentId,
        {
            $set: req.body,
        },
        { new: true })

    res.status(201).json(stu)

}

export default connectDB(handler)