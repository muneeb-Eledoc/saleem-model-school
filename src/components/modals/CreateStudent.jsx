import React, { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { toast } from 'react-hot-toast';

const studentSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    fathername: Yup.string().required("Father's name is required"),
    fathercnic: Yup.string().required("Father's CNIC is required"),
    bayformnumber: Yup.string().required('Its required'),
    address: Yup.string().required("Address is required"),
    whatsappnumber: Yup.number().required('Its required'),
    phonenumber: Yup.number().required('Its required!'),
    email: Yup.string().email("Invalid email").required("Email is required"),
    gender: Yup.string().required("Gender is required"),
    dateofbirth: Yup.string().required("Date of birth is required"),
    monthlyfee: Yup.number().required("Monthly fee is required"),
    registrationfee: Yup.number().required("Registration fee is required"),
    medium: Yup.string().required("Medium is required"),
});

const initialValues = {
    name: "",
    fathername: "",
    fathercnic: "",
    bayformnumber: "",
    address: "",
    whatsappnumber: "",
    phonenumber: "",
    email: "",
    gender: "",
    dateofbirth: "",
    monthlyfee: "",
    registrationfee: "",
    medium: "",
};


const CreateStudent = ({ setShowCreateStudent, setStudents }) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [])

    const addStudent = async (data)=>{
        const res = await axios.post('/api/student/create', {...data, campus: localStorage.getItem('campus')})
        return res.data
    }

    return (
        <div className='fixed top-0 left-0 w-full z-50 h-screen overflow-auto flex justify-center bg-black bg-opacity-60 backdrop-blur-sm'>
            <div className='w-full lg:w-1/2 bg-white md:my-10 h-fit scale-up'>
                <div className="flex justify-between items-center border-b border-gray-200 px-5 py-3">
                    <h1 className='font-semibold tracking-widest  md:text-lg lg:text-xl'>Add Student</h1>

                    <div onClick={() => setShowCreateStudent(false)} className='bg-gray-50 p-2 rounded-full text-gray-700 cursor-pointer hover:scale-125 active:scale-90 transition-all duration-200 ease-in-out'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
                <div className="flex p-5">

                    <Formik
                        initialValues={initialValues}
                        validationSchema={studentSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            const loading = toast.loading('loading...')
                            addStudent(values).then((data)=>{
                                resetForm()
                                setSubmitting(false);
                                setStudents(prev=> [...prev, data])
                                toast.success('Added successfully!', {id: loading})
                            })
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className='grid grid-cols-1 md:grid-cols-2 gap-3 w-full'>
                                <div className='mt-4 w-full flex flex-col'>
                                    <label className='font-medium' htmlFor="name">Name</label>
                                    <Field className='base__input' type="text" name="name" />
                                    <p className='form__error'><ErrorMessage name="name" /></p>
                                </div>
                                <div className='mt-4 w-full flex flex-col'>
                                    <label className='font-medium' htmlFor="fathername">Father's Name</label>
                                    <Field className='base__input' type="text" name="fathername" />
                                    <p className='form__error'><ErrorMessage name="fathername" /></p>
                                </div>
                                <div className='mt-4 w-full flex flex-col'>
                                    <label className='font-medium' htmlFor="fathercnic">Father's CNIC</label>
                                    <Field className='base__input' type="text" name="fathercnic" />
                                    <p className='form__error'><ErrorMessage name="fathercnic" /></p>
                                </div>
                                <div className='mt-4 w-full flex flex-col'>
                                    <label className='font-medium' htmlFor="bayformnumber">BAY Form Number</label>
                                    <Field className='base__input' type="text" name="bayformnumber" />
                                    <p className='form__error'><ErrorMessage name="bayformnumber" /></p>
                                </div>
                                <div className='mt-4 w-full flex flex-col'>
                                    <label className='font-medium' htmlFor="address">Address</label>
                                    <Field className='base__input' type="text" name="address" />
                                    <p className='form__error'><ErrorMessage name="address" /></p>
                                </div>
                                <div className='mt-4 w-full flex flex-col'>
                                    <label className='font-medium' htmlFor="whatsappnumber">WhatsApp Number</label>
                                    <Field className='base__input' type="number" name="whatsappnumber" />
                                    <p className='form__error'><ErrorMessage name="whatsappnumber" /></p>
                                </div>
                                <div className='mt-4 w-full flex flex-col'>
                                    <label className='font-medium' htmlFor="phonenumber">Phone Number</label>
                                    <Field className='base__input' type="number" name="phonenumber" />
                                    <p className='form__error'><ErrorMessage name="phonenumber" /></p>
                                </div>
                                <div className='mt-4 w-full flex flex-col'>
                                    <label className='font-medium' htmlFor="email">Email</label>
                                    <Field className='base__input' type="email" name="email" />
                                    <p className='form__error'><ErrorMessage name="email" /></p>
                                </div>
                                <div className='mt-4 w-full flex flex-col'>
                                    <label className='font-medium' htmlFor="gender">Gender</label>
                                    <Field className='base__input' component="select" name="gender">
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </Field>
                                    <p className='form__error'><ErrorMessage name="gender" /></p>
                                </div>
                                <div className='mt-4 w-full flex flex-col'>
                                    <label className='font-medium' htmlFor="dateofbirth">Date of Birth</label>
                                    <Field className='base__input' type="date" name="dateofbirth" />
                                    <p className='form__error'><ErrorMessage name="dateofbirth" /></p>
                                </div>
                                <div className='mt-4 w-full flex flex-col'>
                                    <label className='font-medium' htmlFor="monthlyfee">Monthly Fee</label>
                                    <Field className='base__input' type="number" name="monthlyfee" />
                                    <p className='form__error'><ErrorMessage name="monthlyfee" /></p>
                                </div>
                                <div className='mt-4 w-full flex flex-col'>
                                    <label className='font-medium' htmlFor="registrationfee">Registration Fee</label>
                                    <Field className='base__input' type="number" name="registrationfee" />
                                    <p className='form__error'><ErrorMessage name="registrationfee" /></p>
                                </div>
                                <div className='mt-4 w-full flex flex-col'>
                                    <label className='font-medium' htmlFor="medium">Medium</label>
                                    <Field className='base__input' component="select" name="medium">
                                        <option value="">Select Medium</option>
                                        <option value="English">English</option>
                                        <option value="Urdu">Urdu</option>
                                    </Field>
                                    <p className='form__error'><ErrorMessage name="medium" /></p>
                                </div>
                                <br />
                                <div className='mt-4'>
                                    <button className='base__button' type="submit" disabled={isSubmitting}>
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

export default CreateStudent