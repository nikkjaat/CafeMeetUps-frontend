import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Camera,
  CreditCard as Edit,
  Save,
  X,
  MapPin,
  Calendar,
  Heart,
  Star,
  Phone,
  User,
  Users,
  Target,
  Coffee,
  Martini,
  Plane,
  Film,
  Gamepad2,
  HeartHandshake,
  Dumbbell,
  Music,
  Utensils,
} from "lucide-react";
import { useForm } from "react-hook-form";
import styles from "../styles/UserProfile.module.css";

const UserProfile = ({ navigate }) => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // All 9 interests data with icons
  const allInterests = [
    { id: "coffee", name: "Coffee", icon: Coffee },
    { id: "clubbing", name: "Clubbing", icon: Martini },
    { id: "travel", name: "Travel", icon: Plane },
    { id: "movies", name: "Movies", icon: Film },
    { id: "gaming", name: "Gaming", icon: Gamepad2 },
    {
      id: "serious-relationship",
      name: "Serious Relationship",
      icon: HeartHandshake,
    },
    { id: "fitness", name: "Fitness", icon: Dumbbell },
    { id: "music", name: "Music", icon: Music },
    { id: "food", name: "Food", icon: Utensils },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm();

  // Watch for form changes to update character count
  const bioValue = watch("bio");

  // Initialize form and selected interests when user data is available
  useEffect(() => {
    if (user && !isInitialized) {
      console.log("Initializing form with user data:", user);

      // Reset form with user data
      reset({
        name: user.name || "",
        email: user.email || "",
        age: user.age || "",
        location: user.location || "",
        gender: user.gender || "",
        interestedIn: user.interestedIn || "",
        relationshipType: user.relationshipType || "",
        lookingFor: user.lookingFor || "",
        bio: user.bio || "",
        phoneNumber: user.phoneNumber || "",
        selectedInterests: user.selectedInterests || user.interests || [],
      });

      // Set selected interests - check both fields for backward compatibility
      const userInterests = user.selectedInterests || user.interests || [];
      console.log("Setting selected interests:", userInterests);
      setSelectedInterests(userInterests);

      setIsInitialized(true);
    }
  }, [user, reset, isInitialized]);

  // Update form when editing mode changes or user data updates
  useEffect(() => {
    if (user && isInitialized) {
      if (!isEditing) {
        // Reset to current user data when not editing
        reset({
          name: user.name || "",
          email: user.email || "",
          age: user.age || "",
          location: user.location || "",
          gender: user.gender || "",
          interestedIn: user.interestedIn || "",
          relationshipType: user.relationshipType || "",
          lookingFor: user.lookingFor || "",
          bio: user.bio || "",
          phoneNumber: user.phoneNumber || "",
          selectedInterests: user.selectedInterests || user.interests || [],
        });
        setSelectedInterests(user.selectedInterests || user.interests || []);
      }
    }
  }, [isEditing, user, reset, isInitialized]);

  const onSubmit = async (data) => {
    console.log("Submitting profile data:", {
      ...data,
      selectedInterests: selectedInterests,
    });

    const formData = new FormData();

    // Append all fields
    Object.keys(data).forEach((key) => {
      if (key !== "selectedInterests") {
        formData.append(key, data[key]);
      }
    });

    // Append selected interests
    if (selectedInterests.length > 0) {
      formData.append("selectedInterests", selectedInterests.join(","));
    }

    const result = await updateProfile(formData);
    if (result.success) {
      setIsEditing(false);
      // Force re-initialization to get fresh data
      setIsInitialized(false);
    }
  };

  const handleCancel = () => {
    // Reset to original user data
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        age: user.age || "",
        location: user.location || "",
        gender: user.gender || "",
        interestedIn: user.interestedIn || "",
        relationshipType: user.relationshipType || "",
        lookingFor: user.lookingFor || "",
        bio: user.bio || "",
        phoneNumber: user.phoneNumber || "",
        selectedInterests: user.selectedInterests || user.interests || [],
      });
      setSelectedInterests(user.selectedInterests || user.interests || []);
    }
    setIsEditing(false);
  };

  const handleEdit = () => {
    console.log(
      "Entering edit mode with current interests:",
      selectedInterests
    );
    setIsEditing(true);
  };

  const handleInterestToggle = (interestId) => {
    setSelectedInterests((prev) => {
      let newSelection;
      if (prev.includes(interestId)) {
        newSelection = prev.filter((id) => id !== interestId);
      } else {
        if (prev.length >= 4) {
          return prev; // Max 4 interests
        }
        newSelection = [...prev, interestId];
      }

      console.log("Updated interests:", newSelection);
      // Update form value
      setValue("selectedInterests", newSelection, { shouldValidate: true });
      return newSelection;
    });
  };

  // Helper function to format enum values for display
  const formatEnumValue = (value) => {
    if (!value || value === "" || value === "undefined") return "Not specified";

    if (typeof value === "string") {
      return value
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    return String(value);
  };

  // Get interest name by ID
  const getInterestName = (interestId) => {
    const interest = allInterests.find((i) => i.id === interestId);
    return interest ? interest.name : interestId;
  };

  // Get interest display object by ID
  const getInterestWithDetails = (interestId) => {
    return allInterests.find((i) => i.id === interestId);
  };

  // Get current user interests for display
  const getCurrentUserInterests = () => {
    return user?.selectedInterests || user?.interests || [];
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loginPrompt}>
          <h2>Please log in to view your profile</h2>
          <button onClick={() => navigate("home")}>Go to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              <img
                src={
                  user.avatar ||
                  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
                }
                alt={user.name}
              />
              {isEditing && (
                <button className={styles.cameraBtn}>
                  <Camera />
                </button>
              )}
            </div>
            <div className={styles.userInfo}>
              <h2>{user.name}</h2>
              <p>
                <MapPin size={16} /> {user.location || "Not specified"}
              </p>
              <p>
                <Calendar size={16} /> {user.age || "Not specified"} years old
              </p>
              {user.phoneNumber && (
                <p>
                  <Phone size={16} /> {user.phoneNumber}
                </p>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            {isEditing ? (
              <>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleCancel}
                >
                  <X />
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.saveBtn}
                  onClick={handleSubmit(onSubmit)}
                >
                  <Save />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                className={styles.editBtn}
                onClick={handleEdit}
              >
                <Edit />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Basic Information Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <User size={20} />
              Basic Information
            </h3>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  className={styles.input}
                  {...register("name", {
                    required: "Name is required",
                    maxLength: {
                      value: 50,
                      message: "Name cannot be more than 50 characters",
                    },
                  })}
                />
              ) : (
                <div className={styles.value}>{user.name}</div>
              )}
              {errors.name && isEditing && (
                <span className={styles.error}>{errors.name.message}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Age</label>
              {isEditing ? (
                <input
                  type="number"
                  className={styles.input}
                  {...register("age", {
                    required: "Age is required",
                    min: { value: 18, message: "Must be 18 or older" },
                    max: { value: 100, message: "Invalid age" },
                  })}
                />
              ) : (
                <div className={styles.value}>
                  {user.age || "Not specified"} years
                </div>
              )}
              {errors.age && isEditing && (
                <span className={styles.error}>{errors.age.message}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Gender</label>
              {isEditing ? (
                <select className={styles.select} {...register("gender")}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-Binary</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <div className={styles.value}>
                  {formatEnumValue(user.gender)}
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Location</label>
              {isEditing ? (
                <input
                  type="text"
                  className={styles.input}
                  {...register("location", {
                    required: "Location is required",
                  })}
                />
              ) : (
                <div className={styles.value}>
                  {user.location || "Not specified"}
                </div>
              )}
              {errors.location && isEditing && (
                <span className={styles.error}>{errors.location.message}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  className={styles.input}
                  placeholder="+1 234 567 8900"
                  {...register("phoneNumber", {
                    pattern: {
                      value: /^\+?[\d\s\-\(\)]+$/,
                      message: "Please enter a valid phone number",
                    },
                  })}
                />
              ) : (
                <div className={styles.value}>
                  {user.phoneNumber || "Not provided"}
                </div>
              )}
              {errors.phoneNumber && isEditing && (
                <span className={styles.error}>
                  {errors.phoneNumber.message}
                </span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  className={styles.input}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
              ) : (
                <div className={styles.value}>{user.email}</div>
              )}
              {errors.email && isEditing && (
                <span className={styles.error}>{errors.email.message}</span>
              )}
            </div>
          </div>

          {/* About Me Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <User size={20} />
              About Me
            </h3>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Bio</label>
              {isEditing ? (
                <>
                  <textarea
                    className={styles.textarea}
                    rows={4}
                    placeholder="Tell people about yourself, your interests, and what you're looking for..."
                    maxLength={500}
                    {...register("bio", {
                      maxLength: {
                        value: 500,
                        message: "Bio cannot be more than 500 characters",
                      },
                    })}
                  />
                  <div className={styles.charCount}>
                    {bioValue?.length || 0}/500 characters
                  </div>
                </>
              ) : (
                <div className={styles.value}>
                  {user.bio || "No bio added yet."}
                </div>
              )}
              {errors.bio && isEditing && (
                <span className={styles.error}>{errors.bio.message}</span>
              )}
            </div>
          </div>

          {/* Relationship Preferences Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <Target size={20} />
              Relationship Preferences
            </h3>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Interested In</label>
              {isEditing ? (
                <select className={styles.select} {...register("interestedIn")}>
                  <option value="">Select preference</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="everyone">Everyone</option>
                </select>
              ) : (
                <div className={styles.value}>
                  {formatEnumValue(user.interestedIn)}
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Relationship Type</label>
              {isEditing ? (
                <select
                  className={styles.select}
                  {...register("relationshipType")}
                >
                  <option value="">Select relationship type</option>
                  <option value="casual">Casual Dating</option>
                  <option value="serious">Serious Relationship</option>
                  <option value="long-term">Long-term Partnership</option>
                  <option value="friendship">Friendship First</option>
                  <option value="marriage">Marriage</option>
                  <option value="not-sure">Not Sure Yet</option>
                </select>
              ) : (
                <div className={styles.value}>
                  {formatEnumValue(user.relationshipType)}
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Looking For</label>
              {isEditing ? (
                <select className={styles.select} {...register("lookingFor")}>
                  <option value="">Select what you're looking for</option>
                  <option value="serious">Serious Relationship</option>
                  <option value="casual">Casual Dating</option>
                  <option value="friends">Friends</option>
                  <option value="networking">Networking</option>
                  <option value="marriage">Marriage</option>
                  <option value="friendship">Friendship</option>
                </select>
              ) : (
                <div className={styles.value}>
                  {formatEnumValue(user.lookingFor)}
                </div>
              )}
            </div>
          </div>

          {/* Interests Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <Heart size={20} />
              Interests
              {!isEditing && (
                <span className={styles.interestsCountDisplay}>
                  ({getCurrentUserInterests().length}/4)
                </span>
              )}
            </h3>

            {/* Display selected interests when not editing */}
            {!isEditing && (
              <div className={styles.interestsDisplay}>
                {getCurrentUserInterests().length > 0 ? (
                  <div className={styles.interestsGridDisplay}>
                    {getCurrentUserInterests().map((interestId) => {
                      const interest = getInterestWithDetails(interestId);
                      if (!interest) return null;
                      const IconComponent = interest.icon;
                      return (
                        <div
                          key={interestId}
                          className={styles.interestDisplay}
                        >
                          <IconComponent
                            className={styles.interestIconDisplay}
                          />
                          <span>{interest.name}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className={styles.value}>No interests selected yet.</div>
                )}
              </div>
            )}

            {/* Interest selection when editing */}
            {isEditing && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Select Your Interests (max 4)
                  <span className={styles.interestsCount}>
                    {selectedInterests.length}/4 selected
                  </span>
                </label>
                <div className={styles.interestsGrid}>
                  {allInterests.map((interest) => {
                    const IconComponent = interest.icon;
                    const isSelected = selectedInterests.includes(interest.id);
                    return (
                      <button
                        key={interest.id}
                        type="button"
                        className={`${styles.interestButton} ${
                          isSelected ? styles.interestButtonSelected : ""
                        } ${
                          selectedInterests.length >= 4 && !isSelected
                            ? styles.interestButtonDisabled
                            : ""
                        }`}
                        onClick={() => handleInterestToggle(interest.id)}
                        disabled={selectedInterests.length >= 4 && !isSelected}
                      >
                        <IconComponent className={styles.interestIcon} />
                        <span className={styles.interestText}>
                          {interest.name}
                        </span>
                        {isSelected && (
                          <div className={styles.interestCheck}>✓</div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedInterests.length === 0 && (
                  <span className={styles.error}>
                    Please select at least one interest
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Rest of your component remains the same */}
          {/* Account Information Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <Users size={20} />
              Account Information
            </h3>

            <div className={styles.accountInfo}>
              <div className={styles.infoItem}>
                <label>Account Created</label>
                <div className={styles.value}>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>

              <div className={styles.infoItem}>
                <label>Email Verification</label>
                <div className={styles.value}>
                  <span
                    className={
                      user.isEmailVerified
                        ? styles.verified
                        : styles.notVerified
                    }
                  >
                    {user.isEmailVerified ? "Verified" : "Not Verified"}
                  </span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <label>Login Method</label>
                <div className={styles.value}>
                  {user.googleId
                    ? "Google"
                    : user.facebookId
                    ? "Facebook"
                    : "Email"}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Stats Section */}
          <div className={styles.statsSection}>
            <h3 className={styles.sectionTitle}>Profile Stats</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>
                  <Heart size={20} />
                  {Math.floor(Math.random() * 50) + 10}
                </div>
                <div className={styles.statLabel}>Likes Received</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>
                  <Star size={20} />
                  {Math.floor(Math.random() * 20) + 5}
                </div>
                <div className={styles.statLabel}>Super Likes</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>
                  <Calendar size={20} />
                  {user.createdAt
                    ? Math.floor(
                        (new Date() - new Date(user.createdAt)) /
                          (1000 * 60 * 60 * 24)
                      )
                    : 1}
                </div>
                <div className={styles.statLabel}>Days Active</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
