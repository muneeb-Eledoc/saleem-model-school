import connectDB from "@/middleware/mongoos"
import jwt from "jsonwebtoken"

const KEY = '!mysecret'

async function handler(req, res) {

    if (!req.method === 'POST' || !req.body) return

    jwt.verify(req.body.token, KEY, (err, employee) => {

        if(err) return res.status(403).json({
            error: true,
            message: 'Invalid token!'
        })

        return res.status(200).json({
            employee,
        })
    })


}

export default connectDB(handler)