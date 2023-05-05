import connectDB from "@/middleware/mongoos"
import Employee from "@/models/employee"

async function handler(req, res) {

    if (!req.method === 'PUT') return

    const emp = await Employee.findByIdAndUpdate(req.query.employeeId,
        {
            $set: req.body,
        },
        { new: true })

    res.status(201).json(emp)

}

export default connectDB(handler)