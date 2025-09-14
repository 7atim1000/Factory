import React, {useState, useEffect, useCallback} from 'react'
import { motion } from 'framer-motion'
import { IoCloseCircle } from 'react-icons/io5';
import { useDispatch } from 'react-redux'
import { PiUserCircleCheckLight } from "react-icons/pi";
import { toast } from 'react-toastify'

import { setSupplier } from '../../redux/slices/supplierSlice';
import { api } from '../../https';

const SelectSupplier = ({setIsSelectSupplierModalOpen}) => {

     const dispatch = useDispatch();
    
    const handleClose = (supplierId, supplierName, email, balance) => {
        dispatch(setSupplier({ supplierId, supplierName, email, balance }));
        setIsSelectSupplierModalOpen(false);
    };

    // fetch supplier - any error on .map or length check next function
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [loading, setLoading] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);


    const fetchSuppliers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.post('/api/supplier/fetch', {
                search: debouncedSearch,
                sort,
                page: 1,
                limit: 1000
            });
        
            if (response.data.success) {
                setList(response.data.suppliers)
                console.log(response.data.suppliers)
            } else {
                toast.error(response.data.message || 'supplier not found')
            }


        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            console.error(error);

        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, sort]);
        
 
    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]  // was[fetchSuppliers()] have error :-

);




    return (
        <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/30 z-50'
            style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }}>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-white p-3 rounded-lg shadow-lg/30 w-175 h-[calc(100vh-2rem)] md:mt-5 mt-5 
                       border-b-3 border-yellow-700'
            >


                {/*Modal Header */}
                <div className="flex justify-between items-center mb-2 shadow-xl p-2">
                    <h2 className='text-[#1a1a1a] text-sm font-semibold underline'>الرجاء اختيار المورد</h2>
                    <button
                        onClick={() => setIsSelectSupplierModalOpen(false)}
                        className='rounded-sm border-b border-[#be3e3f] text-[#be3e3f]
                            cursor-pointer hover:bg-[#be3e3f]/30 transition-all duration-150 ease-in-out'
                    >
                        <IoCloseCircle size={25} />
                    </button>
                </div>
                {/* Search Input */}
                <div className='flex items-center p-2 shadow-xl'>
                    <input
                        type='text'
                        placeholder='بحث ...'
                        className='w-full border-b border-yellow-700 bg-[#F1E8D9] p-2 text-sm focus:outline-none rounded-sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {/* Loading Indicator */}
                {loading && (
                    <div className="mt-4 flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0ea5e9]"></div>
                        <span className="ml-2">تحميل...</span>
                    </div>
                )}


                {/*Modal Body*/}
                <div className='mt-5'>


                    <div className='overflow-x-auto'>
                        <table className='text-left w-full'>
                            <thead>
                                <tr className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
                                    <th className='p-2'>المورد</th>
                                    <th className='p-2'>الايميل</th>
                                    <th className='p-2'>التليفون</th>
                                    <th className='p-2'>العنوان</th>
                                    <th className='p-2'>الرصيد</th>
                                    <th className='p-2'></th>
                                </tr>
                            </thead>

                            <tbody>

                                {list.map((supplier) => (

                                    <tr
                                        // key={supplier._id}
                                        className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] hover:bg-[#F1E8D9] cursor-pointer'
                                    >
                                        <td className='p-2' hidden>{supplier._id}</td>
                                        <td className='p-4'>{supplier.supplierName}</td>
                                        <td className='p-4'>{supplier.email}</td>
                                        <td className='p-2'>{supplier.contactNo}</td>
                                        <td className='p-2'>{supplier.address}</td>

                                        <td
                                            className={`p-2 ${supplier.balance === 0 ? 'text-[#1a1a1a]' : 'text-[#be3e3f]'} font-semibold`}>
                                            {(Number(supplier.balance) || 0).toFixed(2)}
                                        </td>

                                        <td className='p-2'>
                                            <button >
                                                <PiUserCircleCheckLight
                                                    className='w-7 h-7 text-[#0ea5e9] rounded-full flex justify-end cursor-pointer'
                                                    onClick={() => handleClose(supplier._id, supplier.supplierName, supplier.email, supplier.balance)} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!loading && list.length === 0 && (
                            <p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>
                                {debouncedSearch
                                    ? `عفوا لايوجد مورد باسم "${debouncedSearch}"`
                                    : 'قائمه الموردين فارغه حاليا !'}
                            </p>
                        )}

                    </div>
                </div>
                <div className='mt-4 pt-3 border-t border-gray-200 text-sm text-gray-500'>
                    {list.length} مورد
                </div>

            </motion.div>
        </div>
    );
}


export default SelectSupplier ;