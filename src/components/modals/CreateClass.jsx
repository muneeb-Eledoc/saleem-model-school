import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "@/context/authcontext/AuthContext";

const ClassSchema = Yup.object().shape({
    title: Yup.string()
        .required("Title is required"),
    campus: Yup.string()
        .required("Campus is required"),
});


const CreateClass = ({ setShowCreateClass, setClasses }) => {
    const { campuses } = useContext(AuthContext)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [])

    const addClass = async (data) => {
        let loading = toast.loading('loading...')
        const res = await axios.post('/api/classes/create', data)
        setClasses(prev => [...prev, res.data])
        toast.success('Added...', { id: loading })
        setShowCreateClass(false)
    }

    return (
        <div className='fixed top-0 left-0 w-full z-50 h-screen overflow-auto flex justify-center bg-black bg-opacity-60 backdrop-blur-sm'>
            <div className='w-full lg:w-1/3 bg-white md:my-10 h-fit scale-up'>
                <div className="flex justify-between items-center border-b border-gray-200 px-5 py-3">
                    <h1 className='font-semibold tracking-widest  md:text-lg lg:text-xl'>Add Class</h1>

                    <div onClick={() => setShowCreateClass(false)} className='bg-gray-50 p-2 rounded-full text-gray-700 cursor-pointer hover:scale-125 active:scale-90 transition-all duration-200 ease-in-out'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
                <div className="flex p-5">
                    <Formik
                        initialValues={{ title: "" }}
                        validationSchema={ClassSchema}
                        onSubmit={(values) => {
                            addClass(values)
                        }}
                    >
                        {({ errors, touched }) => (
                            <Form className='w-full flex flex-col gap-3'>
                                <div className="flex flex-col">
                                    <label htmlFor="title">Title*</label>
                                    <Field className='base__input' type="text" id="title" name="title" />
                                    <p className='form__error'><ErrorMessage className='form__error' name="title" /></p>
                                </div>
                                <div className='flex flex-col'>
                                    <label htmlFor="campus">Campus</label>
                                    <Field className='base__input' as="select" id="campus" name="campus">
                                        <option value="">Select a campus</option>
                                        {campuses.map((c) => (
                                            <option key={c} value={c.title}>{c.title}</option>
                                        ))}                                    </Field>
                                    <p className='form__error'><ErrorMessage name="campus" /></p>
                                </div>
                                <div>
                                    <button type="submit" className='base__button mt-4' disabled={Object.keys(errors).length > 0}>
                                        Add Class
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

export default CreateClass