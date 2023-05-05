import { AuthContext } from '@/context/authcontext/AuthContext'
import Link from 'next/link'
import React, { useContext, useState } from 'react'

const links = [
    {
        title: 'Dashboard',
        svg: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
        </svg>
        ,
        link: '/',
        onlyForAdmin: false
    },
    {
        title: 'Students',
        svg: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
        ,
        link: '/students',
        onlyForAdmin: false
    },
    {
        title: 'Fees',
        svg: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
        ,
        link: '/fees',
        onlyForAdmin: true
    },
    {
        title: 'Missing Fees',
        svg: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        ,
        link: '/missingfees',
        onlyForAdmin: false
    },
    {
        title: 'Expenses',
        svg: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        ,
        link: '/expense',
        onlyForAdmin: false
    },
    {
        title: 'Analytics',
        svg: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
        ,
        link: '/analytics',
        onlyForAdmin: true
    },
    {
        title: 'Employees',
        svg: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
        ,
        link: '/employees',
        onlyForAdmin: true
    },
    {
        title: 'Settings',
        svg: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        ,
        link: '/settings',
        onlyForAdmin: false
    },
]

const Sidebar = ({ currentPage }) => {
    const { togglesidebarondesktop, employee } = useContext(AuthContext)
    const [filteredLinks, setfilteredLinks] = useState(links)

    const handleSearch = (e)=>{
        const {value} = e.target
        setfilteredLinks(links.filter(link => link.title.toLowerCase().includes(value.toLowerCase())))
    }


    return (
        <div className={`md:block lg:block ${togglesidebarondesktop ? '-translate-x-20  w-[0px] lg:translate-x-0 lg:w-20' : 'w-14 md:w-20 translate-x-0 lg:w-64'} transition-all duration-300 h-[calc(100vh-60px)] fixed lg:sticky top-[60px] z-10 border-r border-gray-200`}>
            <div className='relative w-full h-full'>
                {/* <img className='w-full h-full -z-50' src="/bg.jpg" alt="" /> */}
                <div className='bg-white absolute top-0 w-full h-[calc(100vh-60px)] z-50 overflow-x-hidden overflow-y-auto'>
                    <div className={`justify-center m-2 hidden lg:flex ${togglesidebarondesktop ? 'opacity-0 h-0': 'opacity-100 h-auto'}  transition-all duration-300`}>
                        <input onChange={handleSearch} type="text" placeholder='Search...' className='base__search flex-1 shadow-none bg-white' />
                    </div>
                    <div className="flex pr-2 mt-5 flex-col gap-2">
                        {filteredLinks.map((link, index) => employee.isAdmin ? (
                            <Link href={link.link} key={index}>
                                <div className={`relative animate-opacity rounded-r-full gap-3 px-2 md:px-3 md:py-3 h-10 md:h-12 flex items-center overflow-hidden hover:bg-orange-100 transition-all duration-200 active:bg-orange-300 group cursor-pointer ${currentPage === link.title && 'bg-orange-100 c-shadow font-semibold '}`}>
                                    {currentPage === link.title && <div className='absolute top-2 left-0 h-6 md:h-8 w-1 rounded-r-md shadow bg-orange-500'></div>}
                                    <div className={`text-black  ${currentPage === link.title && 'text-orange-500'}`}>{link.svg}</div>
                                    <div className={`text-black  hidden lg:block transition-all duration-300 font-medium min-w-[114px] ${togglesidebarondesktop ? 'opacity-0' : 'opacity-100'} ${currentPage === link.title && 'text-orange-500'}`}>{link.title}</div>
                                </div>
                            </Link>
                        ) : !link.onlyForAdmin && (
                            <Link href={link.link} key={index}>
                                <div className={` relative animate-opacity rounded-r-full gap-3 px-2 md:px-3 md:py-3 h-10 md:h-12 flex items-center overflow-hidden hover:bg-orange-100 transition-all duration-200 active:bg-orange-300 group cursor-pointer ${currentPage === link.title && 'bg-orange-100 c-shadow font-semibold '}`}>
                                    {currentPage === link.title && <div className='absolute top-2 left-0 h-8 w-1 rounded-r-md shadow bg-orange-500'></div>}
                                    <div className={`text-black  ${currentPage === link.title && 'text-orange-500'}`}>{link.svg}</div>
                                    <div className={`text-black hidden md:block font-medium transition-all duration-300 min-w-[114px] ${togglesidebarondesktop ? 'opacity-0' : 'opacity-100'} ${currentPage === link.title && 'text-orange-500'}`}>{link.title}</div>
                                </div>
                            </Link>
                        )
                        )}
                    </div>
                    {filteredLinks.length===0&&<p className="text-gray-700 m-3 animate-opacity">Sorry, no results found.</p>}
                    {/* <hr className="my-3 mx-2" />
                    <div className="flex mx-2 text-white font-roboto">
                        {localStorage.getItem('campus')}
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Sidebar