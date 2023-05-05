import { AuthContext } from '@/context/authcontext/AuthContext'
import { redirectEmployee } from '@/utils/redirectEmployee'
import Cookies from 'js-cookie'
import React, { useContext, useState } from 'react'

const Navbar = ({ }) => {
  const { employee, setTogglesidebarondesktop, setEmployee, setLocalCampus } = useContext(AuthContext)
  const [showemployeemenu, setShowemployeemenu] = useState(false)

  const handleLogout = ()=>{
    Cookies.remove('token')
    redirectEmployee('/login')
    localStorage.removeItem('campus')
    setEmployee({})
    setLocalCampus('')
  }

  return (
    <nav className='bg-white h-[60px] z-50 border-b border-gray-200 px-4 py-1 flex justify-between items-center sticky top-0'>
      <div className="flex items-center space-x-1">
        <div onClick={() => setTogglesidebarondesktop(prev => !prev)} className="flex hover:text-black hover:border-gray-400 text-gray-600 border border-gray-200 p-1 rounded-lg cursor-pointer hover:bg-opacity-60 active:bg-opacity-40">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
          </svg>
        </div>
        <img className='h-12' src="/favicon.ico" alt="GM School" />
      </div>
      <div className="flex relative">
        <div onClick={()=> setShowemployeemenu(prev=> !prev)} className="flex  items-center text-gray-500 hover:border-gray-400 hover:text-gray-700 space-x-3 cursor-pointer border border-gray-200 active:bg-opacity-10 p-1 pr-2 rounded-3xl">
          <img className='h-7 w-7 md:h-9 md:w-9 rounded-full bg-white object-cover shadow' src={employee.picture?employee.picture:'/avatar.png'} alt="" />
          <span className='font-roboto text-sm md:text-md'>{employee.name}</span>
          <div className=''>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
       {showemployeemenu&&<div className="absolute top-11 right-0 bg-white shadow-md rounded py-2 scale-up">
          <div className="flex px-4 py-1 cursor-pointer hover:bg-slate-100">{localStorage.getItem('campus')}</div>
          <div onClick={handleLogout} className="flex px-4 py-1 cursor-pointer hover:bg-slate-100">Log out</div>
        </div>}
      </div>
    </nav>
  )
}

export default Navbar