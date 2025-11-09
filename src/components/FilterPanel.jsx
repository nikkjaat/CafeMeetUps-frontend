import { useState, useEffect } from "react";
import {
  X,
  FileSliders as Sliders,
  MapPin,
  Heart,
  Users,
  Calendar,
} from "lucide-react";
import { useMatch } from "../contexts/MatchContext";
import styles from "../styles/FilterPanel.module.css";

const FilterPanel = ({ isOpen, onClose }) => {
  const { filters, updateFilters, loadProfiles } = useMatch();
  const [localFilters, setLocalFilters] = useState(filters);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleInterestToggle = (interest) => {
    setLocalFilters((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleApplyFilters = async () => {
    setIsApplying(true);
    updateFilters(localFilters);
    await loadProfiles();
    setIsApplying(false);
    onClose();
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      ageMin: 18,
      ageMax: 100,
      distance: 50,
      interests: [],
      relationshipType: "",
    };
    setLocalFilters(defaultFilters);
  };

  const interests = [
    { id: "coffee", name: "Coffee", emoji: "☕" },
    { id: "clubbing", name: "Clubbing", emoji: "🎉" },
    { id: "travel", name: "Travel", emoji: "✈️" },
    { id: "movies", name: "Movies", emoji: "🎬" },
    { id: "gaming", name: "Gaming", emoji: "🎮" },
    { id: "serious-relationship", name: "Serious", emoji: "💕" },
    { id: "fitness", name: "Fitness", emoji: "💪" },
    { id: "music", name: "Music", emoji: "🎵" },
    { id: "food", name: "Food", emoji: "🍕" },
  ];

  const relationshipTypes = [
    { value: "", label: "Any" },
    { value: "casual", label: "Casual Dating" },
    { value: "serious", label: "Serious Relationship" },
    { value: "long-term", label: "Long-term Partnership" },
    { value: "friendship", label: "Friendship First" },
    { value: "marriage", label: "Marriage" },
  ];

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <Sliders />
            </div>
            <div>
              <h2 className={styles.title}>Filter Your Matches</h2>
              <p className={styles.subtitle}>
                Find exactly who you're looking for
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X />
          </button>
        </div>
        <div className={styles.content}>
          {/* Age Range */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Calendar />
              <h3>Age Range</h3>
            </div>
            <div className={styles.ageRange}>
              <div className={styles.ageInput}>
                <label>Min Age</label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={localFilters.ageMin}
                  onChange={(e) =>
                    handleFilterChange("ageMin", parseInt(e.target.value))
                  }
                />
              </div>
              <div className={styles.ageSeparator}>to</div>
              <div className={styles.ageInput}>
                <label>Max Age</label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={localFilters.ageMax}
                  onChange={(e) =>
                    handleFilterChange("ageMax", parseInt(e.target.value))
                  }
                />
              </div>
            </div>
            <div className={styles.rangeDisplay}>
              Ages {localFilters.ageMin} - {localFilters.ageMax}
            </div>
          </div>

          {/* Distance */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <MapPin />
              <h3>Distance</h3>
            </div>
            <div className={styles.distanceSlider}>
              <input
                type="range"
                min="1"
                max="100"
                value={localFilters.distance}
                onChange={(e) =>
                  handleFilterChange("distance", parseInt(e.target.value))
                }
                className={styles.slider}
              />
              <div className={styles.distanceDisplay}>
                Within {localFilters.distance} miles
              </div>
            </div>
          </div>

          {/* Relationship Type */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Heart />
              <h3>Looking For</h3>
            </div>
            <div className={styles.relationshipTypes}>
              {relationshipTypes.map((type) => (
                <button
                  key={type.value}
                  className={`${styles.relationshipBtn} ${
                    localFilters.relationshipType === type.value
                      ? styles.active
                      : ""
                  }`}
                  onClick={() =>
                    handleFilterChange("relationshipType", type.value)
                  }
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Users />
              <h3>Shared Interests</h3>
            </div>
            <div className={styles.interestsGrid}>
              {interests.map((interest) => (
                <button
                  key={interest.id}
                  className={`${styles.interestBtn} ${
                    localFilters.interests.includes(interest.id)
                      ? styles.active
                      : ""
                  }`}
                  onClick={() => handleInterestToggle(interest.id)}
                >
                  <span className={styles.interestEmoji}>{interest.emoji}</span>
                  <span className={styles.interestName}>{interest.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.resetBtn} onClick={handleResetFilters}>
            Reset All
          </button>
          <button
            className={styles.applyBtn}
            onClick={handleApplyFilters}
            disabled={isApplying}
          >
            {isApplying ? "Applying..." : "Apply Filters"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
