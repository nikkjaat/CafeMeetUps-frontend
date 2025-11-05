import { ArrowLeft, Heart, Star, MapPin, Calendar, Share2 } from 'lucide-react';
import { successStoriesData } from '../data/successStories';
import styles from '../styles/StoryDetailPage.module.css';

const StoryDetailPage = ({ storyId, navigate }) => {
  const story = successStoriesData.find(s => s.id === parseInt(storyId));
  
  if (!story) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Story not found</h2>
          <button onClick={() => navigate('success-stories')}>
            Back to Success Stories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backBtn}
          onClick={() => navigate('success-stories')}
        >
          <ArrowLeft />
          <span>Back to Stories</span>
        </button>
        
        <button className={styles.shareBtn}>
          <Share2 />
          <span>Share Story</span>
        </button>
      </div>

      <article className={styles.storyArticle}>
        <div className={styles.storyHeader}>
          <div className={styles.storyImage}>
            <img src={story.image} alt={story.names} />
          </div>
          
          <div className={styles.storyInfo}>
            <div className={styles.categoryBadge}>
              {story.category}
            </div>
            
            <h1 className={styles.storyTitle}>
              The Love Story of <span className={styles.gradientText}>{story.names}</span>
            </h1>
            
            <div className={styles.storyMeta}>
              <div className={styles.location}>
                <MapPin />
                <span>{story.location}</span>
              </div>
              <div className={styles.date}>
                <Calendar />
                <span>{story.date}</span>
              </div>
              <div className={styles.rating}>
                {[...Array(story.rating)].map((_, i) => (
                  <Star key={i} />
                ))}
                <span>({story.rating}/5)</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.storyContent}>
          <div className={styles.quote}>
            <Heart />
            <blockquote>"{story.story}"</blockquote>
          </div>
          
          <div className={styles.fullStory}>
            <h3>Their Journey</h3>
            <p>
              {story.names.split(' & ')[0]} and {story.names.split(' & ')[1]} first connected on LoveConnect 
              in early 2023. What started as a simple swipe right turned into something beautiful and lasting.
            </p>
            
            <p>
              Their shared love for {story.category.toLowerCase()} brought them together, but it was their 
              genuine connection and compatibility that made them fall in love. After months of getting to 
              know each other through messages, video calls, and wonderful dates, they knew they had found 
              something special.
            </p>
            
            <h3>The First Date</h3>
            <p>
              Their first meeting was at a cozy {story.category === 'Coffee' ? 'coffee shop' : 
              story.category === 'Travel' ? 'local travel expo' : 
              story.category === 'Gaming' ? 'gaming cafe' : 'local venue'} in {story.location}. 
              Both were nervous but excited, and the conversation flowed naturally from the moment they met.
            </p>
            
            <h3>Building Their Relationship</h3>
            <p>
              What makes their relationship special is how they support each other's dreams and ambitions. 
              They've learned that love isn't just about finding someone you can live with, but finding 
              someone you can't imagine living without.
            </p>
            
            <h3>Advice for Others</h3>
            <p>
              "{story.names.split(' & ')[0]} and {story.names.split(' & ')[1]} want other singles to know 
              that finding love is possible when you're authentic and open to new connections. Don't give up 
              on love – your person is out there waiting for you too!"
            </p>
          </div>
        </div>
      </article>

      {/* Related Stories */}
      <div className={styles.relatedStories}>
        <h3>More Success Stories</h3>
        <div className={styles.relatedGrid}>
          {successStoriesData
            .filter(s => s.id !== story.id && s.category === story.category)
            .slice(0, 3)
            .map((relatedStory) => (
              <div
                key={relatedStory.id}
                className={styles.relatedCard}
                onClick={() => navigate('story', relatedStory.id)}
              >
                <img src={relatedStory.image} alt={relatedStory.names} />
                <div className={styles.relatedContent}>
                  <h4>{relatedStory.names}</h4>
                  <p>{relatedStory.location}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StoryDetailPage;