// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "travel-blog-f8590.firebaseapp.com",
  projectId: "travel-blog-f8590",
  storageBucket: "travel-blog-f8590.appspot.com",
  messagingSenderId: "964100958942",
  appId: "1:964100958942:web:e20b791ed457b7470db04f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// uploadFile
export const uploadFile = (file, setMedia) => {
  const storage = getStorage(app);
  const name = new Date().getTime() + file.name;
  const storageRef = ref(storage, name);

  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      // Handle unsuccessful uploads
      console.error("Upload failed:", error);
    },
    () => {
      // Handle successful uploads on complete
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setMedia(downloadURL);
      });
    }
  );
};
