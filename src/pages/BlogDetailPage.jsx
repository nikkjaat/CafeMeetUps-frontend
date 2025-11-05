import { ArrowLeft, User, Calendar, Clock, Share2, BookOpen } from 'lucide-react';
import { blogPostsData } from '../data/blogPosts';
import styles from '../styles/BlogDetailPage.module.css';

const BlogDetailPage = ({ postId, navigate }) => {
  const post = blogPostsData.find(p => p.id === parseInt(postId));
  
  if (!post) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Article not found</h2>
          <button onClick={() => navigate('blog')}>
            Back to Blog
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
          onClick={() => navigate('blog')}
        >
          <ArrowLeft />
          <span>Back to Blog</span>
        </button>
        
        <button className={styles.shareBtn}>
          <Share2 />
          <span>Share Article</span>
        </button>
      </div>

      <article className={styles.blogArticle}>
        <div className={styles.articleHeader}>
          <div className={styles.categoryBadge}>
            {post.category}
          </div>
          
          <h1 className={styles.articleTitle}>{post.title}</h1>
          
          <div className={styles.articleMeta}>
            <div className={styles.author}>
              <User />
              <span>{post.author}</span>
            </div>
            <div className={styles.date}>
              <Calendar />
              <span>{post.date}</span>
            </div>
            <div className={styles.readTime}>
              <Clock />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        <div className={styles.articleImage}>
          <img src={post.image} alt={post.title} />
        </div>

        <div className={styles.articleContent}>
          <div className={styles.excerpt}>
            <p>{post.excerpt}</p>
          </div>
          
          <div className={styles.fullContent}>
            {post.category === 'Dating Tips' && (
              <>
                <h3>Getting Started</h3>
                <p>
                  Creating the perfect dating profile is an art that combines authenticity with strategic presentation. 
                  Your profile is your first impression, and in the world of online dating, first impressions matter more than ever.
                </p>
                
                <h3>Essential Profile Elements</h3>
                <ul>
                  <li><strong>Authentic Photos:</strong> Use recent, clear photos that show your personality</li>
                  <li><strong>Compelling Bio:</strong> Write a bio that tells your story and shows your interests</li>
                  <li><strong>Honest Information:</strong> Be truthful about your age, location, and intentions</li>
                  <li><strong>Show Your Interests:</strong> Include photos and text that highlight your hobbies</li>
                </ul>
                
                <h3>Common Mistakes to Avoid</h3>
                <p>
                  Many people make the mistake of trying to appeal to everyone. Instead, focus on attracting 
                  the right person for you. Avoid using outdated photos, being too generic in your bio, or 
                  focusing only on what you don't want in a partner.
                </p>
              </>
            )}
            
            {post.category === 'Date Ideas' && (
              <>
                <h3>Creative First Date Ideas</h3>
                <p>
                  Moving beyond the traditional coffee date can help create more memorable experiences and 
                  better connections. Here are some unique ideas that encourage natural conversation and fun.
                </p>
                
                <h3>Activity-Based Dates</h3>
                <ul>
                  <li><strong>Mini Golf:</strong> Fun, interactive, and great for conversation</li>
                  <li><strong>Cooking Class:</strong> Learn something new together</li>
                  <li><strong>Art Gallery:</strong> Plenty to talk about and discover each other's tastes</li>
                  <li><strong>Farmers Market:</strong> Casual, lots to see and discuss</li>
                </ul>
                
                <h3>Why These Work</h3>
                <p>
                  Activity-based dates take the pressure off constant conversation while still allowing you 
                  to get to know each other. They also give you shared experiences to reference in future conversations.
                </p>
              </>
            )}
            
            {post.category === 'Safety' && (
              <>
                <h3>Online Dating Safety Basics</h3>
                <p>
                  Your safety should always be the top priority when meeting people online. Here are essential 
                  guidelines to help you navigate online dating safely and confidently.
                </p>
                
                <h3>Before Meeting</h3>
                <ul>
                  <li><strong>Video Chat First:</strong> Verify they are who they claim to be</li>
                  <li><strong>Google Their Name:</strong> Do a basic background check</li>
                  <li><strong>Trust Your Instincts:</strong> If something feels off, it probably is</li>
                  <li><strong>Tell Someone:</strong> Let a friend know your plans</li>
                </ul>
                
                <h3>First Date Safety</h3>
                <p>
                  Always meet in public places, drive yourself or use your own transportation, and let someone 
                  know where you're going. Keep your phone charged and trust your instincts throughout the date.
                </p>
              </>
            )}
            
            <h3>Final Thoughts</h3>
            <p>
              Remember that dating should be enjoyable and exciting. While it's important to be strategic 
              and safe, don't forget to have fun and be yourself. The right person will appreciate you for who you are.
            </p>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <div className={styles.relatedArticles}>
        <h3>Related Articles</h3>
        <div className={styles.relatedGrid}>
          {blogPostsData
            .filter(p => p.id !== post.id && p.category === post.category)
            .slice(0, 3)
            .map((relatedPost) => (
              <div
                key={relatedPost.id}
                className={styles.relatedCard}
                onClick={() => navigate('blog-post', relatedPost.id)}
              >
                <img src={relatedPost.image} alt={relatedPost.title} />
                <div className={styles.relatedContent}>
                  <h4>{relatedPost.title}</h4>
                  <p>{relatedPost.excerpt.substring(0, 100)}...</p>
                  <div className={styles.relatedMeta}>
                    <span>{relatedPost.author}</span>
                    <span>{relatedPost.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;