import { useState } from 'react';
import { ArrowLeft, BookOpen, Calendar, User, Clock, Search } from 'lucide-react';
import { blogPostsData } from '../data/blogPosts';
import styles from '../styles/BlogPage.module.css';

const BlogPage = ({ navigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = ['all', 'Dating Tips', 'Date Ideas', 'Safety', 'Psychology', 'Relationships', 'Mature Dating'];
  
  const filteredPosts = blogPostsData.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <BookOpen />
          </div>
          <h1 className={styles.title}>
            Dating <span className={styles.gradientText}>Blog</span>
          </h1>
          <p className={styles.subtitle}>
            Expert advice, tips, and insights to help you navigate the world of modern dating 
            and build meaningful relationships.
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className={styles.controlsSection}>
        <div className={styles.searchBox}>
          <Search />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.categoryFilter}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.filterBtn} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All Articles' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className={styles.postsGrid}>
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className={styles.postCard}
            onClick={() => navigate('blog-post', post.id)}
          >
            <div className={styles.postImage}>
              <img src={post.image} alt={post.title} />
              <div className={styles.categoryBadge}>
                {post.category}
              </div>
            </div>
            
            <div className={styles.postContent}>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postExcerpt}>{post.excerpt}</p>
              
              <div className={styles.postMeta}>
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
              
              <button className={styles.readMoreBtn}>
                Read Article
              </button>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className={styles.noResults}>
          <BookOpen />
          <h3>No articles found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Newsletter Signup */}
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
    </div>
  );
};

export default BlogPage;