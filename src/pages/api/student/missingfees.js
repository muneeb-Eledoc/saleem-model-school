import connectDB from "@/middleware/mongoos"
import Student from "@/models/student"
import StudentFee from "@/models/studentfee"
import { getMonthsBetweenDates } from "@/utils/getMonth"

async function handler(req, res) {

    if (req.method === 'GET') {
        try {
            const students = await Student.find({
                campus: req.query.campus,
                classes: {
                    $elemMatch: {
                        class: req.query.class,
                        session: req.query.session
                    }
                }
            }, { name: 1, _id: 1, 'classes.$': 1, picture: 1, fathername: 1 })

            let results = await Promise.all(students.map((student) => computeMissingFees(student, req.query.campus)))
            results = results.filter((result) => result&&result)

            res.status(200).json(results)

        } catch (e) {

        }

    }

}

export default connectDB(handler)

const computeMissingFees = async (student, campus) => {
    let dates = getMonthsBetweenDates(student.classes[0].started, student.classes[0].endingDate)

    let newDates = []

    for (const date of dates) {

        let d = date.split('-')[2] + '-' + date.split('-')[1] + '-' + date.split('-')[0]
        const givenDate = new Date(d);
        const currentDate = new Date();

        if (currentDate >= givenDate) {

            let fee = await StudentFee.findOne({
                campus,
                studentId: student._id,
                class: {
                    title: student.classes[0].class,
                    session: student.classes[0].session,
                },
                month: date
            })

            if (!fee) {
                newDates.push(date)
            }

        }
    }

    if(newDates.length > 0){
        return {
            student,
            newDates
        }
    }else{
        return
    }


}