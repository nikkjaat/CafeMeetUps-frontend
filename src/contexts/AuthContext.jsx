import { createContext, useContext, useState, useEffect } from "react";
import ApiService from "../services/api";
import SocialAuthService from "../services/socialAuth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token and get user data
      ApiService.getProfile()
        .then((response) => {
          if (response.success) {
            setUser(response.user);
          } else {
            localStorage.removeItem("token");
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await ApiService.login({ email, password });

      if (response.success) {
        localStorage.setItem("token", response.token);
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const tokenId = await SocialAuthService.signInWithGoogle();
      const response = await ApiService.googleAuth(tokenId);

      if (response.success) {
        localStorage.setItem("token", response.token);
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    setIsLoading(true);
    try {
      const accessToken = await SocialAuthService.signInWithFacebook();
      const response = await ApiService.facebookAuth(accessToken);

      if (response.success) {
        localStorage.setItem("token", response.token);
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData) => {
    console.log("AuthContext - register called with:", formData);
    setIsLoading(true);
    try {
      // Use ApiService.register which now handles FormData properly
      const response = await ApiService.register(formData);

      if (response.success) {
        localStorage.setItem("token", response.token);
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithGoogle = async () => {
    setIsLoading(true);
    try {
      const tokenId = await SocialAuthService.signInWithGoogle();
      const response = await ApiService.googleAuth(tokenId);

      if (response.success) {
        localStorage.setItem("token", response.token);
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithFacebook = async () => {
    setIsLoading(true);
    try {
      const accessToken = await SocialAuthService.signInWithFacebook();
      const response = await ApiService.facebookAuth(accessToken);

      if (response.success) {
        localStorage.setItem("token", response.token);
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const oldRegister = async (userData) => {
    setIsLoading(true);
    try {
      const response = await ApiService.register(userData);

      if (response.success) {
        localStorage.setItem("token", response.token);
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const oldLogin = async (email, password) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userData = {
        id: Date.now(),
        email,
        name: email.split("@")[0],
        avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150`,
        age: 25,
        location: "New York, NY",
        interests: ["Coffee", "Travel", "Movies"],
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const oldRegisterMethod = async (userData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser = {
        id: Date.now(),
        ...userData,
        avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150`,
        interests: userData.interests || [],
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const updateProfile = async (updates) => {
    console.log(updates)
    try {
      const response = await ApiService.updateProfile(updates);
      if (response.success) {
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    loginWithGoogle,
    loginWithFacebook,
    registerWithGoogle,
    registerWithFacebook,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
