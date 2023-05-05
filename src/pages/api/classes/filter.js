import connectDB from "@/middleware/mongoos"
import Classes from "@/models/classes"

async function handler(req, res) {

    if (!req.method === 'GET') return res.status(400).json({message: 'Invalid request!'})
    let classes;

    if(req.query.filter === 'all'){
        classes = await Classes.find()
    }else if(req.query.filter){
        classes = await Classes.find({campus: req.query.filter})
    }else{
        classes = await Classes.findOne({title: req.query.title})
    }

    res.status(200).json(classes)

}

export default connectDB(handler)