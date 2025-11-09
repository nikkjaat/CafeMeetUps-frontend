import { useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  User,
  LogOut,
  Settings,
  ChevronDown,
  AlertCircle,
  BellIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/UserMenu.module.css";

const UserMenu = ({ className, navigate }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 950.5);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNavigation = (page) => {
    navigate(page);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("home");
    setIsDropdownOpen(false);
  };

  return (
    <div className={`${styles.userMenu} ${className || ""}`} ref={dropdownRef}>
      {/* Quick Action Buttons */}
      <div className={styles.quickActions}>
        <button
          className={styles.actionBtn}
          onClick={() => handleNavigation("swipe")}
          title="Discover"
        >
          <BellIcon />
        </button>
        <button
          className={styles.actionBtn}
          onClick={() => handleNavigation("matches")}
          title="Matches"
        >
          <MessageCircle />
        </button>
      </div>

      {/* User Avatar Dropdown */}
      <div className={styles.userDropdown}>
        <button
          className={`${styles.userButton} ${
            isSmallScreen ? styles.compact : ""
          }`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
        >
          <div className={styles.userAvatar}>
            <img src={user?.avatar} alt={user?.name} />
          </div>
          {!isSmallScreen && (
            <>
              <span className={styles.userName}>{user?.name}</span>
              <ChevronDown
                className={`${styles.chevron} ${
                  isDropdownOpen ? styles.rotated : ""
                }`}
              />
            </>
          )}
          {isSmallScreen && (
            <ChevronDown
              className={`${styles.chevron} ${
                isSmallScreen ? styles.compactChevron : ""
              } ${isDropdownOpen ? styles.rotated : ""}`}
            />
          )}
        </button>

        {isDropdownOpen && (
          <div className={styles.dropdownMenu}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatarLarge}>
                <img src={user?.avatar} alt={user?.name} />
              </div>
              <div>
                <div className={styles.userNameLarge}>{user?.name}</div>
                <div className={styles.userEmail}>{user?.email}</div>
              </div>
            </div>

            <div className={styles.menuDivider}></div>

            <button
              className={styles.menuItem}
              onClick={() => handleNavigation("profile")}
            >
              <User />
              <span>My Profile</span>
            </button>

            <button
              className={styles.menuItem}
              onClick={() => handleNavigation("swipe")}
            >
              <Heart />
              <span>Discover</span>
            </button>

            <button
              className={styles.menuItem}
              onClick={() => handleNavigation("matches")}
            >
              <MessageCircle />
              <span>My Matches</span>
            </button>

            <button className={styles.menuItem}>
              <Settings />
              <span>Settings</span>
            </button>

            <div className={styles.menuDivider}></div>

            <button
              className={`${styles.menuItem} ${styles.logoutItem}`}
              onClick={handleLogout}
            >
              <LogOut />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMenu;
