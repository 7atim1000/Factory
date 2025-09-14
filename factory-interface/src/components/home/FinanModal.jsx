import React from 'react'
import {useNavigate} from 'react-router-dom'
import { IoCloseCircle } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import { motion } from 'framer-motion'
import { TbReportSearch } from "react-icons/tb";
import { LuFilePlus2 } from "react-icons/lu";
import { MdSwapVerticalCircle } from "react-icons/md";
import { FcGenericSortingAsc } from "react-icons/fc";
import { FcGenericSortingDesc } from "react-icons/fc";

const FinanModal = ({setIsFinanModalOpen}) =>{
    const navigate = useNavigate();

       const handleClose = () => {
        setIsFinanModalOpen(false)
    }

    return (

        <div className ='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg z-50' 
        style={{ backgroundColor:  'rgba(20, 10, 10, 0.4)'}} >
           <motion.div
                initial ={{opacity :0 , scale :0.9}}
                animate ={{opacity :1, scale :1}}
                exit ={{opacity :0, scale :0.9}}
                transition ={{durayion :0.3 , ease: 'easeInOut'}}

                className ='bg-white p-3 rounded-lg shadow-lg/30 w-100 h-50% md:mt-0 mt-0 h-[calc(100vh-5rem)]'
            >

                <div className='flex justify-between items-center shadow-xl p-5'>
                    <h2 className='text-black text-sm font-semibold'>Financials</h2>
                    <button onClick={handleClose} className='inline text-[#1a1a1a] cursor-pointer hover:text-[#be3e3f]'>
                        <MdOutlineClose size={25} />
                    </button>
                </div>

         

            <div className='flex flex-col gap-7 justify-between items-center px-2 mt-2'>
                
               
                    <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
                        <div className='flex w-full justify-between items-center  '>
                            <button onClick={() => navigate('/incomes')}
                                className='w-full h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                حسابات الايرادات <FcGenericSortingDesc size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>

                    </div>
                     <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
                        <div className='flex w-full justify-between items-center  '>
                            <button onClick={() => navigate('/expenses')}
                                className='w-full h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                حسابات المصروفات <FcGenericSortingAsc size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>

                    </div>
                    <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
                        <div className='flex w-full justify-between items-center  '>
                            <button onClick={() => navigate('/financials')}
                                className='w-full h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                اداره الحسابات <MdSwapVerticalCircle size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>
                       
                    </div>
            </div>
            
            </motion.div>

       </div>
    );
}


export default FinanModal ;