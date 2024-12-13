import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
const firebaseConfig = {
    apiKey: "AIzaSyAra_pRSTItpDP-CcsWETLaiZOffgb8i9A",
    authDomain: "fir-831e8.firebaseapp.com",
    projectId: "fir-831e8",
    storageBucket: "fir-831e8.appspot.com",
    messagingSenderId: "591981350762",
    appId: "1:591981350762:web:2cbb9e53fde46a276a9f13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage()
const signup = async (username, email, password)=>{
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        const user = res.user
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            username: username.toLowerCase(),
            email: user.email,
            profileimage: '',
            createdAt: new Date()
        })
        toast.success('Account Created Successfully', { theme: 'dark' })
    } catch (error) {
        console.log(error)
        toast.error(error.code.split('/')[1].split('-').join(' '), { theme: 'dark' })
    }

}
const signin = async (email, password)=>{
    try {
        const res = await signInWithEmailAndPassword(auth, email, password)
        // console.log(res)
        toast.success('Logged in Succesfully', { theme: 'dark' })
    } catch (error) {
        console.log(error)
        toast.error(error.code.split('/')[1].split('-').join(' '), { theme: 'dark' })
    }
}
const logout = async ()=>{
    try {
        await signOut(auth)
        toast.success('Signout Successfully', {theme:'dark'})
    } catch (error) {
        console.log(error)
        toast.error(error.code.split('/')[1].split('-').join(' '), { theme: 'dark' })
    }
}
const uploadProfileImage = async (file, userId) => {
    try {
        // Reference to the storage location
        const storageRef = ref(storage, `profileImages/${userId}`);
        
        // Upload file
        await uploadBytes(storageRef, file);
        
        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);
        
        // Update Firestore with the image URL
        await setDoc(doc(db, 'users', userId), {
            profileimage: downloadURL
        }, { merge: true }); // Merge so we don't overwrite existing data
        
        toast.success('Profile image uploaded successfully', { theme: 'dark' });
        return downloadURL;
    } catch (error) {
        console.log(error);
        toast.error(error.code.split('/')[1].split('-').join(' '), { theme: 'dark' });
    }
};

export { signup, signin, logout, db, auth, storage, uploadProfileImage };