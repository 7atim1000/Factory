import React, { useState, useEffect, useRef, useCallback } from 'react'
import BackButton from '../components/shared/BackButton';

import { LuPrinterCheck } from "react-icons/lu";


import { api } from '../https';
import { toast } from 'react-toastify'

import InvoiceDetails from '../components/invoice/InvoiceDetails';
   
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Invoices = () => {

    const [allInvoices, setAllInvoices] = useState([]);

    const [frequency, setFrequency] = useState('365');
    const [type, setType] = useState('bills');
    const [invoiceType, setInvoiceType] = useState('all');
    const [invoiceStatus, setInvoiceStatus] = useState('all');
    const [customer, setCustomer] = useState('all');
    const [supplier, setSupplier] = useState('all');
    const [shift, setShift] = useState('all');

    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [loading, setLoading] = useState(false);
  
    // fetch Invoices
    const fetchInvoices = useCallback(async () => {
        setLoading(true)
            try {
            const response = await api.post('/api/invoice/fetch' , 
            {
                    type,
                    frequency,
                    invoiceType,
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
                
                // setAllInvoices(response.data)
                // console.log(response.data)

            if (response.data.success) {
                setAllInvoices(response.data.data || []);
              
            } else {
                toast.error(response.data.message || 'invoices not found')
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
       //if (isInitialMount.current) {
        //    isInitialMount.current = false;
        //} else {
            fetchInvoices();
        //}
    }, [type, frequency, invoiceType, invoiceStatus, shift, search, sort]);

    // Percentage and count
    const totalInvoices = allInvoices.length;  

    const totalSaleInvoices = allInvoices.filter(
        (invoice) => invoice.invoiceType === "Sale invoice"
    );
    const totalBuyInvoices = allInvoices.filter(
        (invoice) => invoice.invoiceType  === "Purchase invoice" //&& invoice.invoiceStatus === "Completed" 
    );
    const totalIncomePercent = (totalSaleInvoices.length / totalInvoices) * 100 ;
    const totalExpensePercent = (totalBuyInvoices.length / totalInvoices) * 100 ;
    // Total amount 
    const totalTurnover = allInvoices.reduce((acc, invoice) => acc + invoice.bills.total, 0) ;
    const totalSaleTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Sale invoice').reduce((acc, invoice) => acc + invoice.bills.total, 0);
    
    const totalBuyTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Purchase invoice').reduce((acc, invoice) => acc + invoice.bills.total, 0);
    const totalSaleTaxTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Sale invoice').reduce((acc, invoice) => acc + invoice.bills.tax, 0);
    
    const totalWithTaxBuyTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Purchase invoice').reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0);
    const totalWithTaxSaleTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Sale invoice').reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0);

    // Percentage
    const totalSaleTurnoverPercent = (totalSaleTurnover / totalTurnover) * 100 ;
    const totalBuyTurnoverPercent = (totalBuyTurnover / totalTurnover) * 100 ;

    const data = [
        { name: 'مبيعات', value: totalSaleTurnover, color: '#10b981' },
        { name: 'مشتروات', value: totalBuyTurnover, color: '#0ea5e9' }
    ];

    // Printing
    const invoiceRef = useRef(null)
    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML
        const WinPrint = window.open("", "", "width=900, height=650")

        WinPrint.document.write(` 
                <html>
                    <head>
                        <title>اداره المبيعات والمشتروات</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            .receipt-container { width: 100%; }
                            h2 { text-align: center; }
                            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }
                            .IdTd {display: none ;}
                            .updateTd {display: none ;}
                            .statusTr {display: none ;}
                            .controls { display: none; }
                            .button { display: none; }
                            .backButton {display: none; }
                            .search {display : none; } 
                            .tdFooter {display : none; } 
                        </style>
                    </head>
                    <body>
                        ${printContent}
                    </body>
                </html>
            `)

        WinPrint.document.close()
        WinPrint.focus()
        setTimeout(() => {
            WinPrint.print()
            WinPrint.close()
        }, 1000)
    };

    return (
        <section dir ='rtl' className ='flex gap-3 h-[calc(100vh)] overflow-y-scroll scrollbar-hidden bg-[#f5f5f5]'>
            
            <div className ='flex-[3] bg-white h-[100vh] overflow-y-scroll scrollbar-hidden'>
                <div ref={invoiceRef} className=''>
                
              
                <div className ='flex items-center justify-between px-5 py-2 shadow-xl mb-2'>
                    <div className='backButton flex items-center gap-2'>
                        <BackButton />
                        <h1 className='text-xs font-semibold text-[#1a1a1a]'>اداره المبيعات والمشتروات</h1>
                    </div>
                    <div className='flex justify-end button  items-center cursor-pointer gap-3'>
                            <button
                                onClick={handlePrint}
                                className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                            >
                                <LuPrinterCheck className="w-4 h-4" />
                                طباعه
                            </button>
                    </div>
                </div>

          
                {/* Search and sorting and Loading */}
                <div className="search flex items-center px-15 py-2 shadow-xl gap-3 ">
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
                        className="ml-4 border border-yellow-700 p-1  rounded-lg text-[#1a1a1a] text-xs font-semibold]"
                        value={sort}

                        onChange={(e) => {
                            setSort(e.target.value);
                            setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when changing sort
                        }}
                    >
                        <option value="-createdAt">Newest First</option>
                        <option value="createdAt">Oldest First</option>
                    </select>
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="mt-4 flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-700"></div>
                        <span className="ml-2">تحميل ...</span>
                    </div>
                )}


                <div className ='mt-5 bg-white py-1 px-10'>

                    <div className='overflow-x-auto'>
                        <table className='text-left w-full'>
                            <thead className=''>
                                <tr className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
                                    <th className='p-1'></th>
                                    <th className='p-1 hide-print'></th>
                                    <th className='p-1 ml-0'></th>
                                    <th className='p-1'>الاصناف</th>
                                    
                                    <th className='p-1'>العميل</th>
                                    <th className='p-1'>المورد</th>
                                  
                                    <th className='p-1'>الاجمالي</th>
                                    <th className='p-1'>الضريبه</th>
                                    <th className='p-1'>الاجمالي الكلي</th>
                                    <th className='p-1'>المدفوع</th>
                                    <th className='p-1'>الرصيد</th>
                                    <th className='p-1 statusTr'>الحاله</th>
                                
                                </tr>
                            </thead>

                                 
                                <tbody>
                                    { 
                                    allInvoices.map((invoice) =>{  
                                    
                                    return (   
                                    <InvoiceDetails  
                                    fetchInvoices ={fetchInvoices}

                                    id ={invoice._id} date ={invoice.date} type ={invoice.invoiceType} shift ={invoice.shift} 
                                    length ={invoice.items === null? 'N/A' : invoice.items.length} customer ={invoice.customer === null? 'N/A' : invoice.customerName}
                                    supplier ={invoice.supplier === null? 'N/A' : invoice.supplierName} payment ={invoice.paymentMethod}total ={invoice.bills.total} tax={invoice.bills.tax}
                                    totalWithTax={invoice.bills.totalWithTax} payed={invoice.bills.payed} balance ={invoice.bills.balance} status={invoice.invoiceStatus} items={invoice.items}
                                    
                                    />
                                        )
                                      })
                                    }
                                </tbody> 
                           

                                 {/* Footer Section */}
                                {allInvoices.length > 0 && (

                            
                                    <tfoot className='bg-[#F1E8D9] border-t-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
                                        <tr>
                                            <td className='p-2' colSpan={1}>{allInvoices.length} فاتوره</td>
                                            
                                          
                                            <td className='p-2' colSpan={3}>
                                               مشتروات بقيمه : {allInvoices.filter(t => t.invoiceType === 'Purchase invoice')
                                               .reduce((sum, t) => sum + t.bills.totalWithTax, 0).toFixed(2)} 
                                            </td>

                                            
                                           <td className='p-2' colSpan={3}>
                                               مبيعات بقيمه : {allInvoices.filter(t => t.invoiceType === 'Sale invoice')
                                               .reduce((sum, t) => sum + t.bills.totalWithTax, 0).toFixed(2)} 
                                            </td>


                                           
                                       
                                            <td className='p-2' colSpan={3}>
                                                صافي الربح المتوقع : {(
                                                    allInvoices.filter(t => t.invoiceType === 'Sale invoice').reduce((sum, t) => sum + t.bills.totalWithTax, 0) -
                                                    allInvoices.filter(t => t.invoiceType === 'Purchase invoice').reduce((sum, t) => sum + t.bills.totalWithTax, 0)
                                                ).toFixed(2)} ر.ع
                                            </td>
                                            <td></td><td className ='tdFooter'></td>

                                        </tr>
                                     
                                    </tfoot>
                            )}


                        </table>
                        {!loading && allInvoices.length === 0 && (
                            <p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start '>
                                {search
                                    ? `عفوا لاتوجد فاتوره باسم  "${search}"`
                                    : `قائمه الفواتير فارغه حاليا !`}
                            </p>
                        )}
                                    
                    </div>
            
                </div>

                </div>
                    
            </div>            

            <div className ='flex-[1] bg-white px-2 py-3'>
                
                <div className="flex gap-2 items-center px-15 py-2 shadow-xl bg-white">
                    <select id='frequency' value={frequency} onChange={(e) => setFrequency(e.target.value)}
                        className='border-b border-yellow-700 rounded-sm px-2 py-1 text-sm'>
                        <option value='90'> 90 Days</option>
                        <option value='60'> 60 Days</option>
                        <option value='30'> 30 Days</option>
                        <option value='7'> 7 Days</option>
                        <option value='1'>1 Day</option>

                    </select>


                    <select id='orderStatus' value={invoiceStatus} onChange={(e) => setInvoiceStatus(e.target.value)}
                        className='border-b border-yellow-700 rounded-sm px-2 py-1 text-sm'>
                        <option value='all'>All</option>
                        <option value='In Progress'>In Progess</option>
                        <option value='Completed'>Completed</option>
                        <option value='Cancelled'>Cancelled</option>
                        <option value='Pending'>Pending</option>

                    </select>


                    <select id='shift' value={shift} onChange={(e) => setShift(e.target.value)}
                        className='border-b border-yellow-700 rounded-sm px-2 py-1 text-sm'>
                        <option value='all'>All</option>
                        <option value='Morning'>Morning</option>
                        <option value='Evening'>Evening</option>
                    </select>
                </div>

                <div className ='flex flex-col items-start mt-2 bg-white'>
                    <p className='text-xs text-[#1a1a1a] font-semibold ml-2 mb-2 mt-2'>عدد الفواتير :-</p>
                    
                    <div className='flex items-center justify-between w-full p-3 rounded-sm'>

                        <div className='flex  items-center justify-center gap-3'>
                            <p className ='text-xs font-normal text-[#1a1a1a] '>
                                <span className ='text-xs font-medium text-[#0ea5e9]'>فواتير المبيعات : </span>
                                {totalSaleInvoices.length}
                            <span className = 'text-xs font-normal text-[#0ea5e9]'> فاتوره</span>
                            </p>
                        </div>
                        <div className ='flex  items-center justify-center gap-3'>
                            <p className ='text-xs font-normal text-[#1a1a1a] '>
                                <span className ='text-xs font-medium text-[#0ea5e9]'>فواتير المشتروات : </span>
                                {totalBuyInvoices.length}
                            <span className = 'text-xs font-normal text-[#0ea5e9]'> فاتوره</span>
                            </p>
                        </div>
                    </div>

                </div>
              

               <p className ='text-xs text-[#1a1a1a] font-semibold ml-2 mb-2 mt-2'>الاجماليات :-</p>
                <div className ='flex flex-col items-start  bg-white rounded-sm'>
                    <div className ='flex items-center justify-between w-full px-1'>
                        
                        <div className ='flex items-center justify-betwee p-2'>
                            <p className ='font-semibold text-xs text-[#be3e3f]'>
                                <span className ='text-xs font-normal text-[#1a1a1a]'>ضريبه مبيعات : </span>
                                {totalSaleTaxTurnover.toFixed(2)}
                                <span className ='font-normal text-xs text-[#1a1a1a]'> ج.س</span>
                            </p>
                        </div>
                    
                        <div className='flex items-start justify-start p-2'>
                            <p className='font-semibold text-xs text-[#0ea5e9]'>
                                <span className='text-xs font-normal text-[#1a1a1a]'>اجمالي المبيعات : </span>
                                {totalSaleTurnover.toFixed(2)}<span className='font-normal text-xs text-black'> ج.س</span>
                            </p>
                        </div>
                    </div>

                    <div className ='flex items-center justify-between w-full px-1'>
                    
                        <div className='flex items-start justify-start p-2'>
                            <p className='font-semibold text-xs text-emerald-600'>
                                <span className='text-xs font-normal text-[#1a1a1a]'>الاجمالي الكلي للمبيعات </span>
                                {totalWithTaxSaleTurnover.toFixed(2)}
                                <span className='font-normal text-xs text-[#1a1a1a]'> ج.س</span>
                            </p>
                        </div>

                        <div className='flex items-end justify-end  p-2'>
                            <p className='font-semibold text-xs text-[#0ea5e9]'>
                                <span className='text-xs font-normal text-[#1a1a1a]'>اجمالي المشتروات </span>
                                {totalBuyTurnover.toFixed(2)}
                                <span className='font-normal text-xs text-[#1a1a1a]'> ج.س</span>
                            </p>
                        </div>

                    </div>

                    <div className ='flex items-center justify-between w-full px-1'>
                      
                        <div className ='flex items-end justify-end  p-2'>
                            <p className ='font-semibold text-xs text-emerald-600'>
                                <span className ='text-xs font-normal text-[#1a1a1a]'>الاجمالي الكلي للمشتروات </span>
                                {totalWithTaxBuyTurnover.toFixed(2)}
                                <span className ='font-normal text-xs text-black'> ج.س</span>
                            </p>
                        </div>

                        <div className='flex items-end justify-end  p-2'>
                            <p className={`${totalSaleTurnover - totalBuyTurnover <= 0 ? 'text-[#0ea5e9]' : 'text-green-600'} text-center font-semibold text-xs`}>
                                <span className='text-xs font-normal text-[#1a1a1a] '>الربح المتوقع </span>
                                {(totalWithTaxSaleTurnover - totalWithTaxBuyTurnover).toFixed(2)}
                                <span className='font-normal text-xs text-black'> ج.س</span></p>

                        </div>
                    </div>


                </div>

              

                <div className='flex flex-col items-start mt-10'>
                    <p className='text-xs text-[#0ea5e9] font-semibold ml-2 mb-2 mt-2'>توضيح بياني :-</p>

                    <div className='w-full h-50'>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className='flex justify-between w-full mt-2 text-xs'>
                        <div className='text-center'>
                            <div className='w-4 h-4 bg-green-500 rounded-full mx-auto mb-1'></div>
                            <div>بيع :  <span className ='text-green-600'>{totalWithTaxSaleTurnover.toFixed(2)}</span> ج.س</div>
                            <div className='text-green-600 font-semibold'>{totalSaleTurnoverPercent.toFixed(0)}%</div>
                        </div>
                        <div className='text-center'>
                            <div className='w-4 h-4 bg-[#0ea5e9] rounded-full mx-auto mb-1'></div>
                            <div>شراء :  <span className ='text-[#0ea5e9]'>{totalWithTaxBuyTurnover.toFixed(2)}</span> ج.س</div>
                            <div className='text-[#0ea5e9] font-semibold'>{totalBuyTurnoverPercent.toFixed(0)}%</div>
                        </div>
                    </div>
                </div>   
            </div>
        </section>
    );
};

export default Invoices ;