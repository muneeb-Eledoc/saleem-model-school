import connectDB from "@/middleware/mongoos"
import StudentFee from "@/models/studentfee"

async function handler(req, res) {

    if (req.method === 'DELETE') {
        await StudentFee.findByIdAndDelete(req.query.feeId)
        res.status(200).json({
            message: 'Fee has been deleted.'
        })
    }


}

export default connectDB(handler)