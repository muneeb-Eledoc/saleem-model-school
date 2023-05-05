import connectDB from "@/middleware/mongoos"
import Classes from "@/models/classes"

async function handler(req, res) {
    if (req.method === 'DELETE') {
        await Classes.findByIdAndDelete(req.query.classId)
        res.status(200).json({
            message: 'Class has been deleted.'
        })
    }


}

export default connectDB(handler)