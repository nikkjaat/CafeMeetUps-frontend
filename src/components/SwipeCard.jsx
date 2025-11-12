import { useState } from "react";
import { Heart, X, MapPin, Info, Star, Activity } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import styles from "../styles/SwipeCard.module.css";

const SwipeCard = ({ profile, onSwipeLeft, onSwipeRight }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  console.log(profile._id);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_, info) => {
    if (!profile) return;
    const { offset, velocity } = info;
    if (offset.x > 100 || velocity.x > 500) onSwipeRight(profile._id);
    else if (offset.x < -100 || velocity.x < -500) onSwipeLeft(profile._id);
  };

  if (!profile) {
    return (
      <div className={styles.card}>
        <div className={styles.noProfile}>
          <div className={styles.noProfileIcon}>Broken Heart</div>
          <h3>No profile available</h3>
          <p>Please check back later</p>
        </div>
      </div>
    );
  }

  const activity = (() => {
    if (!profile.lastActive)
      return { text: "Recently active", color: "#6B7280" };
    const diff = (Date.now() - new Date(profile.lastActive)) / 36e5;
    if (diff < 1) return { text: "Online now", color: "#10B981" };
    if (diff < 24) return { text: "Active today", color: "#3B82F6" };
    if (diff < 168) return { text: "Active this week", color: "#6B7280" };
    return { text: "Active recently", color: "#9CA3AF" };
  })();

  return (
    <motion.div
      className={styles.card}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, opacity }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.96 }}
    >
      {/* ---------- IMAGE ---------- */}
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
            <div className={styles.spinner}></div>
          </div>
        )}

        <div className={styles.overlay} />

        {/* Compatibility badge */}
        {profile.compatibilityScore && (
          <div className={styles.compatibilityBadge}>
            <Star className={styles.starIcon} />
            <span>{profile.compatibilityScore}% Match</span>
          </div>
        )}

        {/* Activity indicator */}
        <div
          className={styles.activityIndicator}
          style={{ backgroundColor: activity.color }}
        >
          <Activity className={styles.activityIcon} />
          <span>{activity.text}</span>
        </div>

        {/* Swipe hints */}
        <motion.div
          className={`${styles.swipeHint} ${styles.like}`}
          style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
        >
          <Heart />
          <span>LIKE</span>
        </motion.div>
        <motion.div
          className={`${styles.swipeHint} ${styles.nope}`}
          style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
        >
          <X />
          <span>NOPE</span>
        </motion.div>

        {/* Basic info */}
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
              {profile.distance && ` • ${profile.distance} km`}
            </span>
          </div>
        </div>
      </div>

      {/* ---------- DETAILS (optional) ---------- */}
      {showDetails && (
        <motion.div
          className={styles.details}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <p className={styles.bio}>{profile.bio || "No bio yet."}</p>

          {/* Common interests */}
          {profile.commonInterests?.length > 0 && (
            <div className={styles.interestBlock}>
              <h4>Common Interests ({profile.commonInterests.length})</h4>
              <div className={styles.interestList}>
                {profile.commonInterests.map((i, idx) => (
                  <span
                    key={idx}
                    className={`${styles.interest} ${styles.common}`}
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* All interests */}
          {profile.interests?.length > 0 && (
            <div className={styles.interestBlock}>
              <h4>All Interests</h4>
              <div className={styles.interestList}>
                {profile.interests.map((i, idx) => (
                  <span
                    key={idx}
                    className={`${styles.interest} ${
                      profile.commonInterests?.includes(i) ? styles.common : ""
                    }`}
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Compatibility stats */}
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.label}>Match Score</span>
              <span className={styles.value}>
                {profile.compatibilityScore}%
              </span>
            </div>
            {profile.distance && (
              <div className={styles.stat}>
                <span className={styles.label}>Distance</span>
                <span className={styles.value}>{profile.distance} km</span>
              </div>
            )}
            <div className={styles.stat}>
              <span className={styles.label}>Activity</span>
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
