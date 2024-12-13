import React, { useEffect, useState } from 'react';
import './VideoPlayer.css';

function PixabayVideoPlayer() {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [startY, setStartY] = useState(null); // For touch event

  useEffect(() => {
    fetch(
      'https://pixabay.com/api/videos/?key=46608885-0b2e2bcc403de3ef3f863fc12&orientation=vertical&video_type=all&per_page=25&q=funny+entertainment+animals+music+movies',
      {
        method: 'GET',
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setVideos(data.hits);
        console.log(data.hits);
      });
  }, []);

  // Handle scroll for mouse wheel
  const handleScroll = (e) => {
    const { deltaY } = e;
    if (deltaY > 0 && currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else if (deltaY < 0 && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
    e.preventDefault(); // Prevent default scrolling behavior
  };

  // Handle touch start
  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  // Handle touch end
  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    const deltaY = startY - endY;

    if (deltaY > 50 && currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1); // Swipe up
    } else if (deltaY < -50 && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1); // Swipe down
    }
  };

  return (
    <div
      className="video-container"
      onWheel={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {videos.length > 0 ? (
        <div className="video-wrapper">
          <video
            key={currentVideoIndex}
            className="video-player"
            controls
            autoPlay
            muted={false}
            playsInline
          >
            <source src={videos[currentVideoIndex].videos.medium.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <p>Loading videos...</p>
      )}
    </div>
  );
}

export default PixabayVideoPlayer;
