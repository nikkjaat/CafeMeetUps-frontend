import { useState } from 'react';
import { Heart, X, MapPin, Info } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import styles from '../styles/SwipeCard.module.css';

const SwipeCard = ({ profile, onSwipeLeft, onSwipeRight }) => {
  const [showDetails, setShowDetails] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 500) {
      onSwipeRight(profile.id);
    } else if (offset < -100 || velocity < -500) {
      onSwipeLeft(profile.id);
    }
  };

  if (!profile) return null;

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
          src={profile.images[0]}
          alt={profile.name}
          className={styles.image}
        />
        <div className={styles.overlay} />
        
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
            <h3>{profile.name}, {profile.age}</h3>
            <button 
              className={styles.infoBtn}
              onClick={() => setShowDetails(!showDetails)}
            >
              <Info />
            </button>
          </div>
          <div className={styles.location}>
            <MapPin />
            <span>{profile.location}</span>
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
          <div className={styles.interests}>
            {profile.interests.map((interest, index) => (
              <span key={index} className={styles.interest}>
                {interest}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SwipeCard;