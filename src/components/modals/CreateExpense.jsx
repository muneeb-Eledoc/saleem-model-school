import React, { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ExpenseSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    amount: Yup.number()
        .required('Amount is required')
        .positive('Amount must be positive')
});

const initialValues = {
    title: '',
    description: '',
    amount: ''
};

const CreateExpense = ({ setShowCreateExpense, setExpenses }) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [])

    const addExpense = async (data) => {
        const res = await axios.post('/api/expense/create', {...data, campus: localStorage.getItem('campus')})
        return res.data
    }

    return (
        <div className='fixed top-0 left-0 w-full z-50 h-screen overflow-auto flex justify-center bg-black bg-opacity-60 backdrop-blur-sm'>
            <div className='w-full md:w-1/2 lg:w-1/3 bg-white md:my-10 h-fit scale-up rounded-lg'>
                <div className="flex justify-between items-center border-b border-gray-200 px-5 py-3">
                    <h1 className='font-semibold tracking-widest  md:text-lg lg:text-xl'>Add Expense</h1>

                    <div onClick={() => setShowCreateExpense(false)} className='bg-gray-50 p-2 rounded-full text-gray-700 cursor-pointer hover:scale-125 active:scale-90 transition-all duration-200 ease-in-out'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
                <div className="flex p-5">

                    <Formik
                        initialValues={initialValues}
                        validationSchema={ExpenseSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            const loading = toast.loading('loading...')
                            addExpense(values).then((expense) => {
                                setExpenses(prev=> [...prev, expense])
                                toast.success('The given task has been completed successfully.',{id:loading})
                                resetForm();
                                setShowCreateExpense(false);
                            }).catch((error) => {
                                console.log(error)
                                toast.error('Something went wrong.', {id:loading})
                            })
                            setSubmitting(false);
                        }}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form className='flex flex-col gap-3 w-full'>
                                <div className='flex flex-col'>
                                    <label className='font-medium' htmlFor="title">Title</label>
                                    <Field className='base__input' type="text" name="title" />
                                    <p className="form__error"><ErrorMessage name="title" /></p>
                                </div>
                                <div className='flex flex-col'>
                                    <label className='font-medium' htmlFor="description">Description</label>
                                    <Field className='base__input' type="text" name="description" />
                                    <p className="form__error"><ErrorMessage name="description" /></p>
                                </div>
                                <div className='flex flex-col'>
                                    <label className='font-medium' htmlFor="amount">Amount</label>
                                    <Field className='base__input' type="number" name="amount" />
                                    <p className="form__error"><ErrorMessage name="amount" /></p>
                                </div>
                                <div>
                                    <button className='base__button mt-2' type="submit" disabled={isSubmitting}>
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

export default CreateExpense