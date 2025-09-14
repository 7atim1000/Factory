import React, { useState } from 'react'

import { enqueueSnackbar } from 'notistack';
import { motion } from 'framer-motion'
import { IoCloseCircle } from "react-icons/io5";

import { useSelector } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import { addInvoice, addTransaction, updateCustomer } from '../../https';
import { toast } from 'react-toastify'
import PaymentInvoice from './PaymentInvoice';


const CustomerPayment = ({setIsPaymentModal, fetchCustomers}) => {
    const customerData = useSelector((state) => state.customer);
    const userData = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        payed : 0 ,  description :''  ,  
        // date: new Date().toISOString().slice(0, 10)
        // date :new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)
        date: new Date().toISOString().slice(0, 10)
       
    });

    // to set date and no shift 
    // Before sending to backend
    const localDate = formData.date; // e.g. "2025-06-20"
    //const utcDate = new Date(localDate + 'T00:00:00Z').toISOString().slice(0, 10);
    // Use utcDate instead of formData.date
        
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name] : value}));
    };
    
    const handleClose = () => {
        setIsPaymentModal(false)
    };


    ///////////////////////////

    const [paymentMethod, setPaymentMethod] = useState();
      
    //  Invoice
    const [paymentInvoice, setPaymentInvoice] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState();
    /////////////////



    const handlePlaceOrder = async () => {

        if (!paymentMethod) {
            toast.warning('Please select payment method !')
            return;
        }
         if (formData.payed === 0) {
            enqueueSnackbar('please specify amount', { variant: "warning" });
            return;
        }

        if (paymentMethod === "Cash" || paymentMethod === 'Online') {

            const paymentOrderData = {

                invoiceNumber : `${Date.now()}`,
                type :'customersPayment',
                invoiceStatus: "Completed",
                invoiceType: "customersPayment",

                customer: customerData.customerId,
                customerName : customerData.customerName ,

                supplier : null, supplierName : null, 


                beneficiary: customerData.customerId,

                // to save TOTALS   || NEEDED  
                buyBills: {
                    total: 0,
                    tax: 0,
                    totalWithTax: 0,
                    payed: 0,
                    balance: 0
                },          

                saleBills: {
                    total: 0,
                    tax: 0,
                    totalWithTax: 0,
                    payed : formData.payed,
                    balance: (customerData.balance - formData.payed)
                },
                bills: {
                    total: 0,
                    tax: 0,
                    totalWithTax: 0,
                    payed : formData.payed,
                    balance: (customerData.balance - formData.payed)
                },

                // to save New Items || NEEDED
                items: null,
                paymentMethod: paymentMethod,

                // date :  new Date(formData.date + 'T00:00:00Z').toISOString().slice(0, 10)
                date :formData.date,

                user: userData._id,

            };

            setTimeout(() => {
                paymentMutation.mutate(paymentOrderData);
            }, 1500);

        }
    };

    const paymentMutation = useMutation({
        mutationFn: (reqData) => addInvoice(reqData),

        onSuccess: (resData) => {
            const { data } = resData.data; // data comes from backend ... resData default on mutation
            console.log(data);

            setPaymentInfo(data)  // to show details in report            

            toast.success('تم تأكيد دفعيه العميل .');

            // transfer to financial 
             const transactionData = {   
                
                transactionNumber :`${Date.now()}`,
                amount :formData.payed,
                type :'Income',
                category :'customerPayment',
                refrence :'-',
                description : '-',
                date : formData.date
                    
                }
    
                setTimeout(() => {
                    transactionMutation.mutate(transactionData)
                }, 1500)


           

            // Update customer 
            const balanceData = {
                balance: customerData.balance - formData.payed,
                customerId: customerData.customerId  
            }

            setTimeout(() => {
                customerUpdateMutation.mutate(balanceData)
            }, 1500)

            setPaymentInvoice(true); // to open report 
            setPaymentMethod('')

        },


        onError: (error) => {
            console.log(error);
        }
    });

    // update Customer balance ...

    const customerUpdateMutation = useMutation({

        mutationFn: (reqData) => updateCustomer(reqData),
        onSuccess: (resData) => {
            console.log(resData);

        },
        onError: (error) => {
            console.log(error)
        }
    });

    // add transaction  ...
    const transactionMutation = useMutation({
        mutationFn: (reqData) => addTransaction(reqData),

        onSuccess: (resData) => {
            const { data } = resData.data; // data comes from backend ... resData default on mutation
            //console.log(data);       
            toast.success('تم ترحيل الاجراء ومبلغ الايراد للماليه .');
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const cancelPayment = () => {
        setPaymentMethod('');
        setFormData({
            payed : 0 , description : '' , date : new Date().toISOString().slice(0, 10)
        })
    };



    return (
        <div dir='rtl' className='fixed inset-0 bg-opacity-50 flex items-center justify-center z-50' 
        style={{ backgroundColor:  'rgba(20, 10, 10, 0.4)'}} >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ durayion: 0.3, ease: 'easeInOut' }}
                className='bg-white p-2 rounded-sm shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)]'
            >


                {/*Modal Header */}
                <div className="flex justify-between items-center mb-2 shadow-xl p-2">
                    <div className ='flex flex-col gap-2'>
                        <h2 className='text-[#1a1a1a] text-sm font-semibold'>دفعيات العملاء</h2>
                        <p className='text-xs text-[#1a1a1a] font-medium'> 
                            <span className='text-[#0ea5e9] font-normal text-xs'>دفعيات العميل : </span> 
                            {customerData.customerName}
                        </p>
                        <p className='text-xs  font-medium text-[#be3e3f]'> 
                            <span className='text-black font-normal text-xs'>رصيده الحالي : </span> 
                            {customerData.balance.toFixed(2)}
                            <span className='text-xs font-normal text-[#1a1a1a]'> ر.ع</span></p>
                    </div>
                    <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
                    border-b border-[#be3e3f]'>
                        <IoCloseCircle size={22} />
                    </button>
                </div>

                {/*Modal Body  onSubmit={handlePlaceOrder}*/}
                <form className='mt-5 space-y-6' >

                    <div className ='flex items-center justify-between'>
                        <label className='w-[20%] text-yellow-700 block text-sm font-normal'>التاريخ :</label>
                        <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='date'
                                name='date'
                                value={formData.date}
                                onChange={handleInputChange}

                                placeholder='Enter date'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
                                border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

                    <div className ='flex items-center justify-between'>
                        <label className='w-[20%] text-yellow-700 block  text-sm font-normal'>المبلغ :</label>
                        <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='text'
                                name='payed'
                                value={formData.payed}
                                onChange={handleInputChange}

                                placeholder='المبلغ المدفوع'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
                                border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>


                    <div className ='flex  items-center justify-between'>
                        <label className='w-[20%] text-yellow-700  block mb-2 mt-3 text-sm font-normal'>Descripion :</label>
                        <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='text'
                                name='description'
                                value={formData.description}
                                onChange={handleInputChange}

                                placeholder='الوصف ان وجد'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
                                border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

                    <div className ='flex items-center justify-between mt-15 mx-10 p-3 shadow-xl'>
                       
                        <div className='flex flex-col gap-3 p-2'>
                        
                        <button className={`text-[#1a1a1a] p-3 w-15 h-15 rounded-full text-sm font-semibold  
                        cursor-pointer shadow-lg/30
                        ${paymentMethod === 'Cash' ? "bg-emerald-500 text-zinc-100" : "bg-zinc-100"}`}
                                //onClick ={() => setPaymentMethod('Cash')}
                                type='button'
                                onClick={() => setPaymentMethod('Cash')}
                            >Cash
                        </button>

                        <button className={`text-[#1a1a1a] p-3 w-15 h-15 rounded-full text-sm font-semibold  
                        cursor-pointer shadow-lg/30
                            ${paymentMethod === 'Online' ? "bg-emerald-500 text-zinc-100" : "bg-zinc-100"}`}
                                onClick={() => setPaymentMethod('Online')}
                                type='button'
                            >Online
                        </button>
                        </div>

                        <div className='flex flex-col gap-3 p-2 '>
                            {/*bg-[#F6B100] */}
                            <button className='bg-[#0ea5e9] text-white p-3 w-full rounded-xs cursor-pointer
                        text-sm font-medium shadow-lg/30'
                                type='button'
                                onClick={handlePlaceOrder}
                            >تأكيد
                            </button>

                            <button className='bg-[#be3e3f]/70 text-white p-3 w-full rounded-xs cursor-pointer
                        text-sm font-medium shadow-lg/30'
                                type='button'
                                onClick={cancelPayment}
                            >الغاء
                            </button>
                        </div>


                    </div>
                  

                     

                    {paymentInvoice && (
                        <PaymentInvoice 
                        paymentInfo ={paymentInfo} 
                        setPaymentInvoice ={setPaymentInvoice}
                        fetchCustomers ={fetchCustomers}
                        />
                    )}

                </form>
            </motion.div>
        </div>

    );
};


export default CustomerPayment ;
