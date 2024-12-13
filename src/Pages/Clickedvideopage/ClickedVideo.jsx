import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import { AiOutlineLike } from "react-icons/ai";
import { BiDislike } from "react-icons/bi";
import { PiShareFatLight } from "react-icons/pi";
import Slidernav from '../../Components/slidernav/Slidernav';

const ClickedVideo = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the video ID from the URL params
  const [videoDetails, setVideoDetails] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]); // Related videos state
  const [channelIcon, setChannelIcon] = useState('');
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false); // State to track if description is expanded
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };
  const API_KEY = 'AIzaSyDgdm0HiQa_nSzR43TFNaCJk3YvELN8muk'; // Replace with your API key

  // Function to generate random RGB color with transparency
  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 0.3; // Fixed transparency value (30% opacity)
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  // Function to format numbers (for subscribers, views, likes)
  const formatNumber = (num, fullFormat = false) => {
    if (fullFormat) {
      return num.toLocaleString(); // Show full number when expanded
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace('.0', '') + 'M'; // For millions
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'K'; // For thousands
    }
    return num.toString(); // For numbers below 1000
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
  // Fetch video details
  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&key=${API_KEY}&id=${id}`
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const video = data.items[0];
          setVideoDetails(video);

          // Fetch channel icon and related videos
          fetchChannelIcon(video.snippet.channelId);
          fetchRelatedVideos(video.snippet.categoryId); // Pass categoryId to get relevant videos
        } else {
          console.error('No video data found');
        }
      } catch (error) {
        console.error('Failed to fetch video details:', error);
      }
    };

    // Function to fetch the channel icon and subscriber count
    const fetchChannelIcon = async (channelId) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const channelData = data.items[0];
          setChannelIcon(channelData.snippet.thumbnails.default.url); // Set channel icon
          setSubscriberCount(channelData.statistics.subscriberCount); // Set subscriber count
        } else {
          console.error('No channel data found');
        }
      } catch (error) {
        console.error('Failed to fetch channel icon and subscriber count:', error);
      }
    };

    // Function to fetch related videos
    const fetchRelatedVideos = async (categoryId) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&type=video&videoCategoryId=${categoryId}&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          setRelatedVideos(data.items); // Set the related videos
        } else {
          console.error('No related videos found');
        }
      } catch (error) {
        console.error('Failed to fetch related videos:', error);
      }
    };

    fetchVideoDetails();
  }, [id, API_KEY]); // Add all variables that should trigger the fetch when they change
  // Ensure data refetches when `id` changes

  // Function to toggle description expansion
  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  if (!videoDetails) {
    return <p>Loading...</p>;
  }

  // Short description (first 3 lines)
  const shortDescription = videoDetails.snippet.description.split('\n').slice(0, 3).join('\n');

  // Function to format text (links, etc.)
  const formatText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a key={index} href={part} className="text-blue-500" target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      }
      return part;
    });
  };
  const sharevideo = (videoDetails) => {
    if (navigator.share) {
      navigator.share({
        title:` ${videoDetails.snippet.title} by ${videoDetails.snippet.channelTitle}`, 
        
        url: `${window.location.origin}/clickedvideo/${videoDetails.id}` // Correct URL formatting
      })
      .then(() => {
        console.log("Video shared successfully!");
      })
      .catch((error) => {
        console.error("Error sharing video:", error);
      });
    } else {
      console.log("Sharing not supported on this browser.");
    }
  };
  return (
    <div>
      <div className="z-50 sticky top-0">
        <Navbar onToggleSidebar={toggleSidebar} />
      </div>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={handleOverlayClick} />
      )}
      <div className={`sidenav fixed left-0 top-0 w-44 h-[100vh] z-50 bg-[#0f0f0f]  duration-300 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Slidernav onToggleSidebar={toggleSidebar} />
      </div>
      <div className='flex justify-around flex-col md:flex-row p-3'>
        <div className="text-white p-2 w-full md:w-[60%]">
          {/* Video player */}
          <div className='w-full  flex justify-center' >
            <iframe
              style={{
                boxShadow: `-10px -20px 60px ${generateRandomColor()}, 10px 20px 60px ${generateRandomColor()}`, // Apply random shadow color
                borderRadius: '12px',
                margin: '10px',
              }}
              className="rounded-xl "
              width="720"
              height="415"
              src={`https://www.youtube.com/embed/${id}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>


          {/* Video details */}
          <div className="mt-4 w-full ">
            <h1 className="text-xl font-extrabold">{videoDetails.snippet.title}</h1>
            <div className="flex items-center mt-2 justify-between flex-wrap gap-y-3">
              <div className='flex items-center'>
                {channelIcon && (
                  <img
                    src={channelIcon}
                    alt="Channel Icon"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                )}
                <div>
                  <h3 className="text-xl">{videoDetails.snippet.channelTitle}</h3>
                  {subscriberCount > 0 && (
                    <p className='text-[#aaaaaa]'>{formatNumber(subscriberCount)} subscribers</p> // Display formatted subscriber count
                  )}
                </div>
              </div>
              <div className='flex items-center gap-y-2'>
                <div className='flex items-center mr-2'>
                  <div className='bg-zinc-800 hover:bg-zinc-700 cursor-pointer select-none p-2 rounded-l-full px-2 flex items-center border-r-zinc-500 border-r-[1px]'>
                    <p className='flex items-center gap-1 text-md'>
                      <AiOutlineLike className='text-2xl text-white' />
                      {videoDetails.statistics?.likeCount ? formatNumber(videoDetails.statistics.likeCount) : 'No likes available'}
                    </p>

                  </div>
                  <div className='bg-zinc-800 hover:bg-zinc-700 cursor-pointer select-none p-2 rounded-r-full px-4 flex items-center'>
                    <BiDislike className='text-2xl text-white font-thin' />
                  </div>
                </div>

                <div className='flex items-center ml-2'>
                  <div className='bg-zinc-800 hover:bg-zinc-700 cursor-pointer select-none p-2 rounded-full px-3 flex items-center gap-2'>
                    <PiShareFatLight onClick={()=>sharevideo(videoDetails)} className='text-2xl' />
                    <p className='text-sm text-white font-semibold'>Share</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video description */}
          <div className="bg-zinc-800 my-2 text-md p-4 rounded-xl text-balance overflow-hidden">
            <p className='text-[#aaaaaa] text-balance'>
              {isExpanded
                ? videoDetails.statistics?.viewCount
                  ? `${formatNumber(videoDetails.statistics.viewCount, true)} views | ${new Date(videoDetails.snippet.publishedAt).toLocaleDateString()}`
                  : 'No views available'
                : videoDetails.statistics?.viewCount
                  ? `${formatNumber(videoDetails.statistics.viewCount)} views ${new Date(videoDetails.snippet.publishedAt).toLocaleDateString()}`
                  : 'No views available'}
            </p>

            <p className="mt-2">
              {isExpanded ? formatText(videoDetails.snippet.description) : formatText(shortDescription)}
            </p>
            <button onClick={toggleDescription} className="text-white mt-2">
              {isExpanded ? 'Show less' : '...more'}
            </button>
          </div>
        </div>

        {/* Related videos */}
        <div className="w-full  md:w-[40%] ">
          {relatedVideos.map((video) => (
            <div
              key={video.id.videoId}
              className="md:flex cursor-pointer p-2"
              onClick={() => navigate(`/clickedvideo/${video.id.videoId}`)}
            >
              <img
                src={video.snippet.thumbnails.default.url}
                alt={video.snippet.title}
                className="md:w-40 w-full h-auto md:h-24 rounded-lg"
              />
              <div className="ml-2">
                <h3 className="text-white">{video.snippet.title}</h3>
                <p className="text-sm text-gray-400">{video.snippet.channelTitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClickedVideo;



// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import Navbar from '../../Components/Navbar/Navbar';
// import { AiOutlineLike } from "react-icons/ai";
// import { BiDislike } from "react-icons/bi";
// import { PiShareFatLight } from "react-icons/pi";

// const ClickedVideo = () => {
//   const { id } = useParams(); // Get the video ID from the URL params
//   const [videoDetails, setVideoDetails] = useState(null);
//   const [channelIcon, setChannelIcon] = useState('');
//   const [boxShadowColor, setBoxShadowColor] = useState('');
//   const [subscriberCount, setSubscriberCount] = useState(0);
//   const [isExpanded, setIsExpanded] = useState(false); // State to track if description is expanded
//   const API_KEY = 'AIzaSyDgdm0HiQa_nSzR43TFNaCJk3YvELN8muk'; // Replace with your API key

//   // Function to generate random RGB color with transparency
//   const generateRandomColor = () => {
//     const r = Math.floor(Math.random() * 256);
//     const g = Math.floor(Math.random() * 256);
//     const b = Math.floor(Math.random() * 256);
//     const a = 0.3; // Fixed transparency value (30% opacity)
//     return `rgba(${r}, ${g}, ${b}, ${a})`;
//   };

//   // Function to format numbers (for subscribers, views, likes)
//   const formatNumber = (num, fullFormat = false) => {
//     if (fullFormat) {
//       return num.toLocaleString(); // Show full number when expanded
//     }
//     if (num >= 1000000) {
//       return (num / 1000000).toFixed(1).replace('.0', '') + 'M'; // For millions
//     }
//     if (num >= 1000) {
//       return (num / 1000).toFixed(1).replace('.0', '') + 'K'; // For thousands
//     }
//     return num.toString(); // For numbers below 1000
//   };

//   // Fetch video details
//   useEffect(() => {
//     const fetchVideoDetails = async () => {
//       try {
//         const response = await fetch(
//           `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&key=${API_KEY}&id=${id}`
//         );
//         const data = await response.json();
//         if (data.items && data.items.length > 0) {
//           const video = data.items[0];
//           setVideoDetails(video);

//           // Fetch channel icon
//           const channelId = video.snippet.channelId;
//           fetchChannelIcon(channelId);
//         }
//       } catch (error) {
//         console.error('Failed to fetch video details:', error);
//       }
//     };

//     // Function to fetch the channel icon and subscriber count
//     const fetchChannelIcon = async (channelId) => {
//       try {
//         const response = await fetch(
//           `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`
//         );
//         const data = await response.json();
//         if (data.items && data.items.length > 0) {
//           const channelData = data.items[0];
//           setChannelIcon(channelData.snippet.thumbnails.default.url); // Set channel icon
//           setSubscriberCount(channelData.statistics.subscriberCount); // Set subscriber count
//         }
//       } catch (error) {
//         console.error('Failed to fetch channel icon and subscriber count:', error);
//       }
//     };

//     // Fetch video details and set a random box shadow color
//     fetchVideoDetails();
//     setBoxShadowColor(generateRandomColor());
//   }, [id, API_KEY]);

//   // Function to toggle description expansion
//   const toggleDescription = () => {
//     setIsExpanded(!isExpanded);
//   };

//   if (!videoDetails) {
//     return <p>Loading...</p>;
//   }

//   // Short description (first 3 lines)
//   const shortDescription = videoDetails.snippet.description.split('\n').slice(0, 3).join('\n');
//   // Function to format text (links, etc.)
//   const formatText = (text) => {
//     const urlRegex = /(https?:\/\/[^\s]+)/g;

//     // Replace URLs with clickable links
//     return text.split(urlRegex).map((part, index) => {
//       if (urlRegex.test(part)) {
//         return (
//           <a key={index} href={part} className="text-blue-500" target="_blank" rel="noopener noreferrer">
//             {part}
//           </a>
//         );
//       }
//       return part;
//     });
//   };

//   return (
//     <div>
//       <div className="z-50 sticky top-0">
//         <Navbar />
//       </div>
//       <div className='flex' >
//         <div className="text-white p-3 w-[55%]">
//           <iframe
//             style={{
//               boxShadow: `-10px -20px 60px ${boxShadowColor}, 10px 20px 60px ${boxShadowColor}`, // Apply random shadow color
//               borderRadius: '12px',
//               margin: '10px',
//             }}
//             className="rounded-xl w-full"
//             width="720"
//             height="415"
//             src={`https://www.youtube.com/embed/${id}`}
//             title="YouTube video player"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//           ></iframe>

//           <div className="mt-4 w-full">
//             <h1 className="text-xl font-extrabold">{videoDetails.snippet.title}</h1>
//             <div className="flex items-center mt-2 justify-between">
//               <div className='flex items-center'>
//                 {channelIcon && (
//                   <img
//                     src={channelIcon}
//                     alt="Channel Icon"
//                     className="w-10 h-10 rounded-full mr-4"
//                   />
//                 )}
//                 <div>
//                   <h3 className="text-xl">{videoDetails.snippet.channelTitle}</h3>
//                   {subscriberCount > 0 && (
//                     <p className='text-[#aaaaaa]'>{formatNumber(subscriberCount)} subscribers</p> // Display formatted subscriber count
//                   )}
//                 </div>
//               </div>

//               <div className='flex items-center'>
//                 <div className='flex items-center mr-2'>
//                   <div className='bg-zinc-800 hover:bg-zinc-700 cursor-pointer select-none p-2 rounded-l-full px-2 flex items-center border-r-zinc-500 border-r-[1px]'>
//                     <p className='flex items-center gap-1 text-md'>
//                       <AiOutlineLike className='text-2xl text-white' />
//                       {formatNumber(videoDetails.statistics.likeCount)}
//                     </p>
//                   </div>
//                   <div className='bg-zinc-800 hover:bg-zinc-700 cursor-pointer select-none p-2 rounded-r-full px-4 flex items-center'>
//                     <BiDislike className='text-2xl text-white font-thin' />
//                   </div>
//                 </div>

//                 <div className='flex items-center ml-2'>
//                   <div className='bg-zinc-800 hover:bg-zinc-700 cursor-pointer select-none p-2 rounded-full px-3 flex items-center gap-2'>
//                     <PiShareFatLight className='text-2xl text-white' />
//                     <h2 className='font-semibold text-lg'>Share</h2>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Description with show more/less */}
//             {/* Description with show more/less and formatted content */}
//             <div className="describox bg-[#272727] p-2 rounded-lg font-semibold">
//               <p> {formatNumber(videoDetails.statistics.viewCount, isExpanded)} views</p>

//               <div className="mt-4">
//                 {isExpanded
//                   ? videoDetails.snippet.description.split("\n").map((line, index) => (
//                     <p key={index} className="mb-2">
//                       {formatText(line)}
//                     </p>
//                   ))
//                   : shortDescription.split("\n").map((line, index) => (
//                     <p key={index} className="mb-2">
//                       {formatText(line)}
//                     </p>
//                   ))
//                 }
//               </div>

//               <button onClick={toggleDescription} className="text-white font-semibold mt-2">
//                 {isExpanded ? 'Show Less' : '...more'}
//               </button>
//             </div>

//           </div>
//         </div>
// <div className="realtedvid">

// </div>

//       </div>

//     </div>
//   );
// };

// export default ClickedVideo;
// style={{width:'calc(100%-55%)'}}