import { Heart, Sparkles, Users, Star, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";
import { useState } from "react";
import { motion } from "framer-motion";
import styles from "../styles/Hero.module.css";

const Hero = ({ navigate }) => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleStartDating = () => {
    if (user) {
      navigate("swipe");
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <section id="home" className={styles.hero}>
        <div className={styles.container}>
          {/* Background Elements */}
          <div className={styles.backgroundElements}>
            <div className={styles.floatingHeart1}>
              <Heart />
            </div>
            <div className={styles.floatingHeart2}>
              <Heart />
            </div>
            <div className={styles.floatingSparkle1}>
              <Sparkles />
            </div>
            <div className={styles.floatingSparkle2}>
              <Sparkles />
            </div>
          </div>

          <div className={styles.content}>
            {/* Badge */}
            <motion.div
              className={styles.badge}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.badgeContent}>
                <Sparkles className={styles.badgeIcon} />
                <span className={styles.badgeText}>
                  Find Your Perfect Match
                </span>
                <div className={styles.badgeStars}>
                  <Star className={styles.star} />
                  <Star className={styles.star} />
                  <Star className={styles.star} />
                </div>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Where Hearts
              <span className={styles.gradientText}> Connect</span>
              <br />& Souls Find
              <span className={styles.gradientText}> Harmony</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className={styles.description}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Join millions of people discovering meaningful connections every
              day. Whether you're seeking love, friendship, or companionship,
              your journey to beautiful relationships starts here.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className={styles.buttons}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <button className={styles.primaryBtn} onClick={handleStartDating}>
                <span>Start Your Love Story</span>
                <ArrowRight className={styles.btnIcon} />
              </button>
              <button className={styles.secondaryBtn}>
                <Users className={styles.btnIcon} />
                <span>See Success Stories</span>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className={styles.stats}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className={styles.statItem}>
                <div className={styles.statNumber}>10M+</div>
                <div className={styles.statLabel}>Happy Members</div>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>500K+</div>
                <div className={styles.statLabel}>Daily Matches</div>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>50K+</div>
                <div className={styles.statLabel}>Love Stories</div>
              </div>
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              className={styles.trustBadge}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <div className={styles.trustContent}>
                <div className={styles.trustAvatars}>
                  <div className={styles.trustAvatar}></div>
                  <div className={styles.trustAvatar}></div>
                  <div className={styles.trustAvatar}></div>
                </div>
                <div className={styles.trustText}>
                  <span>Trusted by thousands worldwide</span>
                  <div className={styles.trustStars}>
                    <Star className={styles.trustStar} />
                    <Star className={styles.trustStar} />
                    <Star className={styles.trustStar} />
                    <Star className={styles.trustStar} />
                    <Star className={styles.trustStar} />
                    <span className={styles.trustRating}>5.0</span>
                  </div>
                </div>
              </div>
            </motion.div>
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
