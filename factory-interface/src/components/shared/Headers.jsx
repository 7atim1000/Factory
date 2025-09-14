import React from 'react'
import { BsBricks } from "react-icons/bs";
import { FaUserCircle } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';

import { useMutation } from '@tanstack/react-query';


import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const Headers = () => {
  
    const userData = useSelector(state => state.user);
    const navigate = useNavigate();

    return(
        <header dir="rtl" className='flex justify-between items-center py-2 px-8 bg-linear-65 from-[#f5f5f5] to-white
                border-b border-yellow-700 shadow-lg/30'>

            <div className='flex items-center justify-content gap-2'>
                <BsBricks className='h-10 w-10 text-yellow-700 rounded-full' />
                <h1 className='text-md font-semibold text-[#1a1a1a]'>مصنع الطابوق الاسمنتي</h1>
            </div>

            


            <div className='flex items-center gap-4'>

                <div className='flex items-center gap-3'>
                    {/* <FaCircleUser className ='text-yellow-700 h-10 w-10' size={30}/> */}
                    <img className='h-10 w-10 rounded-full cursor-pointer border-b-3 border-amber-900' src={userData.image}
                        onClick={() => navigate('/profile')}
                    />

                    <div className='flex flex-col item-start'>

                        <h1 className='text-xs text-black font-semibold cursor-pointer'
                            onClick={() => navigate('/profile')}
                        >{userData.name || 'Username'}
                        </h1>

                        <p className='text-xs text-zinc-500 cursor-pointer'
                            onClick={() => navigate('/profile')}
                        >{userData.role || 'Role'}
                        </p>
                    </div>

                </div>


            </div>


        </header>

    )
};


export default Headers ;