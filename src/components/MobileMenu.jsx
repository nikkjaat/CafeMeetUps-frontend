import {
  Heart,
  MessageCircle,
  User,
  LogOut,
  X,
  Settings,
  Star,
  Coffee,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import NavLinks from "./NavLinks";
import styles from "../styles/MobileMenu.module.css";

const MobileMenu = ({
  isOpen,
  onClose,
  navigate,
  currentPage,
  activeSection,
  user,
  onSignIn,
  onGetStarted,
}) => {
  const { logout } = useAuth();

  const handleNavigation = (page) => {
    navigate(page);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate("home");
    onClose();
  };

  return (
    <>
      {/* Overlay with animation */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${
          isOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoSection}>
            <div className={styles.logoIcon}>
              <Coffee />
            </div>
            <span className={styles.logoText}>CafemeetUps</span>
          </div>
        </div>

        <div className={styles.sidebarContent}>
          {/* User Info Section */}
          {user && (
            <div className={styles.userCard}>
              <div className={styles.userAvatar}>
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.name}
                />
                <div className={styles.onlineIndicator}></div>
              </div>
              <div className={styles.userInfo}>
                <h3 className={styles.userName}>{user.name}</h3>
                <p className={styles.userEmail}>{user.email}</p>
                <div className={styles.userStats}>
                  <div className={styles.stat}>
                    <Heart className={styles.statIcon} />
                    <span>24 Matches</span>
                  </div>
                  <div className={styles.stat}>
                    <Star className={styles.statIcon} />
                    <span>4.8 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className={styles.navigationSection}>
            <h4 className={styles.sectionTitle}>Navigation</h4>
            <NavLinks
              className={styles.mobileNavLinks}
              isMobile={true}
              onClose={onClose}
              navigate={navigate}
              currentPage={currentPage}
              activeSection={activeSection}
            />
          </div>

          {/* Quick Actions - Always show at least 2 buttons */}
          <div className={styles.quickActionsSection}>
            <h4 className={styles.sectionTitle}>Quick Actions</h4>
            <div className={styles.quickActionsGrid}>
              <button
                className={`${styles.quickAction} ${
                  currentPage === "swipe" ? styles.active : ""
                }`}
                onClick={() => handleNavigation("swipe")}
              >
                <div className={styles.quickActionIcon}>
                  <Heart />
                </div>
                <span>Discover</span>
              </button>

              <button
                className={`${styles.quickAction} ${
                  currentPage === "matches" ? styles.active : ""
                }`}
                onClick={() => handleNavigation("matches")}
              >
                <div className={styles.quickActionIcon}>
                  <MessageCircle />
                </div>
                <span>Matches</span>
              </button>

              {user && (
                <>
                  <button
                    className={`${styles.quickAction} ${
                      currentPage === "profile" ? styles.active : ""
                    }`}
                    onClick={() => handleNavigation("profile")}
                  >
                    <div className={styles.quickActionIcon}>
                      <User />
                    </div>
                    <span>Profile</span>
                  </button>

                  <button
                    className={styles.quickAction}
                    onClick={() => handleNavigation("settings")}
                  >
                    <div className={styles.quickActionIcon}>
                      <Settings />
                    </div>
                    <span>Settings</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Auth Section for non-logged in users */}
          {!user && (
            <div className={styles.authSection}>
              <div className={styles.authHeader}>
                <h3>Join the Community</h3>
                <p>Connect with coffee lovers near you</p>
              </div>
              <div className={styles.authButtons}>
                <button className={styles.signInButton} onClick={onSignIn}>
                  <User />
                  <span>Sign In</span>
                </button>
                <button
                  className={styles.getStartedButton}
                  onClick={onGetStarted}
                >
                  <Heart />
                  <span>Get Started</span>
                </button>
              </div>
            </div>
          )}

          {/* Logout Section */}
          {user && (
            <div className={styles.footerSection}>
              <button className={styles.logoutButton} onClick={handleLogout}>
                <LogOut />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Close Button */}
      {isOpen && (
        <button
          className={styles.floatingCloseButton}
          onClick={onClose}
          aria-label="Close menu"
        >
          <X />
        </button>
      )}
    </>
  );
};

export default MobileMenu;
