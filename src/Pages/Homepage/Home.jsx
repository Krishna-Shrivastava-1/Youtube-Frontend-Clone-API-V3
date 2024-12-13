import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import Navbar from '../../Components/Navbar/Navbar';
import Sidenavbar from '../../Components/Sidenavbar/Sidenavbar';
import { GoDotFill } from "react-icons/go";
import Slidernav from '../../Components/slidernav/Slidernav'
import giphy from '../../assets/giphy-unscreen.gif'
const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [channelIcons, setChannelIcons] = useState({}); // Store channel icons
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
      };
    
      const handleOverlayClick = () => {
        setIsSidebarOpen(false);
      };
  const API_KEY = 'AIzaSyDgdm0HiQa_nSzR43TFNaCJk3YvELN8muk'; // Replace with your API key
  // const API_KEY = 'AIzaSyBVFuAMvGevW-4awcLhST0F5UNr_WVUwY4'; // Replace with your API key
  const maxResults = 2; // Number of videos to load

  // Function to format numbers (for views and likes)
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace('.0', '') + 'M'; // For millions
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'K'; // For thousands
    }
    return num.toString(); // For numbers below 1000
  };

  // Fetch the channel icon for a given channelId
  const fetchChannelIcon = async (channelId) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`
      );
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        return data.items[0].snippet.thumbnails.default.url;
      }
    } catch (error) {
      console.error('Failed to fetch channel icon:', error);
    }
    return null;
  };
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = 'unset'; // Enable scrolling
    }

    return () => {
      document.body.style.overflow = 'unset'; // Clean up
    };
  }, [isSidebarOpen]);
  useEffect(() => {
    const loadMoreVideos = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,status&chart=mostPopular&maxResults=${maxResults}&key=${API_KEY}`
        );
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
          throw new Error('No videos found');
        }

        // Filter embeddable videos
        const embeddableVideos = data.items.filter(
          (item) => item.status.embeddable
        );

        // Fetch channel icons for each video
        const channelIconPromises = embeddableVideos.map(async (video) => {
          const icon = await fetchChannelIcon(video.snippet.channelId);
          return { channelId: video.snippet.channelId, icon };
        });

        // Wait for all icons to be fetched
        const iconsData = await Promise.all(channelIconPromises);

        // Create a map of channelId to channel icon
        const iconsMap = iconsData.reduce((acc, { channelId, icon }) => {
          acc[channelId] = icon;
          return acc;
        }, {});

        setChannelIcons(iconsMap);
        setVideos(embeddableVideos);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadMoreVideos();
  }, [API_KEY]);

  const handleThumbnailClick = (videoId) => {
    navigate(`/clickedvideo/${videoId}`);
  };

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

  const getFormattedDate = (publishedAt) => {
    const publishedDate = new Date(publishedAt);
    const currentDate = new Date();
    const timeDifference = currentDate - publishedDate; // Difference in milliseconds

    // Convert time difference to hours
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      // If less than 24 hours, show the time difference (e.g., "5 hours ago")
      const hoursAgo = Math.floor(hoursDifference);
      if (hoursAgo === 0) {
        const minutesAgo = Math.floor(timeDifference / (1000 * 60));
        return `${minutesAgo} minutes ago`;
      }
      return `${hoursAgo} hours ago`;
    } else {
      // If more than 24 hours, show the full date in format "DD/MM/YYYY"
      return publishedDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',  // Month as a number (e.g., 09 for September)
        day: '2-digit',
      });
    }
  };

  return (
    <div>
      <div className="z-50 sticky top-0">
        <Navbar  onToggleSidebar={toggleSidebar} />
      </div>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={handleOverlayClick} />
      )}
      <div className="w-full flex justify-end">
        <div className="sidenav fixed left-0 bottom-0 w-[64px] h-[90vh] z-40">
          <Sidenavbar  />
        

        </div>  
        <div className={`sidenav fixed left-0 top-0 w-52 h-[100vh] z-50 bg-[#0f0f0f]  duration-300 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <Slidernav onToggleSidebar={toggleSidebar}  />
          </div>
        <div
          className="vidcont w-full md:w-[calc(100%-64px)]  text-white "
          // style={{ width: 'calc(100% - 64px)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="video-item cursor-pointer "
                onClick={() => handleThumbnailClick(video.id)} // Navigate on thumbnail click
              >
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="w-full h-auto rounded-lg hover:rounded-none transition-all duration-500 hover:scale-[1.01]"
                />
                <div className='flex justify-start gap-2'>
                  <div>
                    {channelIcons[video.snippet.channelId] && (
                      <img
                        src={channelIcons[video.snippet.channelId]}
                        alt="Channel Icon"
                        className="w-10 h-10 rounded-full mt-2"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="mt-2 font-semibold">{video.snippet.title}</h3>
                    <p className='text-[#aaaaaa]' > {video.snippet.channelTitle}</p>
                    <div className='flex gap-2 flex-wrap items-center whitespace-nowrap'>
                      <p className='text-[#aaaaaa] mx-1'>
                        {formatNumber(video.statistics.viewCount)} views
                      </p> {/* Display formatted views */}
                      <span className='text-[#aaaaaa]'>
                        <GoDotFill className='text-[10px]' />
                      </span>
                      <p className='text-[#aaaaaa]'>
                        {getFormattedDate(video.snippet.publishedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


// import React, {  useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../../Components/Navbar/Navbar';
// import Sidenavbar from '../../Components/Sidenavbar/Sidenavbar';


// const Home = () => {

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const navigate = useNavigate();
  
//   // Fetch videos and other functionality...

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const handleOverlayClick = () => {
//     setIsSidebarOpen(false);
//   };

//   return (
//     <div>
//       <div className="z-50 sticky top-0">
//         <Navbar onToggleSidebar={toggleSidebar} />
//       </div>
//       {isSidebarOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={handleOverlayClick} />
//       )}
//       <div className={`sidenav fixed left-0 bottom-0 w-[64px] h-[90vh] z-40 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//         <Sidenavbar />
//       </div>
//       <div className="vidcont text-white" style={{ width: 'calc(100% - 64px)' }}>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
//           {/* Video Items */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
