

// import React, { useState, useEffect } from 'react';
// import { auth, db, uploadProfileImage } from '../../Firebase/Firebaselogin';
// import { getDoc, doc, setDoc } from "firebase/firestore";
// import Navbar from '../../Components/Navbar/Navbar';
// import Slidernav from '../../Components/slidernav/Slidernav';
// import { useNavigate } from 'react-router-dom';
// import dumper from '../../assets/dumprof.png'
// // import { FaBars } from "react-icons/fa6";
// // import logo from '../../assets/logo-removebg-preview (1).png';
// const Profile = () => {
//     const [userData, setUserData] = useState({});
//     const [imagePreview, setImagePreview] = useState(dumper); // Image to display
//     const [selectedImage, setSelectedImage] = useState(null); // File to upload
//     const [loading, setLoading] = useState(false);
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const navigate = useNavigate(); // Initialize useNavigate for navigation
//     const toggleSidebar = () => {
//           setIsSidebarOpen(!isSidebarOpen);
//         };
      
//         const handleOverlayClick = () => {
//           setIsSidebarOpen(false);
//         };
//     const user = auth.currentUser;

//     // Fetch user profile data from Firestore
//     const fetchUserData = async () => {
//         try {
//             const docRef = doc(db, 'users', user.uid);
//             const docSnap = await getDoc(docRef);
//             if (docSnap.exists()) {
//                 const data = docSnap.data();
//                 setUserData(data);

//                 // Set image preview to the profile image from Firestore
//                 if (data.profileimage) {
//                     setImagePreview(data.profileimage);  // Set the image preview to Firestore image
//                 } else {
//                     setImagePreview('defaultImage.png'); // Fallback to default if no profile image
//                 }
//             } else {
//                 console.log("No such document!");
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // Handle image selection (preview it before uploading)
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         setSelectedImage(file);
//         setImagePreview(URL.createObjectURL(file)); // Set preview to the newly selected image
//     };

//     // Handle image upload to Firestore
//     const handleImageUpload = async () => {
//         if (selectedImage) {
//             setLoading(true);
//             const downloadURL = await uploadProfileImage(selectedImage, user.uid);

//             // Update Firestore with new profile image URL
//             await updateProfileImageInFirestore(downloadURL);

//             // Set the image preview to the uploaded image URL
//             setImagePreview(downloadURL);
//             setLoading(false);
//         }
//     };

