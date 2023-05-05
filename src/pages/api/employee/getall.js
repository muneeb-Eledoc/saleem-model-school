import connectDB from "@/middleware/mongoos"
import Employee from "@/models/employee"

async function handler(req, res) {

    if (!req.method === 'GET') return
    
    const emps = await Employee.find()

    res.status(200).json(emps)

}

export default connectDB(handler)