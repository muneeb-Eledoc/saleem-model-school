import connectDB from "@/middleware/mongoos"
import Campus from "@/models/campus"

async function handler(req, res) {

    if (!req.method === 'POST' || !req.body) return

    const campus = await Campus.create({ ...req.body})

    res.status(201).json(campus)
}

export default connectDB(handler)