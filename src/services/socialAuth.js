// Social authentication service
class SocialAuthService {
  constructor() {
    this.googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    this.facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;
    this.isGoogleLoaded = false;
    this.isFacebookLoaded = false;
  }

  // Initialize Google Sign-In
  async initializeGoogle() {
    if (this.isGoogleLoaded) return;

    return new Promise((resolve, reject) => {
      if (typeof window.google !== "undefined") {
        this.isGoogleLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: this.googleClientId,
          callback: this.handleGoogleResponse.bind(this),
        });
        this.isGoogleLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error("Failed to load Google Sign-In script"));
      };

      document.head.appendChild(script);
    });
  }

  // Initialize Facebook SDK
  async initializeFacebook() {
    if (this.isFacebookLoaded) return;

    return new Promise((resolve, reject) => {
      if (typeof window.FB !== "undefined") {
        this.isFacebookLoaded = true;
        resolve();
        return;
      }

      window.fbAsyncInit = () => {
        window.FB.init({
          appId: this.facebookAppId,
          cookie: true,
          xfbml: true,
          version: "v18.0",
        });
        this.isFacebookLoaded = true;
        resolve();
      };

      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";

      script.onerror = () => {
        reject(new Error("Failed to load Facebook SDK"));
      };

      document.head.appendChild(script);
    });
  }

  // Google Sign-In
  async signInWithGoogle() {
    try {
      await this.initializeGoogle();

      return new Promise((resolve, reject) => {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback to popup
            window.google.accounts.id.renderButton(
              document.createElement("div"),
              {
                theme: "outline",
                size: "large",
                type: "standard",
                text: "signin_with",
                shape: "rectangular",
                logo_alignment: "left",
              }
            );
          }
        });

        this.googleResolve = resolve;
        this.googleReject = reject;
      });
    } catch (error) {
      throw new Error("Google Sign-In initialization failed");
    }
  }

  handleGoogleResponse(response) {
    if (this.googleResolve) {
      this.googleResolve(response.credential);
      this.googleResolve = null;
      this.googleReject = null;
    }
  }

  // Facebook Login
  async signInWithFacebook() {
    try {
      await this.initializeFacebook();

      return new Promise((resolve, reject) => {
        window.FB.login(
          (response) => {
            if (response.authResponse) {
              resolve(response.authResponse.accessToken);
            } else {
              reject(new Error("Facebook login failed"));
            }
          },
          {
            scope: "email,public_profile",
          }
        );
      });
    } catch (error) {
      throw new Error("Facebook Sign-In initialization failed");
    }
  }

  // Get Facebook user info
  async getFacebookUserInfo(accessToken) {
    return new Promise((resolve, reject) => {
      window.FB.api("/me", { fields: "name,email,picture" }, (response) => {
        if (response && !response.error) {
          resolve(response);
        } else {
          reject(new Error("Failed to get Facebook user info"));
        }
      });
    });
  }
}

export default new SocialAuthService();
