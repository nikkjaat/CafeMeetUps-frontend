import { Calendar, User, ArrowRight } from 'lucide-react';
import { blogPostsData } from '../data/blogPosts';
import styles from '../styles/Blog.module.css';

const Blog = ({ navigate, showLimited = false }) => {
  const blogPosts = showLimited ? blogPostsData.slice(0, 3) : blogPostsData;

  const categories = ['All', 'Dating Tips', 'Date Ideas', 'Safety', 'Psychology', 'Relationships', 'Mature Dating'];

  const handleViewAll = () => {
    navigate('blog');
  };

  const handlePostClick = (postId) => {
    navigate('blog-post', postId);
  };

  return (
    <section id="blog" className={styles.blog}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            Dating 
            <span className={styles.gradientText}>
              {' '}Blog
            </span>
          </h2>
          <p className={styles.description}>
            Expert advice, tips, and insights to help you navigate the world of modern dating 
            and build meaningful relationships.
          </p>
        </div>

        {!showLimited && (
          <div className={styles.categoryFilter}>
            {categories.map((category) => (
              <button
                key={category}
                className={styles.categoryBtn}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Blog Grid */}
        <div className={styles.blogGrid}>
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className={styles.blogCard}
              onClick={() => handlePostClick(post.id)}
            >
              {/* Image */}
              <div className={styles.blogImage}>
                <img
                  src={post.image}
                  alt={post.title}
                />
              </div>
              
              {/* Content */}
              <div className={styles.blogContent}>
                {/* Category & Read Time */}
                <div className={styles.blogMeta}>
                  <span className={styles.blogCategory}>
                    {post.category}
                  </span>
                  <span className={styles.readTime}>{post.readTime}</span>
                </div>
                
                {/* Title */}
                <h3 className={styles.blogTitle}>
                  {post.title}
                </h3>
                
                {/* Excerpt */}
                <p className={styles.blogExcerpt}>
                  {post.excerpt}
                </p>
                
                {/* Author & Date */}
                <div className={styles.blogAuthor}>
                  <div className={styles.authorInfo}>
                    <User />
                    <span>{post.author}</span>
                  </div>
                  <div className={styles.dateInfo}>
                    <Calendar />
                    <span>{post.date}</span>
                  </div>
                </div>
                
                {/* Read More */}
                <button className={styles.readMoreBtn}>
                  <span>Read More</span>
                  <ArrowRight />
                </button>
              </div>
            </article>
          ))}
        </div>

        {showLimited && (
          <div className={styles.ctaSection}>
            <button className={styles.viewAllBtn} onClick={handleViewAll}>
              View All Articles
            </button>
          </div>
        )}

        {!showLimited && (
          <div className={styles.newsletter}>
            <h3 className={styles.newsletterTitle}>Stay Updated with Dating Tips</h3>
            <p className={styles.newsletterDescription}>
              Get the latest dating advice, success stories, and exclusive tips delivered to your inbox.
            </p>
            <div className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.newsletterInput}
              />
              <button className={styles.subscribeBtn}>
                Subscribe
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;