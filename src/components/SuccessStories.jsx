import { Star, Quote } from 'lucide-react';
import { successStoriesData } from '../data/successStories';
import styles from '../styles/SuccessStories.module.css';

const SuccessStories = ({ navigate, showLimited = false }) => {
  const stories = showLimited ? successStoriesData.slice(0, 3) : successStoriesData;

  const handleViewAll = () => {
    navigate('success-stories');
  };

  const handleStoryClick = (storyId) => {
    navigate('story', storyId);
  };

  return (
    <section id="success-stories" className={styles.successStories}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            Success 
            <span className={styles.gradientText}>
              {' '}Stories
            </span>
          </h2>
          <p className={styles.description}>
            Real couples, real love stories. See how LoveConnect has helped thousands 
            of people find their perfect match.
          </p>
        </div>

        {/* Stories Grid */}
        <div className={styles.storiesGrid}>
          {stories.map((story) => (
            <div
              key={story.id}
              className={styles.storyCard}
              onClick={() => handleStoryClick(story.id)}
            >
              {/* Image */}
              <div className={styles.storyImage}>
                <img
                  src={story.image}
                  alt={story.names}
                />
              </div>
              
              {/* Content */}
              <div className={styles.storyContent}>
                {/* Quote Icon */}
                <Quote className={styles.quoteIcon} />
                
                {/* Story */}
                <p className={styles.storyText}>
                  "{story.story}"
                </p>
                
                {/* Names & Location */}
                <div>
                  <h3 className={styles.storyNames}>
                    {story.names}
                  </h3>
                  <p className={styles.storyLocation}>{story.location}</p>
                </div>
                
                {/* Rating & Category */}
                <div className={styles.storyFooter}>
                  <div className={styles.rating}>
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} />
                    ))}
                  </div>
                  <span className={styles.category}>
                    {story.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showLimited && (
          <div className={styles.ctaSection}>
            <button className={styles.viewAllBtn} onClick={handleViewAll}>
              View All Success Stories
            </button>
          </div>
        )}

        {!showLimited && (
          <>
            {/* Stats */}
            <div className={styles.statsSection}>
              <div className={styles.statsGrid}>
                <div>
                  <div className={styles.statNumber}>50,000+</div>
                  <div className={styles.statLabel}>Success Stories</div>
                </div>
                <div>
                  <div className={styles.statNumber}>25,000+</div>
                  <div className={styles.statLabel}>Marriages</div>
                </div>
                <div>
                  <div className={styles.statNumber}>98%</div>
                  <div className={styles.statLabel}>Satisfaction Rate</div>
                </div>
                <div>
                  <div className={styles.statNumber}>4.9/5</div>
                  <div className={styles.statLabel}>Average Rating</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className={styles.ctaSection}>
              <button className={styles.shareBtn}>
                Share Your Story
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SuccessStories;