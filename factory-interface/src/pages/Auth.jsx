import React , {useState} from 'react' ;
import brick from '../assets/images/brick.jpg' 
import { BsBricks } from "react-icons/bs";
import Register from '../components/auth/Register';
import Login from '../components/auth/Login';

const Auth = () => {
    const [isRegister, setIsRegister] = useState(false);
    // declares a state variable and function to update it
    return (
        <div dir='rtl' className='flex min-h-screen w-full overflow-y-scroll scrollbar-hidden'>
          
            {/*right section */}
            <div className='w-1/2 min-h-screen bg-white p-1'>
                <div className='flex flex-col items-center gap-2'>
                    <BsBricks className='h-14 w-14 rounded-full p-1 text-yellow-700' />
                    <h1 className='teext-lg font-semibold text-black'>مصنع الطابوق الاسمنتي</h1>
                </div>

                <h2 className='text-xl text-center mt-5 font-semibold text-yellow-700 mb-7'>{isRegister ? "Employee Registeration" : "دخول"}</h2>

                {isRegister ? <Register setIsRegister={setIsRegister} /> : <Login />}

                <div className='flex justify-center mt-6'>
                    <p className='text-sm text-white'>{isRegister ? "Already have an account ?" : "Don't have a account ? "}</p>
                    <p className='text-[#f5f5f5]'>-</p>
                    
                    <a
                        onClick={() => setIsRegister(!isRegister)}
                        href='#'
                        className='text-white text-sm font-semibold hover:underline hover:text-orange-700'
                    >{isRegister ? "Sign in" : "Sign up"}
                    </a>
                </div>
            </div>


             {/*left section */}
            <div className='w-1/2 relative flex items-center justify-center bg-cover' >
                {/**bg Image */}
                <div className="w-[100%] h-[100%]">
                    <img className="w-full h-full" src={brick} alt="Brick image" />
                </div>
                {/*Black overlay */}
                <div className='absolute inset-0  bg-opacity-80'></div>

                {/*Quote at bottom */}
                <blockquote className='absolute bottom-10 px-8 mb-10 text-blue-900 text-lg italic '>
                    <br />
                    <span className='block mt-4 text-[#1f1f1f] text-md'></span>
                </blockquote>
            </div>



        </div>
    )
};


export default Auth ;