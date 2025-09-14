import React from 'react'

const MiniCard = ({title, icon , number, footerNum}) => {
    
    return (
        <div className= 'bg-white py-3 px-5 rounded-lg w-[50%] shadow-lg/30 border-b-3 border-[#e3d1b9]'>
            <div className='flex items-start justify-between'>  
                <h1 className='text-[#0ea5e9] font-semibold text-xs tracking-wide'>{title}</h1>
                <button className={` ${title === 'مبيعات' ? 'bg-green-600 ' : 'bg-[#0ea5e9]' }
                    ${title === 'انتاج' ? 'bg-[#f6b100]' : '' }
                    ${title === 'مصروفات' ? 'bg-[#be3e3f]' : '' }
                    ${title === 'ايرادات' ? 'bg-green-600' : '' } 
                
                    p-3 rounded-sm text-white text-sm mt-2 shadow-xl`}>{icon}</button>
            </div>
           
            <div>
                <h1 className={`text-lg font-bold 
                    ${title === 'مصروفات' ? 'text-[#be3e3f]' : 'text-[#1a1a1a]'}`}>
                    <span className ='text-xs font-normal text-[#1a1a1a]'>ج.س </span>
                    {number}
                </h1>
          
            </div>
        </div>
    )
};

export default MiniCard;