import connectDB from "@/middleware/mongoos"
import Employee from "@/models/employee"
import jwt from "jsonwebtoken"

const KEY = '!mysecret'

async function handler(req, res) {

    if (!req.method === 'POST' || !req.body) return

    const emp = await Employee.findOne({
        email: req.body.email
    })

    if(!emp) return res.status(404).json({
        error: true,
        message: 'Employee not found.'
    })

    if(req.body.password!==emp.password) return res.status(403).json({
        error: true,
        message: 'Invalid password.'
    })

    const {password, ...others } = emp._doc

    const token = jwt.sign(others, KEY)

    return res.status(200).json({
        token,
    })

}

export default connectDB(handler)