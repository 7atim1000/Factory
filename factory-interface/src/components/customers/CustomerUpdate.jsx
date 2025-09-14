import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../https';
import { toast } from 'react-toastify'
import { IoCloseCircle } from 'react-icons/io5';

const CustomerUpdate = ({ customer, setIsEditCustomerModal, fetchCustomers }) => {
    const handleClose = () => {
        setIsEditCustomerModal(false)
    };

    // Replaced multiple useState hooks with a single formData state object in transactionUpdate
    // Added proper handleInputChange function that works for all inputs in transactionUpdate
    // Fixed radio button values and handlers - now using formData.type 
    // Added safety checks for incomes and expenses arrays (incomes && incomes.map)
    // Fixed the API call to send formData directly instead of FormData
    // Corrected input names and types
    // Added status dropdown (was in state but not in the form)  All that in transactionUpdate not here 
    const [customerName, setCustomerName] = useState(customer.customerName);
    const [email, setEmail] = useState(customer.email);
    const [contactNo, setContactNo] = useState(customer.contactNo);
    const [address, setAddress] = useState(customer.address);
    const [balance, setBalance] = useState(customer.balance);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();

            formData.append('customerName', customerName);
            formData.append('email', email);
            formData.append('contactNo', contactNo);
            formData.append('address', address);
            formData.append('balance', balance);
            
            const { data } = await api.put(`/api/customer/${customer._id}`, formData
            //     {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     }
            // }
        );

            if (data.success) {
                // toast.success(data.message);
                toast.success('تم تعديل بيانات العميل بنجاح')
                fetchCustomers();
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
        <div dir='rtl' className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/30 z-50'
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
                    <h2 className='text-[#1a1a1a] text-sm font-bold'>تعديل بيانات عميل</h2>
                    <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
                                     border-b border-[#be3e3f]'>
                        <IoCloseCircle size={22} />
                    </button>
                </div>


                {/*Modal Body*/}
                <form className='mt-3 space-y-6' onSubmit={onSubmitHandler}>
            
                    <div className='flex items-center justify-between'>
                        <label className='w-[20%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-normal'>اسم العميل :</label>
                        <div className='w-[80%] flex items-center rounded-xs p-3  bg-white shadow-xl'>
                            <input
                                type='text'

                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}

                                placeholder='اسم العميل'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
                                             border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>


                    <div className='flex items-center justify-between'>
                        <label className='w-[20%] text-black block mb-2 mt-3 text-xs font-normal'>البريد اللاكتروني :</label>
                        <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='email'

                                value={email}
                                onChange={(e) => setEmail(e.target.value)}

                                placeholder='البريد اللاكتروني'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
                                border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                        <label className='w-[20%] text-black block mb-2 mt-3 text-xs font-normal'>العنوان :</label>
                        <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='text'

                                value={address}
                                onChange={(e) => setAddress(e.target.value)}

                                placeholder='عنوان العميل'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
                                             border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                        <label className='w-[20%] text-black block mb-2 mt-3 text-xs font-normal'>رقم الهاتف :</label>
                        <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='text'

                                value={contactNo}
                                onChange={(e) => setContactNo(e.target.value)}

                                placeholder='رقم هاتف العميل'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
                                             border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                        <label className='w-[20%] text-black block mb-2 mt-3 text-xs font-normal'>الرصيد :</label>
                        <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='text'

                                value={balance}
                                onChange={(e) => setBalance(e.target.value)}

                                placeholder='Enter customer balance'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
                                    border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>


                   

                    <button
                        type='submit'
                        className='p-3 rounded-xs mt-3 py-3 text-sm bg-[#0ea5e9] text-white font-semibold 
                                 cursor-pointer '
                    >
                        تعديل
                    </button>


                </form>

            </motion.div>
        </div>

    );
};


export default CustomerUpdate ;