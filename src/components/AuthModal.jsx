import { useState, useRef, useEffect } from "react";
import {
  X,
  Eye,
  EyeOff,
  Heart,
  Calendar,
  MapPin,
  Camera,
  Upload,
  Check,
  Coffee,
  Martini,
  Plane,
  Film,
  Gamepad2,
  HeartHandshake,
  Dumbbell,
  Music,
  Utensils,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import SocialAuthButtons from "./SocialAuthButtons";
import styles from "../styles/AuthModal.module.css";

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const fileInputRef = useRef(null);
  const {
    login,
    register,
    loginWithGoogle,
    loginWithFacebook,
    registerWithGoogle,
    registerWithFacebook,
    isLoading,
  } = useAuth();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    trigger,
  } = useForm();

  const watchPassword = watch("password");
  const watchGender = watch("gender");
  const watchInterestedIn = watch("interestedIn");
  const watchBio = watch("bio");

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

  // Update form value when selectedInterests changes
  useEffect(() => {
    setValue("selectedInterests", selectedInterests, { shouldValidate: true });
  }, [selectedInterests, setValue]);

  if (!isOpen) return null;

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    setPhotoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInterestToggle = async (interestId) => {
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
      return newSelection;
    });
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (JPEG, PNG, WebP)");
        return;
      }

      if (file.size > maxSize) {
        alert("Image size should be less than 5MB");
        return;
      }

      setProfilePhoto(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const onSubmit = async (data) => {
    if (mode === "login") {
      const result = await login(data.email, data.password);
      if (result.success) {
        reset();
        onClose();
      }
    } else {
      // Validate interests before submitting
      if (selectedInterests.length === 0) {
        alert("Please select at least one interest");
        return;
      }

      // Prepare form data for registration
      const formData = new FormData();

      // Append all basic fields
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("birthDate", data.birthDate);
      formData.append("gender", data.gender);
      formData.append("location", data.location);
      formData.append("interestedIn", data.interestedIn);
      formData.append("relationshipType", data.relationshipType);
      formData.append("bio", data.bio);

      // Calculate and append age
      const age = calculateAge(data.birthDate);
      formData.append("age", age.toString());

      // Append selectedInterests as comma-separated string (simpler for backend)
      if (selectedInterests.length > 0) {
        formData.append("selectedInterests", selectedInterests.join(","));
      }

      // Append phone number if provided
      if (data.phoneNumber) {
        formData.append("phoneNumber", data.phoneNumber);
      }

      // Append profile photo if exists
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      // Append terms agreement
      formData.append("agreeToTerms", agreeToTerms.toString());

      console.log("Submitting form data with interests:", selectedInterests);

      const result = await register(formData);
      if (result.success) {
        reset();
        setProfilePhoto(null);
        setPhotoPreview("");
        setAgreeToTerms(false);
        setSelectedInterests([]);
        onClose();
      }
    }
  };

  const handleSocialAuth = async (provider, isRegister = false) => {
    try {
      let result;
      if (provider === "google") {
        result = isRegister
          ? await registerWithGoogle()
          : await loginWithGoogle();
      } else if (provider === "facebook") {
        result = isRegister
          ? await registerWithFacebook()
          : await loginWithFacebook();
      }

      if (result.success) {
        reset();
        setProfilePhoto(null);
        setPhotoPreview("");
        setAgreeToTerms(false);
        setSelectedInterests([]);
        onClose();
      } else {
        alert(result.error || "Social authentication failed");
      }
    } catch (error) {
      alert(error.message || "Social authentication failed");
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    reset();
    setProfilePhoto(null);
    setPhotoPreview("");
    setAgreeToTerms(false);
    setSelectedInterests([]);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X />
        </button>

        <div className={styles.header}>
          <div className={styles.logo}>
            <Heart />
          </div>
          <h2 className={styles.title}>
            {mode === "login" ? "Welcome Back" : "Find Your Perfect Match"}
          </h2>
          <p className={styles.subtitle}>
            {mode === "login"
              ? "Sign in to continue your journey"
              : "Create your account and start your love story"}
          </p>
        </div>

        {/* Social Auth Buttons */}
        <SocialAuthButtons
          mode={mode}
          onGoogleAuth={() => handleSocialAuth("google", mode === "register")}
          onFacebookAuth={() =>
            handleSocialAuth("facebook", mode === "register")
          }
          isLoading={isLoading}
        />

        <div className={styles.divider}>
          <span>or continue with email</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {mode === "register" && (
            <>
              {/* 🔐 Basic Account Details */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  🔐 Basic Account Details
                </h3>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Enter your full name"
                    {...formRegister("fullName", {
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                  />
                  {errors.fullName && (
                    <span className={styles.error}>
                      {errors.fullName.message}
                    </span>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Date of Birth *</label>
                  <div className={styles.inputWithIcon}>
                    <Calendar className={styles.inputIcon} />
                    <input
                      type="date"
                      className={styles.input}
                      max={new Date().toISOString().split("T")[0]}
                      {...formRegister("birthDate", {
                        required: "Date of birth is required",
                        validate: {
                          minAge: (value) => {
                            const age = calculateAge(value);
                            return age >= 18 || "Must be 18 years or older";
                          },
                        },
                      })}
                    />
                  </div>
                  {errors.birthDate && (
                    <span className={styles.error}>
                      {errors.birthDate.message}
                    </span>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Gender / Identity *</label>
                  <div className={styles.radioGroup}>
                    {["Male", "Female", "Non-Binary", "Other"].map((gender) => (
                      <label key={gender} className={styles.radioLabel}>
                        <input
                          type="radio"
                          value={gender.toLowerCase()}
                          {...formRegister("gender", {
                            required: "Gender is required",
                          })}
                          className={styles.radioInput}
                        />
                        <span className={styles.radioText}>{gender}</span>
                      </label>
                    ))}
                  </div>
                  {errors.gender && (
                    <span className={styles.error}>
                      {errors.gender.message}
                    </span>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Location / City *</label>
                  <div className={styles.inputWithIcon}>
                    <MapPin className={styles.inputIcon} />
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Enter your city"
                      {...formRegister("location", {
                        required: "Location is required",
                      })}
                    />
                  </div>
                  {errors.location && (
                    <span className={styles.error}>
                      {errors.location.message}
                    </span>
                  )}
                </div>
              </div>

              {/* 💞 Profile & Match Preferences */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  💞 Profile & Match Preferences
                </h3>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Interested In *</label>
                  <div className={styles.radioGroup}>
                    {["Men", "Women", "Everyone"].map((preference) => (
                      <label key={preference} className={styles.radioLabel}>
                        <input
                          type="radio"
                          value={preference.toLowerCase()}
                          {...formRegister("interestedIn", {
                            required: "This field is required",
                          })}
                          className={styles.radioInput}
                        />
                        <span className={styles.radioText}>{preference}</span>
                      </label>
                    ))}
                  </div>
                  {errors.interestedIn && (
                    <span className={styles.error}>
                      {errors.interestedIn.message}
                    </span>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Relationship Type *</label>
                  <select
                    className={styles.select}
                    {...formRegister("relationshipType", {
                      required: "Relationship type is required",
                    })}
                  >
                    <option value="">Select what you're looking for</option>
                    <option value="casual">Casual Dating</option>
                    <option value="serious">Serious Relationship</option>
                    <option value="long-term">Long-term Partnership</option>
                    <option value="friendship">Friendship First</option>
                    <option value="marriage">Marriage</option>
                    <option value="not-sure">Not Sure Yet</option>
                  </select>
                  {errors.relationshipType && (
                    <span className={styles.error}>
                      {errors.relationshipType.message}
                    </span>
                  )}
                </div>

                {/* Interests Field */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Interests (max 4) *
                    <span className={styles.interestsCount}>
                      {selectedInterests.length}/4 selected
                    </span>
                  </label>
                  <div className={styles.interestsGrid}>
                    {allInterests.map((interest) => {
                      const IconComponent = interest.icon;
                      const isSelected = selectedInterests.includes(
                        interest.id
                      );
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
                          disabled={
                            selectedInterests.length >= 4 && !isSelected
                          }
                        >
                          <IconComponent className={styles.interestIcon} />
                          <span className={styles.interestText}>
                            {interest.name}
                          </span>
                          {isSelected && (
                            <div className={styles.interestCheck}>
                              <Check size={14} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {/* Remove the hidden input validation and handle it manually */}
                  {selectedInterests.length === 0 && (
                    <span className={styles.error}>
                      Please select at least one interest
                    </span>
                  )}
                </div>

                {/* Profile Photo - Optional */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Profile Photo</label>
                  <div className={styles.photoUploadContainer}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className={styles.fileInput}
                    />

                    {photoPreview ? (
                      <div className={styles.photoPreviewCircle}>
                        <img
                          src={photoPreview}
                          alt="Profile preview"
                          className={styles.previewImageCircle}
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className={styles.removePhotoBtnCircle}
                        >
                          <X size={14} />
                        </button>
                        <div className={styles.photoOverlay}>
                          <Camera className={styles.photoOverlayIcon} />
                          <span>Change Photo</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={styles.uploadAreaCircle}
                        onClick={triggerFileInput}
                      >
                        <div className={styles.uploadCircleContent}>
                          <User className={styles.uploadIconCircle} />
                          <span className={styles.uploadTextCircle}>
                            Add Profile Photo
                          </span>
                          <span className={styles.uploadSubtextCircle}>
                            Optional
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={styles.helperText}>
                    Add a photo to increase your matches (JPEG, PNG, WebP, max
                    5MB)
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Short Bio / About You *
                  </label>
                  <textarea
                    className={styles.textarea}
                    placeholder="Tell us about yourself, your interests, hobbies, and what you're looking for..."
                    rows={4}
                    maxLength={500}
                    {...formRegister("bio", {
                      required: "Bio is required",
                      minLength: {
                        value: 50,
                        message: "Bio must be at least 50 characters",
                      },
                      maxLength: {
                        value: 500,
                        message: "Bio must be less than 500 characters",
                      },
                    })}
                  />
                  <div className={styles.charCount}>
                    {watchBio?.length || 0}/500
                  </div>
                  {errors.bio && (
                    <span className={styles.error}>{errors.bio.message}</span>
                  )}
                </div>
              </div>

              {/* 📱 Verification & Security */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  📱 Verification & Security
                </h3>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input
                    type="tel"
                    className={styles.input}
                    placeholder="+91 98765 43210"
                    {...formRegister("phoneNumber", {
                      pattern: {
                        value: /^\+?[\d\s\-\(\)]+$/,
                        message: "Please enter a valid phone number",
                      },
                    })}
                  />
                  <div className={styles.helperText}>
                    Recommended for account security and verification
                  </div>
                  {errors.phoneNumber && (
                    <span className={styles.error}>
                      {errors.phoneNumber.message}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Account Information (Email & Password) */}
          <div className={mode === "register" ? styles.section : ""}>
            {mode === "register" && (
              <h3 className={styles.sectionTitle}>Account Security</h3>
            )}

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address *</label>
              <input
                type="email"
                className={styles.input}
                placeholder="Enter your email address"
                {...formRegister("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <span className={styles.error}>{errors.email.message}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password *</label>
              <div className={styles.passwordInput}>
                <input
                  type={showPassword ? "text" : "password"}
                  className={styles.input}
                  placeholder="Create a secure password"
                  {...formRegister("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: "Must include uppercase, lowercase, and numbers",
                    },
                  })}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <span className={styles.error}>{errors.password.message}</span>
              )}
              {mode === "register" && (
                <div className={styles.helperText}>
                  8+ characters with uppercase, lowercase, and numbers
                </div>
              )}
            </div>

            {mode === "register" && (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Confirm Password *</label>
                  <div className={styles.passwordInput}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={styles.input}
                      placeholder="Confirm your password"
                      {...formRegister("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === watchPassword || "Passwords do not match",
                      })}
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className={styles.error}>
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>

                <div className={styles.termsContainer}>
                  <label className={styles.termsLabel}>
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className={styles.termsCheckbox}
                    />
                    <span className={styles.termsText}>
                      I agree to the{" "}
                      <a href="/terms" className={styles.termsLink}>
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className={styles.termsLink}>
                        Privacy Policy
                      </a>{" "}
                      *
                    </span>
                  </label>
                  {!agreeToTerms && mode === "register" && (
                    <span className={styles.error}>
                      You must agree to the terms and conditions
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {mode === "register" ? (
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={
                isLoading || !agreeToTerms || selectedInterests.length === 0
              }
            >
              {isLoading ? (
                <div className={styles.loadingSpinner}>Creating Account...</div>
              ) : (
                "Create My Account"
              )}
            </button>
          ) : (
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          )}
        </form>

        <div className={styles.footer}>
          <p>
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button className={styles.switchBtn} onClick={switchMode}>
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
