import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'


import { GrInProgress } from 'react-icons/gr';
import { FaCheckCircle } from "react-icons/fa";

import { GiSunflower } from "react-icons/gi";
import { MdOutlineNightlightRound } from "react-icons/md";

import { getAvatarName } from '../../utils';
import { api } from '../../https';

const  HomeInvoicesList = () => {

    // fetch 
    const [allInvoices, setAllInvoices] = useState([]);

    const [frequency, setFrequency] = useState('1');
    const [type, setType] = useState('bills');
    const [invoiceType, setInvoiceType] = useState('Sale invoice');
    const [invoiceStatus, setInvoiceStatus] = useState('all');
    const [customer, setCustomer] = useState('all');
    const [supplier, setSupplier] = useState('all');
    const [shift, setShift] = useState('all');

    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');
            
    // Add this function inside your component (before return)
    function getCurrentShift() {
        const hour = new Date().getHours();
        // Example: Morning = 6:00-17:59, Evening = 18:00-5:59
        return (hour >= 6 && hour < 18) ? 'Morning' : 'Evening';
    }

    useEffect(() => {
      
    const getInvoices = async () => {
        try {
      
            const res = await api.post('/api/invoice/fetch' , 
                {
                    type,
                    frequency,
                    invoiceType,
                    invoiceStatus,
                    customer,
                    supplier,
                    shift,

                    search,
                    sort,
                    
                    page: 1,
                    limit: 1000
                });
                  
                setAllInvoices(res.data)
                console.log(res.data)
            if (res.data.success) {
                setAllInvoices(res.data.data || []);

            } else {
                toast.error(res.data.message || 'invocies not found')
            }
               
      
              } catch (error) {
                  console.log(error)
                  message.error('Fetch Issue with transaction')
                  
              }
          };
      
        getInvoices();
      }, [type, frequency, invoiceType, invoiceStatus, shift, search, sort]); 

    return (
       
        <div className ='mt-1 px-0 '>
            
            <div className ='h-[calc(100vh-7rem)] bg-white w-full rounded-xl shadow-lg mt-0 overflow-y-scroll scrollbar-hidden'>

                {/*Address [#025cca] */}
                {/* <div className ='flex justify-between items-center px-2 py-2 '> */}
                <div className="flex flex-col md:flex-col md:justify-between md:items-center px-2 py-2 gap-2">

                   <h1 className ='text-[#1a1a1a] text-sm    font-semibold'>مبيعات اليوم</h1>
                    
                   
                   <div className ='flex items-center justify-between px-5 py-2 shadow-xl'>
                    <div className ='flex items-center gap-2 '>
                        <label htmlFor ='frequency' className ='text-xs text-[#0ea5e9] font-normal'>التاريخ</label>
                        <select id ='frequency' value ={frequency} onChange = {(e) => setFrequency(e.target.value)} 
                            className ='px-2 py-1 text-sm shadow-lg/30'>
                            <option value ='1'>Today</option>
                            <option value ='7'>7 Days</option>
                            <option value ='30'>30 Days</option>
                            <option value ='90'>90 Day</option>
                        </select>
                      
                        <label htmlFor ='orderSatus' className ='text-xs text-[#0ea5e9] font-normal'>الحاله</label>
                        <select id ='orderStatus' value ={invoiceStatus} onChange ={(e) => setInvoiceStatus(e.target.value)} 
                            className ='px-2 py-1 text-sm shadow-lg/30'>
                            <option value ='all'>All</option>
                            <option value ='In Progress'>In Progess</option>
                            <option value ='Completed'>Completed</option>
                            <option value ='Cancelled'>Cancelled</option>
                            <option value ='Pending'>Pending</option>

                        </select>
                      
                        <label htmlFor ='shift' className ='text-xs text-[#0ea5e9] font-normal'>الورديه</label>
                        <select id ='shift' value ={shift} onChange ={(e) => setShift(e.target.value)}
                            className ='px-2 py-1 text-sm shadow-lg/30'>
                            <option value ='all'>All</option>
                            <option value = 'Morning'>Morning</option>
                            <option value = 'Evening'>Evening</option>
                        </select>   
                    </div>
                </div>
                   
                </div>

                {/*Sales list */}

                <div className ='mt-3 px-1 overflow-y-scroll  scrollbar-hide scrollbar-hidden bg-white shadow-xl'>
                
                {allInvoices.length === 0 
                ? (<p className ='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>قائمه مبيعات اليوم فارغه حاليا !</p>) 
                :allInvoices.map((invoice, index) => (
                      
                       <div className='flex px-1 items-center gap-5 mb-2 bg-white rounded-lg shadow-lg/30'>

                        <div className='flex justify-between items-center w-[100%] '>
                            
                            <div className ='flex justify-start gap-2'>
                                <p className ='text-black text-xs font-normal'>{new Date(invoice.date).toLocaleDateString('en-GB')}</p>
                                <p className ={`${invoice.shift === 'Evening' ? 'text-[#0ea5e9]' : 'text-[#f6b100]'}
                                    text-xs font-medium`}>
                                    {invoice.shift}</p>
                            </div>
                     


                            <div className='flex flex-col items-start gap-1 p-1'>
                                <h1 className='text-[#1a1a1a] text-xs font-semibold tracking-wide'>

                                    {invoice.customer === null ? 'N/A' : invoice.customerName}
                                </h1>
                                <p className='text-green-600 text-xs'>{invoice.items.length} صنف</p>
                                <p className='text-[#0ea5e9] text-xs'><span className ='text-xs text-[#1a1a1a]'>بواسطه :</span> {invoice.user.name}</p>
                            </div>
                           
                            {/*right side */}
                            <div className='flex flex-col items-start gap-1'>
                                <p  className={`px-1 text-xs font-normal p-2 rounded-lg shadow-lg/30 
                                    ${invoice.invoiceStatus === 'Completed' ? 'text-white bg-sky-600' : 'bg-[#f6b100] text-white'}`}>
                                    <FaCheckCircle hidden={invoice.invoiceStatus === "In Progress"} className='inline mr-2 text-white' size={17} /> 
                                    <GrInProgress hidden={invoice.invoiceStatus === 'Completed'} className='inline mr-2 text-white' size={17} />
                                    {invoice.invoiceStatus}
                                </p>
                            </div>
                        </div>
                    </div>

                    ))}
                      
                </div>
            </div>
        </div>

    );
};

export default HomeInvoicesList ;



