import connectDB from "@/middleware/mongoos"
import Expense from "@/models/expense";

async function handler(req, res) {

    if (req.method === 'GET') {
        try {
            const items = 3;
            let page = parseInt(req.query.page || '0');
            let total = 0;
            let expenses = [];

            if (req.query.startedDate && req.query.endedDate) {

                const startDate = new Date(req.query.startedDate);
                const endDate = new Date(req.query.endedDate);

                total = await Expense.countDocuments({
                    campus: req.query.campus,
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                })

                expenses = await Expense.find({
                    campus: req.query.campus,
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }).sort({ createdAt: -1 }).limit(items).skip(items * page)

            }else if (req.query.limit) {

                expenses = await Expense.find({
                    campus: req.query.campus
                }).sort({ createdAt: -1 }).limit(req.query.limit)

                return res.status(200).json(expenses)

            } else {
                total = await Expense.countDocuments({
                    campus: req.query.campus
                })
                expenses = await Expense.find({
                    campus: req.query.campus
                }).sort({ createdAt: -1 }).limit(items).skip(items * page)
            }

            res.status(200).json({ total, pages: Math.ceil(total / items), expenses })

        } catch (e) {

        }

    }

}

export default connectDB(handler)