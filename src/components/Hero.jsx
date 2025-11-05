import { Heart, Sparkles, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/Hero.module.css';

const Hero = ({ navigate }) => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleStartDating = () => {
    if (user) {
      navigate('swipe');
    } else {
      setShowAuthModal(true);
    }
  };

  // Sample profiles for the swipeable cards
  const sampleProfiles = [
    {
      id: 1,
      name: 'Sarah',
      age: 25,
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
      distance: '2 miles away'
    },
    {
      id: 2,
      name: 'Emma',
      age: 28,
      image: 'https://images.pexels.com/photos/1024992/pexels-photo-1024992.jpeg?auto=compress&cs=tinysrgb&w=400',
      distance: '5 miles away'
    },
    {
      id: 3,
      name: 'Jessica',
      age: 24,
      image: 'https://images.pexels.com/photos/1024994/pexels-photo-1024994.jpeg?auto=compress&cs=tinysrgb&w=400',
      distance: '3 miles away'
    }
  ];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Auto-swipe every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % sampleProfiles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentProfile = sampleProfiles[currentCardIndex];

  return (
    <>
      <section id="home" className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Content */}
          <div className={styles.content}>
            <div className={styles.badge}>
              <Sparkles />
              <span className={styles.badgeText}>Find Your Perfect Match</span>
            </div>
            
            <h1 className={styles.title}>
              Love is just a 
              <span className={styles.gradientText}>
                {' '}swipe away
              </span>
            </h1>
            
            <p className={styles.description}>
              Connect with millions of people worldwide. Whether you're looking for love, friendship, 
              or something casual, we help you find meaningful connections.
            </p>
            
            <div className={styles.buttons}>
              <button className={styles.primaryBtn} onClick={handleStartDating}>
                {user ? 'Start Swiping' : 'Start Dating Now'}
              </button>
              <button className={styles.secondaryBtn}>
                Watch Demo
              </button>
            </div>
            
            {/* Stats */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>10M+</div>
                <div className={styles.statLabel}>Active Users</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>500K+</div>
                <div className={styles.statLabel}>Matches Daily</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>50K+</div>
                <div className={styles.statLabel}>Success Stories</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Interactive Dating Cards */}
          <div className={styles.cardPreview}>
            <div className={styles.cardStack}>
              {/* Background Cards */}
              <div className={styles.cardBg1}></div>
              <div className={styles.cardBg2}></div>
              
              {/* Interactive Card */}
              <motion.div 
                className={styles.card}
                key={currentProfile.id}
                initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className={styles.cardImage}>
                  <img 
                    src={currentProfile.image} 
                    alt={currentProfile.name}
                  />
                  <div className={styles.cardOverlay}></div>
                  <div className={styles.cardInfo}>
                    <h3 className={styles.cardName}>{currentProfile.name}, {currentProfile.age}</h3>
                    <p className={styles.cardDistance}>{currentProfile.distance}</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              className={styles.floatingHeart}
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Heart />
            </motion.div>
            <motion.div 
              className={styles.floatingUsers}
              animate={{ 
                y: [0, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Users />
            </motion.div>
          </div>
        </div>
      </div>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="register"
      />
    </>
  );
};

export default Hero;