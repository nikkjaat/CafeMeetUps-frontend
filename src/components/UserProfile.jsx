import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Camera, CreditCard as Edit, Save, X, MapPin, Calendar, Heart, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import styles from '../styles/UserProfile.module.css';

const UserProfile = ({ navigate }) => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: user
  });

  const onSubmit = (data) => {
    updateProfile(data);
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset(user);
    setIsEditing(false);
  };

  const handleInterestsChange = (data) => {
    if (data.interestsText) {
      const newInterests = data.interestsText.split(',').map(interest => interest.trim()).filter(Boolean);
      data.interests = [...(user.interests || []), ...newInterests];
      delete data.interestsText;
    }
    return data;
  };

  const onSubmitWithInterests = (data) => {
    const processedData = handleInterestsChange(data);
    updateProfile(processedData);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loginPrompt}>
          <h2>Please log in to view your profile</h2>
          <button onClick={() => navigate('home')}>Go to Home</button>
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
              <img src={user.avatar} alt={user.name} />
              <button className={styles.cameraBtn}>
                <Camera />
              </button>
            </div>
            <div className={styles.userInfo}>
              <h2>{user.name}</h2>
              <p><MapPin size={16} /> {user.location}</p>
            </div>
          </div>
          
          <div className={styles.actions}>
            {isEditing ? (
              <>
                <button 
                  className={styles.cancelBtn}
                  onClick={handleCancel}
                >
                  <X />
                  Cancel
                </button>
                <button 
                  className={styles.saveBtn}
                  onClick={handleSubmit(onSubmitWithInterests)}
                >
                  <Save />
                  Save
                </button>
              </>
            ) : (
              <button 
                className={styles.editBtn}
                onClick={() => setIsEditing(true)}
              >
                <Edit />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmitWithInterests)} className={styles.form}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Basic Information</h3>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Name</label>
              {isEditing ? (
                <input
                  type="text"
                  className={styles.input}
                  {...register('name', { required: 'Name is required' })}
                />
              ) : (
                <div className={styles.value}>{user.name}</div>
              )}
              {errors.name && <span className={styles.error}>{errors.name.message}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Age</label>
              {isEditing ? (
                <input
                  type="number"
                  className={styles.input}
                  {...register('age', { 
                    required: 'Age is required',
                    min: { value: 18, message: 'Must be 18 or older' }
                  })}
                />
              ) : (
                <div className={styles.value}>{user.age}</div>
              )}
              {errors.age && <span className={styles.error}>{errors.age.message}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Location</label>
              {isEditing ? (
                <input
                  type="text"
                  className={styles.input}
                  {...register('location', { required: 'Location is required' })}
                />
              ) : (
                <div className={styles.value}>{user.location}</div>
              )}
              {errors.location && <span className={styles.error}>{errors.location.message}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  className={styles.input}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              ) : (
                <div className={styles.value}>{user.email}</div>
              )}
              {errors.email && <span className={styles.error}>{errors.email.message}</span>}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>About Me</h3>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Bio</label>
              {isEditing ? (
                <textarea
                  className={styles.textarea}
                  rows={4}
                  placeholder="Tell people about yourself..."
                  {...register('bio')}
                />
              ) : (
                <div className={styles.value}>
                  {user.bio || 'No bio added yet.'}
                </div>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Preferences</h3>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Looking For</label>
              {isEditing ? (
                <select
                  className={styles.input}
                  {...register('lookingFor')}
                >
                  <option value="">Select what you're looking for</option>
                  <option value="serious">Serious Relationship</option>
                  <option value="casual">Casual Dating</option>
                  <option value="friends">Friends</option>
                  <option value="networking">Networking</option>
                </select>
              ) : (
                <div className={styles.value}>
                  {user.lookingFor || 'Not specified'}
                </div>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Interests</h3>
            
            <div className={styles.interests}>
              {user.interests && user.interests.length > 0 ? (
                user.interests.map((interest, index) => (
                  <span key={index} className={styles.interest}>
                    {interest}
                  </span>
                ))
              ) : (
                <div className={styles.value}>No interests added yet.</div>
              )}
            </div>
            
            {isEditing && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Add Interests (comma separated)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Coffee, Travel, Movies, Gaming..."
                  {...register('interestsText')}
                />
              </div>
            )}
          </div>

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
                  {Math.floor(Math.random() * 30) + 1}
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