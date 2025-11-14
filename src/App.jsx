import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MatchProvider } from "./contexts/MatchContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SwipeInterface from "./components/SwipeInterface";
import MatchesList from "./components/MatchesList";
import UserProfile from "./components/UserProfile";
import CategoriesPage from "./pages/CategoriesPage";
import SuccessStoriesPage from "./pages/SuccessStoriesPage";
import BlogPage from "./pages/BlogPage";
import StoryDetailPage from "./pages/StoryDetailPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import "./App.css";
import { SocketProvider } from "./contexts/SocketContext";

// Main App component wrapped with Router
function App() {
  return (
    <Router>
      <AuthProvider>
        <MatchProvider>
          <SocketProvider>
            <AppContent />
          </SocketProvider>
        </MatchProvider>
      </AuthProvider>
    </Router>
  );
}

// Inner component that has access to React Router hooks
function AppContent() {
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();

  // Convert current path to match your existing page structure
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path === "/swipe") return "swipe";
    if (path.startsWith("/swipe/")) return "swipe";
    if (path === "/matches") return "matches";
    if (path === "/profile") return "profile";
    if (path === "/categories") return "categories";
    if (path === "/success-stories") return "success-stories";
    if (path === "/blog") return "blog";
    if (path.startsWith("/story/")) return "story";
    if (path.startsWith("/blog-post/")) return "blog-post";
    return "home";
  };

  // Extract page data from URL parameters
  const getPageData = () => {
    const path = location.pathname;
    if (path.startsWith("/swipe/")) {
      return [path.split("/")[2]]; // category
    }
    if (path.startsWith("/story/")) {
      return [path.split("/")[2]]; // storyId
    }
    if (path.startsWith("/blog-post/")) {
      return [path.split("/")[2]]; // postId
    }
    return null;
  };

  const currentPage = getCurrentPage();
  const pageData = getPageData();

  useEffect(() => {
    if (currentPage === "home") {
      const handleScroll = () => {
        const sections = ["home"];
        const scrollPosition = window.scrollY + 100;

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (
              scrollPosition >= offsetTop &&
              scrollPosition < offsetTop + offsetHeight
            ) {
              setActiveSection(section);
              break;
            }
          }
        }
      };

      window.addEventListener("scroll", handleScroll);
      handleScroll(); // Check initial position

      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [currentPage]);

  // Your existing renderPage function adapted for React Router
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage navigate={navigate} />;
      case "swipe":
        return (
          <SwipeInterface navigate={navigate} initialCategory={pageData?.[0]} />
        );
      case "matches":
        return <MatchesList navigate={navigate} />;
      case "profile":
        return <UserProfile navigate={navigate} />;
      case "categories":
        return <CategoriesPage navigate={navigate} />;
      case "success-stories":
        return <SuccessStoriesPage navigate={navigate} />;
      case "blog":
        return <BlogPage navigate={navigate} />;
      case "story":
        return <StoryDetailPage storyId={pageData?.[0]} navigate={navigate} />;
      case "blog-post":
        return <BlogDetailPage postId={pageData?.[0]} navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="App">
      <Navbar
        currentPage={currentPage}
        navigate={navigate}
        activeSection={activeSection}
      />
      <main style={{ paddingTop: "4rem" }}>{renderPage()}</main>
    </div>
  );
}

// Route definitions - this ensures direct URL access works
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/swipe" element={<SwipeInterface />} />
      <Route path="/swipe/:category" element={<SwipeInterface />} />
      <Route path="/matches" element={<MatchesList />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/success-stories" element={<SuccessStoriesPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/story/:storyId" element={<StoryDetailPage />} />
      <Route path="/blog-post/:postId" element={<BlogDetailPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App;
