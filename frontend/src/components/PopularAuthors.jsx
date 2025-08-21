import axios from 'axios';
import React, { useEffect, useState } from 'react'
import userLogo from '../assets/userLogo.png'

const PopularAuthors = () => {
    const [popularUser, setPopularUser] = useState([]);
    const getAllUsers = async () => {
        try {
            const res = await axios.get(`https://blog-app-9g6i.onrender.com/api/v1/user/all-users`)
            if(res.data.success){
                setPopularUser(res.data.users)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        getAllUsers();
    },[])
  return (
    <div className='dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto '>
            <div className='flex flex-col space-y-4 items-center mb-6 '>
                <h1 className='text-3xl md:text-4xl font-bold pt-10'>PopularAuthors</h1>
                <hr className='w-30 text-center border-2 border-red-500 rounded-full'/>
            </div>
            <div className='flex items-center justify-around pb-10  px-4 md:px-0'>
                {
                    popularUser?.slice(0,3)?.map((user, index)=>{
                        return <div key={index} className='flex flex-col gap-2 items-center'>
                            <img src={user.photoUrl || userLogo} alt="" className='rounded-full h-16 w-16 md:w-32 md:h-32'/>
                            <p className='font-semibold'>{user.firstName} {user.lastName}</p>
                        </div>
                    })
                }
            </div>
        </div>        
    </div>
  )
}

export default PopularAuthors