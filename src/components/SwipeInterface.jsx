import { useState, useEffect, useMemo } from "react";
import { useMatch } from "../contexts/MatchContext";
import { useAuth } from "../contexts/AuthContext";
import SwipeCard from "./SwipeCard";
import MatchModal from "./MatchModal";
import CategoryFilter from "./CategoryFilter";
import FilterPanel from "./FilterPanel";
import {
  RotateCcw,
  Settings,
  Filter,
  Heart,
  X,
  Menu,
  Sliders,
} from "lucide-react";
import styles from "../styles/SwipeInterface.module.css";

const SwipeInterface = ({ navigate, initialCategory }) => {
  const { user } = useAuth();
  const {
    getCurrentProfile,
    swipeLeft,
    swipeRight,
    matches,
    resetProfiles,
    setFilter,
    categoryFilter,
    profiles,
    currentProfileIndex,
    filteredProfiles,
  } = useMatch();

  const [showMatchModal, setShowMatchModal] = useState(false);
  const [latestMatch, setLatestMatch] = useState(null);
  const [previousMatchCount, setPreviousMatchCount] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showLikeCount, setShowLikeCount] = useState(false);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (showSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSidebar]);

  // Get current profile directly from context
  const currentProfile = getCurrentProfile();

  // Initialize and handle category filter
  useEffect(() => {
    if (!user) {
      navigate("home");
      return;
    }

    // Set initial category filter if provided
    if (initialCategory && initialCategory !== categoryFilter) {
      setFilter(initialCategory);
    }
  }, [user, navigate, initialCategory, categoryFilter, setFilter]);

  // Handle match modal
  useEffect(() => {
    if (matches.length > previousMatchCount) {
      const newMatch = matches[matches.length - 1];
      setLatestMatch(newMatch);
      setShowMatchModal(true);
    }
    setPreviousMatchCount(matches.length);
  }, [matches, previousMatchCount]);

  // Swipe handlers
  const handleSwipeLeft = (profileId) => {
    if (!currentProfile) return;
    swipeLeft(profileId);
  };

  const handleSwipeRight = async (profileId) => {
    console.log(profileId);
    if (!currentProfile) return;

    try {
      const res = await fetch(`/api/like/${profileId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      // UI: animate the card flying right
      swipeRight(profileId);

      // If it's a match → open modal instantly
      if (data.isMatch) {
        const newMatch = {
          _id: data.match._id,
          user: {
            _id: currentProfile.id,
            name: currentProfile.name,
            age: currentProfile.age,
            avatar: currentProfile.images?.[0],
            location: currentProfile.location,
          },
          lastMessage: data.match.lastMessage,
          matchedAt: data.match.createdAt,
        };
        setLatestMatch(newMatch);
        setShowMatchModal(true);
      }

      // Optional: show like count for a few seconds
      if (currentProfile.likeCount > 0) {
        setShowLikeCount(true);
        setTimeout(() => setShowLikeCount(false), 2000);
      }
    } catch (err) {
      console.error(err);
      // fallback to context swipe (offline mode)
      swipeRight(profileId);
    }
  };

  const handleCategoryFilter = (category) => {
    setFilter(category);
  };

  const handleSendMessage = (matchId) => {
    setShowMatchModal(false);
    navigate("matches");
  };

  const handleReset = () => {
    resetProfiles();
  };

  // Stats for current filtering
  const matchingStats = {
    totalProfiles: profiles.length,
    filteredProfiles: filteredProfiles.length,
    currentIndex: currentProfileIndex,
    remaining: Math.max(0, filteredProfiles.length - currentProfileIndex),
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loginPrompt}>
          <h2>Please log in to start swiping</h2>
          <button onClick={() => navigate("home")}>Go to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Filter Panel */}
      <FilterPanel
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
      />

      {/* Sidebar Overlay for Mobile/Tablet */}
      {showSidebar && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${showSidebar ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.sidebarHeader}>
          <h3 className={styles.sidebarTitle}>Discover Settings</h3>
          <button
            className={styles.closeSidebarBtn}
            onClick={() => setShowSidebar(false)}
          >
            <X />
          </button>
        </div>

        <div className={styles.filterStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Profiles Available:</span>
            <span className={styles.statValue}>
              {matchingStats.filteredProfiles}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Remaining:</span>
            <span className={styles.statValue}>{matchingStats.remaining}</span>
          </div>
        </div>

        <CategoryFilter
          selectedCategory={categoryFilter}
          onCategorySelect={(category) => {
            handleCategoryFilter(category);
            setShowSidebar(false);
          }}
        />

        <div className={styles.sidebarSection}>
          <h4 className={styles.sectionTitle}>Advanced Filters</h4>
          <button
            className={styles.advancedFilterBtn}
            onClick={() => {
              setShowFilterPanel(true);
              setShowSidebar(false);
            }}
          >
            <Sliders size={16} />
            Custom Filters
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.cardContainer}>
          {currentProfile ? (
            <>
              <SwipeCard
                profile={{
                  ...currentProfile,
                  likeCount: currentProfile.likeCount || 0, // <-- pass likeCount
                }}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                showLikeCount={showLikeCount} // <-- animate badge
              />

              {/* Floating buttons – call same handler */}
              <div className={styles.floatingSwipeButtons}>
                <button
                  className={styles.floatingPassBtn}
                  onClick={() => handleSwipeLeft(currentProfile.id)}
                >
                  <X size={28} />
                </button>

                <button
                  className={styles.floatingSuperLikeBtn}
                  onClick={() => handleSwipeRight(currentProfile._id)}
                >
                  Star
                </button>

                <button
                  className={styles.floatingLikeBtn}
                  onClick={() => handleSwipeRight(currentProfile._id)}
                >
                  <Heart size={28} fill="currentColor" />
                </button>
              </div>
            </>
          ) : (
            <div className={styles.noMoreCards}>
              <div className={styles.noMoreIcon}>💔</div>
              <h3>That's everyone for now!</h3>
              <p>
                Check back later for new people in your area, or expand your
                search criteria.
              </p>
              <div className={styles.noMoreActions}>
                <button className={styles.resetBtn} onClick={handleReset}>
                  <RotateCcw />
                  Start Over
                </button>
                <button
                  className={styles.adjustFiltersBtn}
                  onClick={() => setShowFilterPanel(true)}
                >
                  <Filter />
                  Adjust Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Bar - Only navigation buttons */}
        <div className={styles.bottomNav}>
          <button
            className={styles.navBtn}
            onClick={() => setShowFilterPanel(true)}
          >
            <Filter size={24} />
            <span>Filters</span>
          </button>

          <button
            className={styles.navBtn}
            onClick={() => setShowSidebar(true)}
          >
            <Sliders size={24} />
            <span>Categories</span>
          </button>

          <button className={styles.navBtn} onClick={handleReset}>
            <RotateCcw size={24} />
            <span>Reset</span>
          </button>

          <button className={styles.navBtn}>
            <Settings size={24} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {showMatchModal && (
        <MatchModal
          match={latestMatch}
          onClose={() => setShowMatchModal(false)}
          onSendMessage={() => {
            setShowMatchModal(false);
            navigate("matches");
          }}
        />
      )}
    </div>
  );
};

export default SwipeInterface;
