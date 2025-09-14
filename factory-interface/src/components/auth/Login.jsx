import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../https/index';
import { enqueueSnackbar } from 'notistack'   // for message 
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/userSlice';


const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const[formData, setFormData] = useState({
        email : "", password :"",
    }) 

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

   
    const handleLogin = (e) => {
        e.preventDefault();
        loginMutation.mutate(formData);
    }

    // backend connection
     const loginMutation = useMutation({
        mutationFn : (reqData) => login(reqData),
        
        onSuccess: (res) => {
            const { data } = res;
            console.log(data);
            
            dispatch(setUser(data.data));

            navigate('/')

        },
        onError: (error) => {
            //console.log(error);
            const { response } = error;
            enqueueSnackbar(response.data.message, { variant: "error"})
        }
    })


    return (

        <div className ='bg-white shadow-lg rounded-lg p-1'>

            <form onSubmit={handleLogin}>
            {/* <form onSubmit={(e) => { e.preventDefault(); handleLogin(formData); }}> */}
             
                 
                <div>
                    <label className ='text-[#1f1f1f] block mb-2 mt-3 text-sm font-medium'>البريد اللاكتروني :</label>
                
                    <div className ='flex items-center rounded-sm p-3 bg-white shadow-xl'>
                        <input 
                            type ='email'
                            name ='email'
                            value ={formData.email}
                            onChange ={handleChange}
                            placeholder = 'Enter employee email'
                            className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-sm font-semibold border-b border-yellow-700'
                            required
                            autoComplete='none'
                        />
                    </div>
                </div>


                <div>
                    <label className ='text-[#1f1f1f] block mb-2 mt-3 text-sm font-medium'>كلمه المرور :</label>
                
                    <div className ='flex items-center rounded-sm p-3 bg-white shadow-xl'>
                        <input 
                            type ='password'
                            name ='password'
                            value ={formData.password}
                            onChange ={handleChange}
                            placeholder = 'Enter password'
                            className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-sm font-semibold border-b border-yellow-700'
                            required
                            autoComplete='none'
                        />
                    </div>
                </div>

                <button type ='submit' 
                className ='cursor-pointer w-full rounded-sm mt-6 py-3 text-lg text-white bg-yellow-700 shadow-lg/30 font-semibold'>
                    دخول</button>

            </form>

        </div>
    );
};


export default Login;


