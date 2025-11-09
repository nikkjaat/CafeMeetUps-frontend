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
    updateFilters,
    loadProfiles,
    filteredProfiles,
  } = useMatch();

  const [showMatchModal, setShowMatchModal] = useState(false);
  const [latestMatch, setLatestMatch] = useState(null);
  const [previousMatchCount, setPreviousMatchCount] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Get current user preferences for filtering
  const userPreferences = useMemo(() => {
    if (!user) return null;

    return {
      age: user.age,
      gender: user.gender,
      interestedIn: user.interestedIn,
      location: user.location,
      preferences: user.preferences || {
        ageMin: 18,
        ageMax: 100,
        distance: 50,
        interests: [],
        relationshipType: "",
      },
    };
  }, [user]);

  // Enhanced filtering logic
  const applyAdvancedFilters = useMemo(() => {
    if (!profiles.length || !userPreferences) return profiles;

    return profiles.filter((profile) => {
      // Basic filters - exclude current user
      if (profile.id === user.id) return false;

      // Age filter based on user preferences
      const ageMin = userPreferences.preferences.ageMin || 18;
      const ageMax = userPreferences.preferences.ageMax || 100;
      if (profile.age < ageMin || profile.age > ageMax) return false;

      // Gender preference matching
      if (userPreferences.interestedIn !== "everyone") {
        const targetGender =
          userPreferences.interestedIn === "men"
            ? "male"
            : userPreferences.interestedIn === "women"
            ? "female"
            : null;

        if (targetGender && profile.gender !== targetGender) return false;

        // Check if the profile is also interested in user's gender
        if (profile.interestedIn && profile.interestedIn !== "everyone") {
          const profileTargetGender =
            profile.interestedIn === "men"
              ? "male"
              : profile.interestedIn === "women"
              ? "female"
              : null;

          if (
            profileTargetGender &&
            userPreferences.gender !== profileTargetGender
          ) {
            return false;
          }
        }
      }

      // Distance filter (simplified - would use actual coordinates in production)
      if (userPreferences.preferences.distance && profile.distance) {
        if (profile.distance > userPreferences.preferences.distance)
          return false;
      }

      // Relationship type filter
      if (
        userPreferences.preferences.relationshipType &&
        profile.relationshipType !==
          userPreferences.preferences.relationshipType
      ) {
        return false;
      }

      // Interests filter
      if (
        userPreferences.preferences.interests &&
        userPreferences.preferences.interests.length > 0
      ) {
        const hasCommonInterests = profile.interests?.some((interest) =>
          userPreferences.preferences.interests.includes(interest)
        );
        if (!hasCommonInterests) return false;
      }

      return true;
    });
  }, [profiles, userPreferences, user]);

  // Apply scoring and sorting
  const scoredAndSortedProfiles = useMemo(() => {
    return profiles.filter((profile) => profile.id !== user.id);
  }, [profiles, user]);

  // Get current profile directly from context - NO LOCAL STATE
  const currentProfile = getCurrentProfile();

  // Initialize and handle category filter
  useEffect(() => {
    if (!user) {
      navigate("home");
      return;
    }

    console.log("🔄 SwipeInterface initialized with user:", user.name);

    // Set initial category filter if provided
    if (initialCategory && initialCategory !== categoryFilter) {
      console.log("🎯 Setting initial category:", initialCategory);
      setFilter(initialCategory);
    }

    console.log("📊 Total profiles:", profiles.length);
    console.log("📊 Filtered profiles:", scoredAndSortedProfiles.length);
    console.log("📱 Current profile index:", currentProfileIndex);
    console.log("📱 Current profile:", currentProfile?.name || "No profile");
  }, [
    user,
    navigate,
    initialCategory,
    categoryFilter,
    setFilter,
    scoredAndSortedProfiles,
    profiles.length,
    currentProfileIndex,
    currentProfile,
  ]);

  // Handle match modal
  useEffect(() => {
    if (matches.length > previousMatchCount) {
      const newMatch = matches[matches.length - 1];
      setLatestMatch(newMatch);
      setShowMatchModal(true);
    }
    setPreviousMatchCount(matches.length);
  }, [matches, previousMatchCount]);

  // Fixed swipe handlers - no setTimeout, no local state updates
  const handleSwipeLeft = (profileId) => {
    if (!currentProfile) {
      console.log("⚠️ No current profile to swipe left");
      return;
    }
    console.log("👈 Swiping left on:", currentProfile.name);
    swipeLeft(profileId);
    // The current profile will automatically update via getCurrentProfile()
  };

  const handleSwipeRight = (profileId) => {
    if (!currentProfile) {
      console.log("⚠️ No current profile to swipe right");
      return;
    }
    console.log("👉 Swiping right on:", currentProfile.name);
    swipeRight(profileId);
    // The current profile will automatically update via getCurrentProfile()
  };

  const handleCategoryFilter = (category) => {
    setFilter(category);
  };

  const handleSendMessage = (matchId) => {
    setShowMatchModal(false);
    navigate("matches");
  };

  const handleReset = () => {
    console.log("🔄 Manual reset triggered");
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
        <div className={styles.header}>
          <button
            className={styles.menuBtn}
            onClick={() => setShowSidebar(true)}
          >
            <Menu />
          </button>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Discover People</h2>
            <p className={styles.subtitle}>
              {matchingStats.filteredProfiles > 0
                ? `${matchingStats.remaining} potential matches nearby`
                : "No matches found with current filters"}
            </p>
          </div>
          <div className={styles.controls}>
            <button
              className={styles.filterBtn}
              onClick={() => setShowFilterPanel(true)}
            >
              <Filter />
            </button>
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

        <div className={styles.instructions}>
          <div className={styles.instructionItem}>
            <div className={styles.swipeIcon}>👈</div>
            <span>Swipe left to pass</span>
          </div>
          <div className={styles.instructionItem}>
            <div className={styles.swipeIcon}>👉</div>
            <span>Swipe right to like</span>
          </div>
          {matchingStats.filteredProfiles > 0 && (
            <div className={styles.instructionItem}>
              <div className={styles.swipeIcon}>⭐</div>
              <span>Sorted by compatibility</span>
            </div>
          )}
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
