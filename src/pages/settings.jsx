import CreateCampus from '@/components/modals/CreateCampus'
import CreateClass from '@/components/modals/CreateClass'
import Navbar from '@/components/nav/Navbar'
import Sidebar from '@/components/sidebar/Sidebar'
import { AuthContext } from '@/context/authcontext/AuthContext'
import axios from 'axios'
import Head from 'next/head'
import { useContext, useState } from 'react'
import { toast } from 'react-hot-toast'


const settings = () => {
    const [showCreateCampus, setShowCreateCampus] = useState(false)
    const [showCreateClass, setShowCreateClass] = useState(false)
    const { classes:allClasses, setClasses:setAllClasses, campuses, setCampuses } = useContext(AuthContext)
    const [classes, setClasses] = useState(allClasses)

    const handleClassDelete = async (classId) => {
        try {
            const res = await axios.delete('/api/classes/delete?classId=' + classId)
            if (res.data) {
                setClasses(prev => prev.filter(c => c._id !== classId))
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error('Something went wrong.')
        }
    }

    const handleCampusDelete = async (campusId) => {
        try {
            const res = await axios.delete('/api/campus/delete?campusId=' + campusId)
            if (res.data) {
                setCampuses(prev => prev.filter(c => c._id !== campusId))
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error('Something went wrong.')
        }
    }

    const handleClassFilter = async (e)=>{
        const filter = e.target.value
        try {
            let res;
            if(filter === 'all'){
                 res = await axios.get('/api/classes/filter?filter='+filter)
            }else if(filter){
                res = await axios.get('/api/classes/filter?filter='+filter)
            }
            setClasses(res.data)
        } catch (error) {
            
        }
    }

    return (
        <>
            <Head>
                <title>Settings - {process.env.NEXT_PUBLIC_SCHOOL_TITLE}</title>
                <meta name="description" content={process.env.NEXT_PUBLIC_SCHOOL_TITLE} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <Navbar />
                <div className="flex">
                    <Sidebar currentPage={'Settings'} />
                    <div className="flex w-full lg:w-auto lg:flex-1 flex-col p-4 md:p-5">

                        <div className="flex justify-between flex-col gap-3 md:flex-row">
                            <div className="flex-1  p-3 rounded-lg shadow flex-col border border-gray-200 min-w-[350px]">
                                <div className="flex flex-wrap justify-between items-center">
                                    <h1 className='text-xl font-roboto text-black'>Campuses</h1>

                                    <button onClick={() => setShowCreateCampus(prev => !prev)} className="base__button space-x-2 px-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-white w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        <span className='font-roboto'>Add</span>
                                    </button>
                                </div>
                                <hr className='my-3' />
                                <div className="bg-white space-y-2 max-h-52 overflow-auto">
                                    {campuses.map((camp) => (
                                        <div className='p-3 bg-gray-50 rounded shadow group flex justify-between border border-gray-100 items-center' key={camp._id}>
                                            <div className='font-semibold'>
                                                {camp.title}
                                            </div>
                                            <div className='cursor-pointer scale-0 group-hover:scale-100 transition-all duration-200' onClick={() => handleCampusDelete(camp._id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1  p-3 rounded-lg shadow flex-col border border-gray-200 min-w-[350px]">
                                <div className="flex flex-wrap justify-between items-center">
                                    <h1 className='text-xl font-roboto text-black'>Classes</h1>

                                    <div className="flex gap-3 items-center">
                                        <select className='base__select px-3' onChange={handleClassFilter}>
                                            <option value="all">All</option>
                                            {campuses.map((c) => (
                                                <option key={c._id} value={c.title}>
                                                    {c.title}
                                                </option>
                                            ))}
                                        </select>
                                        <button onClick={() => setShowCreateClass(prev => !prev)} className="base__button space-x-2 px-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-white w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            <span className='font-roboto'>Add</span>
                                        </button>
                                    </div>
                                </div>
                                <hr className='my-3' />
                                <div className="bg-white space-y-2 max-h-52 overflow-auto">
                                    {classes.map((camp) => (
                                        <div className='p-3 bg-gray-50 group rounded shadow flex justify-between border border-gray-100 items-center' key={camp._id}>
                                            <div className='flex gap-2 items-center'>
                                                <span className='font-semibold'>{camp.title}</span>
                                                <span className='text-sm text-gray-600'>{camp.campus}</span>
                                            </div>
                                            <div className='cursor-pointer scale-0 group-hover:scale-100 transition-all duration-200' onClick={() => handleClassDelete(camp._id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}

                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {showCreateCampus && <CreateCampus setShowCreateCampus={setShowCreateCampus} setCampuses={setCampuses} />}
            {showCreateClass && <CreateClass setShowCreateClass={setShowCreateClass} setClasses={setClasses} />}
        </>
    )
}

export default settings