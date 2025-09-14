import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IoCloseCircle } from "react-icons/io5";
import { useSelector } from 'react-redux'

import { toast } from 'react-toastify';
import { api } from '../../https';

const TransactionAdd = ({ setIsAddTransactionModalOpen, fetchTransactions }) => {

    const userData = useSelector((state) => state.user); 
    const [formData, setFormData] = useState({
        amount: "", 
        type: "", 
        category: "", 
        refrence: "", 
        description: "", 
        transactionNumber: `${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        user: userData._id,
        paymentMethod: "نقدي" // Default payment method
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setIsAddTransactionModalOpen(false)
    };

    function getCurrentShift() {
        const hour = new Date().getHours();
        return (hour >= 6 && hour < 18) ? 'Morning' : 'Evening';
    }

    const formDataWithShift = {
        ...formData,
        shift: getCurrentShift(),
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/transactions/add-transaction', formDataWithShift)

            if (response.data.success) {
                // toast.success(response.data.message);
                toast.success('تم اضافه الاجراء المحاسبي بنجاح');
                fetchTransactions();
                setIsAddTransactionModalOpen(false);
            } else {
                toast.error(response.data.message || 'Failed to add transaction!');
            }

        } catch (error) {
            toast.error('Failed to add new transaction!')
        }
    };

    // Fetch expenses for selection
    const [list, setList] = useState([])
    const fetchList = async () => {
        try {
            const response = await api.get('/api/expenses/')
            if (response.data.success) {
                setList(response.data.expenses);
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };

    // Fetch incomes for selection
    const [incomes, setIncome] = useState([])
    const fetchIncomes = async () => {
        try {
            const response = await api.get('/api/incomes/')
            if (response.data.success) {
                setIncome(response.data.incomes);
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };

    useEffect(() => {
        fetchList();
        fetchIncomes();
    }, [])

    // Payment method options
    const paymentMethods = [
        { value: "Cash", label: "Cash" },
        { value: "Online", label: "Online" },
        // { value: "Debit Card", label: "Debit Card" },
        // { value: "Bank Transfer", label: "Bank Transfer" },
        // { value: "Digital Wallet", label: "Digital Wallet" },
        // { value: "Check", label: "Check" }
    ];

    return (
        <div dir='rtl' className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }}>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)] overflow-y-scroll scrollbar-hidden'
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-2 shadow-xl p-2">
                    <h2 className='text-[#1a1a1a] text-sm font-bold'>اضافه اجراء</h2>
                    <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer border-b border-[#be3e3f]'>
                        <IoCloseCircle size={22} />
                    </button>
                </div>

                {/* Modal Body */}
                <form className='mt-5 space-y-6 text-sm' onSubmit={handleSubmit}>

                    {/* Type Selection */}
                    <div className='flex items-center justify-between'>
                        <label className='text-[#1f1f1f] block mb-2 mt-3 text-sm font-normal'>النوع :</label>
                        <div className='flex items-center gap-3 rounded-lg p-3 bg-white shadow-lg/30'>
                            <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${formData.type === 'Income'
                                    ? 'bg-green-50 text-green-700 ring-2 ring-green-500'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}>
                                <input
                                    type='radio'
                                    name='type'
                                    value='Income'
                                    checked={formData.type === 'Income'}
                                    onChange={handleInputChange}
                                    className='hidden'
                                    required
                                />
                                <span className='text-green-500'>💰</span>
                                <span className='text-xs font-semibold'>Income</span>
                            </label>

                            <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${formData.type === 'Expense'
                                    ? 'bg-red-50 text-red-700 ring-2 ring-red-500'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}>
                                <input
                                    type='radio'
                                    name='type'
                                    value='Expense'
                                    checked={formData.type === 'Expense'}
                                    onChange={handleInputChange}
                                    className='hidden'
                                    required
                                />
                                <span className='text-red-500'>💸</span>
                                <span className='text-xs font-semibold'>Expense</span>
                            </label>
                        </div>
                    </div>

                    {/* Conditionally render category dropdown based on selected type */}
                    {formData.type === 'Income' && (
                        <div className='flex items-center justify-between'>
                            <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>الحساب :</label>
                            <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                                <select
                                    className='w-full bg-zinc-100 h-8 rounded-sm text-xs font-normal'
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    name='category'
                                    required
                                >
                                    <option value="">اختر اسم الحساب ...</option>
                                    {incomes.map((income, index) => (
                                        <option key={index} value={income.incomeName}>
                                            {income.incomeName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {formData.type === 'Expense' && (
                        <div className='flex items-center justify-between'>
                            <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>الحساب :</label>
                            <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                                <select
                                    className='w-full bg-zinc-100 h-8 rounded-sm text-xs font-normal'
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    name='category'
                                    required
                                >
                                    <option value="">اختر اسم الحساب</option>
                                    {list.map((expense, index) => (
                                        <option key={index} value={expense.expenseName}>
                                            {expense.expenseName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Payment Method Field */}
                    <div className='flex items-center justify-between'>
                        <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>طريقه الدفع :</label>
                        <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <select
                                className='w-full bg-zinc-100 h-8 rounded-sm text-xs font-normal'
                                value={formData.paymentMethod}
                                onChange={handleInputChange}
                                name='paymentMethod'
                                required
                            >
                                {paymentMethods.map((method, index) => (
                                    <option key={index} 
                                        value={method.value}>
                                        {method.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                        <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>المبلغ :</label>
                        <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='text'
                                name='amount'
                                value={formData.amount}
                                onChange={handleInputChange}
                                placeholder='مبلغ الصرف او الايراد'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                        <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>المرجع :</label>
                        <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='text'
                                name='refrence'
                                value={formData.refrence}
                                onChange={handleInputChange}
                                placeholder='اسم المستلم او الدافع ان وجد'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                        <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>الوصف :</label>
                        <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='text'
                                name='description'
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder='وصف الاجراء ان وجد'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                        <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>التاريخ :</label>
                        <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='date'
                                name='date'
                                value={formData.date}
                                onChange={handleInputChange}
                                placeholder='تاريخ الاجراء'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='p-3 rounded-xs mt-2 py-3 text-sm bg-[#0ea5e9] text-white font-semibold cursor-pointer w-full'
                    >
                        اضافه
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default TransactionAdd;