import connectDB from "@/middleware/mongoos"
import Employee from "@/models/employee"

async function handler(req, res) {

    if (!req.method === 'POST' || !req.body) return

    const testEmp = await Employee.findOne({
        email: req.body.email
    })
    if(testEmp) return res.status(400).json({
        error: true,
        message: 'An employee with the same email already exists!'
    })

    const emp = await Employee.create({
        ...req.body
    })

    res.status(201).json(emp)

}

export default connectDB(handler)