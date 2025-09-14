import React, { useState , useEffect, useCallback, useRef } from 'react'
import { MdDeleteForever, MdOutlineAddToDrive } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { PiListMagnifyingGlassFill } from "react-icons/pi"
import { FaCcAmazonPay } from "react-icons/fa";
import { useDispatch } from 'react-redux'

import { toast } from 'react-toastify';

import BackButton from '../components/shared/BackButton';
import CustomerAdd from '../components/customers/CustomerAdd';
import BottomNav from '../components/shared/BottomNav';
import { setCustomer } from '../redux/slices/customerSlice';
import DetailsModal from '../components/customers/DetailsModal';
import CustomerPayment from '../components/customers/CustomerPayment';
import { api } from '../https';
import CustomerUpdate from '../components/customers/CustomerUpdate';


const Customers = () => {
    const dispatch = useDispatch();

    const Button = [
        { label : 'اضافه عميل' , icon : <MdOutlineAddToDrive className ='text-yellow-700' size={20} />, action :'customer' }
    ];

    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

    const handleOpenModal = (action) => {
        if(action === 'customer') setIsCustomerModalOpen(true);
    };
        
    // fetch customers - any error on .map or length check next function
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
    });

    const [isEditCustomerModal, setIsEditCustomerModal] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.post('/api/customer/fetch',
                {
                    search,
                    sort,
                    page: pagination.currentPage,
                    limit: pagination.itemsPerPage
                });
        
            if (response.data.success) {
                setList(response.data.customers)
                if (response.data.pagination) {
                    setPagination(prev => ({
                        ...prev,  // Keep existing values
                        currentPage: response.data.pagination.currentPage ?? prev.currentPage,
                        itemsPerPage: response.data.pagination.limit ?? prev.itemsPerPage,
                        totalItems: response.data.pagination.total ?? prev.totalItems,
                        totalPages: response.data.pagination.totalPages ?? prev.totalPages
                    }));
                };
                
            } else {
                toast.error(response.data.message || 'customer not found')
            }

        } catch (error) {
            // Show backend error message if present in error.response
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message)
            }
            console.log(error)
        } finally {
            setLoading(false);
        }
    });

        
    const isInitialMount = useRef(true);
    useEffect(() => {
       // if (isInitialMount.current) {
        //    isInitialMount.current = false;
        //} else {
            fetchCustomers();
       // }
    }, [search, sort, pagination.currentPage, pagination.itemsPerPage]);

    // Handle edit
    const handleEdit = (customer) => {
        setCurrentCustomer(customer);
        setIsEditCustomerModal(true);
    };
    
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const removeCustomer = async (id) => {
              
        try {
            const response = api.post('/api/customer/remove', { id }, )
            if (response.data.success){
                toast.success(response.data.message)
               
                //Update the LIST after Remove
                await fetchCustomers();
                
            } else{
                toast.error(response.data.message)
            }
            
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
    };

    
    const detailsButton = [
        { label : '' , icon : <PiListMagnifyingGlassFill className ='text-green-600' size={20} />, action :'details' }
    ]

    const [isDetailsModal, setIsDetailsModal] = useState(false);

    const handleDetailsModal = (customerId, customerName, balance, action) => {
        dispatch(setCustomer({ customerId, customerName, balance  }));
        if (action === 'details') setIsDetailsModal(true);

       // console.log(customerId)
    };



    const paymentButton = [
        { label : 'Payment' , icon : <FaCcAmazonPay className ='text-[#0ea5e9]' size={20} />, action :'payment' }
    ]

    const [isPaymentModal, setIsPaymentModal] = useState(false);

    const handlePaymentModal = (customerId, customerName ,balance, action) => {
        dispatch(setCustomer({ customerId, customerName , balance }));
        if (action === 'payment') setIsPaymentModal(true);

       // console.log(customerId, customerName , balance)
    };

    // pagination
    const PaginationControls = () => {

        const handlePageChange = (newPage) => {
            setPagination(prev => ({
                ...prev,
                currentPage: newPage
            }));
        };

        const handleItemsPerPageChange = (newItemsPerPage) => {
            setPagination(prev => ({
                ...prev,
                itemsPerPage: newItemsPerPage,
                currentPage: 1  // Reset to first page only when items per page changes
            }));
        };


        return (  //[#0ea5e9]
            <div className="flex justify-between items-center mt-2 py-2 px-5 bg-white shadow-lg/30 rounded-lg
            text-xs font-medium border-b border-yellow-700 border-t border-yellow-700">
                <div>
                    Showing
                    <span className='text-yellow-700'> {list.length} </span>
                    of
                    <span className='text-yellow-700'> {pagination.totalItems} </span>
                    records
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="px-2 py-1 shadow-lg/30 border-b border-yellow-700
                        text-xs font-normal disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="px-3 py-1">
                        Page
                        <span className='text-yellow-700'> {pagination.currentPage} </span>
                        of
                        <span className='text-yellow-700'> {pagination.totalPages} </span>
                    </span>

                    <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-2 py-1 shadow-lg/30 border-b border-yellow-700 text-xs font-normal disabled:opacity-50"
                    >
                        Next
                    </button>

                    <select
                        value={pagination.itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        className="border-b border-yellow-700 px-2 font-normal shadow-lg/30"
                    >
                        <option value="5">5 per page</option>
                        <option value="10">10 per page</option>
                        <option value="20">20 per page</option>
                        <option value="50">50 per page</option>
                    </select>
                </div>
            </div>
        );
    };

    return (
        <section dir ='rtl' className ='h-[calc(100vh)] overflow-y-scroll scrollbar-hidden'>
            
            <div  className ='flex items-center justify-between px-5 py-2 shadow-xl mb-2'>
               
                <div className ='flex items-center gap-2'>
                    <BackButton />
                    <h1 className ='text-sm font-semibold text-[#1a1a1a]'>اداره العملاء</h1>
                </div>
                                        
                <div className ='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
                    {Button.map(({ label, icon, action}) => {
                        return(
                            <button 
                                onClick = {() => handleOpenModal(action)}
                                className ='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
                                    font-semibold text-xs flex items-center gap-2 rounded-full'> 
                                {label} {icon}
                            </button>
                            )
                        })}
                </div>
                                    
                {isCustomerModalOpen && 
                <CustomerAdd 
                setIsCustomerModalOpen ={setIsCustomerModalOpen} 
                fetchCustomers ={fetchCustomers}
                />} 
                                    
            </div>

    
            {/* Search and sorting and Loading */}
                <div className="flex items-center px-15 py-2 shadow-xl">
                    <input
                        type="text"
                        placeholder="بحث ..."
                        className="border border-yellow-700 p-1 rounded-lg w-full text-xs font-semibold"
                        // max-w-md
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {/* Optional: Sort dropdown */}
                    <select
                        className="mr-4 border border-yellow-700 p-1  rounded-lg text-[#1a1a1a] text-xs font-semibold]"
                        value={sort}

                        onChange={(e) => {
                            setSort(e.target.value);
                            setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when changing sort
                        }}
                    >
                        <option value="-createdAt">Newest First</option>
                        <option value="createdAt">Oldest First</option>
                        <option value="customerName">By Name (A-Z)</option>
                        <option value="-customerName">By Name (Z-A)</option>
                        <option value ='balance'>Balance (Low to High)</option>
                    </select>
                </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="mt-4 flex gap-2 justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0ea5e9] text-xs"></div>
                    <span className="ml-2">تحميل...</span>
                </div>
            )}

            
            <div className ='mt-5 bg-white py-1 px-10'>
                      
            <div className ='overflow-x-auto'>
                <table className ='text-left w-full'>
                    <thead className =''>
                        <tr className ='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
                            <th className ='p-2'>العميل</th>
                            <th className ='p-2'>البريد اللاكتروني</th>
                            <th className ='p-2'>رقم الهاتف</th>
                            <th className ='p-2'>العنوان</th>
                            <th className ='p-2'>الرصيد</th>
                        
                            <th className ='p-1' style={{ marginRight: '0px'}}></th>  
                        </tr>
                    </thead>
                        
                <tbody>
                    
                    {/* {list.length === 0 
                    ? (<p className ='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>Your customers list is empty . Start adding customers !</p>) 
                    :list.map((customer, index) => ( */}
                    {
                    list.map((customer, index) => (
                    
                    <tr
                       // key ={index}
                        className ='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
                            hover:bg-[#F1E8D9] cursor-pointer'
                    >
                        <td className ='p-2' hidden>{customer._id}</td>
                        <td className ='p-2'>{customer.customerName}</td>
                        <td className ='p-2'>{customer.email}</td>
                        <td className ='p-2'>{customer.contactNo}</td>
                        <td className ='p-2'>{customer.address}</td>
                        <td className ={`p-2 ${customer.balance === 0 ? 'text-green-600' : 'text-[#be3e3f]'}`}>
                            {customer.balance.toFixed(2)}
                            <span className ='text-[#1a1a1a] font-normal'> ج.س</span>
                        </td>
                 
                        
                        <td className ='p-1 flex flex-wrap gap-2 justify-center bg-zinc-1' style={{ marginRight: '0px'}}>

                            <button className ={`cursor-pointer text-sm font-semibold `}>
                                <LiaEditSolid size ={20} 
                                className ='w-5 h-5 text-sky-600 rounded-full' 
                                onClick={() => handleEdit(customer)}
                                />
                            </button>
                            
                            <button 
                                className ={`text-[#be3e3f] cursor-pointer text-sm font-semibold`}>
                                <MdDeleteForever 
                                onClick={()=> {setSelectedCustomer(customer); setDeleteModalOpen(true); }} 
                                className ='w-5 h-5 text-[#be3e3f] rounded-full'/> 
                            </button>
                           
                                {detailsButton.map(({ label, icon, action }) => {
                                    return (
                                        <button className='cursor-pointer 
                                        rounded-lg text-green-600 font-semibold text-sm '
                                            onClick={() => handleDetailsModal(customer._id, customer.customerName, customer.balance, action)}
                                        >
                                            {label} {icon}
                                        </button>
                                    )
                                })}


                                {paymentButton.map(({ label, icon, action }) => {
                                    return (
                                        <button className='cursor-pointer 
                                        rounded-xs text-[#0ea5e9] text-xs font-normal flex items-center gap-1'
                                            onClick={() => handlePaymentModal(customer._id, customer.customerName, customer.balance, action)}
                                        >
                                            {label} {icon}
                                        </button>
                                    )
                                })}
                        </td>             
                    </tr>
               ))}
                    </tbody>
                        <tfoot>
                            <tr className="bg-[#F1E8D9] border-t-2 border-yellow-700 text-yellow-600 text-xs font-semibold">
                                <td className="p-2 text-[#1a1a1a]">{list.length}<span className='font-normal'> عميل</span></td>

                                <td className="p-2" colSpan={3}></td>
                                <td className="p-2"></td>
                                <td className="p-2" colSpan={1}></td>
                            </tr>
                        </tfoot>
                </table>
                {!loading && list.length === 0 && (
                    <p className ='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start '>
                        {search
                        ? `عفوا لايوجد عميل باسم  "${search}"` 
                        : `قائمه العملاء فارغه حاليا`}
                        
                    </p>
                )}


        <PaginationControls/>
            </div>
            
            {isDetailsModal && <DetailsModal setIsDetailsModal={setIsDetailsModal} />} 
           
            {isPaymentModal && 
            <CustomerPayment 
            setIsPaymentModal={setIsPaymentModal} 
            fetchCustomers= {fetchCustomers}
            />
            }    
                     
        </div>

            {isEditCustomerModal && currentCustomer && (
                <CustomerUpdate
                    customer= {currentCustomer}
                    setIsEditCustomerModal= {setIsEditCustomerModal}
                    fetchCustomers= {fetchCustomers}
                />
            )}

            <BottomNav />

            {/* Place the ConfirmModal here */}
            <ConfirmModal
                open={deleteModalOpen}
                customerName={selectedCustomer?.customerName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    removeCustomer(selectedCustomer._id);
                    setDeleteModalOpen(false);
                }}
            />

        </section>
    )
};


// You can put this at the bottom of your Services.jsx file or in a separate file
const ConfirmModal = ({ open, onClose, onConfirm, customerName }) => {
  if (!open) return null;
  return (
       <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(243, 216, 216, 0.4)' }}  //rgba(0,0,0,0.4)
    >
      
      <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
        {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
        <p className="mb-6">هل انت متاكد من مسح العميل  <span className="font-semibold text-red-600">{customerName}</span>?</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
            onClick={onClose}
          >
            الغاء
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            onClick={onConfirm}
          >
            مسح
          </button>
        </div>
      </div>

    </div>
  );
};

export default Customers ;
