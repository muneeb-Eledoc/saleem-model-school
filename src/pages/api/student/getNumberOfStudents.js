import connectDB from "@/middleware/mongoos"
import Student from "@/models/student"

async function handler(req, res) {

    if (req.method === 'GET'){

        const rn = await Student.countDocuments({campus: req.query.campus})
    
        res.status(200).json(rn)
    }


}

export default connectDB(handler)