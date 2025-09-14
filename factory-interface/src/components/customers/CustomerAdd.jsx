import React, {useState} from 'react'
import { useMutation } from '@tanstack/react-query'
import { addCustomer } from '../../https';
import { motion } from 'framer-motion'
import { enqueueSnackbar } from 'notistack';
import { IoCloseCircle } from 'react-icons/io5'; 

const CustomerAdd = ({setIsCustomerModalOpen, fetchCustomers}) => {

    const handleClose = () => {
        setIsCustomerModalOpen(false);
    }

    const [formData, setFormData] = useState({
        customerName :"" , email :"", contactNo :"", address :"", balance :0
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData)

        CustomerMutation.mutate(formData)
        
        // window.location.reload()
        setIsCustomerModalOpen(false)
    };

    
    const CustomerMutation = useMutation({
        mutationFn: (reqData) => addCustomer(reqData),
        onSuccess: (res) => {

            const { data } = res;
            //console.log(data)
            // enqueueSnackbar(data.message, { variant: "success" });
            enqueueSnackbar('تم اضافه العميل بنجاح', { variant: "success" });
            fetchCustomers();
        },

        onError: (error) => {
            const { response } = error;
            enqueueSnackbar(response.data.message, { variant: "error" });

            console.log(error);
        },
    });


    return (
        
        <div dir ='rtl' className ='fixed inset-0 bg-opacity-50 flex items-center justify-center z-50' 
        style={{ backgroundColor:  'rgba(20, 10, 10, 0.4)'}}>
            <motion.div
            initial ={{opacity :0 , scale :0.9}}
            animate ={{opacity :1, scale :1}}
            exit ={{opacity :0, scale :0.9}}
            transition ={{duration :0.3 , ease: 'easeInOut'}}
            className ='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)] overflow-y-scroll scrollbar-hidden'
            >
                                        
                                        
            {/*Modal Header */}
            <div className="flex justify-between items-center mb-2 shadow-xl p-2">
                <h2 className ='text-[#1a1a1a] text-sm font-bold'>اضافه عميل</h2>
                    <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
                        border-b border-[#be3e3f]'>
                        <IoCloseCircle size={22} />
                    </button>
            </div>
                                                  
            {/*Modal Body*/}
            <form className ='mt-5 space-y-6' onSubmit ={handleSubmit}>

                <div className ='flex items-center justify-between'>
                    <label className ='w-[25%] text-[#1a1a1a] block text-xs font-normal'>اسم العميل :</label>
                    <div className ='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                        <input 
                            type ='text'
                            name ='customerName'
                            value ={formData.customerName}
                            onChange ={handleInputChange}
                                                          
                            placeholder = 'اسم العميل'
                            className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
                                border-b border-yellow-700'
                            required
                            autoComplete='none'
                        />
                    </div>
                </div>

                <div className ='flex items-center justify-between'>
                    <label className ='w-[25%] text-[#1a1a1a] block text-xs font-normal'>البريد اللاكتروني : </label>
                    <div className ='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                        <input 
                            type ='text'
                            name ='email'
                            value ={formData.email}
                            onChange ={handleInputChange}
                            placeholder = 'البريد اللاكتروني للعميل'
                            className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
                                border-b border-yellow-700'
                            required
                            autoComplete='none'
                        />
                        
                    </div>
                </div>
                
                        
                <div className ='flex items-center justify-between'>
                    <label className ='w-[25%] text-[#1a1a1a] block text-xs font-normal'>رقم الهاتف : </label>
                    <div className ='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                        <input 
                            type ='text'
                            name ='contactNo'
                            value ={formData.contactNo}
                            onChange ={handleInputChange}
                                                          
                            placeholder = '+249 9999999'
                            className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
                                border-b border-yellow-700'
                            required
                            autoComplete='none'
                        />
                    </div>       
                </div>        
                                    
                <div className ='flex items-center justify-between'>
                    <label className ='w-[25%] text-[#1a1a1a] block text-xs font-normal'>العنوان : </label>
                    <div className ='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                        <input 
                            type ='text'
                            name ='address'
                            value ={formData.address}
                            onChange ={handleInputChange}
                            placeholder = 'عنوان العميل'
                            className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
                                border-b border-yellow-700'
                            required
                            autoComplete='none'
                        />
                        
                    </div>
                </div>
                                              
                <div className ='flex items-center justify-between'>
                    <label className ='w-[25%] text-[#1a1a1a] block text-xs font-normal'>الرصيد : </label>
                        <div className ='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input 
                                type ='text'
                                name ='balance'
                                value ={formData.balance}
                                onChange ={handleInputChange}
                                                          
                                placeholder = 'الرصيد الافتتاحي للعميل ان وجد'
                                className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
                                border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        
                        </div>
                </div>
                
                               
                <button
                    type ='submit'
                    className ='p-3 w-full rounded-xs mt-6 py-3 text-sm bg-[#0ea5e9] text-white font-semibold 
                    cursor-pointer '
                    >
                    حفظ
                </button>
                                                          
                                                 
            </form>
                
        </motion.div>
    </div>
        
    );
    
};


export default CustomerAdd ;