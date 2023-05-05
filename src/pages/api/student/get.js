import connectDB from "@/middleware/mongoos"
import Student from "@/models/student"

async function handler(req, res) {

    if (!req.method === 'GET' || !req.query.studentId) return res.status(400).json({message: 'Invalid request!'})

    const stud = await Student.findById(req.query.studentId)

    res.status(200).json(stud)

}

export default connectDB(handler)