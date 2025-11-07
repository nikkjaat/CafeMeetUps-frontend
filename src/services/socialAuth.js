import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
} from "firebase/auth";

class SocialAuthService {
  constructor() {
    this.auth = null;
    this.googleProvider = null;
    this.facebookProvider = null;
    this.isInitialized = false;
  }

  initializeFirebase() {
    if (this.isInitialized) return;

    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    let firebaseApp;
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApp();
    }

    this.auth = getAuth(firebaseApp);
    this.googleProvider = new GoogleAuthProvider();
    this.facebookProvider = new FacebookAuthProvider();
    this.googleProvider.setCustomParameters({ prompt: "select_account" });
    this.facebookProvider.setCustomParameters({ display: "popup" });
    this.isInitialized = true;
  }

  async signInWithGoogle() {
    try {
      this.initializeFirebase();
      const result = await signInWithPopup(this.auth, this.googleProvider);
      const idToken = await result.user.getIdToken();
      return idToken;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw new Error(error.message || "Google sign-in failed");
    }
  }

  async signInWithFacebook() {
    try {
      this.initializeFirebase();
      const result = await signInWithPopup(this.auth, this.facebookProvider);
      const idToken = await result.user.getIdToken();
      return idToken;
    } catch (error) {
      console.error("Facebook sign-in error:", error);
      throw new Error(error.message || "Facebook sign-in failed");
    }
  }

  async signOut() {
    try {
      this.initializeFirebase();
      await signOut(this.auth);
    } catch (error) {
      console.error("Sign out error:", error);
      throw new Error(error.message || "Sign out failed");
    }
  }
}

export default new SocialAuthService();
