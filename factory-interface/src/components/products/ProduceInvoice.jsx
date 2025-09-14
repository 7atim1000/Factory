import React, { useRef } from 'react'
import { motion } from 'framer-motion'

const ProduceInvoice = ({produceInfo, setShowInvoice}) => {

    const invoiceRef = useRef(null);
    
    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML;
        const WinPrint = window.open("", "", "width=900, height=650");
        
        WinPrint.document.write(` 
            <html dir="rtl">
                <head>
                    <title>فاتوره انتاج</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            padding: 5px;
                            direction: rtl;
                            text-align: right;
                        }
                        .receipt-container { 
                            width: 100%; 
                        }
                        h2 { 
                            text-align: center; 
                            margin-bottom: 15px;
                            font-size: 24px;
                        }
                        p { 
                            margin: 8px 0; 
                            font-size: 16px; 
                        }
                        ul { 
                            list-style: none; 
                            padding: 0; 
                            margin: 0;
                        }
                        ul li {
                            display: flex;
                            justify-content: space-between;
                            padding: 8px 0;
                            border-bottom: 1px solid #f1f5f9;
                            direction: rtl;
                        }
                        .flex {
                            display: flex;
                        }
                        .justify-between {
                            justify-content: space-between;
                        }
                        .items-center {
                            align-items: center;
                        }
                        .text-xs {
                            font-size: 14px;
                        }
                        .text-sm {
                            font-size: 16px;
                        }
                        .mt-4 {
                            margin-top: 16px;
                        }
                        .border-t {
                            border-top: 1px solid #e2e8f0;
                        }
                        .pt-4 {
                            padding-top: 16px;
                        }
                        .mb-2 {
                            margin-bottom: 8px;
                        }
                        .nb-4 {
                            margin-bottom: 16px;
                        }
                        .p-4 {
                            padding: 16px;
                        }
                        .rounded-full {
                            border-radius: 50%;
                        }
                        .w-12 {
                            width: 48px;
                        }
                        .h-12 {
                            height: 48px;
                        }
                        .border-8 {
                            border-width: 8px;
                        }
                        .border-\\[\\#0ea5e9\\] {
                            border-color: #0ea5e9;
                        }
                        .text-2xl {
                            font-size: 24px;
                        }
                        .text-xl {
                            font-size: 20px;
                        }
                        .font-bold {
                            font-weight: bold;
                        }
                        .text-center {
                            text-align: center;
                        }
                        .text-gray-700 {
                            color: #374151;
                        }
                        .font-semibold {
                            font-weight: 600;
                        }
                    </style>
                </head>
                <body>
                ${printContent}
                </body>
            </html>
        `);
        WinPrint.document.close();
        WinPrint.focus();
        setTimeout(() => {
            WinPrint.print();
            WinPrint.close();
        }, 1000);
    }

    const handleClose = () => {
        setShowInvoice(false)
    };
    
    return (
        <div className='fixed inset-0 bg-opacity-50 flex justify-center items-center' 
        style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }} >
            <div className='bg-white p-4 rounded-lg shadow-lg w-[400px]'>
                {/* Receipt content for printing */}
                <div ref={invoiceRef} className='p-4'>
                    {/*Receipt Header*/}
                    <div className='flex justify-center nb-4'>
                        <motion.div
                           initial={{ scale: 0, opacity: 0 }}
                           animate={{ scale: 1.0, opacity: 1 }}
                           transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
                           className='mt-0 w-12 h-12 border-8 border-[#0ea5e9] rounded-full flex items-center'
                        >
                        <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                            className='text-2xl'    
                        >
                        </motion.span>
                        </motion.div>
                    </div>

                    <h2 className='text-xl font-bold text-center mb-2'>فاتوره انتاج</h2>
                    
                    {/*Order Details*/}
                    <div className='mt-4 border-t pt-4 text-sm text-gray-700'>
                        <p>
                            <strong>رقم الفاتوره : </strong>
                            {produceInfo.invoiceNumber} 
                        </p>
                        <p>
                            <strong>تاريخ الانتاج : </strong>
                            {new Date(produceInfo.date).toLocaleDateString('en-GB')}
                        </p>
                    </div>

                    {/*Items Summary*/}
                    <div className='mt-4 border-t pt-4'>
                        <h3 className='text-sm font-semibold'>الاصناف </h3>
                            <ul className='text-sm text-gray-700'>
                                {produceInfo.items.map((item, index) => (
                                    <li 
                                        key={index}
                                        className='flex justify-between items-center text-xs'
                                    >
                                        <span>
                                            {item.name} - {item.quantity}
                                        </span>
                                        <span>ج.س {item.price.toFixed(2)}</span>
                                    </li>
                                ))}  
                            </ul>
                    </div>

                    {/*Bills Summary */}
                    <div className='mt-4 border-t pt-4 text-sm'>
                        <p className='mt-2'>
                            <strong className='text-xs'>انتاج بقيمه : </strong> <span className='text-xs'>ج.س </span>
                            <span className='text-xs font-semibold'>{produceInfo.bills.totalWithTax.toFixed(2)}</span>
                        </p>
                    </div>
                </div>
                
                {/** Buttons */}
                <div className='flex justify-between mt-4 border border-gray-300 rounded-sm'>
                    <button
                        onClick={handlePrint}
                        className='text-[#0ea5e9] font-semibold hover underline text-xs px-4 py-2 rounded-lg cursor-pointer'
                    >  
                        طباعه
                    </button>
                    <button
                        onClick={handleClose}
                        className='text-[#be3e3f] font-semibold hover: underline text-xs px-4 py-2 rounded-lg cursor-pointer'
                    >
                        اغلاق
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProduceInvoice;