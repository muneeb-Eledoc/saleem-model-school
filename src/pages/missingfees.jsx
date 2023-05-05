import StudentCard from '@/components/missingfees/StudentCard'
import Navbar from '@/components/nav/Navbar'
import Sidebar from '@/components/sidebar/Sidebar'
import { AuthContext } from '@/context/authcontext/AuthContext'
import { authenticate } from '@/utils/authenticate'
import axios from 'axios'
import Head from 'next/head'
import React, { useContext, useState } from 'react'
import { toast } from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'


const missingfees = () => {
    const [students, setStudents] = useState([])
    const [filteredStudents, setFilteredStudents] = useState([])
    const { classes } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false)
    const [fClass, setFClass] = useState('')
    const [fSession, setFSession] = useState('')


    const handleClear = () => {
        if (fClass !== '' || fSession !== '') {
            setFClass('')
            setFSession('')
        }
    }

    const handleFilterByClass = async () => {
        try {
            setStudents([])
            setFilteredStudents([])
            setIsLoading(true)
            const res = await axios.get(`/api/student/missingfees?class=${fClass}&session=${fSession}&campus=${localStorage.getItem('campus')}`)
            setStudents(res.data)
            setFilteredStudents(res.data)
            setIsLoading(false)
        } catch (e) {
            console.log(e)
            setIsLoading(false)
            toast.error('Something went wrong. Please try again.')
        }
    }

    const handleFilter = (e) => {
        const { value } = e.target
        setFilteredStudents(students.filter((s) => s.student.name.toLowerCase().match(value.toLowerCase())))
    }

    return (
        <div>
            <Head>
                <title>Missing Fees - {process.env.NEXT_PUBLIC_SCHOOL_TITLE}</title>
                <meta name="description" content={process.env.NEXT_PUBLIC_SCHOOL_TITLE} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Navbar />
                <div className="flex">
                    <Sidebar currentPage={'Missing Fees'} />
                    <div className="flex w-full lg:w-auto lg:flex-1 flex-col p-4 md:p-5">
                        <section className="bg-gray-50 border border-gray-100 rounded-md">
                            <div className="mx-auto max-w-screen-xl">
                                <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
                                    <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                                        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                                            <div className="flex gap-3 items-center flex-wrap">

                                                <div className='flex items-center flex-wrap gap-3'>
                                                    <select onChange={(e) => setFClass(e.target.value)} value={fClass} className='base__select bg-white px-3 text-sm'>
                                                        <option value="">Select a class...</option>
                                                        {classes.map((c, i) => (
                                                            <option key={i} value={c.title}>{c.title}</option>
                                                        ))}
                                                    </select>

                                                    <select onChange={(e) => setFSession(e.target.value)} value={fSession} className='base__select bg-white px-3 text-sm'>
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

                                                    <button onClick={handleFilterByClass} className='base__button px-3 text-sm'>Process</button>
                                                    {fClass !== '' && fSession !== '' && <div onClick={handleClear} className='flex p-1 bg-gray-100 rounded-full shadow cursor-pointer hover:scale-125 transition-all duration-300'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </div>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="">
                                            {students.length > 0 && <input type="search" onChange={handleFilter} className='base__search' placeholder='Search...' />}
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <div className="flex flex-col p-4 gap-3">
                                            {filteredStudents.map((student, index) => (
                                                <StudentCard student={student} i={index + 1} key={student.student._id} />
                                            ))}
                                        </div>
                                        <div>
                                            {isLoading && <div className='p-5 flex flex-1 justify-center items-center '>
                                                <ClipLoader
                                                    color="orange"
                                                    cssOverride={{}}
                                                    size={35}
                                                    speedMultiplier={1}
                                                />
                                            </div>}
                                           {students.length===0 && !isLoading && <div className="flex p-4">
                                                <h1 className='text-xl font-bold'>Select class and session to view student with missing fees.</h1>
                                            </div>}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </section>
                    </div>
                </div>

            </main>
        </div>
    )
}

export default missingfees

export async function getServerSideProps(context) {
    authenticate(context)

    return {
        props: {}
    }
}
