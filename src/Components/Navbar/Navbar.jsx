
import React, { useState, useEffect, useRef } from 'react';
import { FaBars } from "react-icons/fa6";
import logo from '../../assets/logo-removebg-preview (1).png';
import { IoIosSearch, IoIosMic } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import dumprof from '../../assets/dumprof.png';
import { useNavigate } from 'react-router-dom';
import { GoSignOut } from "react-icons/go";
import { logout } from '../../Firebase/Firebaselogin';
import { auth, db } from '../../Firebase/Firebaselogin';
import { getDoc, doc } from "firebase/firestore";
import beeper from '../../assets/beepsound.mp3'

// Check for SpeechRecognition support
const isSpeechRecognitionSupported = () => 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

const Navbar = ({ onToggleSidebar }) => {
  const [bgcolor, setBgcolor] = useState('transparent');
  const [searchQuery, setSearchQuery] = useState('');
  const [profsect, setProfsect] = useState(false);
  const [userData, setUserData] = useState({});
  const [isListening, setIsListening] = useState(false);
  const profileRef = useRef(null); // For detecting clicks outside the profile section
  const navigate = useNavigate();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  // Handle scroll event to change navbar background color
  useEffect(() => {
    const handleScroll = () => {
      setBgcolor(window.scrollY > 20 ? '#0f0f0f' : 'transparent');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle SpeechRecognition events
  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript.trim();
        if (transcript.endsWith('.')) {
          transcript = transcript.slice(0, -1);
        }
        setSearchQuery(transcript);
      };
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  }, [recognition]);

  // Fetch user data when the user is logged in
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const fetchUserProfile = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      };
      fetchUserProfile();
    }
  }, []);

  // Click outside of profile section to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfsect(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Speech recognition start and stop handlers
  let timerId = null;
  const startListening = () => {
    if (recognition) {
      recognition.continuous = true;
      recognition.lang = 'en-IN';
      recognition.start();
      setIsListening(true);

      // Stop after 5 seconds automatically
      timerId = setTimeout(() => {
        stopListening();
      }, 5000);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleProfsect = () => {
    setProfsect(!profsect);
  };

  // If SpeechRecognition is not supported
  if (!isSpeechRecognitionSupported()) {
    return <span>Browser does not support speech recognition.</span>;
  }

  const user = auth.currentUser;
  const inputRef = useRef(null); // Create a ref for the input field

  const handleMicClick = () => {
    // When mic is clicked, focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
      beepu.play()
    }
  };
  const beepu  = new Audio(beeper)
  return (
    <div>
      <div className='flex items-center justify-between sticky top-0 p-2 transition-all duration-300' style={{ backgroundColor: bgcolor }}>
        {/* Left Side: Sidebar toggle and logo */}
        <div className='flex items-center justify-center'>
          <FaBars onClick={onToggleSidebar} className='text-white text-4xl hover:bg-zinc-700 rounded-full cursor-pointer p-2 mx-2' />
          <img onClick={() => navigate('/home')} className='w-24 cursor-pointer' src={logo} alt="Logo" />
        </div>

        {/* Search form */}
        <form onSubmit={handleSearchSubmit} className="search w-[57%] sm:flex items-center justify-center hidden ">
          <div className='flex items-center group w-full border-[#222223] border-2 pl-2 rounded-l-full focus-within:border-sky-700 bg-[#0f0f0f]'>
            
            <IoIosSearch className='text-white text-2xl hidden group-focus-within:block' />
            <input 
          ref={inputRef} // Attach ref to input
          type="search" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='bg-[#121212] text-white p-1 text-lg border-none outline-none rounded-l-full w-full' 
          placeholder='Search' 
        />
          </div>
          <button type="submit" className='bg-[#222223] rounded-r-full cursor-pointer hover:border-zinc-600 mr-2'>
            <CiSearch className='text-white text-[40px] p-1 pr-3' />
          </button>
          <div className="mic ml-2">
          <IoIosMic 
            onClick={() => {
              handleMicClick();  // Focus the input on mic click
              isListening ? stopListening() : startListening(); // Also handle listening logic
            }} 
            className='text-white bg-zinc-800 hover:bg-zinc-700 text-4xl p-1 rounded-full cursor-pointer' 
          />
        </div>
        </form>

        {/* Right Side: Profile and search on mobile */}
        <div 
          onClick={toggleProfsect} 
          className="profile relative cursor-pointer flex items-center gap-x-3"
          ref={profileRef}
        >
          <CiSearch onClick={() => navigate('/searchbar')} className='text-white text-[40px] p-1 pr-3 sm:hidden flex' />
          {user && (
            <div className="user-profile">
              <img
                src={userData.profileimage || dumprof} 
                alt="Profile" 
                className="profile-img w-10 rounded-full"
              />
            </div>
          )}
          {profsect && (
            <div className="profsect absolute right-[50px] top-4 shadow-xl bg-[#282828] w-48 h-auto rounded-lg z-50">
              <div onClick={() => navigate('/profile')} className='cursor-pointer flex items-center justify-center hover:bg-zinc-700 p-2 gap-2 rounded-lg flex-wrap'>
                {user && (
                  <div className="user-profile flex justify-between items-center gap-2">
                    <img
                      src={userData.profileimage || dumprof} 
                      alt="Profile" 
                      className="profile-img w-16 rounded-full"
                    />
                    <span className='text-white text-lg font-bold m-2'>{userData.username}</span>
                  </div>
                )}
                <h1 className='text-lg text-white font-semibold'>View Profile</h1>
              </div>
              <div onClick={logout} className='cursor-pointer flex items-center justify-center hover:bg-zinc-700 p-2 gap-2 rounded-lg'>
                <GoSignOut className='text-white text-2xl' />
                <h1 className='text-lg text-white font-semibold'>Sign out</h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
