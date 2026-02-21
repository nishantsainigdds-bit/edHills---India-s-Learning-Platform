import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDomL5jHEyU4iiPsFTwnQt3v6dyNDqxvTQ",
  authDomain: "prefab-grid-483215-n8.firebaseapp.com",
  projectId: "prefab-grid-483215-n8",
  storageBucket: "prefab-grid-483215-n8.firebasestorage.app",
  messagingSenderId: "927188811854",
  appId: "1:927188811854:web:5b1837456641b24061c31f",
  measurementId: "G-78WB8G2F1H"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };
