import connectDB from "@/middleware/mongoos"
import Expense from "@/models/expense"

async function handler(req, res) {

    if (!req.method === 'POST') return

    const expense = await Expense.create({ ...req.body})

    res.status(201).json(expense)

}

export default connectDB(handler)