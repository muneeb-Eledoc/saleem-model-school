import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { storage } from '@/utils/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { BarLoader } from 'react-spinners';
import ClassForm from './forms/ClassForm';
import { deleteFile } from '@/utils/deleteFile';

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
    isActive: Yup.boolean()
});

const ViewStudent = ({ setViewStudent, viewStudent }) => {
    let initialValues = {
        name: viewStudent.name,
        fathername: viewStudent.fathername,
        fathercnic: viewStudent.fathercnic,
        bayformnumber: viewStudent.bayformnumber,
        address: viewStudent.address,
        whatsappnumber: viewStudent.whatsappnumber,
        phonenumber: viewStudent.phonenumber,
        email: viewStudent.email,
        gender: viewStudent.gender,
        dateofbirth: viewStudent.dateofbirth,
        monthlyfee: viewStudent.monthlyfee,
        registrationfee: viewStudent.registrationfee,
        medium: viewStudent.medium,
        isActive: viewStudent.isActive
    };
    const [file, setFile] = useState(null)
    const [progress, setProgress] = useState(0)

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

            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    const res = await axios.put('/api/student/update?studentId=' + viewStudent._id, {
                        picture: downloadURL
                    })
                    if (res.data) {
                        if (viewStudent.picture) {
                            deleteFile(viewStudent.picture)
                                .then(() => {
                                }).catch((e) => {
                                })
                        }
                        setViewStudent(prev => {
                            return {
                                ...prev,
                                picture: res.data.picture
                            }
                        })
                        setProgress(0)
                        setFile(null)
                    }
                });
            }
        );
    }

    const updateStudent = async (data) => {
        const res = await axios.put('/api/student/update?studentId=' + viewStudent._id, data);
        if (res.data) {
            setViewStudent(res.data)
        }
        return res.data;
    }

    return (
        <div className='fixed animate-bg-opacity top-0 w-full z-50 h-screen overflow-auto flex justify-center bg-black bg-opacity-60 backdrop-blur-sm'>
            <div className='w-full lg:w-2/3 bg-white md:my-10 h-fit scale-up'>
                <div className="flex justify-between items-center border-b border-gray-200 px-5 py-3">
                    <h1 className='font-semibold tracking-widest flex items-center gap-3 md:text-lg'>
                        <img className='w-10 h-10 rounded object-cover' src={viewStudent.picture} alt="" /> {viewStudent.name}
                    </h1>

                    <div onClick={() => setViewStudent({})} className='bg-gray-50 p-2 rounded-full text-gray-700 cursor-pointer hover:scale-125 active:scale-90 transition-all duration-200 ease-in-out'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
                <div className="flex p-5 flex-col">
                    <div className="flex items-center space-x-3">
                        <img className='w-20 h-20 shadow rounded object-cover hover:scale-150 transition-all duration-300 cursor-pointer hover:m-5' src={viewStudent.picture ? viewStudent.picture : "/avatar.png"} alt="" />
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
                    {progress > 0 && <div className='flex'>
                        <BarLoader color="#36d7b7" width={80} />
                    </div>}
                    <Formik
                        initialValues={initialValues}
                        validationSchema={studentSchema}
                        onSubmit={(values, { setSubmitting, resetForm, setValues }) => {
                            updateStudent(values).then((data) => {
                                setValues(data)
                                // resetForm()
                                setSubmitting(false);
                            })
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full'>
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
                                <div></div>
                                <div></div>
                                <div className='mt-3'>
                                    <div className='flex items-center'>
                                    <Field className="w-5 h-5" type="checkbox" name="isActive" />
                                        <span className='ml-3 font-roboto'>is Active</span>
                                    </div>
                                    <div>
                                        <p className='form__error'><ErrorMessage name="isActive" /></p>
                                    </div>


                                    <button className='base__button mt-3' type="submit" disabled={isSubmitting}>
                                        Update
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    <hr className='my-3' />
                    <h1 className='text-xl font-roboto'>Add Class</h1>
                    <div className='flex'>
                        <div className="flex my-3">
                            <ClassForm student={viewStudent} />
                        </div>
                    </div>
                </div >
            </div >
        </div >
    )
}

export default ViewStudent