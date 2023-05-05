import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Students = () => {
    const [studentsList, setStudentsList] = useState([1,2,3,4,5])

    useEffect(() => {
        const fetchStudents = async()=>{
            const res = await axios.get('/api/student/getall?limit=5&campus='+localStorage.getItem('campus'))
            setStudentsList(res.data)
        }
        fetchStudents()
    }, [])
  return (
    <div className='border border-gray-200 rounded-md min-w-[350px] grid-cols-1' >
        <h1 className='p-4 font-roboto text-xl'>Lastest Added Students</h1>
        <hr className='mx-3' />
        <div className="flex p-3 flex-col gap-1">
            {studentsList.map((student, i) => (
                <Student student={student} key={student._id+i.toString()} />
            ))}
        </div>
    </div>
  )
}

export default Students

const Student = ({student})=>{

    return student.name ?(
        <div className='flex justify-between items-center bg-white p-2 py-3 shadow animate-slow'>
            <div className='flex items-center gap-3'>
                <img className='h-8 lg:h-12 w-8 lg:w-12 rounded shadow object-cover' src={student.picture?student.picture:'/avatar.png'} alt="" />
                <span className='font-roboto text-sm md:text-md text-gray-800'>{student.name}</span>
                <span className='font-semibold text-xs md:text-sm text-blue-600 bg-blue-100 p-2 py-1 rounded shadow'>{student.fathername}</span>
            </div>
            <div>
                <span className='bg-orange-100 text-orange-600 p-2 rounded-md font-semibold py-1 text-xs md:text-sm shadow'>12/2/2023</span>
            </div>
        </div>
    ):(
        <div className='flex justify-between items-center bg-gray-200 animate-pulse p-2 py-3 shadow h-14'></div>
    )
}