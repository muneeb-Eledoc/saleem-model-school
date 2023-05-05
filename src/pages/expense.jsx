import CreateExpense from '@/components/modals/CreateExpense'
import Navbar from '@/components/nav/Navbar'
import Sidebar from '@/components/sidebar/Sidebar'
import { authenticate } from '@/utils/authenticate'
import { fetchStudent } from '@/utils/fetchStudent'
import axios from 'axios'
import moment from 'moment'
import Head from 'next/head'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'


const Expense = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [showCreateExpense, setShowCreateExpense] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [expenses, setExpenses] = useState([])
    const [total, setTotal] = useState({})
    const [filters, setFilters] = useState({
        startedDate: '',
        endedDate: ''
    })

    const fetchExpenses = async (ignoreDates) => {
        let res = {};
        setCurrentPage(1)
        setTotal({})
        setExpenses([])
        setIsLoading(true)
        try {
            if (filters.startedDate !== '' && filters.endedDate !== '' && !ignoreDates) {
                res = await axios.get(`/api/expense/get?campus=${localStorage.getItem('campus')}&startedDate=${filters.startedDate}&endedDate=${filters.endedDate}`)
            } else {
                res = await axios.get(`/api/expense/get?campus=${localStorage.getItem('campus')}`)
            }
            setExpenses(res.data.expenses)
            setTotal({
                total: res.data.total,
                pages: res.data.pages
            })
            setIsLoading(false)
        } catch (error) {
            toast.error('Something went wrong.')
            setIsLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        fetchExpenses()
    }, [])

    const fetchMore = async() => {
        let loading = toast.loading('loading...')
        try {
            let res = {};
            if (filters.startedDate !== '' && filters.endedDate !== '') {
                res = await axios.get(`/api/expense/get?page=${currentPage}&campus=${localStorage.getItem('campus')}&startedDate=${filters.startedDate}&endedDate=${filters.endedDate}`)
            }else{
                res = await axios.get(`/api/expense/get?page=${currentPage}&campus=${localStorage.getItem('campus')}`)
            }
            setExpenses([...expenses, ...res.data.expenses])
            setCurrentPage(prev => prev + 1)
            toast.success('finished', { id: loading })
        } catch (error) {
            toast.error('something went wrong...', { id: loading })
        }
    }

    const handleFilterApply = () => {
        if (filters.startedDate === '' || filters.endedDate === '') return
        fetchExpenses()
    }

    const handleClear = () => {
        if(filters.startedDate !== '' || filters.endedDate !== ''){
            setFilters({
                startedDate: '',
                endedDate: ''
            })
        }
    }
    
    const handleChange = (event)=>{
        let { name, value } = event.target
        setFilters({
            ...filters,
            [name]: value
        })
    }

    const handleDelete = async (expenseId)=>{
        if(expenseId){
            const res = await axios.delete(`/api/expense/delete?expenseId=${expenseId}`)
            if(res.data.message){
                toast.success(res.data.message)
                setExpenses(prev=> prev.filter(e=> e._id!==expenseId))
            }
        }
    }

    return (
        <div>
            <Head>
                <title>Expense - {process.env.NEXT_PUBLIC_SCHOOL_TITLE}</title>
                <meta name="description" content={process.env.NEXT_PUBLIC_SCHOOL_TITLE} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Navbar />
                <div className="flex">
                    <Sidebar currentPage={'Expenses'} />
                    <div className="flex w-full lg:w-auto lg:flex-1 flex-col p-4 md:p-5">
                        <section className="bg-gray-50 border border-gray-100 rounded-md">
                            <div className="mx-auto max-w-screen-xl">
                                <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
                                    <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                                        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                                            <div className="flex gap-3 items-center flex-wrap">
                                                <input onChange={handleChange} value={filters.startedDate} name='startedDate' type="date" className='base__input py-[5px] px-3 mt-0 border-gray-100 bg-white text-sm' />
                                                <input onChange={handleChange} value={filters.endedDate} name='endedDate' type="date" className='base__input py-[5px] px-3 mt-0 border-gray-100 bg-white text-sm' />
                                                <button className="base__button px-3 text-sm" disabled={filters.startedDate === '' || filters.endedDate === ''} onClick={handleFilterApply}>Apply</button>
                                                {filters.startedDate !== '' && filters.endedDate !== '' && <div onClick={handleClear} className='flex p-1 bg-gray-100 rounded-full shadow cursor-pointer hover:scale-125 transition-all duration-300'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </div>}
                                            </div>
                                        </div>
                                        <div className="">
                                            <button onClick={() => setShowCreateExpense(prev => !prev)} className='base__button flex items-center gap-3 px-3'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>
                                                    Add Expense
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500 ">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-4 py-3 min-w-[30px] max-w-[30px]">Srno.</th>
                                                    <th scope="col" className="px-4 py-3">Title</th>
                                                    <th scope="col" className="px-4 py-3">Description</th>
                                                    <th scope="col" className="px-4 py-3">Amount</th>
                                                    <th scope="col" className="px-4 py-3">Created At</th>
                                                    {/* <th scope="col" className="px-4 py-3"></th> */}
                                                    <th scope="col" className="px-4 py-3">
                                                        <span className="sr-only">Actions</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {expenses.map((expense, i) => (
                                                    <ExpenseRow expense={expense} handleDelete={handleDelete} key={expense._id+i.toString()} i={i + 1} />
                                                ))}
                                                {/* <tr>
                                                    <td className="px-4 py-3 text-lg">Total</td>
                                                    <td className="px-4 py-3"></td>
                                                    <td className="px-4 py-3"></td>
                                                    <td className="px-4 py-3"></td>
                                                    <td className="px-4 py-3 text-lg"><b>Rs.{new Intl.NumberFormat().format(getFeeSum(fees))}</b></td>
                                                </tr> */}
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
                                        <button onClick={fetchMore} disabled={currentPage === total?.pages || isLoading} className="base__button px-3">Show more</button>
                                        <p className='text-gray-600'>Showing <b>{currentPage}</b> of <b>{total.pages}</b> pages</p>
                                    </nav>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                {showCreateExpense && <CreateExpense setExpenses={setExpenses} setShowCreateExpense={setShowCreateExpense} />}
            </main>
        </div>
    )
}

export default Expense

export async function getServerSideProps(context) {
    authenticate(context)

    return {
        props: {}
    }
}

const ExpenseRow = ({ expense, i, handleDelete }) => {

    return (
        <tr className="border-b animate-slow">
            <th scope="row" className="px-4 py-3 font-medium text-gray-900 max-w-[30px]">{i}</th>
            <td className="px-4 py-3">
                {expense.title}
            </td>
            <td className="px-4 py-3">{expense.description}</td>
            <td className="px-4 py-3">{new Intl.NumberFormat().format(expense.amount)}</td>
            <td className="px-4 py-3">{moment(expense?.createdAt).format('L')}</td>
            <td className="px-4 py-3 flex items-center justify-end">
                <div className="flex">
                    <div onClick={()=> handleDelete(expense._id)} className='text-red-500 cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </div>
                </div>
            </td>
        </tr>

    )
}