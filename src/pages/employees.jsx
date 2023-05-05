import CreateEmployee from '@/components/modals/CreateEmployee'
import UpdateEmployee from '@/components/modals/UpdateEmployee'
import Navbar from '@/components/nav/Navbar'
import Sidebar from '@/components/sidebar/Sidebar'
import { AuthContext } from '@/context/authcontext/AuthContext'
import { authenticate } from '@/utils/authenticate'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect, useRef, useState } from 'react'

export default function Home() {
    const [showcreate, setShowcreate] = useState(false)
    const [employeeToUpdate, setEmployeeToUpdate] = useState({})
    const [employees, setEmployees] = useState([])
    const { employee } = useContext(AuthContext)
    const router = useRouter()

    if(!employee.isAdmin){
        router.back()
    }
    
    useEffect(() => {
        const fetchEmployees = async () => {
            const res = await axios.get('/api/employee/getall')
            setEmployees(res.data)
        }
        fetchEmployees()
    }, [])


    return (
        <>
            <Head>
                <title>Employees - {process.env.NEXT_PUBLIC_SCHOOL_TITLE}</title>
                <meta name="description" content={'Powered by '+process.env.NEXT_PUBLIC_SCHOOL_TITLE} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className=''>
                <Navbar />
                <div className="flex">
                    <Sidebar currentPage='Employees' />
                    <div className="flex w-full lg:w-auto lg:flex-1 flex-col p-4 md:p-5">
                        <div className="flex justify-between items-center flex-wrap gap-3">
                            <div className="flex">
                                <div className="flex">
                                    <input type="search" placeholder='Search' className='base__search' />
                                </div>
                            </div>
                            <div className="flex">
                                {employee.isAdmin && <button onClick={() => setShowcreate(prev => !prev)} className='base__button'>
                                    <div className='mr-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                        </svg>

                                    </div>
                                    Add Employee
                                </button>}
                            </div>
                        </div>
                        <div className="flex w-full mt-4 overflow-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 font-roboto">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 font-roboto">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 font-roboto">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 font-roboto">
                                            Whatsapp
                                        </th>
                                        <th className="px-6 py-3 font-roboto">
                                            Campus
                                        </th>
                                        <th className="px-1 py-3 font-roboto">
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((emp) => (
                                        <EmployeeRow key={emp._id} employee={emp} setEmployeeToUpdate={setEmployeeToUpdate} />
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
                {showcreate && <CreateEmployee setShowcreate={setShowcreate} employees={employees} setEmployees={setEmployees} />}
                {Object.keys(employeeToUpdate).length>0 && <UpdateEmployee employeeToUpdate={employeeToUpdate} employees={employees} setEmployees={setEmployees} setEmployeeToUpdate={setEmployeeToUpdate} />}
            </main>
        </>
    )
}



const EmployeeRow = ({ employee, setEmployeeToUpdate }) => {
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
            <tr className="bg-white border-b hover:bg-gray-50 ">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center">
                    <img className='h-10 w-10 mr-2 rounded object-cover' src={employee.picture ? employee.picture : '/avatar.png'} alt='' />  {employee.name}
                </th>
                <td className="px-6 py-4">
                    {employee.email}
                </td>
                <td className="px-6 py-4">
                    {employee.phoneNumber}
                </td>
                <td className="px-6 py-4">
                    {employee.whatsappnumber}
                </td>
                <td className="px-6 py-4">
                    {employee.campus ? employee.campus : 'No campus'}
                </td>
                <td className="px-1 py-4">
                    <div  ref={ref} className='relative w-8 h-8'>
                        <div onClick={()=> setShowMenu(prev=> !prev)} className='hover:bg-gray-100 w-8 h-8 flex justify-center active:bg-gray-300 hover:shadow items-center text-black rounded-full cursor-pointer'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                            </svg>
                        </div>

                        <div className={`absolute ${showMenu ? 'top-5 right-5 scale-100' : 'scale-0 -top-5 -right-5'} transition-all duration-300 ease-in-out py-3 shadow-md rounded bg-white border-t border-gray-100`}>
                            <div onClick={()=> setEmployeeToUpdate(employee)} className='flex space-x-3 px-3 py-2 hover:bg-gray-100 cursor-pointer'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>View</div>
                            </div>
                            <hr className='mx-2' />
                            <div className='flex space-x-3 px-3 py-2 hover:bg-gray-100 cursor-pointer'>
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