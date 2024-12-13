
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoDotFill } from "react-icons/go";
import Navbar from '../../Components/Navbar/Navbar';
import Slidernav from '../../Components/slidernav/Slidernav';
import Sidenavbar from '../../Components/Sidenavbar/Sidenavbar';
import giphy from '../../assets/giphy-unscreen.gif'
const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query'); // Get the search query from URL
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [channelProfiles, setChannelProfiles] = useState({}); // Store channel profile photos
  const API_KEY = 'AIzaSyDgdm0HiQa_nSzR43TFNaCJk3YvELN8muk'; // Replace with your actual API key
  const maxResults = 2; // Number of results to fetch
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  // Fetch videos based on the search query
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`
        );
        const searchData = await searchResponse.json();

        if (!searchData.items || searchData.items.length === 0) {
          throw new Error('No videos found');
        }

        const videoIds = searchData.items.map(item => item.id.videoId).join(',');

        // Fetch video details including statistics
        const detailsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`
        );
        const detailsData = await detailsResponse.json();

        setVideos(detailsData.items);

        // Fetch channel details to get profile photos
        const channelIds = detailsData.items.map(item => item.snippet.channelId).join(',');
        const channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds}&key=${API_KEY}`
        );
        const channelData = await channelResponse.json();

        const profilePhotos = {};
        channelData.items.forEach(channel => {
          profilePhotos[channel.id] = channel.snippet.thumbnails.default.url;
        });

        setChannelProfiles(profilePhotos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchVideos();
    }
  }, [query, API_KEY]);

  if (loading) {
    return (
      <div className='w-full flex items-center justify-center h-screen flex-col'>
        <img className='w-[30%]' src={giphy} alt="Loading" />
        <h1 className="text-2xl font-bold text-white ml-4">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <div className="z-50 sticky top-0">
        <Navbar onToggleSidebar={toggleSidebar} />
      </div>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={handleOverlayClick} />
      )}
      <div className="sidenav fixed left-0 bottom-0 w-[64px] h-[90vh] z-40">
        <Sidenavbar />
      </div>
      <div className={`sidenav fixed left-0 top-0 w-52 h-[100vh] z-50 bg-[#0f0f0f]  duration-300 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Slidernav onToggleSidebar={toggleSidebar} />
      </div>
    
      <div className='flex justify-end' >
        <div className="flex flex-col justify-center gap-y-4  w-full md:w-[calc(100%-64px)]  p-4" >  <h1 className="text-white">Search Results for: <span className='text-sky-600 font-semibold' >{query}</span></h1>
          {videos.map((video) => (
            <div key={video.id} onClick={() => navigate(`/clickedvideo/${video.id}`)} className="video-item cursor-pointer flex items-center gap-x-5 flex-wrap md:flex-nowrap">
              <div className='w-full md:w-auto'>
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="w-full h-auto rounded-lg hover:rounded-none transition-all duration-500 hover:scale-[1.01]"
                />
              </div>

              <div className='text-balance'>
                <h3 className="mt-2 font-semibold text-white">{video.snippet.title}</h3>
              
                <div className='flex gap-2 flex-wrap items-center whitespace-nowrap'>
                  <p className='text-[#aaaaaa] mx-1'>
                    {video.statistics.viewCount ? formatNumber(video.statistics.viewCount) : 'N/A'} views
                  </p>
                  <span className='text-[#aaaaaa]'>
                    <GoDotFill className='text-[10px]' />
                  </span>
                  <p className='text-[#aaaaaa]'>
                    {new Date(video.snippet.publishedAt).toLocaleDateString()}
                  </p>
                </div>  
                <div className='flex items-center gap-2'>
                  {/* Display channel profile photo */}
                  {channelProfiles[video.snippet.channelId] && (
                    <img
                      src={channelProfiles[video.snippet.channelId]}
                      alt={`${video.snippet.channelTitle} profile`}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <p className='text-[#aaaaaa]'>{video.snippet.channelTitle}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Function to format numbers (for views)
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace('.0', '') + 'M'; // For millions
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace('.0', '') + 'K'; // For thousands
  }
  return num.toString(); // For numbers below 1000
};

export default SearchResults;
