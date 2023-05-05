import connectDB from "@/middleware/mongoos"
import Student from "@/models/student"

async function handler(req, res) {

    if (!req.method === 'GET' || !req.query.campus) return res.status(400).json({message: 'Invalid request!'})

    let students = [];

    if(req.query.limit){
        students = await Student.find({campus: req.query.campus}).sort({createdAt: -1}).limit(parseInt(req.query.limit))
    }else{
        students = await Student.find({campus: req.query.campus}).sort({createdAt: -1}).limit(10)
    }

    res.status(201).json(students)

}

export default connectDB(handler)