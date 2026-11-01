
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAbjFd-zzBq_FnhtijHiLfH05QSKHG6IpQ",
  authDomain: "inksphere-fd426.firebaseapp.com",
  projectId: "inksphere-fd426",
  storageBucket: "inksphere-fd426.firebasestorage.app",
  messagingSenderId: "251434115191",
  appId: "1:251434115191:web:1a4e1aa7b29d04a1646672",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
