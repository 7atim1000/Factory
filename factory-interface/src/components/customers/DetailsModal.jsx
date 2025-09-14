import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { api } from '../../https'
import { IoCloseCircle } from "react-icons/io5";
import { FaPrint } from "react-icons/fa";

const DetailsModal = ({ setIsDetailsModal }) => {
    const customerData = useSelector((state) => state.customer)
    const customer = customerData.customerId

    const [customerInvoices, setCustomerInvoices] = useState([])
    const [loading, setLoading] = useState(false)
    
    // State for pagination, sort and search
    const [currentPage, setCurrentPage] = useState(1)
    const [invoicesPerPage, setInvoicesPerPage] = useState(10)
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOrder] = useState('desc')
    const [searchTerm, setSearchTerm] = useState('')
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)

    // Fetch customer invoices with pagination, sort and search
    const fetchCustomerDetails = async () => {
        setLoading(true)
        try {
            const response = await api.post('/api/invoice/customerDetails', {
                customer,
                page: Number(currentPage),        // Convert to number
                limit: Number(invoicesPerPage),   // Convert to number
                sortBy: sortBy,
                sortOrder: sortOrder,
                search: searchTerm
            })

            if (response.data.success) {
                setCustomerInvoices(response.data.data)
                setTotalPages(response.data.pagination.totalPages)
                setTotalItems(response.data.pagination.totalItems)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log('Error details:', error.response?.data)
            toast.error(error.response?.data?.message || 'Error fetching invoices')
        } finally {
            setLoading(false)
        }
    };




    // Helper functions for pagination and sorting
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
    }

    const handleSortChange = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(field)
            setSortOrder('desc')
        }
    }

    const handleSearch = (term) => {
        setSearchTerm(term)
        setCurrentPage(1) // Reset to first page when searching
    }

    const handleInvoicesPerPageChange = (value) => {
        setInvoicesPerPage(value)
        setCurrentPage(1) // Reset to first page when changing items per page
    }

    useEffect(() => {
        fetchCustomerDetails()
    }, [customer, currentPage, invoicesPerPage, sortBy, sortOrder, searchTerm])

    // Printing
    const invoiceRef = useRef(null)
    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML
        const WinPrint = window.open("", "", "width=900, height=650")

        WinPrint.document.write(` 
            <html>
                <head>
                    <title>Customer Statement</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .receipt-container { width: 100%; }
                        h2 { text-align: center; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .controls { display: none; }
                        .pagination { display: none; }
                        .button { display: none; }
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
    }

    return (
        <div dir='rtl' className="fixed inset-0 flex items-center justify-center z-50" 
        style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }}>

            <div className='bg-white p-2 rounded-sm shadow-lg/30 w-[50vw] max-w-6xl md:mt-1 mt-1 h-[calc(100vh)] 
            overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-hidden'>
                {/* Receipt content for printing */}
                <div ref={invoiceRef} className=''>

                  

                    <div className ='flex flex-col shadow-xl bg-white'>
                       
                        <div className='flex justify-between items-center p-2'>
                            <h2 className='text-sm font-bold text-center mb-2 text-[#1a1a1a]'>كشف حساب العملاء</h2>

                            <div className='button flex justify-end items-center cursor-pointer gap-3'>
                                <button onClick={handlePrint} className='rounded-full text-[#0ea5e9] hover:bg-[#0ea5e9]/30 
                                cursor-pointer rounded-xs'>
                                    <FaPrint size={22} />
                                </button>
                                <button onClick={() => setIsDetailsModal(false)} className='rounded-full text-[#be3e3f] hover:bg-[#be3e3f]/30 
                                cursor-pointer rounded-xs border-b border-[#be3e3f]'>
                                    <IoCloseCircle size={22} />
                                </button>

                            </div>

                        </div>
                        
                        <div className ='flex items-center justify-between p-1'>
                            <p className={`text-center text-xs font-normal text-[#0ea5e9]`}>
                                العميل : <span className='text-xs text-[#1a1a1a] font-semibold'>
                                    {customerData.customerName}</span>
                            </p>
                            <p className ='text-xs font-normal text-[#0ea5e9]'>رصيده الحالي : 
                                <span className ='text-xs  text-[#1a1a1a] font-semibold'> {customerData.balance}</span>
                                <span className ='text-xs text-[#0ea5e9] font-normal'> ر.ع</span>
                            </p>

                        </div>
                        
                    </div>

                 
                    {/* Search and Controls - hidden in print */}
                    <div className='flex justify-center flex-wrap gap-2 mb-4 mt-5 controls'>
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="بحث ..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="border border-[#d2b48c] p-1 rounded-sm text-xs"
                            />
                        </div>
                        
                        <select
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="border p-1 border-[#d2b48c] rounded-sm text-xs"
                        >
                            <option value="createdAt">Date Created</option>
                            <option value="invoiceNumber">Invoice Number</option>
                            <option value="invoiceType">Invoice Type</option>
                            <option value="bills.total">Total Amount</option>
                        </select>
                        
                        <select 
                            value={invoicesPerPage} 
                            onChange={(e) => handleInvoicesPerPageChange(Number(e.target.value))}
                            className="border border-[#d2b48c] p-1 rounded text-xs"
                        >
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                            <option value={50}>50 per page</option>
                        </select>
                    </div>

                    <div className='mt-2 overflow-x-auto'>
                        <div className='overflow-x-auto px-5'>
                            <table className='w-full text-left text-[#1a1a1a] h-[calc(100vh-30rem)]'>
                                <thead className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
                                    <tr>
                                        <th className='p-2'></th>
                                        <th className='p-2'>نوع الاجراء</th>
                                        <th className='p-2'>رقم الاجراء</th>
                                        <th className='p-2'>اجمالي</th>
                                        <th className='p-2'>ضريبه</th>
                                        <th className='p-2'>اجمالي كلي</th>
                                        <th className='p-2'>المدفوع</th>
                                        <th className='p-2'>الرصيد</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className='p-2 text-center'>
                                                تحميل ...
                                            </td>
                                        </tr>
                                    ) : customerInvoices.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className='p-2 text-center text-xs text-[#be3e3f]'>
                                                قائمه كشف الحساب فارغه حاليا !
                                            </td>
                                        </tr>
                                    ) : (
                                        customerInvoices.map((invoice, index) => (
                                            <tr
                                                key={index}
                                                className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
                                                    hover:bg-[#F1E8D9] cursor-pointer'
                                            >
                                                <td className='p-2 font-semibold bg-zinc-100'>{new Date(invoice.date).toLocaleDateString('en-GB')}</td>
                                                <td className='p-2 font-semibold bg-zinc-100'>{invoice.invoiceType}</td>
                                                <td className='p-2'>{invoice.invoiceNumber}</td>
                                                <td className='p-2'>{invoice.bills.total.toFixed(2)}</td>
                                                <td className='p-2'>{invoice.bills.tax.toFixed(2)}</td>
                                                <td className='p-2'>{invoice.bills.totalWithTax.toFixed(2)}</td>
                                                <td className='p-2 text-blue-600'>{invoice.bills.payed.toFixed(2)}</td>
                                                <td className='p-2'>{invoice.bills.balance.toFixed(2)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>

                                <tfoot> 
                                    <tr className="bg-[#F1E8D9] border-t-2 border-yellow-700 text-yellow-700 text-xs font-semibold">
                                        <td className="p-2" colSpan={3}>اجماليات</td>
                                        <td className="p-2">{customerInvoices.reduce((acc, invoice) => acc + invoice.bills.total, 0).toFixed(2)}</td>
                                        <td className="p-2">{customerInvoices.reduce((acc, invoice) => acc + invoice.bills.tax, 0).toFixed(2)}</td>
                                        <td className="p-2">{customerInvoices.reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0).toFixed(2)}</td>
                                        <td className="p-2">{customerInvoices.reduce((acc, invoice) => acc + invoice.bills.payed, 0).toFixed(2)}</td>
                                        <td className="p-2">{customerInvoices.reduce((acc, invoice) => acc + invoice.bills.balance, 0).toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Pagination - hidden in print */}
                    <div className="pagination flex justify-between items-center mt-4 controls">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || loading}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
                        >
                            Previous
                        </button>
                        
                        <span className="text-sm">
                            Page {currentPage} of {totalPages} | Total Invoices: {totalItems}
                        </span>
                        
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || loading}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
                        >
                            Next
                        </button>
                    </div>
                </div>

                
            </div>
        </div>
    )
}

export default DetailsModal