import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../https';
import { toast } from 'react-toastify'
import { IoCloseCircle } from 'react-icons/io5';

const SupplierEdit = ({ supplier, setIsEditSupplierModal, fetchSuppliers }) => {
    const handleClose = () => {
        setIsEditSupplierModal(false)
    };

    const [supplierName, setSupplierName] = useState(supplier.supplierName);
    const [email, setEmail] = useState(supplier.email);
    const [contactNo, setContactNo] = useState(supplier.contactNo);
    const [address, setAddress] = useState(supplier.address);
    const [balance, setBalance] = useState(supplier.balance);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();

            formData.append('supplierName', supplierName);
            formData.append('email', email);
            formData.append('contactNo', contactNo);
            formData.append('address', address);
            formData.append('balance', balance);
            
            const { data } = await api.put(`/api/supplier/${supplier._id}`, formData
        );

            if (data.success) {
                // toast.success(data.message);
                enqueueSnackbar('تم تعديل بيانات المورد بنجاح', { variant: "success"});
                fetchSuppliers();
                handleClose();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // The issue is that you're trying to send multipart/form-data but your backend is expecting JSON data. When you set 'Content-Type': 'multipart/form-data', the Express.js express.json() middleware can't parse the request body, so req.body becomes undefined.
    // Solution 1: Remove the headers (Use JSON) this is Json : const { data } = await api.put(`/api/customers/${customer._id}`, formData);
   
    return (
        <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/30 z-50'
            style={{ backgroundColor: 'rgba(145, 143, 143, 0.4)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ durayion: 0.3, ease: 'easeInOut' }}
                className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)]'
            >


                {/*Modal Header */}
                <div className="flex justify-between items-center mb-2 shadow-xl p-2">
                    <h2 className='text-[#1a1a1a] text-sm font-bold'>تعديل بيانات مورد</h2>
                    <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
                                     border-b border-[#be3e3f]'>
                        <IoCloseCircle size={22} />
                    </button>
                </div>


                {/*Modal Body*/}
                <form className='mt-3 space-y-6' onSubmit={onSubmitHandler}>
            
                    <div className='flex items-center justify-between'>
                        <label className='w-[25%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-normal'>اسم المورد :</label>
                        <div className='w-[75%] flex items-center rounded-xs p-3  bg-white shadow-xl'>
                            <input
                                type='text'

                                value={supplierName}
                                onChange={(e) => setSupplierName(e.target.value)}

                                placeholder='Enter supplier name'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
                                            border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>


                    <div className='flex items-center justify-between'>
                        <label className='w-[25%] text-black block mb-2 mt-3 text-xs font-normal'>البريد اللاكتروني :</label>
                        <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='email'

                                value={email}
                                onChange={(e) => setEmail(e.target.value)}

                                placeholder='Enter supplier email'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
                                border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                        <label className='w-[25%] text-black block mb-2 mt-3 text-xs font-normal'>العنوان :</label>
                        <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='text'

                                value={address}
                                onChange={(e) => setAddress(e.target.value)}

                                placeholder='Enter supplier address'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
                                             border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                        <label className='w-[25%] text-black block mb-2 mt-3 text-xs font-normal'>رقم الهاتف :</label>
                        <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='text'

                                value={contactNo}
                                onChange={(e) => setContactNo(e.target.value)}

                                placeholder='Enter supplier contact number'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
                                             border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                        <label className='w-[25%] text-black block mb-2 mt-3 text-xs font-normal'>الرصيد :</label>
                        <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='text'

                                value={balance}
                                onChange={(e) => setBalance(e.target.value)}

                                placeholder='Enter supplier balance'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
                                    border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>


                   

                    <button
                        type='submit'
                        className='p-3 w-full rounded-xs mt-3 py-3 text-sm bg-[#0ea5e9] text-white font-semibold 
                                 cursor-pointer '
                    >
                        تعديل
                    </button>


                </form>

            </motion.div>
        </div>

    );
};


export default SupplierEdit ;