import React, { useState, useEffect } from 'react'
import BackButton from '../components/shared/BackButton'
import { useSelector } from 'react-redux'
import { FaCircleUser } from "react-icons/fa6";
import { IoMdArrowDropleft } from "react-icons/io";



import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'

import { getProducts } from '../https';

import { BsFillCartCheckFill } from "react-icons/bs";
import { IoMdArrowDropupCircle } from "react-icons/io";
import { IoMdArrowDropdownCircle } from "react-icons/io";

import {useDispatch} from 'react-redux';
import { addProduce} from '../redux/slices/produceSlice';

import { toast } from 'react-toastify';
import CartInfo from '../components/production/CartInfo';
import Bills from '../components/production/Bills';


const Production = () => {
  

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async (filters = {}) => {
        setLoading(true);
        try {
            const response = await getProducts({
              
                search: filters.search || '',
                sort: filters.sort || '-createdAt',
                page: filters.page || 1,
                limit: filters.limit || 10
            });
            setProducts(response.data.data);
            // setPagination(response.data.pagination);
        
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch services when category changes
    useEffect(() => {
        fetchProducts({
            
        });
    }, []);

   
    const [selectedService, setSelectedService] = useState(null);
    const [quantities, setQuantities] = useState({});

    const increment = () => {
        if (!selectedService) return;

        setQuantities(prev => ({
            ...prev,
            [selectedService._id]: (prev[selectedService._id] || 0) + 1
        }));
    }

    const decrement = () => {
        if (!selectedService || !quantities[selectedService._id] || quantities[selectedService._id] <= 0) return;

        setQuantities(prev => ({
            ...prev,
            [selectedService._id]: prev[selectedService._id] - 1
        }));
    }


    const handleServiceChange = (e) => {
        const selectedServiceName = e.target.value;
        const product = products.find(s => s.productName === selectedServiceName);
        setSelectedService(product || null);
    }

    const getCurrentQuantity = () => {
        if (!selectedService) return 0;
        return quantities[selectedService._id] || 1;
    };


    // handle add to cart
    
    const dispatch = useDispatch();

    const handleAddToCard = (item) => {
        const { id, name, price, qty, unit } = item ;
        const getCurrentQuantity = quantities[item.id] || 1;
        if (getCurrentQuantity === 0) {
            toast.warning('الرجاء تحديد الكميه المنتجه.');
            return;
        }
     
      
        if (getCurrentQuantity > 0 ) {
        
            const service = {serviceId: id}
            // editing service or ItemId from this method to itemId = id means id from {id, name, price, qty, unit, cat}
            const newObj = { id: id, name, pricePerQuantity: price, quantity: getCurrentQuantity, price: price * getCurrentQuantity }
          
        
            dispatch(addProduce(newObj));

            setQuantities(prev => ({
                ...prev, [item.id] : 0
            }))

            setSelectedService(null);
            fetchProducts({  page: 1 })
        }

            return;
     }

 
    return (
       <section dir ='rtl' className='h-[calc(100vh)] overflow-y-scroll scrollbar-hidden flex gap-2 bg-[#f5f5f5] shadow-xl'>
            <div className='flex-[3] bg-white shadow-xl rounded-lg pt-0'>
                
                <div className='flex items-center justify-between px-4 py-2 shadow-xl mb-2 bg-white rounded-t-lg'>
                    <div className='flex flex-wrap gap-0 items-center cursor-pointer'>
                        <BackButton />
                        <h1 className='text-[#1a1a1a] text-sm font-bold tracking-wide'>فواتير الانتاج</h1>
                    </div>
        
                </div>
                
                <div className='flex w-full gap-1 justify-start items-start p-1'>
                 

                    {/* Services */}
                    <div className='flex flex-col w-full px-5 gap-5'>
                        <div className='flex items-center'>
                            <label className='w-[10%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-medium'>اختيار المنتج :</label>
                            <div className='flex w-[90%] items-center p-3 bg-white shadow-xl'>
                                <select
                                    className='w-full bg-[#f5f5f5] h-8 rounded-sm w-[500px] text-xs font-normal border-b-1 border-yellow-700'
                                    required
                                    onChange={handleServiceChange}
                                    value={selectedService?.productName || ''}
                                >
                                    <option value="">...</option>
                                    {products.map((product, index) => (
                                        <option 
                                            key={index} 
                                            value={product.productName} 
                                            className='text-xs font-normal'>
                                            {product.productName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {loading && (
                            <div className="mt-4 flex gap-2 justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0ea5e9] text-xs"></div>
                                <span className="ml-2">تحميل...</span>
                            </div>
                        )}

                        {selectedService && (
                            <div className='flex items-center justify-between p-2 bg-white shadow-lg/30 rounded-sm'>
                                <div className='flex-1'>
                                    <h3 className='text-sm font-semibold text-green-600'>{selectedService.productName}</h3>
                                    <p>
                                        <span className ='text-xs text-gray-600 font-normal'>سعر البيع : </span>
                                        <span className='text-sm font-semibold text-[#0ea5e9]'>{selectedService.price}</span>
                                       <span className ='text-xs text-gray-600'> ر.ع</span>
                                    </p>
                                    
                                    <p>
                                        <span className ='text-xs text-gray-600 font-normal'>رصيد الكميه : </span>
                                        <span className='text-sm font-semibold text-[#0ea5e9]'>{selectedService.qty}</span> 
                                        <span className ='text-xs text-gray-600'> {selectedService.unit}</span></p>
                                </div>

                                <div className='flex gap-3 items-center justify-between shadow-xl
                                    px-4 py-1 rounded-sm mr-0 bg-[#f5f5f5]'>
                                    
                                    <button
                                        onClick={increment}
                                        className='text-[#0ea5e9] text-md cursor-pointer'
                                    >
                                        <IoMdArrowDropupCircle className ='w-5 h-5'/>
                                    </button>

                                    <span className={`${getCurrentQuantity() > 9 ? "text-lg" : "text-xl"} text-[#0ea5e9] flex flex-wrap gap-2 font-semibold`}>
                                        {getCurrentQuantity()}
                                    </span>

                                    <button
                                        onClick={decrement}
                                        className='text-emerald-600 text-md cursor-pointer'
                                    >
                                        <IoMdArrowDropdownCircle className ='w-5 h-5'/>
                                    </button>
                                </div>
                                <div className='ml-3'>
                                    {/* disabled={getCurrentQuantity() === 0}  */}
                                    <button onClick={() => handleAddToCard({
                                        id: selectedService._id,
                                        name: selectedService.productName, 
                                        price: selectedService.price, 
                                        qty: selectedService.qty, 
                                        unit: selectedService.unit,
                                        cat: selectedService.category
                                    })}
                                        className='cursor-pointer mt-0 mr-3'>
                                        <BsFillCartCheckFill className='text-[#0ea5e9] rounded-lg flex justify-end items-end' size={25} />
                                    </button>
                                </div>
                            </div>
                        )}

                     <CartInfo /> 
                    </div>
                     
                </div>

            </div>
            
            <div className='flex-[1] bg-white h-[100vh] rounded-lg shadow-lg pt-2'>
                <Bills
                    fetchProducts={fetchProducts} 
                />   
            </div>
       
       </section>
    );
};

export default Production;
