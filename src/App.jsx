import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from './Pages/Homepage/Home';
import ClickedVideo from './Pages/Clickedvideopage/ClickedVideo';
import Login from './Pages/Loginpage/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase/Firebaselogin';
import SearchResults from './Pages/Searchresult/SearchResults';
import Profile from './Pages/Profilepage/Profile';
import Searchbarpage from './Pages/Searchbarpage/Searchbarpage';
import PixabayVideoPlayer from './Pages/PixabayVideoPlayerpage/PixabayVideoPlayer';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If the user is logged in, do not redirect them back to home if they are accessing other pages.
        if (location.pathname === '/') {
          navigate('/home'); // Only redirect to home if they are on the login page
        }
      } else {
        // If the user is not logged in, only allow access to the login page
        if (location.pathname !== '/') {
          navigate('/');
        }
      }
    });

    return () => unsub(); // Cleanup the listener
  }, [navigate, location.pathname]);

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/clickedvideo/:id" element={<ClickedVideo />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/searchbar" element={<Searchbarpage />} />
        <Route path='/shorts' element={<PixabayVideoPlayer/>}  />
      </Routes>
    </div>
  );
};

export default App;
