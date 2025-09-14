import React, {useState, useEffect} from 'react'
import BottomNav from '../components/shared/BottomNav';
import Greetings from '../components/home/Greetings';
import ErpMenu from '../components/home/ErpMenu';

import { api } from '../https';

import { IoStatsChartSharp } from "react-icons/io5";
import MiniCard from '../components/home/MiniCard';
import { FaFileInvoice } from "react-icons/fa";
import { BsCashCoin } from 'react-icons/bs'
import HomeInvoicesList from '../components/home/HomeInvoiceList';
// stone-500  slate-500  [#D2B48C] bg-[#D2B48C]

const Home = () => {
 
    // stores and invoices frequency
    const [frequency, setFrequency] = useState('1');

    // invoices
    const [sale, setSale] = useState([]);
    const [purchase, setPurchase] = useState([]);
    const [production, setProduction] = useState([]);

    const [type, setType] = useState('bills');
    const [invoiceType, setInvoiceType] = useState('all');
    const [invoiceStatus, setInvoiceStatus] = useState('all');
    const [customer, setCustomer] = useState('all');
    const [supplier, setSupplier] = useState('all');
    const [shift, setShift] = useState('all');

    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');


    const [incomeList, setIncomeList] = useState([]);
    const [expenseList, setExpenseList] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('all');
    const [incomeType, setIncomeType] = useState('Income');
    const [expenseType, setExpenseType] = useState('Expense');
    

    const fetchSale = async () => {
        try {
            const response = await api.post('/api/invoice/fetch' , 
             {
                    type,
                    frequency,
                    invoiceType:'Sale invoice',
                    invoiceStatus,
                    customer,
                    supplier,
                    shift,

                    search,
                    sort,
                    
                    page: 1,
                    limit: 1000
                },
            );

            setSale(response.data)
            console.log(response.data)

            if (response.data.success) {
                setSale(response.data.data || []);

            } else {
                toast.error(response.data.message || 'invocies not found')
            }


        } catch (error) {
            console.log(error)
        }
    };

    const fetchPurchase = async () => {
        try {
            const response = await api.post('/api/invoice/fetch',
                {
                    type,
                    frequency,
                    invoiceType:'Purchase invoice',
                    invoiceStatus,
                    customer,
                    supplier,
                    shift,

                    search,
                    sort,

                    page: 1,
                    limit: 1000
                },
            );

            setPurchase(response.data)
            console.log(response.data)

            if (response.data.success) {
                setPurchase(response.data.data || []);

            } else {
                toast.error(response.data.message || 'invocies not found')
            }

        } catch (error) {
            console.log(error)
        }
    };

    const fetchProduction = async () => {
        try {
            const response = await api.post('/api/invoice/fetch',
                {
                    type: 'production',
                    frequency,
                    invoiceType: 'Production invoice',
                    invoiceStatus,
                    customer,
                    supplier,
                    shift,

                    search,
                    sort,

                    page: 1,
                    limit: 1000
                },
            );

            setProduction(response.data)
            console.log(response.data)

            if (response.data.success) {
                setProduction(response.data.data || []);

            } else {
                toast.error(response.data.message || 'invocies not found')
            }

        } catch (error) {
            console.log(error)
        }
    };

       
    const fetchIncome = async () => {
        try {
            const response = await api.post('/api/transactions/get-transactions',
                {
                    paymentMethod,
                    frequency,
                    type: incomeType,
                    shift,
                    search,
                    sort,
                    page: 1,
                    limit: 1000
                },
            );

            setIncomeList(response.data.data || response.data.transactions || []);
            // console.log(response.data.data)

            if (response.data.success) {
                setIncomeList(response.data.data || response.data.transactions || []);

            } else {
                toast.error(response.data.message || 'invocies not found')
            }

        } catch (error) {
            console.log(error)
        }
    };

    const fetchExpense = async () => {
        try {
            const response = await api.post('/api/transactions/get-transactions',
                {
                    paymentMethod,
                    frequency,
                    type: expenseType,
                    shift,
                    search,
                    sort,
                    page: 1,
                    limit: 1000
                },
            );

            setExpenseList(response.data.data || response.data.transactions || []);
        

            if (response.data.success) {
                setExpenseList(response.data.data || response.data.transactions || []);

            } else {
                toast.error(response.data.message || 'invocies not found')
            }

        } catch (error) {
            console.log(error)
        }
    };


    useEffect(() => {
        fetchSale(), fetchPurchase(), fetchProduction(), fetchIncome(), fetchExpense()
    }, [frequency,  shift, invoiceType,  invoiceStatus, shift, search, sort, paymentMethod, incomeType, expenseType]);

    return (
        <section dir='rtl' className='bg-[#f5f5f5] h-[calc(100vh-5rem)] overflow-hidden flex gap-3'>

            <div className='flex-[3]  bg-white'>

                <div className='bg-white mt-0 bg-white'>
                    <Greetings />
                </div>

                <div className='mt-1 px-5 py-2 flex justify-between flex-wrap shadow-xl bg-[#f5f5f5]'>
                    <ErpMenu />
                </div>


                <div className ='flex flex-col gap-1 mt-2 px-10 bg-white mt-3'>
                  
                    <div className='flex items-center w-full gap-3 px-8 '>
                        <MiniCard title='مبيعات' icon ={<BsCashCoin className='w-4 h-4 text-white' />} 
                        number ={sale.reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0).toFixed(2)} />
                      
                        <MiniCard title='مشتروات' icon ={<FaFileInvoice className='w-4 h-4 text-white' />} 
                        number ={purchase.reduce((acc, invo) => acc + invo.bills.totalWithTax, 0).toFixed(2)} />
                    </div>
                </div>
                <div className='flex flex-col gap-1 mt-2 px-10 bg-white mt-3'>

                    <div className='flex items-center w-full gap-3 px-8 '>
                        <MiniCard title='ايرادات' icon={<IoStatsChartSharp className='w-4 h-4 text-white' />}
                            number={incomeList.reduce((acc, income) => acc + income.amount, 0).toFixed(2)} />

                        <MiniCard title='مصروفات' icon={<IoStatsChartSharp className='w-4 h-4 text-white' />}
                            number={expenseList.reduce((acc, expense) => acc + expense.amount, 0).toFixed(2)} />
                    </div>
                </div>

                <div className='flex flex-col gap-1 mt-2 px-10 bg-white mt-3'>
                 
                    <div className='flex items-center w-full gap-3 px-8'>
                      
                        <MiniCard title='انتاج' icon={<FaFileInvoice className='w-6 h-6 text-white' />} 
                        number={production.reduce((acc, invo) => acc + invo.bills.total, 0).toFixed(2)} />
                    </div>
                </div>

            </div>

            <div className='flex-[2] bg-white'>

                <div className='flex flex-col gap-5'>
                    <HomeInvoicesList />
                </div> 


            </div>

            <BottomNav />

        </section>
    );
};



export default Home;