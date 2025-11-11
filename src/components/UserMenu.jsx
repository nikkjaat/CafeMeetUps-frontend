import { useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Bell,
  X,
  Clock,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/UserMenu.module.css";

// Export QuickActions as a separate component
export const QuickActions = ({ navigate, className }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  // Sample notifications data
  const [notifications] = useState([
    {
      id: 1,
      type: "match",
      title: "New Match!",
      message: "You and Sarah have liked each other",
      time: "2 min ago",
      read: false,
      image:
        "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 2,
      type: "message",
      title: "New Message",
      message: "Emma sent you a message",
      time: "1 hour ago",
      read: false,
      image:
        "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <div className={`${styles.quickActions} ${className || ""}`}>
      {/* Notifications Button with Popup */}
      <div className={styles.notificationWrapper} ref={notificationRef}>
        <button
          className={`${styles.actionBtn} ${styles.notificationBtn} ${
            isNotificationOpen ? styles.active : ""
          }`}
          onClick={toggleNotifications}
          title="Notifications"
        >
          <Bell />
          {unreadCount > 0 && (
            <span className={styles.notificationBadge}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Popup */}
        {isNotificationOpen && (
          <div className={styles.notificationPopup}>
            {/* Header */}
            <div className={styles.notificationHeader}>
              <h3 className={styles.notificationTitle}>Notifications</h3>
              <div className={styles.notificationActions}>
                <button
                  className={styles.closeBtn}
                  onClick={() => setIsNotificationOpen(false)}
                >
                  <X />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className={styles.notificationList}>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`${styles.notificationItem} ${
                      !notification.read ? styles.unread : ""
                    }`}
                    onClick={() => {
                      setIsNotificationOpen(false);
                      // Navigate based on notification type
                      if (
                        notification.type === "match" ||
                        notification.type === "message"
                      ) {
                        navigate("matches");
                      }
                    }}
                  >
                    {notification.image && (
                      <div className={styles.notificationImage}>
                        <img src={notification.image} alt="Profile" />
                      </div>
                    )}
                    <div className={styles.notificationContent}>
                      <div className={styles.notificationText}>
                        <h4 className={styles.notificationItemTitle}>
                          {notification.title}
                        </h4>
                        <p className={styles.notificationMessage}>
                          {notification.message}
                        </p>
                      </div>
                      <div className={styles.notificationMeta}>
                        <Clock className={styles.timeIcon} />
                        <span className={styles.notificationTime}>
                          {notification.time}
                        </span>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className={styles.unreadIndicator}></div>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <Bell className={styles.emptyIcon} />
                  <h4>No notifications</h4>
                  <p>We'll notify you when something arrives</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className={styles.notificationFooter}>
                <button
                  className={styles.viewAllBtn}
                  onClick={() => {
                    navigate("notifications");
                    setIsNotificationOpen(false);
                  }}
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Messages Button */}
      <button
        className={styles.actionBtn}
        onClick={() => navigate("matches")}
        title="Messages"
      >
        <MessageCircle />
      </button>
    </div>
  );
};

const UserMenu = ({ className, navigate }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isBelow769, setIsBelow769] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleResize = () => {
      const width = window.innerWidth;
      setIsSmallScreen(width <= 950.5);
      setIsBelow769(width <= 769.5);
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
      {/* Quick Action Buttons - ALWAYS VISIBLE on all screens */}
      <QuickActions navigate={navigate} />

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
            <img src={user?.avatar || "/default-avatar.png"} alt={user?.name} />
          </div>
          {/* Show user name when screen is below 769.5px OR when it's not a small screen */}
          {(!isSmallScreen || isBelow769) && (
            <>
              <span className={styles.userName}>{user?.name || "User"}</span>
              <ChevronDown
                className={`${styles.chevron} ${
                  isDropdownOpen ? styles.rotated : ""
                }`}
              />
            </>
          )}
          {/* Show only chevron when it's small screen but above 769.5px */}
          {isSmallScreen && !isBelow769 && (
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
                <img
                  src={user?.avatar || "/default-avatar.png"}
                  alt={user?.name}
                />
              </div>
              <div>
                <div className={styles.userNameLarge}>
                  {user?.name || "User"}
                </div>
                <div className={styles.userEmail}>{user?.email || ""}</div>
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

            <button
              className={styles.menuItem}
              onClick={() => handleNavigation("settings")}
            >
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

// Attach QuickActions to UserMenu for easier access
UserMenu.QuickActions = QuickActions;

export default UserMenu;
