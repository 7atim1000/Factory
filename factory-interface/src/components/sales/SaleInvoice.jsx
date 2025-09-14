import React, { useRef } from 'react'
import { motion } from 'framer-motion'
//import { faCheck } from 'react-icons/fa6'

const SaleInvoice = ({saleInfo, setShowInvoice}) => {

    const invoiceRef = useRef(null);
    
    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML;
        const WinPrint = window.open("", "", "width=900, height=650");
        
        WinPrint.document.write(` 
            <html>
                <head>
                    <title>Order Receipt</title>
                    <style>
                        body { fonst-family: Arial, sans-serif; padding: 20px; }
                        .receip-container { width: 300px; border: 1px solid #ddd; padding: 10px;}

                        h2 {text-align: center;}
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
            // window.location.reload();
        }, 1000);
    }


    const handleClose = () => {
        setShowInvoice(false)
        // window.location.reload();

    };
    
    return (

        <div className ='fixed inset-0 bg-opacity-50 flex justify-center items-center' 
        style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }} >
            <div className = 'bg-white p-4 rounded-lg shadow-lg  w-[400px]'>
                {/* Receipt content for printing */}
                <div ref ={invoiceRef} className ='p-4'>
                    
                    {/*Receipt Header*/}
                    <div className ='flex justify-center nb-4'>
                        <motion.div
                           initial ={{ scale: 0, opacity: 0 }}
                           animate ={{ scale: 1.0, opacity: 1 }}
                           transition ={{ duration: 0.5, type: "spring", stiffness: 150 }}
                           className ='mt-0 w-12 h-12 border-8 border-[#0ea5e9] rounded-full flex items-center'
                        >
                        <motion.span
                            initial ={{ scale: 0, opacity: 0 }}
                            animate ={{ scale: 1 }}
                            transition ={{ delay: 0.3, duration: 0.3 }}
                            className ='text-2xl'    
                        >

                        </motion.span>
                        </motion.div>

                    </div>

                    <h2 className ='text-xl font-bold text-center mb-2'>فاتوره مبيعات</h2>
                    <p className ={`text-center text-gray-600`}>Thank you for your order</p>
                    
                    {/*Order Details*/}
                    <div className ='mt-4 border-t pt-4  text-sm text-gray-700'>
                        <p>
                            <strong>تاريخ الفاتوره : </strong>
                            {new Date(saleInfo.date).toLocaleDateString('en-GB')}
                        </p>
                        <p>
                            <strong>رقم الفاتوره : </strong>
                            {saleInfo.invoiceNumber} 
                        </p>
                        <p>
                            <strong>العميل / السيد : </strong> {saleInfo.customerName} 
                        </p>
                        {/* <p>
                            <strong>Phone: </strong> {orderInfo.customerDetails.phone} 
                        </p>    
                        <p>
                            <strong>Guests: </strong> {orderInfo.customerDetails.guests}
                        </p> */}
                    </div>

                    {/*Items Summary*/}
                    <div className ='mt-4 border-t pt-4'>
                        <h3 className ='text-sm font-semibold'>الاصناف </h3>
                            <ul className ='text-sm text-gray-700'>
                                {saleInfo.items.map((item, index) => (
                                    <li 
                                        key= {index}
                                        className ='flex justify-between items-center text-xs'
                                    >
                                        <span>
                                            {item.name} - {item.quantity}
                                        </span>
                                        <span>ر.ع {item.price.toFixed(2)}</span>
                                    </li>
                                ))}  
                            </ul>
                    </div>
 

                    {/*Bills Summery */}
                    <div className ={`mt-4 border-t pt-4 text-sm`}>
                        <p className ='flex gap-1'>
                            <span className ='text-sm font-semibold'>الاجمالي : </span>
                            <span className ='text-xs'>ر.ع </span>
                            <span className ='text-sm font-semibold'>{saleInfo.bills.total.toFixed(2)}</span>  
                        </p>
                        <p>
                             <span className ='text-sm font-semibold'>ضريبه : </span>
                             <span className ='text-xs'>ر.ع </span>
                             <span className ='text-sm font-semibold'>{saleInfo.bills.tax.toFixed(2)}</span>
                        </p>
                        <p className ='mt-2'>
                            <strong className ='text-xs'>الاجمالي الكلي : </strong> 
                            <span className ='text-xs'>ر.ع </span>
                            <span className ='text-sm font-semibold'>{saleInfo.bills.totalWithTax.toFixed(2)}</span>
                        </p>
                    </div>

                    {/**payment Details */}
                    <div className ={`mb-2 mt-2 border-t pt-4 text-xs`}>
                        {saleInfo.paymentMethod === 'Cash' || 'Online'? (
                            <p>
                               <strong>طريقه الدفع : </strong>{" "}
                               {saleInfo.paymentMethod}  
                            </p>
                        ): (
                            <>
                            {/*Online payment */}
                            </>
                        )}
                      
                    </div>

                    
                </div>
                
                {/** Buttons */}
                <div className ='flex justify-between mt-4 border border-gray-300 rounded-sm'>

                    <button
                        onClick={handlePrint}
                        className ='text-[#0ea5e9] font-semibold hover underline text-xs px-4 py-2 rounded-lg cursor-pointer'
                    >  
                        Print Receipt
                    </button>
                    <button
                        onClick={handleClose}
                        className ='text-[#be3e3f] font-semibold hover: underline text-xs px-4 py-2 rounded-lg cursor-pointer'
                    >
                        Close
                    </button>

                </div>
            </div>
        </div>
    );
};


export default SaleInvoice;