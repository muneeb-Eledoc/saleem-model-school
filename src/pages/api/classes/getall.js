import connectDB from "@/middleware/mongoos"
import Classes from "@/models/classes"

async function handler(req, res) {

    if (!req.method === 'GET') return res.status(400).json({message: 'Invalid request!'})

    const classes = await Classes.find({campus: req.query.campus})

    res.status(200).json(classes)

}

export default connectDB(handler)