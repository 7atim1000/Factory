import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../https';
import { toast } from 'react-toastify';
import { IoCloseCircle } from 'react-icons/io5';

const TransactionUpdate = ({ transaction, setIsEditTransactionModal, fetchTransactions }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Payment method options
    const paymentMethods = [
        { value: "Cash", label: "Cash" },
        { value: "Online", label: "Online" }
        //     { value: "Cash", label: "Cash" },
    //     { value: "Credit Card", label: "Credit Card" },
    //     { value: "Debit Card", label: "Debit Card" },
    //     { value: "Bank Transfer", label: "Bank Transfer" },
    //     { value: "Digital Wallet", label: "Digital Wallet" },
    //     { value: "Check", label: "Check" }
    
    ];

    const [formData, setFormData] = useState({
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        refrence: transaction.refrence,
        description: transaction.description,
        paymentMethod: transaction.paymentMethod || "نقدي", // Add paymentMethod with default
        status: 'updated'
    });

    // Fetch categories when component mounts
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            // Fetch both incomes and expenses
            const [incomesResponse, expensesResponse] = await Promise.all([
                api.get('/api/incomes/'),
                api.get('/api/expenses/')
            ]);

            if (incomesResponse.data.success) {
                setIncomes(incomesResponse.data.data || []);
            }
            
            if (expensesResponse.data.success) {
                setExpenses(expensesResponse.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const { data } = await api.put(`/api/transactions/${transaction._id}`, formData);
            if (data.success) {
                // toast.success(data.message);
                toast.success('تم تعديل الاجراء المحاسبي بنجاح')
                fetchTransactions();
                handleClose();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const handleClose = () => {
        setIsEditTransactionModal(false);
    };

    if (loading) {
        return (
            <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center z-50'
                style={{ backgroundColor: 'rgba(145, 143, 143, 0.4)' }}>
                <div className='bg-white p-6 rounded-lg shadow-lg'>
                    <p>Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div dir='rtl'  className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/30 z-50'
            style={{ backgroundColor: 'rgba(145, 143, 143, 0.4)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)] overflow-y-auto'
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-2 shadow-xl p-2">
                    <h2 className='text-[#1a1a1a] text-sm font-bold'>تعديل الاجراء</h2>
                    <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer border-b border-[#be3e3f]'>
                        <IoCloseCircle size={22} />
                    </button>
                </div>

                {/* Modal Body */}
                <form className='mt-3 space-y-6 p-2 text-sm' onSubmit={onSubmitHandler}>
                    {/* Type Radio Buttons */}
                    <div className='flex items-center justify-between'>
                        <label className='text-[#1f1f1f] block mb-2 mt-3 text-xs font-normal'>النوع:</label>
                        <div className='flex items-center gap-3 rounded-lg p-3 bg-white shadow-lg/30'>
                            <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${
                                formData.type === 'Income' 
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
                                />
                                <span className='text-green-500'>💰</span>
                                <span className='text-xs font-semibold'>Income</span>
                            </label>

                            <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${
                                formData.type === 'Expense' 
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
                                />
                                <span className='text-red-500'>💸</span>
                                <span className='text-xs font-semibold'>Expense</span>
                            </label>
                        </div>
                    </div>

                    {/* Category Dropdown - Conditionally Rendered */}
                    {formData.type === 'Income' && (
                        <div className='flex items-center justify-between'>
                            <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>الحساب :</label>
                            <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                                <select
                                    className='w-full bg-zinc-100 h-8 rounded-sm text-xs font-normal'
                                    name='category'
                                    value={formData.category}
                                    onChange={handleInputChange}
                                >
                                    <option value="">اختر اسم الحساب</option>
                                    {incomes && incomes.map((income, index) => (
                                        <option key={index} value={income.incomeName || income.name}>
                                            {income.incomeName || income.name}
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
                                    name='category'
                                    value={formData.category}
                                    onChange={handleInputChange}
                                >
                                    <option value="">اختر اسم الحساب</option>
                                    {expenses && expenses.map((expense, index) => (
                                        <option key={index} value={expense.expenseName || expense.name}>
                                            {expense.expenseName || expense.name}
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
                                name='paymentMethod'
                                value={formData.paymentMethod}
                                onChange={handleInputChange}
                            >
                                {paymentMethods.map((method, index) => (
                                    <option key={index} value={method.value}>
                                        {method.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className='flex items-center justify-between'>
                        <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>المبلغ :</label>
                        <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='number'
                                name='amount'
                                value={formData.amount}
                                onChange={handleInputChange}
                                placeholder='المستلم او الدافع ان وجد'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal border-b border-yellow-700'
                                required
                                autoComplete='off'
                            />
                        </div>
                    </div>

                    {/* Reference */}
                    <div className='flex items-center justify-between'>
                        <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>المرجع :</label>
                        <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='text'
                                name='refrence'
                                value={formData.refrence}
                                onChange={handleInputChange}
                                placeholder='المرجع ...'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal border-b border-yellow-700'
                                autoComplete='off'
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className='flex items-center justify-between'>
                        <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>الوصف :</label>
                        <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
                            <input
                                type='text'
                                name='description'
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder='الوصف ...'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal border-b border-yellow-700'
                                autoComplete='off'
                            />
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='p-3 rounded-xs mt-3 py-3 text-sm bg-[#0ea5e9] text-white font-semibold cursor-pointer w-full'
                    >
                        تعديل
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default TransactionUpdate;