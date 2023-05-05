import { AuthContext } from '@/context/authcontext/AuthContext';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from "yup";

const classSchema = Yup.object().shape({
    class: Yup.string().required("Class is required"),
    session: Yup.string().required("Session is required"),
    started: Yup.string().required("Started Date is required"),
    endingDate: Yup.string().required("Ending Date is required"),
});

function ClassForm({ student: stu }) {
    const [student, setStudent] = useState(stu)
    const {classes} = useContext(AuthContext)

    const createClass = async (data) => {
        const res = await axios.put('/api/student/addClass', { ...data, studentId: student._id })
        return res.data
    }

    const handleDelete = async(c)=>{
        const loading = toast.loading('loading...')
        const res = await axios.delete(`/api/student/addClass?studentId=${student._id}&class=${c.class}&session=${c.session}&started=${c.started}&endingDate=${c.endingDate}`)
        setStudent(res.data)
        toast.success('Class has been removed.', {id:loading})
    }

    return (
        <div className='flex flex-col'>
            <Formik
                initialValues={{ class: '', session: '', started: '', endingDate: ''}}
                validationSchema={classSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    const loading = toast.loading('loading...')
                    createClass(values)
                        .then((res) => {
                            setStudent(res)
                            resetForm()
                            toast.success('Class has been added.', {id:loading})
                            setSubmitting(false)
                        }).catch(e => {
                            setSubmitting(false)
                            toast.error(e.response.data.message, {id:loading});
                        })
                }}
            >
                {({ isSubmitting }) => (
                    <Form className='flex gap-3 flex-wrap items-start'>
                        <div className='flex flex-col'>
                            <Field as="select" className='base__select' name="class" id="class">
                                <option value="">Select a class...</option>
                                {classes.map((c, i) => (
                                        <option key={i} value={c.title}>{c.title}</option>
                                    ))}
                            </Field>
                            <p className='form__error'><ErrorMessage name="class" /></p>

                        </div>

                        <div className="flex flex-col">
                            <Field as="select" className='base__select' name="session" id="session">
                                <option value="">Select Session</option>
                                <option value="2023-2024">2023-2024</option>
                                <option value="2024-2025">2024-2025</option>
                                <option value="2025-2026">2025-2026</option>
                                <option value="2026-2027">2026-2027</option>
                                <option value="2027-2028">2027-2028</option>
                                <option value="2028-2029">2028-2029</option>
                                <option value="2029-2030">2029-2030</option>
                                <option value="2030-2031">2030-2031</option>
                            </Field>
                            <p className='form__error'><ErrorMessage name="session" /></p>
                        </div>

                        <div className="flex flex-col">
                            <Field type='date' className='base__select' name="started" />
                            <p className='form__error'><ErrorMessage name="started" /></p>
                        </div>

                        <div className="flex flex-col">
                            <Field type='date' className='base__select' name="endingDate" />
                            <p className='form__error'><ErrorMessage name="endingDate" /></p>
                        </div>

                        <button type="submit" className='base__button' disabled={isSubmitting}>
                            Add
                        </button>
                    </Form>)}
            </Formik>
            <hr className='my-3' />
            <div className="flex flex-wrap">
                {student?.classes?.map((c) => (
                    <div className='flex cursor-default relative m-2 flex-col group space-y-1 shadow-md border border-gray-100 px-4 py-2 rounded-md' key={c.class + c.session}>
                        <div className="flex font-roboto">
                            {c.class}
                        </div>
                        <div className="flex text-gray-600">
                            {c.session}
                        </div>
                        <div className="flex text-gray-500 text-xs">
                            {c.started}
                        </div>
                        <div className="flex text-gray-500 text-xs">
                            {c.endingDate}
                        </div>
                        <div onClick={()=> handleDelete(c)} className="absolute cursor-pointer bottom-1 right-0 scale-0 group-hover:scale-100 transition-all duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-red-600 p-1 rounded-md shadow-md">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ClassForm