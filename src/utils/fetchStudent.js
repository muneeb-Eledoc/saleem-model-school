import axios from "axios"

export const fetchStudent = async (studentId) => {
    const res = await axios.get('/api/student/get?studentId='+studentId)
    return res.data
}