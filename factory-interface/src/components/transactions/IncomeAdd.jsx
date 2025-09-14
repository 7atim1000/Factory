import React , {useState} from 'react'
import { addIncome } from '../../https';
import { motion } from 'framer-motion'

import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { IoCloseCircle } from 'react-icons/io5';

const IncomeAdd = ({setIsIncomeModalOpen}) => {
    const [formData, setFormData] = useState({
        incomeName: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData)

        IncomeMutation.mutate(formData)
        window.location.reload()
        setIsIncomeModalOpen(false)
    }

    const IncomeMutation = useMutation({
        mutationFn: (reqData) => addIncome(reqData),

        onSuccess: (res) => {

            const { data } = res;
            //console.log(data)
            enqueueSnackbar('تم فتح واضافه حساب الايراد', { variant: "success" });
        },

        onError: (error) => {
            const { response } = error;
            enqueueSnackbar(response.data.message, { variant: "error" });

            console.log(error);
        },
    });


    const handleClose = () => {
        setIsIncomeModalOpen(false)
    };



    return (
        <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/10 z-50' 
        style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ durayion: 0.3, ease: 'easeInOut' }}
                className='bg-white p-3 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5'
            >


                {/*Modal Header */}
                <div className="flex justify-between items-center mb-2 shadow-xl p-2">
                    <h2 className='text-[#1a1a1a] text-sm font-semibold'>اضافه حساب</h2>
                    <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer border-b border-[#be3e3f]'>
                        <IoCloseCircle size={22} />
                    </button>
                </div>

                {/*Modal Body*/}
                <form className='mt-3 space-y-6' onSubmit={handleSubmit}>
                    <div className='mt-5'>
                        <label className='text-[#0ea5e9] block mb-2 mt-3 px-4 text-xs font-medium'>اسم الحساب :</label>

                        <div className='mt-5 flex items-center justify-between gap-5'>

                            <div className='w-full flex items-center rounded-lg p-3 bg-white shadow-xl'>
                                <input
                                    type='text'
                                    name='incomeName'
                                    value={formData.incomeName}
                                    onChange={handleInputChange}

                                    placeholder='الرجاء كتابه اسم الحساب'
                                    className='bg-transparent text-[#1a1a1a] focus:outline-none border-b border-yellow-700 w-full text-xs font-semibold'
                                    required
                                    autoComplete='none'
                                />
                            </div>
                        </div>

                        <button
                            type='submit'
                            className='rounded-xs px-3 py-3 text-sm font-semibold bg-sky-500 text-white cursor-pointer 
                            mt-10 w-full'
                        >
                            حفظ
                        </button>

                    </div>
                    
                </form>
            </motion.div>
        </div> 
    )
};


export default IncomeAdd ;
