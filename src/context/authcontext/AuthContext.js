import { redirectEmployee } from "@/utils/redirectEmployee";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";
import SelectCampus from "../SelectCampus";
import Head from "next/head";
import { ClipLoader } from "react-spinners";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [employee, setEmployee] = useState({})
    const [togglesidebarondesktop, setTogglesidebarondesktop] = useState(false)
    const router = useRouter()
    const [localCampus, setLocalCampus] = useState('')
    const [campuses, setCampuses] = useState([])
    const [classes, setClasses] = useState([])

    const decodeEmployee = async (token) => {
        if (!token) return
        const res = await axios.post('/api/employee/decode', { token })
        return res.data
    }


    useEffect(() => {
        setLocalCampus(localStorage.getItem('campus'))
        if (Cookies.get('token')) {
            decodeEmployee(Cookies.get('token'))
                .then((e) => {
                    setEmployee(e.employee)
                })
        }
    }, [])

    useEffect(() => {
        const fetchCampuses = async () => {
            const res = await axios.get('/api/campus/getall')
            setCampuses(res.data)
        }
        fetchCampuses()

        const fetchClasses = async () => {
            const res = await axios.get('/api/classes/getall?campus='+localStorage.getItem('campus'))
            setClasses(res.data)
        }
        fetchClasses()
    }, [])



    return (
        <AuthContext.Provider value={{
            employee, setEmployee, decodeEmployee,
            togglesidebarondesktop, setTogglesidebarondesktop, setLocalCampus, campuses, setCampuses, classes, setClasses
        }}>

            {router.asPath === '/login' && children}
            {Object.keys(employee).length !== 0 && router.asPath !== '/login' && employee.isAdmin && !localCampus && (
                <SelectCampus localCampus={localCampus} setLocalCampus={setLocalCampus} employee={employee} setEmployee={setEmployee} />
            )}
            {Object.keys(employee).length !== 0 ? localCampus && children : router.asPath !== '/login' && (
                <>
                    <Head>
                        <title>loading...</title>
                    </Head>
                    <div className='p-5 w-full h-screen flex flex-1 justify-center items-center '>
                        <ClipLoader
                            color="orange"
                            cssOverride={{}}
                            size={50}
                            speedMultiplier={1}
                        />
                    </div>
                </>

            )}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext }