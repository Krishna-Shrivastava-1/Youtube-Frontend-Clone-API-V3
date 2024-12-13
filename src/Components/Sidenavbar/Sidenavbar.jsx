import React from 'react'
import { MdHomeFilled } from "react-icons/md";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { BsLayoutWtf } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
const Sidenavbar = () => {
    const navigate = useNavigate()
    return (
        <div>
            <div className='md:flex flex-col items-center justify-start gap-1 hidden' >
                <div className='flex flex-col items-center justify-start text-white hover:bg-zinc-800 p-2 py-4  w-full rounded-lg cursor-pointer' onClick={()=>navigate('/home')} >
                    <MdHomeFilled className='text-2xl ' />
                    <p className='text-[10px]'>Home</p>
                </div>
                <div onClick={()=>navigate('/shorts')} className='flex flex-col items-center justify-start text-white hover:bg-zinc-800 p-2 py-4  w-full rounded-lg cursor-pointer'>
                    <SiYoutubeshorts className='text-2xl ' />
                    <p className='text-[10px]'>Shorts</p>
                </div>
                <div className='flex flex-col items-center justify-start text-white hover:bg-zinc-800 p-2 py-4  w-full rounded-lg cursor-pointer' >
                    <MdOutlineSubscriptions className='text-2xl ' />
                    <p className='text-[10px]' >Subscription</p>
                </div>
                <div className='flex flex-col items-center justify-start text-white hover:bg-zinc-800 p-2 py-4 w-full rounded-lg cursor-pointer' >
                    <BsLayoutWtf className='text-2xl ' />
                    <p className='text-[10px]'>You</p>
                </div>


            </div>
            <div className='flex w-full fixed bottom-0 left-0 bg-[#0f0f0f] z-50 items-center justify-start gap-1 md:hidden' >
                <div className='flex flex-col items-center justify-start text-white hover:bg-zinc-800 p-2 py-4  w-full rounded-lg cursor-pointer' onClick={()=>navigate('/home')} >
                    <MdHomeFilled className='text-2xl ' />
                    <p className='text-[10px]'>Home</p>
                </div>
                <div className='flex flex-col items-center justify-start text-white hover:bg-zinc-800 p-2 py-4  w-full rounded-lg cursor-pointer' >
                    <SiYoutubeshorts className='text-2xl ' />
                    <p className='text-[10px]'>Shorts</p>
                </div>
                <div className='flex flex-col items-center justify-start text-white hover:bg-zinc-800 p-2 py-4  w-full rounded-lg cursor-pointer' >
                    <MdOutlineSubscriptions className='text-2xl ' />
                    <p className='text-[10px]' >Subscription</p>
                </div>
                <div onClick={()=>navigate('/profile')} className='flex flex-col items-center justify-start text-white hover:bg-zinc-800 p-2 py-4 w-full rounded-lg cursor-pointer' >
                    <BsLayoutWtf className='text-2xl ' />
                    <p className='text-[10px]'>You</p>
                </div>


            </div>
        </div>
    )
}

export default Sidenavbar
