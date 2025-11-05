import { useState } from 'react';
import { ArrowLeft, Heart, Star, MapPin, Calendar } from 'lucide-react';
import { successStoriesData } from '../data/successStories';
import styles from '../styles/SuccessStoriesPage.module.css';

const SuccessStoriesPage = ({ navigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = ['all', 'Coffee', 'Travel', 'Gaming', 'Movie', 'Serious Relationship'];
  
  const filteredStories = selectedCategory === 'all' 
    ? successStoriesData 
    : successStoriesData.filter(story => story.category === selectedCategory);

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
            Success <span className={styles.gradientText}>Stories</span>
          </h1>
          <p className={styles.subtitle}>
            Real couples, real love stories. Be inspired by thousands of people 
            who found their perfect match through LoveConnect.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className={styles.filterSection}>
        <h3>Filter by Category</h3>
        <div className={styles.categoryFilter}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.filterBtn} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All Stories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      <div className={styles.storiesGrid}>
        {filteredStories.map((story) => (
          <div
            key={story.id}
            className={styles.storyCard}
            onClick={() => navigate('story', story.id)}
          >
            <div className={styles.storyImage}>
              <img src={story.image} alt={story.names} />
              <div className={styles.categoryBadge}>
                {story.category}
              </div>
            </div>
            
            <div className={styles.storyContent}>
              <div className={styles.storyHeader}>
                <h3 className={styles.storyNames}>{story.names}</h3>
                <div className={styles.rating}>
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>
              </div>
              
              <div className={styles.storyMeta}>
                <div className={styles.location}>
                  <MapPin />
                  <span>{story.location}</span>
                </div>
                <div className={styles.date}>
                  <Calendar />
                  <span>{story.date}</span>
                </div>
              </div>
              
              <p className={styles.storyPreview}>
                {story.story.substring(0, 120)}...
              </p>
              
              <button className={styles.readMoreBtn}>
                Read Full Story
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>50,000+</div>
            <div className={styles.statLabel}>Success Stories</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>25,000+</div>
            <div className={styles.statLabel}>Marriages</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>98%</div>
            <div className={styles.statLabel}>Satisfaction Rate</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>4.9/5</div>
            <div className={styles.statLabel}>Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStoriesPage;