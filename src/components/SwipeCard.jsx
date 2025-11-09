import { useState } from "react";
import { Heart, X, MapPin, Info, Star, Activity } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import styles from "../styles/SwipeCard.module.css";

const SwipeCard = ({ profile, onSwipeLeft, onSwipeRight }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Add safety check - only swipe if profile exists
    if (!profile) return;

    if (offset > 100 || velocity > 500) {
      console.log("👉 Swipe right triggered");
      onSwipeRight(profile.id);
    } else if (offset < -100 || velocity < -500) {
      console.log("👈 Swipe left triggered");
      onSwipeLeft(profile.id);
    }
  };

  // Return early if no profile
  if (!profile) {
    return (
      <div className={styles.card}>
        <div className={styles.noProfile}>
          <div className={styles.noProfileIcon}>💔</div>
          <h3>No profile available</h3>
          <p>Please check back later for new matches</p>
        </div>
      </div>
    );
  }

  // Calculate activity indicator
  const getActivityIndicator = (lastActive) => {
    if (!lastActive) return { text: "Recently active", color: "#6B7280" };

    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const hoursDiff = (now - lastActiveDate) / (1000 * 60 * 60);

    if (hoursDiff < 1) return { text: "Online now", color: "#10B981" };
    if (hoursDiff < 24) return { text: "Active today", color: "#3B82F6" };
    if (hoursDiff < 168) return { text: "Active this week", color: "#6B7280" };
    return { text: "Active recently", color: "#9CA3AF" };
  };

  const activityInfo = getActivityIndicator(profile.lastActive);

  return (
    <motion.div
      className={styles.card}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, opacity }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.95 }}
    >
      <div className={styles.imageContainer}>
        <img
          src={
            profile.images?.[0] ||
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
          }
          alt={profile.name}
          className={styles.image}
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
        {!imageLoaded && (
          <div className={styles.imagePlaceholder}>
            <div className={styles.placeholderSpinner}></div>
          </div>
        )}
        <div className={styles.overlay} />

        {/* Compatibility Score Badge */}
        {profile.compatibilityScore && (
          <div className={styles.compatibilityBadge}>
            <Star className={styles.starIcon} />
            <span>{profile.compatibilityScore}% Match</span>
          </div>
        )}

        {/* Activity Indicator */}
        <div
          className={styles.activityIndicator}
          style={{ backgroundColor: activityInfo.color }}
        >
          <Activity className={styles.activityIcon} />
          <span>{activityInfo.text}</span>
        </div>

        {/* Swipe indicators */}
        <motion.div
          className={`${styles.swipeIndicator} ${styles.like}`}
          style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
        >
          <Heart />
          <span>LIKE</span>
        </motion.div>

        <motion.div
          className={`${styles.swipeIndicator} ${styles.nope}`}
          style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
        >
          <X />
          <span>NOPE</span>
        </motion.div>

        <div className={styles.cardInfo}>
          <div className={styles.nameAge}>
            <h3>
              {profile.name}, {profile.age}
            </h3>
            <button
              className={styles.infoBtn}
              onClick={() => setShowDetails(!showDetails)}
            >
              <Info />
            </button>
          </div>
          <div className={styles.location}>
            <MapPin />
            <span>
              {profile.location}
              {profile.distance && ` • ${profile.distance}km away`}
            </span>
          </div>
        </div>
      </div>

      {showDetails && (
        <motion.div
          className={styles.details}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <p className={styles.bio}>{profile.bio}</p>

          {/* Common Interests */}
          {profile.commonInterests && profile.commonInterests.length > 0 && (
            <div className={styles.commonInterests}>
              <h4>Common Interests ({profile.commonInterests.length})</h4>
              <div className={styles.interests}>
                {profile.commonInterests.map((interest, index) => (
                  <span
                    key={index}
                    className={`${styles.interest} ${styles.common}`}
                  >
                    {typeof interest === "string"
                      ? interest.charAt(0).toUpperCase() + interest.slice(1)
                      : interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* All Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className={styles.allInterests}>
              <h4>All Interests</h4>
              <div className={styles.interests}>
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className={`${styles.interest} ${
                      profile.commonInterests?.includes(interest)
                        ? styles.common
                        : ""
                    }`}
                  >
                    {typeof interest === "string"
                      ? interest.charAt(0).toUpperCase() + interest.slice(1)
                      : interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Compatibility Details */}
          <div className={styles.compatibilityDetails}>
            <div className={styles.compatibilityItem}>
              <span className={styles.label}>Match Score:</span>
              <span className={styles.value}>
                {profile.compatibilityScore}%
              </span>
            </div>
            {profile.distance && (
              <div className={styles.compatibilityItem}>
                <span className={styles.label}>Distance:</span>
                <span className={styles.value}>{profile.distance}km</span>
              </div>
            )}
            <div className={styles.compatibilityItem}>
              <span className={styles.label}>Activity Level:</span>
              <span className={styles.value}>
                {Math.round((profile.activityScore || 50) / 10)}/10
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SwipeCard;
