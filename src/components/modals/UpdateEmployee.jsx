import React, { useContext, useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/utils/firebase';
import { BarLoader } from 'react-spinners';
import { deleteFile } from '@/utils/deleteFile';
import { AuthContext } from '@/context/authcontext/AuthContext';

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    phoneNumber: Yup.number().required("Phone number is required"),
    whatsappnumber: Yup.number().required("Whatsapp number is required"),
    password: Yup.string().required("Password is required"),
    campus: Yup.string(),
    isAdmin: Yup.boolean()
});


const UpdateEmployee = ({ setEmployeeToUpdate, employeeToUpdate, setEmployees, employees }) => {
    const initialValues = {
        name: employeeToUpdate.name,
        email: employeeToUpdate.email,
        phoneNumber: employeeToUpdate.phoneNumber,
        whatsappnumber: employeeToUpdate.whatsappnumber,
        password: employeeToUpdate.password,
        campus: employeeToUpdate.campus,
        isAdmin: employeeToUpdate.isAdmin
    };

    const [passwordType, setPasswordType] = useState('password')
    const [file, setFile] = useState(null)
    const [progress, setProgress] = useState(0)
    const { campuses } = useContext(AuthContext)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [])


    const handleUpload = async () => {

        if (!file) return
        let filename = (new Date().getTime()).toString() + file.name
        const storageRef = ref(storage, 'students/' + filename);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const fprogress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                if (fprogress > 0) {
                    setProgress(fprogress)
                }
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                console.log(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    const res = await axios.put('/api/employee/update?employeeId=' + employeeToUpdate._id, {
                        picture: downloadURL
                    })
                    if (res.data) {
                        if (employeeToUpdate.picture) {
                            deleteFile(employeeToUpdate.picture)
                                .then(() => {
                                }).catch((e) => {
                                })
                        }
                        setEmployeeToUpdate(prev => {
                            return {
                                ...prev,
                                picture: res.data.picture
                            }
                        })
                        let newEmployees = employees.filter(e => e._id !== employeeToUpdate._id)
                        setEmployees([...newEmployees, res.data])
                        setProgress(0)
                        setFile(null)
                    }
                });
            }
        );
    }

    const updateEmployee = async (data) => {
        try {
            const res = await axios.put('/api/employee/update?employeeId=' + employeeToUpdate._id, data);
            return res.data;
        } catch (error) {
            toast.error('somthing went wrong.')
        }
    }


    return (
        <div className='fixed animate-bg-opacity top-0 left-0 w-full z-50 h-screen overflow-auto flex justify-center bg-black bg-opacity-60 backdrop-blur-sm'>
            <div className='w-full lg:w-1/2 bg-white md:my-10 h-fit scale-up'>
                <div className="flex justify-between items-center border-b border-gray-200 px-5 py-3">
                    <h1 className='font-semibold flex items-center gap-2 tracking-widest  md:text-lg lg:text-xl'>
                        <img className='w-10 h-10 rounded shadow object-cover' src={employeeToUpdate.picture ? employeeToUpdate.picture : '/avatar.png'} alt={employeeToUpdate.name} />
                        <span>{employeeToUpdate.name}</span>
                    </h1>

                    <div onClick={() => setEmployeeToUpdate({})} className='bg-gray-50 p-2 rounded-full text-gray-700 cursor-pointer hover:scale-125 active:scale-90 transition-all duration-200 ease-in-out'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
                <div className="flex p-5 flex-col gap-3">

                    <div className="flex gap-3 items-center">
                        <div className='flex flex-col'>
                            <img className='w-20 h-20 object-cover rounded' src={employeeToUpdate.picture ? employeeToUpdate.picture : '/avatar.png'} alt={employeeToUpdate.name} />
                            {progress > 0 && <div className='flex mt-1'>
                                <BarLoader color="#36d7b7" width={80} />
                            </div>}
                        </div>
                        {file &&
                            <div className='relative'>
                                <img className='w-20 h-20 shadow rounded object-cover hover:scale-150 transition-all duration-300 cursor-pointer hover:m-5' src={URL.createObjectURL(file)} alt="" />
                                <div onClick={() => setFile(null)} className="absolute -top-2 -right-2 p-[3px] text-white bg-black bg-opacity-30">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                        }
                        {!file ? <><label className='base__button cursor-pointer' htmlFor='file'>Select</label>
                            <input type="file" onChange={(e) => setFile(e.target.files[0])} className='hidden' id='file' accept='png,jpg,jpeg' />
                        </> : <button className='base__button' onClick={handleUpload}>{progress > 0 && (progress) + '%'} Upload</button>}

                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting, resetForm, setValues }) => {
                            let loading = toast.loading('loading...')
                            updateEmployee(values).then(res => {

                                let newEmployees = employees.filter(e => e._id !== employeeToUpdate._id)
                                setEmployees([...newEmployees, res])
                                setEmployeeToUpdate(res)
                                toast.success('Employee successfully updated.', { id: loading })
                                setValues(res)
                                setSubmitting(false);
                            }).catch(e => {
                                console.log(e)
                                toast.error(e.response?.data?.message, { id: loading })
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
                                    <Field disabled className='base__input disabled:text-gray-500' type="email" id="email" name="email" />
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
                                    <div className='flex flex-col relative'>
                                        <Field className='base__input' type={passwordType} id="password" name="password" />
                                        <div onClick={() => setPasswordType(prev => prev === 'password' ? 'text' : 'password')} className="absolute top-[14px] right-3 cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className='form__error'><ErrorMessage name="password" /></p>
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="campus">Campus (optional)</label>
                                    <Field className='base__input' as="select" id="campus" name="campus">
                                        <option value="">Select a campus</option>
                                        {campuses.map((c) => (
                                            <option value={c.title}>{c.title}</option>
                                        ))}
                                    </Field>
                                    <p className='form__error'><ErrorMessage name="campus" /></p>
                                </div>
                                <div className='flex flex-col items-start gap-3'>
                                <div className='flex items-center'>
                                    <Field className="w-5 h-5" type="checkbox" name="isAdmin" />
                                    <span className='ml-3 font-roboto'>is Admin</span>
                                </div>
                                    <button className='base__button' type="submit" disabled={!isValid || isSubmitting}>
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

export default UpdateEmployee