import React, { useState } from 'react'
import { TbHomeFilled } from "react-icons/tb";
import { MdReorder } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import { CgMoreVertical } from "react-icons/cg";

import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
// stone-200
    return (
        <div className ='bg-linear-65 from-[#f5f5f5] to-white shadow-lg/30  flex items-center justify-around  
        bottom-0 left-0 right-0 h-15 fixed border-t border-yellow-700 z-50 '>
            <p className ='text-yellow-700 text-md font-semibold shadow-lg/30 p-2 bg-[#f5f5f5]'>Copyright 2025@ microcode.com - All Right Reserved.</p>
        </div>
    );
};


export default BottomNav;