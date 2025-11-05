import { Heart, MessageCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NavLinks from './NavLinks';
import styles from '../styles/MobileMenu.module.css';

const MobileMenu = ({ isOpen, onClose, navigate, currentPage, activeSection, user, onSignIn, onGetStarted }) => {
  const { logout } = useAuth();

  const handleNavigation = (page) => {
    navigate(page);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('home');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.mobileMenu}>
      <div className={styles.mobileMenuContent}>
        {/* Navigation Links */}
        <NavLinks 
          className={styles.mobileNavLinks} 
          isMobile={true} 
          onClose={onClose} 
          navigate={navigate}
          currentPage={currentPage}
          activeSection={activeSection}
        />
        
        <div className={styles.menuDivider}></div>
        
        {/* User Actions */}
        {user ? (
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                <img src={user.avatar} alt={user.name} />
              </div>
              <div>
                <div className={styles.userName}>{user.name}</div>
                <div className={styles.userEmail}>{user.email}</div>
              </div>
            </div>
            
            <div className={styles.userActions}>
              <button 
                className={styles.actionButton}
                onClick={() => handleNavigation('swipe')}
              >
                <Heart />
                <span>Discover</span>
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => handleNavigation('matches')}
              >
                <MessageCircle />
                <span>My Matches</span>
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => handleNavigation('profile')}
              >
                <User />
                <span>My Profile</span>
              </button>
              
              <button 
                className={`${styles.actionButton} ${styles.logoutButton}`}
                onClick={handleLogout}
              >
                <LogOut />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.authSection}>
            <button className={styles.signInButton} onClick={onSignIn}>
              Sign In
            </button>
            <button className={styles.getStartedButton} onClick={onGetStarted}>
              Get Started
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;