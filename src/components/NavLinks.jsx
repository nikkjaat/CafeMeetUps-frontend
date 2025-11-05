import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Hop as Home,
  Grid3x2 as Grid3X3,
  Circle as HelpCircle,
  Users,
  BookOpen,
  Info,
  Repeat2,
} from "lucide-react";
import styles from "../styles/NavLinks.module.css";

const NavLinks = ({ className, isMobile = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Categories", path: "/categories", icon: Grid3X3 },
    { name: "Swipe", path: "/swipe", icon: Repeat2 },
    { name: "Success Stories", path: "/success-stories", icon: Users },
    { name: "Blog", path: "/blog", icon: BookOpen },
  ];

  const handleMobileClick = () => {
    if (onClose) onClose();
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // For mobile, use buttons with navigate
  if (isMobile) {
    return (
      <div className={`${styles.navLinks} ${className || ""}`}>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.name}
              className={`${styles.navLink} ${styles.mobileNavLink} ${
                active ? styles.active : ""
              }`}
              onClick={() => {
                navigate(item.path);
                handleMobileClick();
              }}
            >
              <IconComponent />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // For desktop, use Link components for better accessibility and performance
  return (
    <div className={`${styles.navLinks} ${className || ""}`}>
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const active = isActive(item.path);

        return (
          <Link
            key={item.name}
            to={item.path}
            className={`${styles.navLink} ${active ? styles.active : ""}`}
          >
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default NavLinks;