//     // Update profile image URL in Firestore
//     const updateProfileImageInFirestore = async (imageURL) => {
//         try {
//             const docRef = doc(db, 'users', user.uid);
//             await setDoc(docRef, { profileimage: imageURL }, { merge: true });
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         if (user) {
//             fetchUserData(); // Fetch user data including profile image on mount
//         }
//     }, [user]);

//     return (
//         <div>
//             <div className="z-50 sticky top-0">
//         <Navbar  onToggleSidebar={toggleSidebar} />
//       </div>
//       {isSidebarOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={handleOverlayClick} />
//       )}
//             <div className={`sidenav fixed left-0 top-0 w-52 h-[100vh] z-50 bg-[#0f0f0f]  duration-300 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//             <Slidernav onToggleSidebar={toggleSidebar}  />
//           </div>
//             <div className="profile-container text-white h-screen flex items-center justify-start flex-col">
//                 <h1 className='text-2xl font-extrabold m-2' >Profile</h1>
//                 {userData && (
//                     <div className="profile-details flex flex-col gap-3 w-[80%] justify-center items-center  shadow-red-600 shadow-xl rounded-xl mb-6 p-3">
//                         {/* Label for uploading a new profile image */}
//                         <label className='cursor-pointer flex justify-center gap-x-5 items-center' htmlFor="imgInput">
//                             <img
//                                 id='img'
//                                 src={imagePreview}  // Show profile image from Firestore or selected file
//                                 alt="Profile"
//                                 className="profile-img"
//                                 style={{ width: '150px', height: '150px', borderRadius: '50%' }} // Styling for the image
//                             />
//                             {/* Hidden file input for image selection */}
//                             <input
//                                 type="file"
//                                 id="imgInput"
//                                 accept=".png, .jpg, .jpeg"
//                                 hidden
//                                 onChange={handleImageChange} // Trigger image change
//                             />

//                         </label>
//                         <h2 className='text-xl text-sky-500  font-semibold' >{userData.username}</h2>
//                         <p className='text-xl font-semibold'>Email id : <span className='text-sky-700 underline-offset-2'>{userData.email}</span> </p>
//                     </div>
//                 )}
//                 <button className='bg-red-700 m-2 w-[40%] text-white text-lg font-semibold  p-1 rounded-lg' onClick={handleImageUpload} disabled={loading}>
//                     {loading ? 'Saving...' : 'Save'}
//                 </button>
//             </div>
//         </div>

//     );
// };

// export default Profile;
import React, { useState, useEffect } from 'react';
import { auth, db, uploadProfileImage } from '../../Firebase/Firebaselogin';
import { getDoc, doc, setDoc } from "firebase/firestore";
import Navbar from '../../Components/Navbar/Navbar';
import Slidernav from '../../Components/slidernav/Slidernav';
import { useNavigate } from 'react-router-dom';
import dumper from '../../assets/dumprof.png'; // Ensure dumper is correctly imported

const Profile = () => {
    const [userData, setUserData] = useState({});
    const [imagePreview, setImagePreview] = useState(dumper); // Set dumper as default image
    const [selectedImage, setSelectedImage] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate(); 
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    const handleOverlayClick = () => {
        setIsSidebarOpen(false);
    };

    const user = auth.currentUser;

    // Fetch user profile data from Firestore
    const fetchUserData = async () => {
        try {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserData(data);

                // Set image preview to the profile image from Firestore or fallback to dumper
                if (data.profileimage) {
                    setImagePreview(data.profileimage);  
                } else {
                    setImagePreview(dumper); // Fallback to dumper image if no profile image exists
                }
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Handle image selection (preview it before uploading)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file)); // Set preview to the newly selected image
    };

    // Handle image upload to Firestore
    const handleImageUpload = async () => {
        if (selectedImage) {
            setLoading(true);
            const downloadURL = await uploadProfileImage(selectedImage, user.uid);

            // Update Firestore with new profile image URL
            await updateProfileImageInFirestore(downloadURL);

            // Set the image preview to the uploaded image URL
            setImagePreview(downloadURL);
            setLoading(false);
        }
    };

    // Update profile image URL in Firestore
    const updateProfileImageInFirestore = async (imageURL) => {
        try {
            const docRef = doc(db, 'users', user.uid);
            await setDoc(docRef, { profileimage: imageURL }, { merge: true });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserData(); // Fetch user data including profile image on mount
        }
    }, [user]);

    return (
        <div>
            <div className="z-50 sticky top-0">
                <Navbar onToggleSidebar={toggleSidebar} />
            </div>
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={handleOverlayClick} />
            )}
            <div className={`sidenav fixed left-0 top-0 w-52 h-[100vh] z-50 bg-[#0f0f0f]  duration-300 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Slidernav onToggleSidebar={toggleSidebar} />
            </div>
            <div className="profile-container text-white h-screen flex items-center justify-start flex-col">
                <h1 className='text-2xl font-extrabold m-2' >Profile</h1>
                {userData && (
                    <div className="profile-details flex flex-col gap-3 w-[80%] justify-center items-center shadow-red-600 shadow-xl rounded-xl mb-6 p-3">
                        {/* Label for uploading a new profile image */}
                        <label className='cursor-pointer flex justify-center gap-x-5 items-center' htmlFor="imgInput">
                            <img
                                id='img'
                                src={imagePreview}  // Show profile image from Firestore or selected file
                                alt="Profile"
                                className="profile-img"
                                style={{ width: '150px', height: '150px', borderRadius: '50%' }} // Styling for the image
                            />
                            {/* Hidden file input for image selection */}
                            <input
                                type="file"
                                id="imgInput"
                                accept=".png, .jpg, .jpeg"
                                hidden
                                onChange={handleImageChange} // Trigger image change
                            />
                        </label>
                        <h2 className='text-xl text-sky-500 font-semibold'>{userData.username}</h2>
                        <p className='text-xl font-semibold'>Email id: <span className='text-sky-700 underline-offset-2'>{userData.email}</span></p>
                    </div>
                )}
                <button className='bg-red-700 m-2 w-[40%] text-white text-lg font-semibold p-1 rounded-lg' onClick={handleImageUpload} disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </div>
    );
};

export default Profile;
