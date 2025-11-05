import { Coffee, Music, Plane, Film, Gamepad2, Heart, Grid3x2 as Grid3X3 } from 'lucide-react';
import styles from '../styles/CategoryFilter.module.css';

const CategoryFilter = ({ selectedCategory, onCategorySelect }) => {
  const categories = [
    {
      id: 'all',
      name: 'All',
      icon: Grid3X3,
      color: 'from-gray-400 to-gray-600',
      description: 'Show everyone'
    },
    {
      id: 'coffee',
      name: 'Coffee',
      icon: Coffee,
      color: 'from-amber-400 to-orange-500',
      description: 'Coffee lovers'
    },
    {
      id: 'clubbing', 
      name: 'Clubbing',
      icon: Music,
      color: 'from-purple-400 to-pink-500',
      description: 'Party enthusiasts'
    },
    {
      id: 'travel',
      name: 'Travel',
      icon: Plane,
      color: 'from-blue-400 to-cyan-500',
      description: 'Adventure seekers'
    },
    {
      id: 'movie',
      name: 'Movie',
      icon: Film,
      color: 'from-red-400 to-pink-500',
      description: 'Film buffs'
    },
    {
      id: 'gaming',
      name: 'Gaming',
      icon: Gamepad2,
      color: 'from-green-400 to-blue-500',
      description: 'Gamers'
    },
    {
      id: 'serious',
      name: 'Serious',
      icon: Heart,
      color: 'from-pink-500 to-red-500',
      description: 'Long-term relationships'
    },
    {
      id: 'fitness',
      name: 'Fitness',
      icon: Heart,
      color: 'from-green-400 to-emerald-500',
      description: 'Health enthusiasts'
    },
    {
      id: 'music',
      name: 'Music',
      icon: Music,
      color: 'from-purple-500 to-indigo-500',
      description: 'Music lovers'
    },
    {
      id: 'food',
      name: 'Food',
      icon: Coffee,
      color: 'from-orange-400 to-red-500',
      description: 'Food enthusiasts'
    }
  ];

  return (
    <div className={styles.categoryFilter}>
      <div className={styles.filterHeader}>
        <h3 className={styles.filterTitle}>Browse by Interest</h3>
        <p className={styles.filterSubtitle}>Find people who share your passions</p>
      </div>
      
      <div className={styles.categoriesGrid}>
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategory === category.id || (selectedCategory === null && category.id === 'all');
          
          return (
            <button
              key={category.id}
              className={`${styles.categoryCard} ${isSelected ? styles.selected : ''}`}
              onClick={() => onCategorySelect(category.id === 'all' ? null : category.id)}
            >
              <div className={`${styles.categoryIcon} ${styles[category.id]}`}>
                <IconComponent />
              </div>
              <div className={styles.categoryInfo}>
                <h4 className={styles.categoryName}>{category.name}</h4>
                <p className={styles.categoryDescription}>{category.description}</p>
              </div>
              {isSelected && (
                <div className={styles.selectedIndicator}>
                  <div className={styles.checkmark}>✓</div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;