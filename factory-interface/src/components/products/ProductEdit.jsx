import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../https';
import { toast } from 'react-toastify'
import { IoCloseCircle } from 'react-icons/io5';

const ProductEdit = ({ product, setIsEditProductModal, fetchProducts }) => {
    const handleClose = () => {
        setIsEditProductModal(false)
    };

    
    const [unit, setUnit] = useState(
        product.unit?._id || product.unit || ""
    );

    const [productName, setProductName] = useState(product.productName);
    const [price, setPrice] = useState(product.price);
    const [qty, setQty] = useState(product.qty);
    
    const [newImage, setNewImage] = useState(null);
    // fetch categories and units
   
    const [units, setUnits] = useState([]);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();

            if (newImage) {
                formData.append('image', newImage);
            }

        
            formData.append('productName', productName);
            formData.append('price', price);
            formData.append('qty', qty);
            formData.append('unit', unit);

            const { data } = await api.put(`/api/product/${product._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (data.success) {
                toast.success(data.message);
                fetchProducts();
                handleClose();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

   
    // Fetch categories and units
    useEffect(() => {
        const fetchData = async () => {
            try {
                // // Fetch categories
                // const categoriesResponse = await api.get('/api/category/');
                // if (categoriesResponse.data.success) {
                //     setCategories(categoriesResponse.data.categories);
                // }
                // Fetch units
                const unitsResponse = await api.get('/api/unit/');
                if (unitsResponse.data.success) {
                    setUnits(unitsResponse.data.units);
                }
            } catch (error) {
                toast.error(error.message);
            }
        };

        fetchData();
    }, []);

   
  
    return(
        <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/30 z-50'
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
                    <h2 className='text-[#1a1a1a] text-sm font-bold'>تعديل منتج</h2>
                    <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
                                border-b border-[#be3e3f]'>
                        <IoCloseCircle size={22} />
                    </button>
                </div>


                {/*Modal Body*/}
                <form className='mt-3 space-y-6' onSubmit={onSubmitHandler}>
                    <div className='flex items-center gap-4 mb-2'>
                        <label htmlFor='edit-service-img'>
                            <img
                                className='w-16 h-16 rounded-full cursor-pointer  p-1 border-b-3 border-sky-500 shadow-lg/30 object-cover'
                                src={newImage ? URL.createObjectURL(newImage) : product.image}
                                alt="product"
                            />
                        </label>
                        <input
                            onChange={(e) => setNewImage(e.target.files[0])}
                            type='file'
                            id='edit-service-img'
                            hidden
                        />
                        <p className='text-xs font-semibold text-[#0ea5e9] underline'>تغيير صوره المنتج</p>
                    </div>


                    <div className='flex items-center justify-between'>
                        <label className='w-[20%] text-black block mb-2 mt-3 text-xs font-normal'>اسم المنتج :</label>
                        <div className='w-[80%] flex items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='text'

                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}

                                placeholder='اسم المنتج'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-xs
                                        border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>


                    <div className='flex items-center justify-between'>
                        <label className='w-[20%] text-black block mb-2 mt-3 text-xs font-normal'>سعر البيع :</label>
                        <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='text'

                                value={price}
                                onChange={(e) => setPrice(e.target.value)}

                                placeholder='سعر بيع المنتج'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-xs
                                        border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

           

                    <div className='flex items-center justify-between gap-5'>
                        {/* <label className='w-[20%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-medium'>Quantity:</label> */}
                        <div className='w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='text'
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}

                                placeholder='رصيد الكميه'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-xs
                                        border-b border-yellow-700  w-full'
                                required
                                autoComplete='none'
                            />
                        </div>


                        <div className='flex w-full items-center rounded-xs p-2 bg-white shadow-lg/30'>
                            <select className='w-full bg-zinc-100 h-8 rounded-xs text-xs font-normal'
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                required
                            >
                                {units.map((unit) => (

                                    <option key={unit._id} value={unit.unitName}>
                                        {unit.unitName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='p-3 rounded-xs mt-3 py-3 text-sm bg-[#0ea5e9] text-white font-semibold 
                            cursor-pointer w-full'
                    >
                        تعديل
                    </button>


                </form>

            </motion.div>
        </div>

    )
};

export default ProductEdit ; 