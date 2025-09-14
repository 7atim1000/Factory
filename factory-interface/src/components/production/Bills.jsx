import React ,{ useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { getTotalPrice } from '../../redux/slices/produceSlice';
import { removeAllProduce } from '../../redux/slices/produceSlice';

import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { toast } from 'react-toastify'
import { addInvoice,  api } from '../../https';

import ProduceInvoice from '../products/ProduceInvoice';



const Bills = ({fetchProducts}) => {

    // total Accounting
    const dispatch = useDispatch();
    
    // to get from slices

    const produceData = useSelector(state => state.produce);
    const userData = useSelector((state) => state.user);

    const total = useSelector(getTotalPrice);

    const taxRate = 0;
    const calculations = useMemo(() => {
        const tax = (total * taxRate) / 100;
        const totalPriceWithTax = total + tax;
        return { tax, totalPriceWithTax };
    }, [total]);


    const [showInvoice, setShowInvoice] = useState(false);
    const [produceInfo, setProduceInfo] = useState();



    const handlePlaceOrder = async () => {
            

        if (produceData.length === 0) {
            enqueueSnackbar('الرجاء اختيار المنتجات المنتجه', { variant: "warning" });
            return;
        }


            const updatedItems = produceData.map(item => ({
                id: item.id, // or item._id, depending on your schema
                quantity: item.quantity // the quantity to subtract from stock
            }));

            await api.post('/api/product/update-producequantities', { product: updatedItems });
            
            ////////////////////End Update quantity.....
        
        const produceOrderData = {
            type :'production',
           
            invoiceNumber : `${Date.now()}`,
            customer : null,  customerName :null,
            supplier : null, supplierName : null,
        
            // to save Status
            invoiceStatus: "Completed",
            invoiceType : "Production invoice",

            // to save TOTALS   || NEEDED            
            productionBills: {
                total: total.toFixed(2),
                tax: (calculations.tax).toFixed(2),
                totalWithTax: (calculations.totalPriceWithTax).toFixed(2),

                payed: 0,
                balance: 0,
            },
            bills: {
                total: total.toFixed(2),
                tax: (calculations.tax).toFixed(2),
                totalWithTax: (calculations.totalPriceWithTax).toFixed(2),

                payed: 0,
                balance: 0,
            },
        
            // to save New Items || NEEDED
            items: produceData,
            paymentMethod: null,
    
            user: userData._id,
    
        };
        
        setTimeout(() => {
            produceMutation.mutate(produceOrderData);
        }, 1500);
    
    }

    const produceMutation = useMutation ({ 
    mutationFn: (reqData) => addInvoice(reqData),
                      
        onSuccess: (resData) => {
            const { data } = resData.data; // data comes from backend ... resData default on mutation
            console.log(data);
                           
            setProduceInfo(data)  // to show details in report            
               
            //enqueueSnackbar('Order Placed!', {variant: "success"});
            toast.success('تم حفظ وتأكيدالانتاج بنجاح  .') ;

       
 
        
                    
            setShowInvoice(true); // to open report 
       
            dispatch(removeAllProduce());
            fetchProducts({  page: 1}) // to refresh services quantity
            
        },
                           

            onError: (error) => {
                console.log(error);
            }
        });
    
    

    const cancelOrder = () => {
         
      
        dispatch(removeAllProduce());
        fetchProducts({ page: 1}) // to refresh services quantity
       
    }
    
    
    return (
        <>
        <div className ='flex bg-[#f5f5f5] items-center justify-between shadow-lg/30 p-2'>
            <p className ='text-xs text-[#1a1a1a] font-normal'>الاصناف : {produceData.length}</p>
            <p className ='text-[#1a1a1a]'>
                <span className ='text-xs font-normal'>انتاج بقيمه : </span>
                <span className ='text-sm font-normal'>{total.toFixed(2)}</span>
                <span className ='text-xs font-normal text-yellow-700'> ر.ع</span>
            </p>
        </div>

        {/* <div className ='flex bg-[#f5f5f5] items-center justify-between p-2 mt-1 shadow-lg/30'>
            <p className ='text-xs text-[#1a1a1a] font-normal'>ضريبه (5.25%)</p>
            <p className ='text-[#1a1a1a]'><span className ='text-sm font-normal'>
                {calculations.tax.toFixed(2)}</span>
            <span className ='text-xs font-normal text-yellow-700'> ج.س</span></p>
        </div> */}

        <div className ='flex bg-[#f5f5f5] items-center justify-between p-2 mt-1 shadow-lg/30'>
            <p className ='text-xs text-[#1a1a1a] font-normal'>اجمالي الانتاج :</p>
            <p className ='text-yellow-700'><span className ='text-md font-semibold'>
                {calculations.totalPriceWithTax.toFixed(2)}</span>
                <span className ='text-xs font-normal text-[#1a1a1a]'> ر.ع</span>
            </p>
        </div>

       


            <div className='flex items-center justify-between mt-15 bg-white p-5 shadow-lg/30'>

               <div className='flex flex-col items-center gap-3 px-5 py-2 w-full '>
                     <button className='bg-[#0ea5e9] px-4 py-4 w-full rounded-sm text-white cursor-pointer font-semibold 
                    text-sm font-medium shadow-lg/30'
                        onClick={handlePlaceOrder}
                    >
                        تأكيد
                    </button>
                    <button className='bg-emerald-600  py-4 w-full rounded-sm  cursor-pointer font-semibold text-white text-sm 
                    font-medium shadow-lg/30'>
                        طباعه
                    </button>
                    <button className='bg-[#be3e3f]/90 px-4 py-4 w-full rounded-sm text-white cursor-pointer font-semibold 
                    text-sm font-medium shadow-lg/30'
                        onClick={cancelOrder}
                    >
                        الغاء
                    </button>
                </div>


            </div>

            {showInvoice && (
                <ProduceInvoice produceInfo={produceInfo} setShowInvoice={setShowInvoice} />
            )}
        
        </>
    );
}


export default Bills ;