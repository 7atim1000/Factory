import React ,{useState, useEffect, useRef, useCallback,} from 'react'

import { MdDeleteForever, MdOutlineAddToDrive } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";

import { api } from '../https';
import { toast } from 'react-toastify'
import BackButton from '../components/shared/BackButton';
import bricks from '../assets/images/brickProduct.jpg' 


import BottomNav from '../components/shared/BottomNav';

import ProductAdd from '../components/products/ProductAdd';
import ProductEdit from '../components/products/ProductEdit';


const Products = () => {
    
    const addBtn = [{ label: 'اضافه منتج', action: 'product', icon: <MdOutlineAddToDrive className='text-yellow-700' size={20} /> }]

    const [isAddProductModal, setIsAddProductModal] = useState(false)
    const handleAddProductModal = (action) => {
        if (action === 'product') setIsAddProductModal(true)
    };

    //fetch items
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');

    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
    });

    const [loading, setLoading] = useState(false);

    const [isEditProductModal, setIsEditProductModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const fetchProducts = async () => {
     setLoading(true);

        try {
            const response = await api.post('/api/product/fetch',
                {
                    search,
                    sort,
                    page: pagination.currentPage,
                    limit: pagination.itemsPerPage
                }
            )

            if (response.data.success) {
                setList(response.data.data || []);
                console.log(response.data.data)

                if (response.data.pagination) {
                    setPagination(prev => ({
                        ...prev,  // Keep existing values
                        currentPage: response.data.pagination.currentPage ?? prev.currentPage,
                        itemsPerPage: response.data.pagination.limit ?? prev.itemsPerPage,
                        totalItems: response.data.pagination.total ?? prev.totalItems,
                        totalPages: response.data.pagination.totalPages ?? prev.totalPages
                    }));
                };

            } else {
                toast.error(response.data.message || 'Empty products list')
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } 
        finally {
            setLoading(false);
        }

    }

    const isInitialMount = useRef(true);
    useEffect(() => {
       // if (isInitialMount.current) {
       //     isInitialMount.current = false;
       // } else {
            fetchProducts();
       // }
    }, [search, sort, pagination.currentPage, pagination.itemsPerPage]);

    
    
    // Handle edit
    const handleEdit = (product) => {
        setCurrentProduct(product);
        setIsEditProductModal(true);
    };



    // remove 
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const removeProduct = async (id) => {

        try {
            const response = await api.post('/api/product/remove', { id },)

            if (response.data.success) {
                // toast.success(response.data.message)
                 toast.success('تم مسح المنتج بنجاح')

                //Update the LIST after Remove
                await fetchProducts();

            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };

    
    // pagination
    const PaginationControls = () => {

        const handlePageChange = (newPage) => {
            setPagination(prev => ({
                ...prev,
                currentPage: newPage
            }));
        };

        const handleItemsPerPageChange = (newItemsPerPage) => {
            setPagination(prev => ({
                ...prev,
                itemsPerPage: newItemsPerPage,
                currentPage: 1  // Reset to first page only when items per page changes
            }));
        };


        return (  //[#0ea5e9]
            <div className="flex justify-between items-center mt-2 py-2 px-5 bg-white shadow-lg/30 rounded-lg
            text-xs font-medium border-b border-yellow-700 border-t border-yellow-700">
                <div>
                    Showing
                    <span className='text-yellow-700'> {list.length} </span>
                    of
                    <span className='text-yellow-700'> {pagination.totalItems} </span>
                    records
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="px-2 py-1 shadow-lg/30 border-b border-yellow-700
                        text-xs font-normal disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="px-3 py-1">
                        Page
                        <span className='text-yellow-700'> {pagination.currentPage} </span>
                        of
                        <span className='text-yellow-700'> {pagination.totalPages} </span>
                    </span>

                    <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-2 py-1 shadow-lg/30 border-b border-yellow-700 text-xs font-normal disabled:opacity-50"
                    >
                        Next
                    </button>

                    <select
                        value={pagination.itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        className="border-b border-yellow-700 px-2 font-normal shadow-lg/30"
                    >
                        <option value="5">5 per page</option>
                        <option value="10">10 per page</option>
                        <option value="20">20 per page</option>
                        <option value="50">50 per page</option>
                    </select>
                </div>
            </div>
        );
    };

    // decorater decorate template

    return (
        <section dir ='rtl' className ='overflow-y-scroll scrollbar-hidden h-[calc(100vh)]'>

            <div className='flex justify-between items-center px-5 py-2 shadow-xl'>
                <div className='flex items-center'>
                    <BackButton />
                    <h1 className='text-sm font-semibold text-[#1a1a1a]'>اداره المنتجات</h1>
                </div>

                <div className='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
                    {addBtn.map(({ label, icon, action }) => {
                        return (
                            <button className='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
                                font-semibold text-xs flex items-center gap-2 rounded-full'
                                 onClick={() => handleAddProductModal(action)}
                            >
                                {label} {icon}
                            </button>
                        )
                    })}

                </div>

                {isAddProductModal &&
                    <ProductAdd
                        setIsAddProductModal= {setIsAddProductModal}
                        fetchProducts= {fetchProducts}

                    />}

            </div>
            {/* Search and sorting */}
            <div className="flex items-center px-15 py-2 shadow-xl gap-2">
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
                    <option value="category">By Categories (A-Z)</option>
                    <option value="serviceName">By Name (A-Z)</option>
                    <option value="-serviceName">By Name (Z-A)</option>
                </select>
            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="mt-4 flex justify-center text-xs font-normal">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0ea5e9] text-xs font-normal"></div>
                    <span className="ml-2">تحميل ...</span>
                </div>
            )}


            {/** table  */}
            <div className='mt-5 bg-white py-1 px-10'>

                <div className='overflow-x-auto'>
                    <table className='text-right w-full'>
                        <thead className=''>
                            <tr className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>

                                <th className='p-1'>اسم المنتج</th>
                                <th className='p-1'>سعر البيع</th>
                                <th className='p-1'>رصيد الكميه</th>

                                <th className='p-1'></th>
                                <th className='p-1'></th>
                            </tr>
                        </thead>

                        <tbody>

                            {/* {list.length === 0
                                ? (<p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>Your items list is empty . Start adding items !</p>)
                                : list.map((item, index) => ( */}
                            {
                                list.map((product, index) => (
                                    <tr
                                        key ={index}
                                        className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
                                        hover:bg-[#F1E8D9] cursor-pointer'
                                    >
                                        <td className='p-1' hidden>{product._id}</td>
                                        <td className='p-1'>{product.productName}</td>
                                        <td className='p-1'>{product.price}<span className='text-xs font-normal text-yellow-700'> AED</span></td>
                                        
                                        <td className='p-1'>{product.qty}
                                            <span> {product.unit}</span>
                                        </td>

                                        <td className='p-1'>
                                            <img className='rounded-full border-b-2 border-yellow-700 w-9 h-9' 
                                            src={product.image || bricks} />
                                        </td>
                                        <td className='p-1'>

                                            <button className={`text-[#0ea5e9] cursor-pointer text-sm font-semibold `}>
                                                <LiaEditSolid size={20}
                                                    className='w-5 h-5 text-[#ea5e9] rounded-full'
                                                    onClick={() => handleEdit(product)}
                                                />
                                            </button>

                                            <button className={`text-[#be3e3f] cursor-pointer text-sm font-semibold`}>
                                                <MdDeleteForever
                                                    onClick={() => { setSelectedProduct(product); setDeleteModalOpen(true); }} size={20}
                                                    className='w-5 h-5 text-[#be3e3f] rounded-full'
                                                />
                                            </button>
                                        </td>
                                    </tr>

                                ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-[#F1E8D9] border-t-2 border-emerald-600 text-emerald-600 text-xs font-semibold">

                                <td className="p-2 text-[#1a1a1a]">{list.length}<span className='font-normal'> منتج</span></td>

                                <td className="p-1" colSpan={4}></td>

                            </tr>
                        </tfoot>
                    </table>
                    {!loading && list.length === 0 && (

                        <p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>
                            {search
                                ? `عفوا لايوجد منتج باسم "${search}"`
                                : `قائمه المنتجات فارغه حاليا !`}
                        </p>

                    )}
                    {/* Pagination  */}
                    {list.length > 0 && <PaginationControls />}
                </div>
            </div>

            {/* Edit Service Modal */}
            {isEditProductModal && currentProduct && (
                <ProductEdit
                    product ={currentProduct}
                    setIsEditProductModal={setIsEditProductModal}
                    fetchProducts={fetchProducts}
                />
            )}




            <ConfirmModal

                open={deleteModalOpen}
                productName={selectedProduct?.productName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    removeProduct(selectedProduct._id);
                    setDeleteModalOpen(false);
                }}
            />
            <BottomNav />
        </section>
    )
};


const ConfirmModal = ({ open, onClose, onConfirm, productName }) => {
  if (!open) return null;
  return (
       <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(56, 2, 2, 0.4)' }}  //rgba(0,0,0,0.4)
    >
      
      <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
        {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
        <p className="mb-6">هل انت متأكد من مسح المنتج  <span className="font-semibold text-red-600">{productName}</span> ؟</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-white hover:bg-gray-300 cursor-pointer shadow-lg/30 text-sm"
            onClick={onClose}
          >
            الغاء
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-[#be3e3f] cursor-pointer shadow-lg/30 text-sm"
            onClick={onConfirm}
          >
            مسح
          </button>
        </div>
      </div>

    </div>
  )};


export default Products ;
