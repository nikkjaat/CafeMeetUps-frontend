import { motion } from 'framer-motion';
import { Heart, MessageCircle, X } from 'lucide-react';
import styles from '../styles/MatchModal.module.css';

const MatchModal = ({ match, onClose, onSendMessage }) => {
  if (!match) return null;

  return (
    <motion.div 
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className={styles.modal}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <button className={styles.closeBtn} onClick={onClose}>
          <X />
        </button>

        <div className={styles.celebration}>
          <motion.div 
            className={styles.heartIcon}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <Heart />
          </motion.div>
          <h2 className={styles.title}>It's a Match!</h2>
          <p className={styles.subtitle}>
            You and {match.profile.name} liked each other
          </p>
        </div>

        <div className={styles.profiles}>
          <div className={styles.profileImage}>
            <img 
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150" 
              alt="You" 
            />
          </div>
          <div className={styles.matchIcon}>
            <Heart />
          </div>
          <div className={styles.profileImage}>
            <img 
              src={match.profile.images[0]} 
              alt={match.profile.name} 
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.keepSwipingBtn} onClick={onClose}>
            Keep Swiping
          </button>
          <button 
            className={styles.sendMessageBtn} 
            onClick={() => onSendMessage(match.id)}
          >
            <MessageCircle />
            Send Message
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MatchModal;