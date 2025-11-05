import { useState, useEffect } from 'react';
import { useMatch } from '../contexts/MatchContext';
import { useAuth } from '../contexts/AuthContext';
import SwipeCard from './SwipeCard';
import MatchModal from './MatchModal';
import CategoryFilter from './CategoryFilter';
import { RotateCcw, Settings, ListFilter as Filter, Heart, X, Menu } from 'lucide-react';
import styles from '../styles/SwipeInterface.module.css';

const SwipeInterface = ({ navigate, initialCategory }) => {
  const { user } = useAuth();
  const { getCurrentProfile, swipeLeft, swipeRight, matches, resetProfiles, setFilter, categoryFilter } = useMatch();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [latestMatch, setLatestMatch] = useState(null);
  const [previousMatchCount, setPreviousMatchCount] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('home');
      return;
    }
    
    // Set initial category filter if provided
    if (initialCategory && initialCategory !== categoryFilter) {
      setFilter(initialCategory);
    }
    
    setCurrentProfile(getCurrentProfile());
  }, [user, navigate, initialCategory, categoryFilter, setFilter, getCurrentProfile]);

  useEffect(() => {
    // Check for new matches
    if (matches.length > previousMatchCount) {
      const newMatch = matches[matches.length - 1];
      setLatestMatch(newMatch);
      setShowMatchModal(true);
    }
    setPreviousMatchCount(matches.length);
  }, [matches, previousMatchCount]);

  const handleSwipeLeft = (profileId) => {
    swipeLeft(profileId);
    setTimeout(() => {
      setCurrentProfile(getCurrentProfile());
    }, 300);
  };

  const handleSwipeRight = (profileId) => {
    swipeRight(profileId);
    setTimeout(() => {
      setCurrentProfile(getCurrentProfile());
    }, 300);
  };

  const handleReset = () => {
    resetProfiles();
    setCurrentProfile(getCurrentProfile());
  };

  const handleCategoryFilter = (category) => {
    setFilter(category);
    setCurrentProfile(getCurrentProfile());
  };

  const handleSendMessage = (matchId) => {
    setShowMatchModal(false);
    navigate('matches');
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loginPrompt}>
          <h2>Please log in to start swiping</h2>
          <button onClick={() => navigate('home')}>Go to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sidebar Overlay for Mobile/Tablet */}
      {showSidebar && (
        <div className={styles.sidebarOverlay} onClick={() => setShowSidebar(false)} />
      )}

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${showSidebar ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h3 className={styles.sidebarTitle}>Categories</h3>
          <button className={styles.closeSidebarBtn} onClick={() => setShowSidebar(false)}>
            <X />
          </button>
        </div>
        <CategoryFilter
          selectedCategory={categoryFilter}
          onCategorySelect={(category) => {
            handleCategoryFilter(category);
            setShowSidebar(false);
          }}
        />
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <button
            className={styles.menuBtn}
            onClick={() => setShowSidebar(true)}
          >
            <Menu />
          </button>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Discover People</h2>
            <p className={styles.subtitle}>Find your perfect match</p>
          </div>
          <div className={styles.controls}>
            <button className={styles.resetBtn} onClick={handleReset}>
              <RotateCcw />
            </button>
            <button className={styles.settingsBtn}>
              <Settings />
            </button>
          </div>
        </div>

        <div className={styles.cardContainer}>
          {currentProfile ? (
            <>
              <SwipeCard
                profile={currentProfile}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
              <div className={styles.actionButtons}>
                <button
                  className={styles.passBtn}
                  onClick={() => handleSwipeLeft(currentProfile.id)}
                >
                  <X />
                </button>
                <button
                  className={styles.superLikeBtn}
                  onClick={() => handleSwipeRight(currentProfile.id)}
                >
                  ⭐
                </button>
                <button
                  className={styles.likeBtn}
                  onClick={() => handleSwipeRight(currentProfile.id)}
                >
                  <Heart />
                </button>
              </div>
            </>
          ) : (
            <div className={styles.noMoreCards}>
              <div className={styles.noMoreIcon}>💔</div>
              <h3>That's everyone for now!</h3>
              <p>Check back later for new people in your area, or expand your search criteria.</p>
              <button className={styles.resetBtn} onClick={handleReset}>
                <RotateCcw />
                Start Over
              </button>
            </div>
          )}
        </div>

        <div className={styles.instructions}>
          <div className={styles.instructionItem}>
            <div className={styles.swipeIcon}>👈</div>
            <span>Swipe left to pass</span>
          </div>
          <div className={styles.instructionItem}>
            <div className={styles.swipeIcon}>👉</div>
            <span>Swipe right to like</span>
          </div>
        </div>
      </div>

      {showMatchModal && (
        <MatchModal
          match={latestMatch}
          onClose={() => setShowMatchModal(false)}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

export default SwipeInterface;