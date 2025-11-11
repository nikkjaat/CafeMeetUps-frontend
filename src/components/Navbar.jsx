// Navbar.js - Updated
import { useState, useEffect } from "react";
import { Heart, Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";
import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import styles from "../styles/Navbar.module.css";

const Navbar = ({ currentPage, navigate, activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      const width = window.innerWidth;
      setIsMediumScreen(width <= 1150.5 && width >= 768);
      setIsMobileScreen(width <= 768);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSignIn = () => {
    setAuthMode("login");
    setShowAuthModal(true);
    setIsMenuOpen(false);
  };

  const handleGetStarted = () => {
    setAuthMode("register");
    setShowAuthModal(true);
    setIsMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate("home");
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.container}>
          <div className={styles.navContent}>
            {/* Logo */}
            <div className={styles.logo} onClick={handleLogoClick}>
              <div className={styles.logoIcon}>
                <Heart />
              </div>
              <span className={styles.logoText}>CafemeetUps</span>
            </div>

            {/* Desktop Navigation */}
            <NavLinks
              className={styles.desktopNav}
              navigate={navigate}
              currentPage={currentPage}
              activeSection={activeSection}
              isMediumScreen={isMediumScreen}
            />

            {/* User Menu or Auth Buttons - ALWAYS SHOW */}
            {user ? (
              <UserMenu className={styles.userMenu} navigate={navigate} />
            ) : (
              <div className={styles.authButtons}>
                <button className={styles.signInBtn} onClick={handleSignIn}>
                  Sign In
                </button>
                <button
                  className={styles.getStartedBtn}
                  onClick={handleGetStarted}
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Floating Quick Actions for Mobile - Includes Menu Button */}
      {user && isMobileScreen && (
        <div className={styles.floatingActionsContainer}>
          {/* Close button when sidebar is open */}
          {isMenuOpen && (
            <button
              className={`${styles.floatingActionBtn} ${styles.closeBtn}`}
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <X />
            </button>
          )}

          {/* Menu button when sidebar is closed */}
          {!isMenuOpen && (
            <button
              className={`${styles.floatingActionBtn} ${styles.menuBtn}`}
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu />
            </button>
          )}

          {/* Quick Actions (Notification & Message) */}
          <UserMenu.QuickActions
            navigate={navigate}
            className={styles.floatingQuickActions}
          />
        </div>
      )}

      {/* Mobile Sidebar */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={closeMobileMenu}
        navigate={navigate}
        currentPage={currentPage}
        activeSection={activeSection}
        user={user}
        onSignIn={handleSignIn}
        onGetStarted={handleGetStarted}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Navbar;
