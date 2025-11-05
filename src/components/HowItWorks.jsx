import { UserPlus, Search, MessageCircle, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import AuthModal from './AuthModal';
import styles from '../styles/HowItWorks.module.css';

const HowItWorks = ({ navigate }) => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const steps = [
    {
      id: 1,
      icon: UserPlus,
      title: 'Create Your Profile',
      description: 'Sign up and create an attractive profile with your best photos and interests.',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 2,
      icon: Search,
      title: 'Discover Matches',
      description: 'Browse through profiles and discover people who share your interests and values.',
      color: 'from-green-400 to-green-600'
    },
    {
      id: 3,
      icon: MessageCircle,
      title: 'Start Conversations',
      description: 'Break the ice with our conversation starters and get to know each other better.',
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 4,
      icon: Heart,
      title: 'Find Love',
      description: 'Meet in person, build meaningful relationships, and find your perfect match.',
      color: 'from-pink-400 to-red-500'
    }
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate('swipe');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <section id="how-it-works" className={styles.howItWorks}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            How 
            <span className={styles.gradientText}>
              {' '}It Works
            </span>
          </h2>
          <p className={styles.description}>
            Finding love has never been easier. Follow these simple steps to start your journey 
            towards meaningful connections.
          </p>
        </div>

        {/* Steps */}
        <div className={styles.stepsContainer}>
          {/* Connection Line */}
          <div className={styles.connectionLine}></div>
          
          <div className={styles.stepsGrid}>
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const colorClass = ['blue', 'green', 'purple', 'pink'][index];
              return (
                <div key={step.id}>
                  {/* Step Card */}
                  <div className={styles.stepCard}>
                    {/* Step Number */}
                    <div className={styles.stepNumber}>
                      {step.id}
                    </div>
                    
                    {/* Icon */}
                    <div className={`${styles.stepIcon} ${styles[colorClass]}`}>
                      <IconComponent />
                    </div>
                    
                    {/* Content */}
                    <h3 className={styles.stepTitle}>
                      {step.title}
                    </h3>
                    <p className={styles.stepDescription}>
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Arrow for mobile */}
                  {index < steps.length - 1 && (
                    <div className={styles.mobileArrow}>
                      <div className={styles.arrowLine}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className={styles.ctaSection}>
          <button className={styles.getStartedBtn} onClick={handleGetStarted}>
            Get Started Today
          </button>
          <p className={styles.ctaSubtext}>Join millions of people finding love every day</p>
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

export default HowItWorks;