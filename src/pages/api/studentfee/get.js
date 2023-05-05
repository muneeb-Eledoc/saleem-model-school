import connectDB from "@/middleware/mongoos"
import StudentFee from "@/models/studentfee"

async function handler(req, res) {

    if (req.method === 'GET') {
        try {
            const items = 8;
            let page = parseInt(req.query.page || '0');
            let total = 0;
            let fees = [];

            if (req.query.startedDate && req.query.endedDate) {

                const startDate = new Date(req.query.startedDate);
                const endDate = new Date(req.query.endedDate);

                total = await StudentFee.countDocuments({
                    campus: req.query.campus,
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                })

                fees = await StudentFee.find({
                    campus: req.query.campus,
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }).sort({ createdAt: -1 }).limit(items).skip(items * page)

            }else if (req.query.class && req.query.session) {

                total = await StudentFee.countDocuments({
                    campus: req.query.campus,
                    class: {
                        title: req.query.class,
                        session: req.query.session
                    }
                })

                fees = await StudentFee.find({
                    campus: req.query.campus,
                    class: {
                        title: req.query.class,
                        session: req.query.session
                    }
                }).sort({ createdAt: -1 }).limit(items).skip(items * page)
                

            } else if (req.query.limit) {

                fees = await StudentFee.find({
                    campus: req.query.campus
                }).sort({ createdAt: -1 }).limit(req.query.limit)

                return res.status(200).json(fees)

            } else {
                total = await StudentFee.countDocuments({
                    campus: req.query.campus
                })
                fees = await StudentFee.find({
                    campus: req.query.campus
                }).sort({ createdAt: -1 }).limit(items).skip(items * page)
            }

            res.status(200).json({ total, pages: Math.ceil(total / items), fees })

        } catch (e) {

        }

    }

}

export default connectDB(handler)