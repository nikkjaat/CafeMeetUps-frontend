import { useState } from 'react';
import { ArrowLeft, Users, Heart } from 'lucide-react';
import Categories from '../components/Categories';
import styles from '../styles/CategoriesPage.module.css';

const CategoriesPage = ({ navigate }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backBtn}
          onClick={() => navigate('home')}
        >
          <ArrowLeft />
          <span>Back to Home</span>
        </button>
        
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <Heart />
          </div>
          <h1 className={styles.title}>
            All <span className={styles.gradientText}>Categories</span>
          </h1>
          <p className={styles.subtitle}>
            Discover people who share your interests and passions. Choose a category 
            to find your perfect match based on what matters most to you.
          </p>
          
          <div className={styles.stats}>
            <div className={styles.stat}>
              <Users />
              <span>10M+ Active Users</span>
            </div>
            <div className={styles.stat}>
              <Heart />
              <span>500K+ Daily Matches</span>
            </div>
          </div>
        </div>
      </div>
      
      <Categories navigate={navigate} showLimited={false} />
    </div>
  );
};

export default CategoriesPage;