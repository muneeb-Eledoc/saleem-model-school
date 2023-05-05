import connectDB from "@/middleware/mongoos"
import Classes from "@/models/classes"

async function handler(req, res) {

    if (!req.method === 'POST' || !req.body) return

    const classes = await Classes.create({ ...req.body})

    res.status(201).json(classes)
}

export default connectDB(handler)