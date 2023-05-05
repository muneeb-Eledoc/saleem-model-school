import connectDB from "@/middleware/mongoos"
import Campus from "@/models/campus"

async function handler(req, res) {

    if (!req.method === 'GET') return res.status(400).json({message: 'Invalid request!'})

    const campus = await Campus.find()

    res.status(200).json(campus)

}

export default connectDB(handler)