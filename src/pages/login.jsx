import { AuthContext } from '@/context/authcontext/AuthContext'
import axios from 'axios'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'
import { redirectEmployee } from '@/utils/redirectEmployee'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { decodeEmployee, setEmployee, employee, setLocalCampus } = useContext(AuthContext)

    if(Object.keys(employee).length>0){
        redirectEmployee('/')
    }
    

    const handleLogin = async () => {
        if (email && password) {
            const loading = toast.loading('logging in...')
            axios.post('/api/employee/auth', {
                email,
                password
            }).then((res) => {
                decodeEmployee(res.data.token).then(r => {
                    if(!r.employee.isAdmin){
                        if(r.employee.campus){
                            localStorage.setItem('campus', r.employee.campus)
                            setLocalCampus(r.employee.campus)
                        }else {
                            return toast.error('You are neither an admin nor have a campus.', {id:loading})
                        }
                    }

                    setEmployee(r.employee)
                    Cookies.set('token', res.data.token)
                    toast.success('logged in', {id:loading})
                    redirectEmployee('/')
                })

            }).catch((e) => {
                console.log(e)
                if(e.response?.data.message){
                    toast.error(e.response.data.message, {id:loading})
                }
            })
        } else {
            toast.error('Please provide required information!')
        }
    }

    return (
        <>
            <Head>
                <title>Log in - {process.env.NEXT_PUBLIC_SCHOOL_TITLE}</title>
                <meta name="description" content={process.env.NEXT_PUBLIC_SCHOOL_TITLE} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className='flex justify-center items-center h-screen backdrop-blur-sm bg-gray-50'>
                <div className='flex h-[80vh] flex-row shadow-lg rounded-xl overflow-hidden z-50 border border-gray-100'>
                    <div className="relative hidden md:flex">
                        <img className='max-w-md object-cover' src="/login-bg.jpg" alt="" />
                        <div className="h-full w-full bg-gradient-to-tr to-[rgba(0,0,0,1)] backdrop-blur-[2px] from-transparent absolute top-0 right-0"></div>
                        <img className='w-14 h-14 absolute top-5 left-5 p-2 bg-white rounded-full shadow' src="/favicon.ico" alt="" />
                    </div>
                    <div className="flex flex-col space-y-3 p-5 bg-white">
                        <h1 className='font-roboto text-2xl mb-3 text-black'>Login</h1>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder='Email' className='base__input' />
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' className='base__input' />
                        {/* <select className='base__select' onClick={(e)=> setCampus(e.target.value)}>
                            <option value="">Select Campus</option>
                            <option value="Campus 1">Campus 1</option>
                            <option value="Campus 2">Campus 2</option>
                            <option value="Campus 3">Campus 3</option>
                        </select> */}
                        <div>
                            <button onClick={handleLogin} className='base__button'>Login</button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
