
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { IoIosMic } from "react-icons/io";
import yougif from '../../assets/yugif.gif';
import beeper from '../../assets/beepsound.mp3';

const isSpeechRecognitionSupported = () => 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

const Searchbarpage = () => {
  const [isListening, setIsListening] = useState(false);
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (searchQuery) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // Navigate to search results page
    }
  };

  const inputRef = useRef(null); // Create a ref for the input field

  const handleMicClick = () => {
    // When mic is clicked, focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
      beepu.play();
    }
  };

  let timerId = null;

  const startListening = () => {
    if (recognition) {
      recognition.continuous = false; // Stop after each result
      recognition.lang = 'en-IN';
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript; // Get the recognized speech
        setSearchQuery(speechToText); // Update the search query state
        inputRef.current.value = speechToText; // Also update the input value
        stopListening(); // Stop listening after getting the result
      };

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

  if (!isSpeechRecognitionSupported()) {
    return <span>Browser does not support speech recognition.</span>;
  }

  const beepu = new Audio(beeper);

  return (
    <div>
      <form onSubmit={handleSearchSubmit} className="sticky top-0 z-50 search w-[100%] flex p-2 items-center justify-between">
        <img onClick={() => navigate('/home')} className='m-2 w-24 cursor-pointer' src={yougif} alt="" />
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
    </div>
  );
}

export default Searchbarpage;
