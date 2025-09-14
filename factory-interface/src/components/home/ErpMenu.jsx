import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SiDatabricks } from "react-icons/si";

import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { CiCalculator2 } from "react-icons/ci";
import { FaStoreAlt } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";


import FinanModal from './FinanModal';
import InvoiceModal from './InvoiceModal';

import { useDispatch } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import { logout } from '../../https';
import { removeUser } from '../../redux/slices/userSlice';
import ProductionModal from './ProductionModal';

const ErpMenu = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logOutMutation = useMutation({
        mutationFn: () => logout(),
        onSuccess: (data) => {

            console.log(data);
            dispatch(removeUser());
           
            //////////////////////////////////////////////////////
            // to remove token from localStorage
            localStorage.removeItem('token');
            // remove token from cookie 
            document.cookie = 'accessToken=; Max-Age=0; path=/;';
            ///////////////////////////////////////////////////////

            navigate('/auth');
        },

        onError: (error) => {
            console.log(error);
        }
    });

    
    
    const handleLogOut = () => {
    if (!logOutMutation.isLoading) {
        
        // Clear client-side cookie just in case
        document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        logOutMutation.mutate();
    }
};

    const accountBtn = [{ label: "الاداره الماليه", action: 'finan'}];
    const invoiceBtn = [{ label: "اداره الفواتير", action: 'invoice'}];
    const productionBtn = [{ label :'اداره الانتاج', action :'production'}]

    const [isFinanModalOpen, setIsFinanModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [isProductionModal, setIsProductionModal] = useState(false);

    const handleOpenModal = (action) => {
        if (action === 'finan') setIsFinanModalOpen(true)
    };

    const handleInvoiceModal = (action) => {
        if (action === 'invoice') setIsInvoiceModalOpen(true)
    };
    
    const handleProductionModal = (action) => {
        if (action === 'production') setIsProductionModal(true)
    };

    // border-[#e3d1b9]
    return (
        <div className ='flex flex-wrap justify-beween gap-4 py-2 w-full'>

            <div className='w-35 h-14  bg-white flex justify-around items-center  p-2 shadow-xl w-45 rounded-sm border-b-2 border-[#0ea5e9]'>
                {invoiceBtn.map(({ label, action }) => {
                    return (
                        <button 
                        onClick={() => handleInvoiceModal(action)} 
                        className='bg-white rounded-lg  p-2 text-sm text-black font-semibold cursor-pointer'>
                            {label} <LiaFileInvoiceDollarSolid className='text-[#0ea5e9] inline' size={25} />

                        </button>

                    )
                })}
            </div>

            <div className='w-35 h-14  flex bg-white justify-around items-center p-2 shadow-xl w-45 rounded-sm border-b-2 border-[#0ea5e9]'>
                {productionBtn.map(({ label, action }) => {
                    return(
                        <button 
                        onClick={() => handleProductionModal(action)} 
                        className='bg-white  w-30 p-2  text-sm text-black font-semibold cursor-pointer'>
                            {label} <SiDatabricks className='text-[#0ea5e9] inline' size={25} />

                        </button>
                    )
                })}
            </div>
            
            <div className='w-35 h-14 bg-white flex justify-around items-center  p-2 shadow-xl w-45 rounded-sm border-b-2 border-[#0ea5e9]'>
                {accountBtn.map(({ label, action }) => {
                    return (
                        <button onClick={() => handleOpenModal(action)} className='bg-white rounded-lg  p-2 text-sm text-black font-semibold cursor-pointer'>
                            {label} <CiCalculator2 className='text-[#0ea5e9] inline' size={25} />
                        </button>
                    )
                })}
            </div>

            <div className='w-35 h-14 bg-white flex justify-around items-center  p-2 shadow-xl w-45 rounded-sm border-b-2 border-[#be3e3f]'>
                {accountBtn.map(({ label, action }) => {
                    return (
                        <button 
                           className='bg-white rounded-lg  p-2 text-sm text-black font-semibold cursor-pointer'
                           onClick ={ handleLogOut }
                        >
                            
                            خروج <AiOutlineLogout className='text-[#be3e3f] inline' size={25} />
                        </button>
                    )
                })}
            </div>
           
        

            {isFinanModalOpen && <FinanModal setIsFinanModalOpen={setIsFinanModalOpen}/>}
            {isInvoiceModalOpen && <InvoiceModal setIsInvoiceModalOpen={setIsInvoiceModalOpen}/>}

            {isProductionModal && <ProductionModal setIsProductionModal={setIsProductionModal}/>}
            
        </div>
        
    );
};



export default ErpMenu ;