import React, { useState } from 'react'
import { MdOutlineClose } from "react-icons/md";
import {useNavigate} from 'react-router-dom'
import { IoCloseCircle } from "react-icons/io5";
import { motion } from 'framer-motion'
import { TbReportSearch } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";

import { TbBrandProducthunt } from "react-icons/tb";
import { BsListStars } from "react-icons/bs";

import { TbUsersGroup } from "react-icons/tb";
import { TiGroupOutline } from "react-icons/ti";

import { BsFileEarmarkPptFill } from "react-icons/bs";

const InvoiceModal = ({setIsInvoiceModalOpen}) =>{
    const navigate = useNavigate();

       const handleClose = () => {
        setIsInvoiceModalOpen(false)
    }

       
    
        const saleBtn = [{ label: "Sales Invocies", action: 'sale'}];

        const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
       
        const handleSaleModalOpen = (action) => {
            if (action === 'sale') setIsSaleModalOpen(true)
            //setIsInvoiceModalOpen(false)

        }


        const buyBtn = [{ label: "Purchase Invoice", action: 'buy'}];
    
        const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
      
        const handleBuyModalOpen = (action) => {
            if (action === 'buy') setIsBuyModalOpen(true)
        }
    

    return (
        <div className ='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg z-50' 
        style={{ backgroundColor:  'rgba(20, 10, 10, 0.4)'}} >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ durayion: 0.3, ease: 'easeInOut' }}

                className='bg-white p-3 rounded-lg shadow-lg/30 w-100 h-50% md:mt-0 mt-0 h-[calc(100vh-5rem)]'
            >

                <div className='flex justify-between items-center shadow-xl p-5'>
                    <h2 className='text-black text-sm font-semibold'>اداره الفواتير</h2>
                    <button onClick={handleClose} className='inline text-[#1a1a1a] cursor-pointer hover:text-[#be3e3f]'>
                        <MdOutlineClose size={25} />
                    </button>
                </div>

         

            <div className ='flex flex-col gap-7 justify-between items-center px-8 mt-2'>

                    <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
                        <div className='flex justify-between items-center'>
                            <button onClick={() => navigate('/products')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                المنتجات  <TbBrandProducthunt className='text-[#0ea5e9] inline' size={25} />
                            </button>
                        </div>
                        <div className='flex justify-between items-center'>
                            <button onClick={() => navigate('/items')}
                                className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  p-2 text-xs text-black font-semibold cursor-pointer'>
                                اداره المواد الخام <BsListStars size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>

                    </div>

                    <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
                        <div className='flex justify-between items-center '>
                            <button onClick={() => navigate('/customers')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                العملاء <TiGroupOutline size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>
                        <div className='flex justify-between items-center '>
                            <button onClick={() => navigate('/suppliers')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                الموردين  <TbUsersGroup size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>

                    </div>

                    <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
                        <div className='flex justify-between items-center'>
                            <button onClick={() => navigate('/sales')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                المبيعات <TbReportSearch size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>
                        <div className='flex justify-between items-center '>
                            <button onClick={() => navigate('/purchases')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                المشتروات <BsFileEarmarkPptFill size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>
                    </div>

                    <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
                        <div className='flex justify-between items-center w-full'>
                            <button onClick={() => navigate('/invoices')} className='w-full h-15  shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                اداره الفواتير <IoSettings size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>
                       
                    </div>
                
            
            </div>

                {isSaleModalOpen && <SaleModal setIsSaleModalOpen={setIsSaleModalOpen} />}
                {isBuyModalOpen && <BuyModal setIsBuyModalOpen={setIsBuyModalOpen} />}
            
            </motion.div>

    
       </div>
    )
}


export default InvoiceModal ;