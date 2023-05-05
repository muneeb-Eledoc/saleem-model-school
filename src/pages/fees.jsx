import Navbar from '@/components/nav/Navbar'
import Sidebar from '@/components/sidebar/Sidebar'
import { AuthContext } from '@/context/authcontext/AuthContext'
import { authenticate } from '@/utils/authenticate'
import { fetchStudent } from '@/utils/fetchStudent'
import axios from 'axios'
import moment from 'moment'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'


const fees = () => {
    const [fees, setFees] = useState([])
    const [total, setTotal] = useState({})
    const { employee, classes } = useContext(AuthContext)
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [fClass, setFClass] = useState('')
    const [fSession, setFSession] = useState('')
    const [filters, setFilters] = useState({
        startedDate: '',
        endedDate: ''
    })
    const router = useRouter()

    if (!employee.isAdmin) {
        router.back()
    }

    const fetchFees = async (ignoreDates) => {
        let res = {};
        setCurrentPage(1)
        setTotal({})
        setFees([])
        setIsLoading(true)
        try {
            if (filters.startedDate !== '' && filters.endedDate !== '' && !ignoreDates) {
                res = await axios.get(`/api/studentfee/get?campus=${localStorage.getItem('campus')}&startedDate=${filters.startedDate}&endedDate=${filters.endedDate}`)
            }else if(fClass && fSession && !ignoreDates){
                res = await axios.get(`/api/studentfee/get?campus=${localStorage.getItem('campus')}&class=${fClass}&session=${fSession}`)
            } else {
                res = await axios.get(`/api/studentfee/get?campus=${localStorage.getItem('campus')}`)
            }
            setFees(res.data.fees)
            setTotal({
                total: res.data.total,
                pages: res.data.pages
            })
            setIsLoading(false)
        } catch (error) {
            toast.error('something went wrong')
            setIsLoading(false)
            console.log(error)
        }

    }
    useEffect(() => {
        fetchFees()
    }, [])

    const fetchMore = async () => {
        let loading = toast.loading('loading...')
        try {
            let res = {};
            if (filters.startedDate !== '' && filters.endedDate !== '') {
                res = await axios.get(`/api/studentfee/get?page=${currentPage}&campus=${localStorage.getItem('campus')}&startedDate=${filters.startedDate}&endedDate=${filters.endedDate}`)
            }else if(fClass && fSession){
                res = await axios.get(`/api/studentfee/get?page=${currentPage}&campus=${localStorage.getItem('campus')}&class=${fClass}&session=${fSession}`)
            } else{
                res = await axios.get(`/api/studentfee/get?page=${currentPage}&campus=${localStorage.getItem('campus')}`)
            }
            setFees([...fees, ...res.data.fees])
            setCurrentPage(prev => prev + 1)
            toast.success('finished', { id: loading })
        } catch (error) {
            toast.error('something went wrong...', { id: loading })
        }
    }

    function getFeeSum(fee) {
        let sum = 0
        for (let i = 0; i < fee.length; i++) {
            sum += fee[i].feeamount
        }
        return sum
    }

    const handleChange = (event) => {
        let { name, value } = event.target
        setFilters({
            ...filters,
            [name]: value
        })
    }

    const handleFilterApply = () => {
        if (filters.startedDate === '' || filters.endedDate === '') return
        fetchFees()
    }

    const handleFilterByClass = () => {
        if(fClass === '' || fSession === '') return
        fetchFees()
    }

    const handleClear = () => {
        if(filters.startedDate !== '' || filters.endedDate !== ''){
            setFilters({
                startedDate: '',
                endedDate: ''
            })
        }else{
            setFClass('')
            setFSession('')
        }
        fetchFees(true)
    }

    return (
        <div>
            <Head>
                <title>Students - {process.env.NEXT_PUBLIC_SCHOOL_TITLE}</title>
                <meta name="description" content={process.env.NEXT_PUBLIC_SCHOOL_TITLE} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Navbar />
                <div className="flex">
                    <Sidebar currentPage={'Fees'} />
                    <div className="flex w-full lg:w-auto lg:flex-1 flex-col p-4 md:p-5">
                        <section className="bg-gray-50 border border-gray-100 rounded-md">
                            <div className="mx-auto max-w-screen-xl">
                                <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
                                    <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                                        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                                            <div className="flex gap-3 items-center flex-wrap">
                                                <input onChange={handleChange} value={filters.startedDate} name='startedDate' type="date" className='base__input py-[5px] px-3 mt-0 border-gray-100 bg-white text-sm' />
                                                <input onChange={handleChange} value={filters.endedDate} name='endedDate' type="date" className='base__input py-[5px] px-3 mt-0 border-gray-100 bg-white text-sm' />
                                                <button className="base__button px-3 text-sm" onClick={handleFilterApply}>Apply</button>
                                                {filters.startedDate !== '' && filters.endedDate !== '' && <div onClick={handleClear} className='flex p-1 bg-gray-100 rounded-full shadow cursor-pointer hover:scale-125 transition-all duration-300'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </div>}
                                                <div className='flex items-center gap-3 flex-wrap'>
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

                                                    <button onClick={handleFilterByClass} className='base__button px-3 text-sm'>Apply</button>
                                                    {fClass !== '' && fSession !== '' && <div onClick={handleClear} className='flex p-1 bg-gray-100 rounded-full shadow cursor-pointer hover:scale-125 transition-all duration-300'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </div>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="">
                                            <span className='text-sm'>Records: <b>{total.total ? total.total : '__'}</b></span>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500 ">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-4 py-3 min-w-[30px] max-w-[30px]">Srno.</th>
                                                    <th scope="col" className="px-4 py-3">Student</th>
                                                    <th scope="col" className="px-4 py-3">Father</th>
                                                    <th scope="col" className="px-4 py-3">Class</th>
                                                    <th scope="col" className="px-4 py-3">Amount</th>
                                                    <th scope="col" className="px-4 py-3">Remainings</th>
                                                    <th scope="col" className="px-4 py-3">Created At</th>
                                                    <th scope="col" className="px-4 py-3">Rn</th>
                                                    {/* <th scope="col" className="px-4 py-3"></th> */}
                                                    <th scope="col" className="px-4 py-3">
                                                        <span className="sr-only">Actions</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {fees.map((fee, i) => (
                                                    <FeeRow fee={fee} key={fee._id + i} i={i + 1} />
                                                ))}

                                                <tr>
                                                    <td className="px-4 py-3 text-lg">Total</td>
                                                    <td className="px-4 py-3"></td>
                                                    <td className="px-4 py-3"></td>
                                                    <td className="px-4 py-3"></td>
                                                    <td className="px-4 py-3 text-lg"><b>Rs.{new Intl.NumberFormat().format(getFeeSum(fees))}</b></td>
                                                </tr>
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
                                    <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
                                        <button onClick={fetchMore} disabled={currentPage === total?.pages} className="base__button">Show more</button>
                                    </nav>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

            </main>
        </div>
    )
}

export default fees

export async function getServerSideProps(context) {
    authenticate(context)

    return {
        props: {}
    }
}

const FeeRow = ({ fee, i }) => {
    const [student, setStudent] = useState({})

    useEffect(() => {
        fetchStudent(fee.studentId).then((data) => {
            setStudent(data)
        })
    }, [])

    return (
        <tr className="border-b animate-slow">
            <th scope="row" className="px-4 py-3 font-medium text-gray-900 max-w-[30px]">{i}</th>
            <td className="px-4 py-3 min-w-[180px]">
                <div className="flex gap-2 items-center">
                    <img className='w-10 h-10 rounded shadow object-cover' src={student.picture ? student.picture : 'avatar.png'} alt={student.name} />
                    <span className='font-semibold'>
                        {student.name}
                    </span>
                </div>
            </td>
            <td className="px-4 py-3">{student.fathername}</td>
            <td className="px-4 py-3">{fee.class.title}</td>
            <td className="px-4 py-3">{new Intl.NumberFormat().format(fee.feeamount)}</td>
            <td className="px-4 py-3">{fee.remainings}</td>
            <td className="px-4 py-3">{moment(fee?.createdAt).format('L')}</td>
            <td className="px-4 py-3">{student.rn}</td>
            <td className="px-4 py-3 flex items-center justify-end">
                <button id="apple-imac-27-dropdown-button" data-dropdown-toggle="apple-imac-27-dropdown" className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none" type="button">
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                </button>
                <div id="apple-imac-27-dropdown" className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow">
                    <ul className="py-1 text-sm text-gray-700" aria-labelledby="apple-imac-27-dropdown-button">
                        <li>
                            <a href="#" className="block py-2 px-4 hover:bg-gray-100">Show</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-4 hover:bg-gray-100">Edit</a>
                        </li>
                    </ul>
                    <div className="py-1">
                        <a href="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">Delete</a>
                    </div>
                </div>
            </td>
        </tr>

    )
}