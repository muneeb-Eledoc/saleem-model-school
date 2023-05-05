import connectDB from "@/middleware/mongoos"
import Campus from "@/models/campus"

async function handler(req, res) {
    if (req.method === 'DELETE') {
        await Campus.findByIdAndDelete(req.query.campusId)
        res.status(200).json({
            message: 'Campus has been deleted.'
        })
    }


}

export default connectDB(handler)