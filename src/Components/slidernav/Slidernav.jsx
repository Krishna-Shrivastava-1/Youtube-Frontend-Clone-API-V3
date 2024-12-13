import React from 'react'
import { MdHomeFilled } from "react-icons/md";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { FaBars } from "react-icons/fa6";
import yougif from '../../assets/yugif.gif'
import { useLocation, useNavigate } from 'react-router-dom';
import { LuHistory } from "react-icons/lu";
import { MdOutlinePlaylistPlay } from "react-icons/md";
import { MdOutlineWatchLater } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { BiBulb } from "react-icons/bi";
import { HiFire } from "react-icons/hi";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { BiMovie } from "react-icons/bi";
import { LuMusic2 } from "react-icons/lu";
import { SiYoutubegaming } from "react-icons/si";
import { GoTrophy } from "react-icons/go";
import { RiNewsLine } from "react-icons/ri";
import { LuPodcast } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
const Slidernav = ({ onToggleSidebar }) => {
    const location = useLocation()
const navigate = useNavigate()
    return (
        <div>
            <div>
                <div className='flex flex-col items-center justify-start gap-1 overflow-y-scroll h-screen px-2 scrolli' >
                    <div className='flex items-center justify-center sticky top-0 z-50 bg-[#0f0f0f] p-2 w-full '  >
                        <FaBars onClick={onToggleSidebar} className='text-white text-4xl hover:bg-zinc-700 rounded-full cursor-pointer p-2 mx-2' />
                        <img onClick={()=>navigate('/home')} className='w-24 cursor-pointer' src={yougif} alt="" />
                    </div>
                    {/* <div> */}
                    {
                        location.pathname === '/home' ?
                        <div className='flex items-center justify-start gap-x-4 text-white bg-zinc-800 hover:bg-zinc-700 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' onClick={()=>navigate('/home')} >
                        <MdHomeFilled className='text-2xl ' />
                        <p className='text-md font-semibold'>Home</p>
                    </div>:
                    <div className='flex items-center justify-start gap-x-4 text-white hover:bg-zinc-800 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' onClick={()=>navigate('/home')} >
                    <MdHomeFilled className='text-2xl ' />
                    <p className='text-md font-semibold'>Home</p>
                </div>
                    }
                  
                    <div className='flex items-center justify-start  gap-x-4 text-white hover:bg-zinc-800 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' >
                        <SiYoutubeshorts className='text-2xl ' />
                        <p className='text-md font-semibold'>Shorts</p>
                    </div>
                    <div className='flex items-center justify-start gap-x-4 text-white hover:bg-zinc-800 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' >
                        <MdOutlineSubscriptions className='text-2xl ' />
                        <p className='text-md font-semibold'>Subscription</p>
                    </div>
                    <div className='border-[#212121] border w-full' ></div>
                    <h1 className='text-white font-semibold flex justify-start text-lg w-full m-2' >You</h1>
                    {/* </div> */}
                    <div onClick={()=>navigate('/profile')} className='flex items-center justify-start gap-x-4 text-white hover:bg-zinc-800 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' >
                        <CgProfile  className='text-2xl ' /> 
                        <p className='text-md font-semibold'>Your Profile</p>
                    </div>
                    <div className='flex items-center justify-start gap-x-4 text-white hover:bg-zinc-800 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' >
                        <LuHistory  className='text-2xl ' /> 
                        <p className='text-md font-semibold'>History</p>
                    </div>
                    <div className='flex items-center justify-start gap-x-4 text-white hover:bg-zinc-800 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' >
                        <MdOutlinePlaylistPlay className='text-2xl ' /> 
                        <p className='text-md font-semibold'>Playlists</p>
                    </div>
                    <div className='flex items-center justify-start gap-x-4 text-white hover:bg-zinc-800 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' >
                        <BiBulb className='text-2xl ' />
                        <p className='text-md font-semibold'>Your Courses</p>
                    </div>
                    <div className='flex items-center justify-start gap-x-4 text-white hover:bg-zinc-800 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' >
                        <MdOutlineWatchLater className='text-2xl ' />
                        <p className='text-md font-semibold'>Watch later</p>
                    </div>
                    <div className='flex items-center justify-start gap-x-4 text-white hover:bg-zinc-800 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' >
                        <AiOutlineLike className='text-2xl ' />
                        <p className='text-md font-semibold'>Liked</p>
                    </div>
                    <div className='border-[#212121] border w-full' ></div>
                    <h1 className='text-white font-semibold flex justify-start text-lg w-full' >Explore</h1>
                   
                   
                    <div className='flex items-center justify-start gap-x-4 text-white hover:bg-zinc-800 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' >
                        <HiFire  className='text-2xl rotate-[30deg]' /> 
                        <p className='text-md font-semibold'>Trending</p>
                    </div>
                    <div className='flex items-center justify-start gap-x-4 text-white hover:bg-zinc-800 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' >
                        <LiaShoppingBagSolid className='text-2xl ' /> 
                        <p className='text-md font-semibold'>Shopping</p>
                    </div>
                    <div className='flex items-center justify-start gap-x-4 text-white hover:bg-zinc-800 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' >
                        <LuMusic2 className='text-2xl ' />
                        <p className='text-md font-semibold'>Music</p>
                    </div>
                    <div className='flex items-center justify-start gap-x-4 text-white hover:bg-zinc-800 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' >
                        <BiMovie className='text-2xl ' />
                        <p className='text-md font-semibold'>Movies</p>
                    </div>
                    <div className='flex items-center justify-start gap-x-4 text-white hover:bg-zinc-800 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' >
                        <SiYoutubegaming className='text-2xl ' />
                        <p className='text-md font-semibold'>Gaming</p>
                    </div>
                    <div className='flex items-center justify-start gap-x-4 text-white hover:bg-zinc-800 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' >
                        <RiNewsLine className='text-2xl ' />
                        <p className='text-md font-semibold'>News</p>
                    </div>
                    <div className='flex items-center justify-start gap-x-4 text-white hover:bg-zinc-800 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' >
                        <GoTrophy className='text-2xl ' />
                        <p className='text-md font-semibold'>Sports</p>
                    </div>
                    <div className='flex items-center justify-start gap-x-4 text-white hover:bg-zinc-800 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' >
                        <BiBulb className='text-2xl ' />
                        <p className='text-md font-semibold'>Courses</p>
                    </div>
                    <div className='flex items-center justify-start gap-x-4 text-white hover:bg-zinc-800 p-2 py-2 px-2  w-full rounded-lg cursor-pointer' >
                        <LuPodcast className='text-2xl ' />
                        <p className='text-md font-semibold'>Podcast</p>
                    </div>


                    <div className='border-[#212121] border w-full' ></div>
                    <p className='text-sm cursor-pointer text-[#aaaaaa] text-balance font-semibold' >
                        About Press Copyright Contactus Creators Advertise Developers


                    </p>
                    <span className='m-2 mt-3 text-sm cursor-pointer text-[#aaaaaa] text-balance font-semibold w-full'>
                        Terms PrivacyPolicy & SafetyHow YouTube worksTest new features
                        © 2024
                    </span>

                </div>
            </div>
        </div>
    )
}

export default Slidernav
