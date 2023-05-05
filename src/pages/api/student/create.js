import connectDB from "@/middleware/mongoos"
import Student from "@/models/student"

async function handler(req, res) {

    if (!req.method === 'POST') return

    const rn = await Student.countDocuments({})+1
    const stu = await Student.create({ ...req.body, rn })

    res.status(201).json(stu)

}

export default connectDB(handler)