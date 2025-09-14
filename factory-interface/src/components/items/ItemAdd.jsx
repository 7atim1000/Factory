import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IoCloseCircle } from 'react-icons/io5';
import { toast } from 'react-toastify'
import { api } from '../../https';

const ItemAdd = ({setIsAddItemModal, fetchItems}) => {
    const handleClose = () => {
        setIsAddItemModal(false)
    };

    const [itemName, setItemName] = useState('')
    const [price, setPrice] = useState('')
    const [qty, setQty] = useState('')
    const [unit, setUnit] = useState('') // Changed from 'Pc' to empty string

      const onSubmitHandler = async (event) => {
        event.preventDefault()

        // Validation
        if (!itemName || !price || !qty || !unit) {
            toast.error('يرجى ملء جميع الحقول المطلوبة')
            return
        }

        try {
            const formData = new FormData()
          
            formData.append('itemName', itemName)
            formData.append('qty', qty)
            formData.append('price', price)
            formData.append('unit', unit)

            const { data } = await api.post('/api/item', formData)

            // DEBUG: Log the response to see what's being returned
            console.log('API Response:', data);

            // FIX: Changed from data.success to data.status
            if (data.status) {
                toast.success('تم حفظ الصنف بنجاح')
                fetchItems();
                setIsAddItemModal(false)

                // Reset form
                setItemName('')
                setQty('')
                setUnit('')
                setPrice('')
            } else {
                toast.error(data.message || 'فشل في إضافة الصنف')
            }

        } catch (error) {
            console.error('Error adding item:', error)
            // Improved error handling
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'حدث خطأ أثناء إضافة الصنف';
            toast.error(errorMessage)
        }
    };



    // Unit fetch
    const [unitlist, setUnitList] = useState([])
    const fetchUnit = async () => {
        try {
            const response = await api.get('/api/unit/')
            if (response.data.success) {
                setUnitList(response.data.units);
                // Set default unit if units exist
                if (response.data.units.length > 0) {
                    setUnit(response.data.units[0].unitName)
                }
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحميل الوحدات')
        }
    };

    useEffect(() => {
        fetchUnit()
    }, []);

    return(
        <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/30 z-50'
            style={{ backgroundColor: 'rgba(145, 143, 143, 0.4)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)]'
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-2 shadow-xl p-2">
                    <h2 className='text-[#1a1a1a] text-sm font-bold'>اضافه صنف</h2>
                    <button
                        onClick={handleClose} 
                        className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
                                border-b border-[#be3e3f]'>
                        <IoCloseCircle size={22} />
                    </button>
                </div>

                {/* Modal Body */}
                <form className='space-y-4' onSubmit={onSubmitHandler}>
                    {/* Item Name Field */}
                    <div className='flex flex-col'>
                        <label className='text-gray-700 text-xs font-normal mb-1'>اسم الصنف:</label>
                        <input
                            type='text'
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            placeholder='أدخل اسم الصنف'
                            className='p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal text-xs'
                            required
                            autoComplete='off'
                        />
                    </div>

                    {/* Price Field */}
                    <div className='flex flex-col'>
                        <label className='text-gray-700 font-normal text-xs mb-1'>سعر الشراء:</label>
                        <input
                            type='number'
                            step='0.01'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder='أدخل سعر الشراء'
                            className='p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal text-xs'
                            required
                            autoComplete='off'
                        />
                    </div>

                    {/* Quantity and Unit Fields */}
                    <div className='grid grid-cols-2 gap-3'>
                        <div className='flex flex-col'>
                            <label className='text-gray-700 font-normal text-xs mb-1'>الكمية:</label>
                            <input
                                type='number'
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                                placeholder='الكمية'
                                className='p-2 border border-gray-300 rounded font-normal text-xs focus:outline-none focus:ring-2 focus:ring-blue-500'
                                required
                                autoComplete='off'
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className='text-gray-700 text-sm font-medium mb-1 font-normal text-xs'>الوحدة:</label>
                            <select 
                                className='p-2 border border-gray-300 font-normal text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                required
                            >
                                <option value=''>اختر الوحدة</option>
                                {unitlist.map((unitItem, index) => (
                                    <option key={index} value={unitItem.unitName}>
                                        {unitItem.unitName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type='submit'
                        className='w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors mt-4'
                    >
                        حفظ
                    </button>
                </form>
            </motion.div>
        </div>
    )
};

export default ItemAdd;