import React, { useState } from 'react'

import { MdDelete, MdOutlineAddToDrive } from "react-icons/md";
import BackButton from '../components/shared/BackButton';
import { FiEdit3 } from "react-icons/fi";

import { getBgColor } from '../utils';

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api, getExpenses } from '../https';

import { toast } from 'react-toastify'
import ExpenseAdd from '../components/transactions/ExpenseAdd';
import BottomNav from '../components/shared/BottomNav';


const Expense = () => {
    const Button = [
        { label: 'اضافه حساب', icon: <MdOutlineAddToDrive className='text-yellow-700' size={20} />, action: 'expense' }
    ];

    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

    const handleOpenModal = (action) => {
        if (action === 'expense') setIsExpenseModalOpen(true);
    };
    
    // fetch expenses
    const { data: responseData, IsError } = useQuery({
        queryKey: ['expenses'],

        queryFn: async () => {
            return await getExpenses();
        },

        placeholderData: keepPreviousData,
    });


    if (IsError) {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }

    console.log(responseData);

    // remove Expense
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);    
    const [selectedExpenses, setSelectedExpenses] = useState(null);   
    const removeExpense = async (id) => {

        try {
            const response = await api.post('/api/expenses/remove', { id },)

            if (response.data.success) {

                //Update the LIST after Remove
                toast.success('تم مسح الحساب بنجاح')
                window.location.reload();


            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };


    return (
        <section dir ='rtl' className ='h-[100vh] overfllow-y-scroll scrollbar-hidden'>
            <div className='flex items-center justify-between px-8 py-2 shadow-xl  mb-2'>

                <div className='flex items-center'>
                    <BackButton />
                    <h1 className='text-sm font-semibold text-black'>اداره حسابات المصروفات</h1>
                </div>
                <div className='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
                    {Button.map(({ label, icon, action }) => {
                        return (
                            <button
                                className='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
                                    font-semibold text-xs flex items-center gap-2 rounded-full'

                                onClick={() => handleOpenModal(action)}
                            >
                                {label} {icon}
                            </button>
                        )
                    })}


                </div>
                {isExpenseModalOpen && <ExpenseAdd setIsExpenseModalOpen={setIsExpenseModalOpen} />}

            </div>


            <div className='grid grid-cols-5 gap-4 px-10 py-4 mt-0 w-[100%] rounded-sm'>
                {responseData?.data.data.length === 0
                    ? (<p className='w-full text-sm text-[#be3e3f] flex justify-center'>قائمه حسابات المصروفات فارغه حاليا .</p>)
                    : responseData?.data.data.map(expense => (

                        <div key={expense.expenseName} 
                        className='flex items-center justify-between bg-[#f5f5f5] px-3 rounded-xs h-[70px] cursor-pointer
                    shadow-lg/10 bg-[#F1E8D9]'
                           
                        >

                            <div className='flex justify-between w-full shadow-lg/30'>
                                <div className='items-start px-3'>
                                    <h1 className='text-xs font-semibold text-[#1a1a1a]'>{expense.expenseName}</h1>
                                </div>

                                <div className='items-end flex gap-1 px-3'>
                                    {/* <FiEdit3 size={20} className='w-5 h-5 text-sky-500 rounded-full' /> */}
                                    <MdDelete onClick={() => { setSelectedExpenses(expense); setDeleteModalOpen(true); }}
                                    size={20} 
                                    className='w-6 h-6 text-[#be3e3f] rounded-full' 
                                    />
                                </div>

                            </div>
                        </div>
                    ))}
            </div>


            <BottomNav />

            <ConfirmModal
                open={deleteModalOpen}
                ExpenseName={selectedExpenses?.expenseName}
       
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    removeExpense(selectedExpenses._id);
                    setDeleteModalOpen(false);
                }}
            />
        </section>
    )
};


const ConfirmModal = ({ open, onClose, onConfirm, ExpenseName}) => {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(243, 216, 216, 0.4)' }}  //rgba(0,0,0,0.4)
        >

            <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px] text-sm font-normal">
                {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
                <p className="mb-6">هل انت متأكد من حذف حساب   
                    <span className="font-semibold text-[#0ea5e9]"> {ExpenseName}</span> ؟</p>
                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        onClick={onClose}
                    >
                        الغاء
                    </button>
                    <button
                        className="px-4 py-2 rounded  text-white bg-[#be3e3f] cursor-pointer"
                        onClick={onConfirm}
                    >
                        مسح
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Expense ;