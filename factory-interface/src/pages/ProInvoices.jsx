import React, { useState, useEffect, useRef, useCallback } from 'react'
import BackButton from '../components/shared/BackButton';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { LuPrinterCheck } from "react-icons/lu";

import { api } from '../https';
import { toast } from 'react-toastify'

import InvoiceDetails from '../components/invoice/InvoiceDetails';
   
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const ProInvocies = () => {

    const [allInvoices, setAllInvoices] = useState([]);

    const [frequency, setFrequency] = useState('365');
    const [type, setType] = useState('production');
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
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            fetchInvoices();
        }
    }, [type, frequency, invoiceType, invoiceStatus, shift, search, sort]);

    
    // Printing
    const invoiceRef = useRef(null)
    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML
        const WinPrint = window.open("", "", "width=900, height=650")

        WinPrint.document.write(` 
                <html>
                    <head>
                        <title>اداره الانتاج</title>
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
                            .tdFooter { display: none ;}
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
        <section dir ='rtl' className ='gap-3 h-[calc(100vh)] overflow-y-scroll scrollbar-hidden bg-[#f5f5f5]'>
            
            <div className ='bg-white h-[100vh] overflow-y-scroll scrollbar-hidden'>
                <div ref={invoiceRef} className=''>
                
              
                <div className ='flex items-center justify-between px-5 py-2 shadow-xl mb-2'>
                    <div className='backButton flex items-center gap-2'>
                        <BackButton />
                        <h1 className='text-sm font-semibold text-[#1a1a1a]'>اداره الانتاج</h1>
                    </div>
                    <div className='flex justify-end button  items-center cursor-pointer gap-3'>
                            <button
                                onClick={handlePrint}
                                className="bg-blue-500 shadow-lg/30 cursor-pointer hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                            >
                                <LuPrinterCheck className="w-4 h-4" />
                                طباعه
                            </button>
                    </div>
                </div>

          
                {/* Search and sorting and Loading */}
                <div className="search flex items-center px-15 py-2 gap-2 bg-white shadow-xl">
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

                    <div className="flex gap-2 items-center px-5 py-2 shadow-xl bg-white">
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
                                    <th className='p-1 ml-0'></th>
                                    <th className='p-1'>الاصناف</th>
                                
                                    <th className='p-1'>انتاج بقيمه</th>
                                    <th className='p-1 statusTr'>الحاله</th>
                                
                                </tr>
                            </thead>

                                 
                            


                                <tbody>

                                    {allInvoices.length === 0
                                        ? (<p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>قائمه فواتير الانتاج فارغه حاليا .</p>)
                                        : allInvoices.map((production, index) => (

                                            <tr
                                                key={index}
                                                className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
                                                                            hover:bg-[#F1E8D9] cursor-pointer'
                                            >
                                                <td className='IdTd p-1' hidden>{production._id}</td>
                                                <td className='p-1'>{production.date ? new Date(production.date).toLocaleDateString('en-GB') : ''}</td>
                                                <td className={`${production.shift === 'Morning' ? 'text-[#e6b100]' :
                                                    'text-[#0ea5e9]'
                                                    } p-1`}>{production.shift}
                                                </td>
                                                <td className='p-1'>{production.items.length}</td>

                                            

                                                <td className='p-1'>{production.bills.totalWithTax.toFixed(2)}</td>
                                             
                                                <td className='p-1'> {production.invoiceStatus}</td>
                                            </tr>
                                        ))}
                                </tbody>


                                {/* Footer Section */}
                                {allInvoices.length > 0 && (


                                    <tfoot className='bg-[#F1E8D9] border-t-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
                                        <tr>
                                            <td className='p-2' colSpan={1}>{allInvoices.length} فاتوره</td>

                                            <td  className='p-2' colSpan={3}>
                                                انتاج بقيمه : {allInvoices.filter(t => t.type === 'production')
                                                .reduce((sum, t) => sum + t.bills.totalWithTax, 0).toFixed(2)} ر.ع
                                            </td>
                                           

                                            <td></td>
                                            <td className='tdFooter'></td>

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

        </section>
    );
};

export default ProInvocies ;