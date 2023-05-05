import React, { useContext, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AuthContext } from '@/context/authcontext/AuthContext';

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    phoneNumber: Yup.number().required("Phone number is required"),
    whatsappnumber: Yup.number().required("Whatsapp number is required"),
    password: Yup.string().required("Password is required"),
    campus: Yup.string()
});

const initialValues = {
    name: "",
    email: "",
    phoneNumber: "",
    whatsappnumber: "",
    password: "",
    campus: ""
};


const CreateEmployee = ({ setShowcreate }) => {
    const {campuses} = useContext(AuthContext)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [])

    const addEmployee = async (data)=>{
        
        if(!data) return

        const res = await axios.post('/api/employee/create', data)
        return res.data
    }


    return (
        <div className='fixed animate-bg-opacity top-0 left-0 w-full z-50 h-screen overflow-auto flex justify-center bg-black bg-opacity-60 backdrop-blur-sm'>
            <div className='w-full lg:w-1/2 bg-white md:my-10 h-fit scale-up'>
                <div className="flex justify-between items-center border-b border-gray-200 px-5 py-3">
                    <h1 className='font-semibold tracking-widest  md:text-lg lg:text-xl'>Add Employee</h1>

                    <div onClick={() => setShowcreate(false)} className='bg-gray-50 p-2 rounded-full text-gray-700 cursor-pointer hover:scale-125 active:scale-90 transition-all duration-200 ease-in-out'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
                <div className="flex p-5">

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            let loading = toast.loading('loading...')
                            addEmployee(values).then(res=>{
                                toast.success('Employee successfully added.', {id:loading})
                                resetForm()
                                setSubmitting(false);
                            }).catch(e=>{
                                toast.error(e.response.data.message, {id:loading})
                                setSubmitting(false);
                            })
                        }}
                    >
                        {({ isSubmitting, isValid }) => (
                            <Form className='grid grid-cols-1 md:grid-cols-2 gap-3 w-full'>
                                <div className='flex flex-col'>
                                    <label htmlFor="name">Name</label>
                                    <Field className='base__input' type="text" id="name" name="name" />
                                    <p className='form__error'><ErrorMessage name="name" /></p>
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="email">Email</label>
                                    <Field className='base__input' type="email" id="email" name="email" />
                                    <p className='form__error'><ErrorMessage name="email" /></p>
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <Field className='base__input' type="number" id="phoneNumber" name="phoneNumber" />
                                    <p className='form__error'><ErrorMessage name="phoneNumber" /></p>
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="whatsappnumber">WhatsApp Number</label>
                                    <Field className='base__input' type="number" id="whatsappnumber" name="whatsappnumber" />
                                    <p className='form__error'><ErrorMessage name="whatsappnumber" /></p>
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="password">Password</label>
                                    <Field className='base__input' type="password" id="password" name="password" />
                                    <p className='form__error'><ErrorMessage name="password" /></p>
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="campus">Campus (optional)</label>
                                    <Field className='base__input' as="select" id="campus" name="campus">
                                        <option value="">Select a campus</option>
                                        {campuses.map((c)=>(
                                            <option value={c.title}>{c.title}</option>
                                        ))}                                    </Field>
                                    <p className='form__error'><ErrorMessage name="campus" /></p>
                                </div>
                                <div>
                                    <button className='base__button' type="submit" disabled={!isValid||isSubmitting}>
                                        Submit
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div >
            </div >
        </div >
    )
}

export default CreateEmployee