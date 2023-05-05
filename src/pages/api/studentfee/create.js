import connectDB from "@/middleware/mongoos"
import StudentFee from "@/models/studentfee"

async function handler(req, res) {

    if (req.method === 'POST' && req.body) {
        try{
            const testFee = await StudentFee.findOne({
                studentId: req.body.studentId,
                class: {
                    title: req.body.class,
                    session: req.body.session
                },
                month: req.body.month,
            })
            if(!testFee){
                const newFee = new StudentFee({
                    studentId: req.body.studentId,
                    class: {
                        title: req.body.class,
                        session: req.body.session
                    },
                    feeamount: req.body.feeamount,
                    monthlyfee: req.body.monthlyfee,
                    month: req.body.month,
                    remainings: req.body.remainings,
                    campus: req.body.campus
                })
                const fee = await newFee.save()

                res.status(201).json(fee)
            }else{
                res.status(400).json({
                    error: true,
                    message: 'Fee already added.'
                })
            }


        }catch(e){

        }

    }

}

export default connectDB(handler)