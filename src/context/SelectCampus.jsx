import { redirectEmployee } from '@/utils/redirectEmployee'
import Cookies from 'js-cookie'
import Head from 'next/head'
import React, { useContext, useState } from 'react'
import { AuthContext } from './authcontext/AuthContext'

const SelectCampus = ({setEmployee, employee, localCampus, setLocalCampus}) => {
    const [campus, setCampus] = useState('')
    const {campuses} = useContext(AuthContext)

    const handleLogout = ()=>{
        Cookies.remove('token')
        redirectEmployee('/login')
        localStorage.removeItem('campus')
        setEmployee({})
        setLocalCampus('')
    }

    const handleContinue = () => {
        if(campus){
            localStorage.setItem('campus', campus)
            setLocalCampus(campus)
        }
    }

    return (
        <>
            <Head>
                <title>{process.env.NEXT_PUBLIC_SCHOOL_TITLE}</title>
                <meta name="description" content={process.env.NEXT_PUBLIC_SCHOOL_TITLE} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="w-full h-screen bg-black flex justify-center items-center flex-col space-y-4">
                <img src={employee.picture?employee.picture:'/avatar.png'} className='w-16 h-16 object-cover rounded-full shadow' alt="" />
                <select className='px-6 py-3 border-[2px] border-slate-500 bg-black outline-none rounded-md text-white hover:bg- shadow' onClick={(e) => setCampus(e.target.value)}>
                    <option value="">Select Campus</option>
                    {campuses.map((campus) => (
                        <option key={campus._id} value={campus.title}>{campus.title}</option>
                    ))}
                </select>
                <button onClick={handleContinue} className='base__button'>Continue...</button>

                <button onClick={handleLogout} className='text-gray-400 hover:text-white hover:underline'>Log out</button>
            </div>
        </>
    )
}

export default SelectCampus