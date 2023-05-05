import { authenticate } from '@/utils/authenticate'
import { fetchStudent } from '@/utils/fetchStudent'
import { getMonthName, getMonthsBetweenDates } from '@/utils/getMonth'
import axios from 'axios'
import moment from 'moment'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'




const Receipt = ({ queries }) => {
    const [showSliders, setShowSliders] = useState(true)
    const [receiptFeeList, setReceiptFeeList] = useState([])
    const [scale, setScale] = useState(100)
    const [marginTop, setMarginTop] = useState(0)
    const [moveX, setMoveX] = useState(0)
    const [feeStudent, setFeeStudent] = useState({})
    const router = useRouter()
    const [error, setError] = useState(false)

    useEffect(() => {
        const getStudent = async () => {
            try {
                const student = await fetchStudent(queries.studentId)
                setReceiptFeeList([])
                let classes = student.classes?.filter((c) => c.class === queries.class && c.session === queries.session)[0]
                if (classes) {
                    setReceiptFeeList(getMonthsBetweenDates(classes.started, classes.endingDate))
                    setFeeStudent(student)
                } else {
                    setError(true)
                }
            } catch (error) {
                return setError(true)

            }
        }
        getStudent()
    }, [])


    useEffect(() => {
        const callback = (event) => {
            var name = event.key;
            var code = event.code;
            if (name === 'c') {
            }
            if (name === 'k') {
                setShowSliders(prev => !prev)
            }
        }

        document.addEventListener('keydown', callback, false);

        return () => {
            document.removeEventListener('keydown', callback, false);
        }
    }, [])

    return error ? (
        <div className='w-full h-screen flex justify-center items-center flex-col'>
            <h1 className='text-red-500 text-lg'>Oops! Something went wrong. Please try again by changing some information.</h1>
            <button className='base__button mt-3' onClick={() => router.back()}>Go back</button>
        </div>
    ) : (
        <>
            <Head>
                <title>{feeStudent.name} - {feeStudent.fathername}</title>
                <meta name="description" content={'Powered by '+process.env.NEXT_PUBLIC_SCHOOL_TITLE} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href={"/favicon.ico"} />
            </Head>
            <div className="flex w-full fixed top-0 h-screen left-0 bg-white justify-center">

                <div className="flex border border-gray-200 p-3 absolute" style={{ transform: `scale(${scale}%)`, marginTop: marginTop, marginLeft: moveX }}>
                    <div className="flex flex-col w-full h-full">
                        <div className="flex items-center gap-5 justify-between">
                            <img src={feeStudent.picture} className='w-14 h-14 object-cover' alt="" />
                            <div className="flex flex-col">
                                <span className='font-semibold text-lg'>{feeStudent.name}</span>
                                <span className='text-gray-600'>{feeStudent.fathername}</span>
                            </div>
                            <div className="flex flex-col items-center mx-3">
                                <span className='text-gray-600'>{queries.class}</span>
                                <span className='text-gray-600'>{queries.session}</span>
                            </div>
                            <div className="">
                                <span className='text-lg'>{moment(new Date()).format('L')}</span>
                            </div>
                        </div>
                        <hr className='my-2' />
                        <div className="flex flex-col">
                            {receiptFeeList.map((date, i) => (
                                <ReceiptFee date={date} key={date + i} studentId={feeStudent._id} classes={queries.class} session={queries.session} />
                            ))}
                        </div>
                        <div className="flex justify-between mt-2">
                            <div className="flex">
                                <span className='text-sm'>Monthly fee: Rs.{new Intl.NumberFormat().format(feeStudent.monthlyfee)}/-</span>
                            </div>
                            <div className="flex flex-col">
                                <span className='text-sm'>Signature:</span>
                                <span>____________________</span>
                            </div>
                        </div>
                    </div>
                </div>

                {showSliders && <div className="flex mt-64 absolute bottom-0 gap-3 items-center">
                    <div className='flex items-center'>
                        Scale: <input type="range" min='0' max='200' onChange={(e) => setScale(parseInt(e.target.value))} />
                    </div>
                    <div className='flex items-center'>
                        Move Y: <input type="range" min='-300' max='300' onChange={(e) => setMarginTop(parseInt(e.target.value))} />
                    </div>
                    <div className='flex items-center'>
                        Move X:<input type="range" min='-600' max='600' onChange={(e) => setMoveX(parseInt(e.target.value))} />
                    </div>
                </div>}

            </div>
        </>
    )
}

export default Receipt

export async function getServerSideProps(context) {
    authenticate(context)
    const queries = context.query

    return {
        props: {
            queries
        }
    }
}

const ReceiptFee = ({ date, studentId, classes, session }) => {
    const [fee, setFee] = useState({})

    useEffect(() => {
        const fetchFe = async () => {
            const res = await axios.get(`/api/studentfee/getOne?studentId=${studentId}&class=${classes}&session=${session}&month=${date}`)
            if (res.data) {
                setFee(res.data)
            } else {
                setFee({})
            }
        }
        fetchFe()
    }, [])
    return (
        <div className='flex justify-between p-1 border-b border-gray-200 items-center'>
            <div className='font-semibold'>{getMonthName(date.split('-')[1])}</div>
            {Object.keys(fee).length > 0 && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
                // : (
                //     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                //         <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                //     </svg>

                // )
            }
            <div className='text-md text-gray-600'>Rs.{fee?.feeamount ? new Intl.NumberFormat().format(fee?.feeamount) : 0}/-</div>

        </div>
    )
}