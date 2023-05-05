import AddFee from '@/components/modals/AddFee'
import CreateStudent from '@/components/modals/CreateStudent'
import ViewStudent from '@/components/modals/ViewStudent'
import Navbar from '@/components/nav/Navbar'
import Sidebar from '@/components/sidebar/Sidebar'
import { AuthContext } from '@/context/authcontext/AuthContext'
import { authenticate } from '@/utils/authenticate'
import { deleteFile } from '@/utils/deleteFile'
import axios from 'axios'
import Head from 'next/head'
import Image from 'next/image'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'

const Students = ({ }) => {
    const [showCreateStudent, setShowCreateStudent] = useState(false)
    const [fclass, setFclass] = useState('')
    const [fsession, setFsession] = useState('')
    const [students, setStudents] = useState([])
    const [viewStudent, setViewStudent] = useState({})
    const [feeStudent, setFeeStudent] = useState({})
    const { classes } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false)

    const fetchStudents = async () => {
        try {
            setIsLoading(true)
            const res = await axios.get(`/api/student/getall?campus=${localStorage.getItem('campus')}`)
            setStudents(res.data)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchStudents()
    }, [])

    const handleFilter = async () => {
        if (fclass && fsession) {
            try {
                setStudents([])
                setIsLoading(true)
                const res = await axios.get(`/api/student/search?byClass=true&class=${fclass}&session=${fsession}&campus=${localStorage.getItem('campus')}`)
                setStudents(res.data)
                setIsLoading(false)
            } catch (error) {
                toast.error('Something went wrong.')
                setIsLoading(false)
            }
        }
    }

    const handleTextSearch = async (e) => {
        const res = await axios.get(`/api/student/search?byText=true&text=${e.target.value}&campus=${localStorage.getItem('campus')}`)
        setStudents(res.data)
    }

    const handleDelete = async (stu) => {
        if (prompt('Please type student name') === stu.name) {
            try {
                const res = await axios.delete('/api/student/delete?studentId=' + stu._id)
                if (res.data) {
                    try {
                        await deleteFile(stu.picture)
                    } catch (e) { }
                    setStudents(students.filter((s) => s._id !== stu._id))
                    toast.success(res.data.message)
                }

            } catch (error) {
                console.log(error)
                toast.error('Something went wrong.')
            }
        }
    }


    return (
        <>
            <Head>
                <title>Students - {process.env.NEXT_PUBLIC_SCHOOL_TITLE}</title>
                <meta name="description" content={process.env.NEXT_PUBLIC_SCHOOL_TITLE} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Navbar />
                <div className="flex">
                    <Sidebar currentPage={'Students'} />
                    <div className="flex w-full lg:w-auto lg:flex-1 flex-col p-4 md:p-5">
                        <div className='flex flex-col items-start md:flex-row justify-between gap-3 mb-4'>
                            <div className="flex gap-3 flex-wrap">

                                <select onChange={(e) => setFclass(e.target.value)} value={fclass} className='base__select'>
                                    <option value="">Select a class...</option>
                                    {classes.map((c, i) => (
                                        <option key={i} value={c.title}>{c.title}</option>
                                    ))}
                                </select>

                                <select onChange={(e) => setFsession(e.target.value)} value={fsession} className='base__select'>
                                    <option value="">Select Session</option>
                                    <option value="2023-2024">2023-2024</option>
                                    <option value="2024-2025">2024-2025</option>
                                    <option value="2025-2026">2025-2026</option>
                                    <option value="2026-2027">2026-2027</option>
                                    <option value="2027-2028">2027-2028</option>
                                    <option value="2028-2029">2028-2029</option>
                                    <option value="2029-2030">2029-2030</option>
                                    <option value="2030-2031">2030-2031</option>
                                </select>

                                <button onClick={handleFilter} className='base__button'>Apply</button>

                                {fclass && fsession && <button onClick={() => { setFclass(''); setFsession(''); fetchStudents() }} className='base__button'>Clear</button>}

                            </div>
                            <div className="">
                                <button className='base__button' onClick={() => setShowCreateStudent(true)} title='Add Student'>
                                    <div className='mr-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                        </svg>

                                    </div>
                                    Add Student
                                </button>
                            </div>
                        </div>

                        <div className='flex mb-3 justify-between items-center'>
                            <div className="flex items-center space-x-2 base__search">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                <input type="search" onChange={handleTextSearch} placeholder='Search...' className='bg-transparent outline-none' />
                            </div>
                            <div>
                                <div onClick={fetchStudents} className='w-8 h-8 font-bold rounded-full flex justify-center items-center bg-gray-50 hover:scale-125 active:rotate-180 transition-all duration-300 ease-in-out cursor-pointer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className=' max-w-full' >

                            <div className='h-fit'>
                                <div className="overflow-auto shadow sm:rounded-lg border border-gray-200">
                                    <table className="w-full min-w-[700px] text-sm text-left text-gray-500">
                                        <thead className="text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-3 font-bold">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 font-bold">
                                                    Father Name
                                                </th>
                                                <th className="px-6 py-3 font-bold">
                                                    Class
                                                </th>
                                                <th className="px-6 py-3 font-bold">
                                                    Medium
                                                </th>
                                                <th className="px-6 py-3 font-bold">
                                                    R.No
                                                </th>
                                                <th className="px-1 py-3 font-bold">
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((stu) => (
                                                <StudentRow handleDelete={handleDelete} student={stu} key={stu._id} setViewStudent={setViewStudent} setFeeStudent={setFeeStudent} />
                                            ))}
                                        </tbody>
                                    </table>
                                    {isLoading && <div className='p-5 flex flex-1 justify-center items-center '>
                                        <ClipLoader
                                            color="orange"
                                            cssOverride={{}}
                                            size={35}
                                            speedMultiplier={1}
                                        />
                                    </div>}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {showCreateStudent && <CreateStudent setStudents={setStudents} setShowCreateStudent={setShowCreateStudent} />}
                {Object.keys(viewStudent).length > 0 && <ViewStudent viewStudent={viewStudent} setViewStudent={setViewStudent} />}
                {Object.keys(feeStudent).length > 0 && <AddFee feeStudent={feeStudent} setFeeStudent={setFeeStudent} />}
            </main>
        </>
    )
}

export default Students

const StudentRow = ({ student, setViewStudent, setFeeStudent, handleDelete }) => {
    const [showMenu, setShowMenu] = useState(false)
    const ref = useRef()

    useEffect(() => {
        const closeMenu = (e) => {
            if (!ref.current.contains(e.target)) {
                setShowMenu(false)
            }
        }
        document.addEventListener('mousedown', closeMenu)
        return () => document.removeEventListener('mousedown', closeMenu)
    }, [])

    return (
        <>
            <tr className="bg-white border-b hover:bg-gray-50 animate-slow" title={student.name}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center">
                    <Image className='h-10 w-10 mr-2 rounded object-cover' width={50} height={50} src={student.picture ? student.picture : '/avatar.png'} alt={student.name} />
                    {student.name}
                </th>
                <td className="px-6 py-4">
                    {student.fathername}
                </td>
                <td className="px-6 py-4">
                    {student.classes[student.classes.length - 1]?.class}
                </td>
                <td className="px-6 py-4">
                    {student.medium}
                </td>
                <td className="px-6 py-4">
                    {student.rn}
                </td>
                <td className="px-1 py-4">
                    <div ref={ref} className="relative">
                        <div onClick={() => setShowMenu(prev => !prev)} className='hover:bg-gray-100 w-8 h-8 flex justify-center active:bg-gray-300 hover:shadow items-center text-black rounded-full cursor-pointer'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                            </svg>
                        </div>
                        <div className={`absolute w-[110px] py-2 rounded bg-white transition-all duration-300 ease-in-out flex flex-col shadow-md border border-gray-100 ${showMenu ? 'scale-100 top-5 right-12' : 'scale-0 -top-5 right-0'}`}>
                            <div onClick={() => setViewStudent(student)} className='flex space-x-3 px-3 py-2 hover:bg-gray-100 cursor-pointer'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>View</div>
                            </div>
                            <div onClick={() => setFeeStudent(student)} className='flex space-x-3 px-3 py-2 hover:bg-gray-100 cursor-pointer'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>

                                </div>
                                <div>Add Fee</div>
                            </div>
                            <div onClick={() => handleDelete(student)} className='flex space-x-3 px-3 py-2 hover:bg-gray-100 cursor-pointer'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>

                                </div>
                                <div className='text-red-500'>Delete</div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    )
}

export async function getServerSideProps(context) {
    authenticate(context)

    return {
        props: {}
    }
}