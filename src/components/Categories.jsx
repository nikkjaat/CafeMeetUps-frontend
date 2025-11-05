import { Coffee, Music, Plane, Film, Gamepad2, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import AuthModal from './AuthModal';
import styles from '../styles/Categories.module.css';

const Categories = ({ navigate, showLimited = false }) => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const categories = [
    {
      id: 1,
      name: 'Coffee',
      icon: Coffee,
      description: 'Meet over a perfect cup of coffee',
      color: 'from-amber-400 to-orange-500',
      users: '2.3M'
    },
    {
      id: 2,
      name: 'Clubbing',
      icon: Music,
      description: 'Dance the night away together',
      color: 'from-purple-400 to-pink-500',
      users: '1.8M'
    },
    {
      id: 3,
      name: 'Travel',
      icon: Plane,
      description: 'Explore the world with someone special',
      color: 'from-blue-400 to-cyan-500',
      users: '3.1M'
    },
    {
      id: 4,
      name: 'Movie',
      icon: Film,
      description: 'Share popcorn and great stories',
      color: 'from-red-400 to-pink-500',
      users: '2.7M'
    },
    {
      id: 5,
      name: 'Gaming',
      icon: Gamepad2,
      description: 'Level up your love life',
      color: 'from-green-400 to-blue-500',
      users: '1.9M'
    },
    {
      id: 6,
      name: 'Serious Relationship',
      icon: Heart,
      description: 'Find your life partner',
      color: 'from-pink-500 to-red-500',
      users: '4.2M'
    },
    {
      id: 7,
      name: 'Fitness',
      icon: Heart,
      description: 'Stay active together',
      color: 'from-green-400 to-emerald-500',
      users: '1.5M'
    },
    {
      id: 8,
      name: 'Music',
      icon: Music,
      description: 'Share your favorite beats',
      color: 'from-purple-500 to-indigo-500',
      users: '2.1M'
    },
    {
      id: 9,
      name: 'Food',
      icon: Coffee,
      description: 'Explore culinary adventures',
      color: 'from-orange-400 to-red-500',
      users: '2.8M'
    }
  ];

  const displayCategories = showLimited ? categories.slice(0, 3) : categories;

  const handleExplore = (category) => {
    if (user) {
      navigate('swipe', category.name.toLowerCase().replace(/\s+/g, '-'));
    } else {
      setShowAuthModal(true);
    }
  };

  const handleBrowseAll = () => {
    navigate('categories');
  };

  return (
    <>
      <section id="categories" className={styles.categories}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            Find Your Perfect 
            <span className={styles.gradientText}>
              {' '}Match Type
            </span>
          </h2>
          <p className={styles.description}>
            Whether you're looking for casual coffee dates or your soulmate, 
            we have the perfect category for your dating style.
          </p>
        </div>

        {/* Categories Grid */}
        <div className={styles.grid}>
          {displayCategories.map((category) => {
            const IconComponent = category.icon;
            const iconClass = category.name.toLowerCase().replace(/\s+/g, '');
            return (
              <div
                key={category.id}
                className={styles.categoryCard}
              >
                <div className={`${styles.categoryIcon} ${styles[iconClass] || styles.coffee}`}>
                  <IconComponent />
                </div>
                
                <h3 className={styles.categoryName}>
                  {category.name}
                </h3>
                
                <p className={styles.categoryDescription}>
                  {category.description}
                </p>
                
                <div className={styles.categoryFooter}>
                  <span className={styles.userCount}>
                    {category.users} active users
                  </span>
                  <button 
                    className={styles.exploreBtn}
                    onClick={() => handleExplore(category)}
                  >
                    Explore →
                  </button>
                </div>
                
                {/* Hover Effect */}
                <div className={`${styles.hoverOverlay} ${styles[iconClass] || styles.coffee}`}></div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        {showLimited && (
          <div className={styles.ctaSection}>
            <button className={styles.browseBtn} onClick={handleBrowseAll}>
              Browse All Categories
            </button>
          </div>
        )}
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

export default Categories;