import React, { useState, useEffect } from 'react'

import BackButton from '../components/shared/BackButton'
import { useSelector } from 'react-redux'
import { FaCircleUser } from "react-icons/fa6";

import SupplierInfo from '../components/buy/SupplierInfo';

import Bills from '../components/buy/Bills';
import { IoMdArrowDropright } from "react-icons/io";
import SelectSupplier from '../components/buy/SelectSupplier';
import { ImUserPlus } from "react-icons/im";
import SupplierAdd from '../components/suppliers/SupplierAdd';

import { IoMdArrowDropupCircle } from "react-icons/io";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { BsFillCartCheckFill } from "react-icons/bs";

import {useDispatch} from 'react-redux';
import { toast } from 'react-toastify'
import { getItems } from '../https';
import { addBuyItems } from '../redux/slices/buySlice';
import CartInfo from '../components/buy/CartInfo';

const Buy = () => {
    // to fetch customer name from customer Modal 
    const supplierData = useSelector(state => state.supplier);
    const userData = useSelector(state => state.user);

    const buyBtn = [{ label: "اختيار المورد", action: 'buy' }];
    
    const [isSelectSupplierModalOpen, setIsSelectSupplierModalOpen] = useState(false);
    const handleSupplierModalOpen = (action) => {
        if (action === 'buy') setIsSelectSupplierModalOpen(true)
    }

    // Add new Supplier
    const addSuppButton = [
        { label: '', icon: <ImUserPlus className='text-[#0ea5e9]' size={20} />, action: 'supplier' }
    ];

    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const handleAddSupplierModal = (action) => {
        if (action === 'supplier') setIsSupplierModalOpen(true);
    };

    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchItems = async (filters = {}) => {
        setLoading(true)
        try {
            const response = await getItems({
                search: filters.search || '',
                sort: filters.sort || '-createdAt',
                page: filters.page || 1,
                limit: filters.limit || 10
            });
            setItems(response.data.data || response.data.items);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error(error);
        } finally{
            setLoading(false);
        }
    };

    // Fetch services when category changes
    useEffect(() => {
        fetchItems({
            page: 1 // Reset to first page when category changes
        });
    }, []);

    // Increment and decrement functions
    const [selectedService, setSelectedService] = useState(null);
    const [quantities, setQuantities] = useState({});

    const increment = () => {
        if (!selectedService) return;

        setQuantities(prev => ({
            ...prev,
            [selectedService._id]: (prev[selectedService._id] || 1) + 1
        }));
    }

    const decrement = () => {
        if (!selectedService || !quantities[selectedService._id] || quantities[selectedService._id] <= 1) return;

        setQuantities(prev => ({
            ...prev,
            [selectedService._id]: prev[selectedService._id] - 1
        }));
    }

    const handleServiceChange = (e) => {
        const selectedServiceName = e.target.value;
        const item =items.find(s => s.itemName === selectedServiceName);
        setSelectedService(item || null);
    }

    const getCurrentQuantity = () => {
        if (!selectedService) return 1;
        return quantities[selectedService._id] || 1;
    };

    const dispatch = useDispatch();

    const handleAddToCard = (item) => {
        const { id, name, price, qty, unit } = item;
        const getCurrentQuantity = quantities[item.id] || 1;
        if (getCurrentQuantity === 0) {
            toast.warning('Please specify the required quantity.');
            return;
        }
       
        if (getCurrentQuantity > 0 ) {
            // slice item for sale send ID versiaal ID
            const service = { serviceId: id }
            // editing service or ItemId from this method to itemId = id means id from {id, name, price, qty, unit, cat}
            const newObj = { id: id, name, pricePerQuantity: price, quantity: getCurrentQuantity, price: price * getCurrentQuantity }
        
            dispatch(addBuyItems(newObj));
          
            setSelectedService(null);
            fetchItems({ page: 1 })
        }

        return;
    }

      
    return (
        <section dir ='rtl' className='h-[calc(100vh)] overflow-y-scroll scrollbar-hidden flex gap-2 bg-[#f5f5f5] shadow-xl'>
               
            <div className='flex-[3] bg-white shadow-xl rounded-lg pt-0'>

                <div className='flex items-center justify-between px-4 py-2 shadow-xl mb-2 bg-white rounded-t-lg'>
                    <div className='flex flex-wrap gap-0 items-center cursor-pointer'>
                        <BackButton />
                        <h1 className='text-[#1a1a1a] text-sm font-bold tracking-wide'>فواتير المشتروات</h1>
                    </div>

                    <div className='flex items-center justify-content gap-4 shadow-xl px-1 h-8 bg-[#f5f5f5] rounded-sm'>
                        <div className='flex items-center gap-3 cursor-pointer '>
                            <div className='p-2 mb-4 flex justify-center cursor-pointer'>

                                {buyBtn.map(({ label, action }) => {
                                    return (
                                        <button
                                            onClick={() => handleSupplierModalOpen(action)}
                                            className='flex gap-1 items-center cursor-pointer'>
                                            <p className='text-xs mt-3 underline text-zinc-600 font-semibold'>{label}</p>
                                            <IoMdArrowDropright className='inline mt-4 text-[#0ea5e9]' size={20} />
                                        </button>
                                    );
                                })}
                            </div>

                            <FaCircleUser className='h-5 w-5 text-yellow-700' />
                             <div className='flex items-center gap-1'>
                                <p className='text-xs font-normal text-[#1a1a1a]'>
                                    السيد :
                                </p>
                                <p className='text-xs font-medium text-yellow-700'>
                                    {supplierData.supplierName || 'اسم المورد'}
                                </p>
                            </div>
                            <div className='flex items-center gap-1'>
                                <p className='text-xs font-normal text-[#1a1a1a]'>
                                    الرصيد :
                                </p>

                                <p className={`${supplierData.balance === 0 ? 'text-[#0ea5e9]' : 'text-[#be3e3f]'} 
                                    text-xs font-medium`}>
                                    {(Number(supplierData.balance) || 0).toFixed(2)}
                                    <span className='text-xs text-[#1a1a1a] font-normal'> ر.ع</span>
                                </p>
                            </div>

                            <div className='flex items-center justify-around gap-3'>
                                {addSuppButton.map(({ label, icon, action }) => {
                                    return (
                                        <button
                                            onClick={() => handleAddSupplierModal(action)}
                                            className='cursor-pointer px-2 py-2 font-semibold text-sm 
                                            flex items-center gap-2'>
                                            {label} {icon}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
          
                  
                    <div className='flex w-full gap-1 justify-start items-start p-1'>
                    
                    {/* Services */}
                     <div className='flex flex-col w-full px-5 gap-5'>
                        <div className='flex items-center'>
                            <label className='w-[10%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-medium'>اختيار الصنف :</label>
                            <div className='flex w-[90%] items-center p-3 bg-white shadow-xl'>
                                <select
                                    className='w-full bg-[#f5f5f5] h-8 rounded-sm w-[500px] text-xs font-normal border-b-1 border-yellow-700'
                                    required
                                    onChange={handleServiceChange}
                                    value={selectedService?.itemName || ''}
                                >
                                    <option value="">...</option>
                                    {items.map((item, index) => (
                                        <option
                                            key={index}
                                            value={item.itemName}
                                            className='text-xs font-normal'>
                                            {item.itemName}
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
                                    <h3 className='text-sm font-semibold text-gray-500'>{selectedService.itemName}</h3>
                                     <p>
                                        <span className='text-xs text-gray-600 font-normal'>سعر الشراء : </span>
                                        <span className='text-sm font-semibold text-[#0ea5e9]'>{selectedService.price}</span>
                                        <span className='text-xs text-gray-600'> ر.ع</span>
                                    </p>
                                    <p>
                                        <span className='text-xs text-gray-600 font-normal'>رصيد الكميه : </span>
                                        <span className='text-sm font-semibold text-[#0ea5e9]'>{selectedService.qty}</span>
                                        <span className='text-xs text-gray-600'> {selectedService.unit}</span>
                                    </p>
                                </div>

                                <div className='flex gap-3 items-center justify-between shadow-xl
                                    px-4 py-1 rounded-sm mr-0 bg-[#f5f5f5]'>
                                   
                                    <button
                                        onClick={increment}
                                        className='text-[#0ea5e9] text-md cursor-pointer'
                                    >
                                        <IoMdArrowDropupCircle className='w-5 h-5' />
                                    </button>
                                    <span className={`${getCurrentQuantity() > 9 ? "text-lg" : "text-xl"} text-[#0ea5e9] flex flex-wrap gap-2 font-semibold`}>
                                        {getCurrentQuantity()}
                                    </span>
                                    <button
                                        onClick={decrement}
                                        className='text-emerald-600 text-md cursor-pointer'
                                    >
                                        <IoMdArrowDropdownCircle className='w-5 h-5' />
                                    </button>

                                  
                                </div>

                                <div className='ml-3'>
                                    {/* disabled={getCurrentQuantity() === 0}  */}
                                    <button onClick={() => handleAddToCard({
                                        id: selectedService._id,
                                        name: selectedService.itemName,
                                        price: selectedService.price,
                                        qty: selectedService.qty,
                                        unit: selectedService.unit
                                    })}
                                        className='cursor-pointer mt-0 mr-2'>
                                        <BsFillCartCheckFill className='text-emerald-600 rounded-lg flex justify-end items-end' 
                                        size={25} />
                                    </button>
                                </div>
                            </div>
                        )}

                        <CartInfo />
                    </div>
                </div>
               
                
                </div>

                {isSelectSupplierModalOpen && 
                <SelectSupplier 
                setIsSelectSupplierModalOpen={setIsSelectSupplierModalOpen}
                />
                }

                {isSupplierModalOpen && 
                <SupplierAdd 
                setIsSupplierModalOpen ={setIsSupplierModalOpen} 
                />
                }


            <div className='flex-[1] bg-white shadow-xl rounded-lg pt-0'>
                <SupplierInfo />

                <Bills
                    fetchItems={fetchItems} 
                />
            </div>
       
              </section>
    );
}


export default Buy ;
