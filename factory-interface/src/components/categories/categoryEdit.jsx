import React, {useState, useEffect} from 'react'

import { motion } from 'framer-motion'
import { api } from '../../https';
import { toast } from 'react-toastify'
import { IoCloseCircle } from 'react-icons/io5';

const CategoryEdit = ({setIsEditCategoryModal, category}) => {
    const handleClose = () => {
        setIsEditCategoryModal(false)
    };

    const [categoryName, setCategoryName] = useState(category.categoryName);
    
    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();

            formData.append('categoryName', categoryName);
       
            const { data } = await api.put(`/api/category/${category._id}`, formData
             
            );

            if (data.success) {
               
                // fetchCustomers();
                window.location.reload();
                handleClose();
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return(
        <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/30 z-50'
            style={{ backgroundColor: 'rgba(145, 143, 143, 0.4)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ durayion: 0.3, ease: 'easeInOut' }}
                className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-0 mt-0'
            >


                {/*Modal Header */}
                <div className="flex justify-between items-center mb-2 shadow-xl p-2">
                    <h2 className='text-[#1a1a1a] text-md font-bold'>تعديل انواع المنتجات</h2>
                    <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
                        border-b border-[#be3e3f]'>
                        <IoCloseCircle size={22} />
                    </button>
                </div>


                {/*Modal Body*/}
                <form className='mt-3 space-y-6' onSubmit={onSubmitHandler}>

                    <div className='flex items-center justify-between'>
                        <label className='w-[20%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-normal'>نوع المنتج :</label>
                        <div className='w-[80%] flex items-center rounded-xs p-3  bg-white shadow-xl'>
                            <input
                                type='text'

                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}

                                placeholder='نوع المنتج'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
                                    border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>




                    <button
                        type='submit'
                        className='p-3 w-full rounded-xs mt-5 py-3 text-sm bg-[#0ea5e9] text-white font-semibold 
                        cursor-pointer '
                    >
                        تعديل
                    </button>


                </form>

            </motion.div>
        </div>

    );
};


export default CategoryEdit ;