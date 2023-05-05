import { fetchStudent } from '@/utils/fetchStudent'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const fetchFees = async (setFees) => {
  const res = await axios.get('/api/studentfee/get?limit=5&campus='+localStorage.getItem('campus'))
  setFees(res.data)
}

const Fees = () => {
  const [fees, setFees] = useState([1, 2, 3, 4, 5])

  useEffect(() => {
    fetchFees(setFees)
  }, [])

  return (
    <div className='border border-gray-200 rounded-md min-w-[350px] grid-cols-1' >
      <h1 className='p-4 font-roboto text-xl'>Lastest Added Fees</h1>
      <hr className='mx-3' />
      <div className="flex p-3 flex-col gap-1">
        {fees.map((fee, i) => (
          <FeeItem fee={fee} key={fee._id+(i).toString()} />
        ))}
      </div>
    </div>
  )
}

export default Fees

const FeeItem = ({ fee }) => {
  const [student, setStudent] = useState({})

  useEffect(() => {
    if (fee.studentId) {
      fetchStudent(fee.studentId).then((data) => {
        setStudent(data)
      })
    }
  }, [])

  return fee?.studentId ? (
    <div className='p-2 py-3 shadow flex justify-between items-center animate-slow'>
      <div className='flex gap-2 items-center'>
        <img className='lg:w-12 w-8 h-8 lg:h-12 object-cover rounded' src={student.picture ? student.picture : '/avatar.png'} alt="" />
        <div className='flex flex-col'>
          <span className='font-semibold'>{student.name}</span>
          <span className='text-sm text-gray-500'>{student.fathername}</span>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <span className='text-sm text-blue-700 p-2 rounded bg-blue-100 font-semibold py-1 shadow'>{fee.class.title}</span>
        <span className='text-xs mt-1 text-gray-500'>{fee.class.session}</span>
      </div>
      <div>
        <span className='bg-green-100 p-2 py-1 text-sm rounded text-green font-roboto shadow'>Rs.3000</span>
      </div>
    </div>
  ) : (
    <div className='rounded-md bg-gray-200 animate-pulse animate-slow h-14'></div>
  )
}