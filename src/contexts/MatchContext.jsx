import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import ApiService from "../services/api";

const MatchContext = createContext();

const initialState = {
  profiles: [],
  currentProfileIndex: 0,
  matches: [],
  isLoading: false,
  categoryFilter: null,
  compatibilityScores: {},
  swipeHistory: [],
  filters: {
    ageMin: 18,
    ageMax: 100,
    distance: 50,
    interests: [],
    relationshipType: "",
    lookingFor: "",
  },
};

function matchReducer(state, action) {
  switch (action.type) {
    case "SET_PROFILES":
      return {
        ...state,
        profiles: action.payload,
        currentProfileIndex: 0,
        isLoading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SWIPE_LEFT":
      if (state.currentProfileIndex >= state.profiles.length) {
        console.log("ℹ️ No more profiles to swipe left");
        return state;
      }

      const swipedLeftProfile = state.profiles[state.currentProfileIndex];
      return {
        ...state,
        currentProfileIndex: state.currentProfileIndex + 1,
        swipeHistory: [
          ...state.swipeHistory,
          {
            profileId: swipedLeftProfile.id,
            action: "pass",
            timestamp: new Date().toISOString(),
          },
        ],
      };
    case "SWIPE_RIGHT":
      if (state.currentProfileIndex >= state.profiles.length) {
        console.log("ℹ️ No more profiles to swipe right");
        return state;
      }

      const swipedRightProfile = state.profiles[state.currentProfileIndex];
      return {
        ...state,
        currentProfileIndex: state.currentProfileIndex + 1,
        swipeHistory: [
          ...state.swipeHistory,
          {
            profileId: swipedRightProfile.id,
            action: "like",
            timestamp: new Date().toISOString(),
            isMatch: action.payload?.isMatch || false,
          },
        ],
      };
    case "ADD_MATCH":
      // Check if match already exists to avoid duplicates
      const matchExists = state.matches.some(
        (match) =>
          match._id === action.payload._id ||
          match.id === action.payload.id ||
          match.matchId === action.payload.matchId
      );

      if (matchExists) {
        return state;
      }

      return {
        ...state,
        matches: [...state.matches, action.payload],
      };
    case "SET_MATCHES":
      return {
        ...state,
        matches: action.payload,
      };
    case "SET_FILTER":
      return {
        ...state,
        categoryFilter: action.payload,
      };
    case "UPDATE_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case "RESET_PROFILES":
      return {
        ...state,
        currentProfileIndex: 0,
      };
    case "UPDATE_COMPATIBILITY_SCORE":
      return {
        ...state,
        compatibilityScores: {
          ...state.compatibilityScores,
          [action.payload.profileId]: action.payload.score,
        },
      };
    case "ADD_MESSAGE":
      const { matchId, message } = action.payload;
      return {
        ...state,
        matches: state.matches.map((match) =>
          match._id === matchId ||
          match.id === matchId ||
          match.matchId === matchId
            ? {
                ...match,
                messages: [...(match.messages || []), message],
                lastMessage: message,
              }
            : match
        ),
      };
    case "SET_MESSAGES":
      const { matchId: targetMatchId, messages } = action.payload;
      return {
        ...state,
        matches: state.matches.map((match) =>
          match._id === targetMatchId ||
          match.id === targetMatchId ||
          match.matchId === targetMatchId
            ? {
                ...match,
                messages: messages,
                lastMessage: messages[messages.length - 1] || null,
              }
            : match
        ),
      };
    default:
      return state;
  }
}

export const MatchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(matchReducer, initialState);
  const { user } = useAuth();

  // Filter out matched users from profiles
  const filteredProfiles = useMemo(() => {
    if (!state.profiles.length || !state.matches.length) {
      return state.profiles;
    }

    // Get all matched user IDs
    const matchedUserIds = state.matches
      .map((match) => {
        // Handle different match object structures
        if (match.user && match.user._id) return match.user._id.toString();
        if (match.user && match.user.id) return match.user.id.toString();
        if (match._id) return match._id.toString();
        if (match.id) return match.id.toString();
        return null;
      })
      .filter((id) => id !== null);

    console.log("🎯 Filtering profiles - Matched user IDs:", matchedUserIds);
    console.log("📊 Before filtering:", state.profiles.length, "profiles");

    // Filter out profiles that are already matched
    const filtered = state.profiles.filter((profile) => {
      const isMatched =
        matchedUserIds.includes(profile._id?.toString()) ||
        matchedUserIds.includes(profile.id?.toString());

      if (isMatched) {
        console.log(`🚫 Filtered out matched user: ${profile.name}`);
      }

      return !isMatched;
    });

    console.log("📊 After filtering:", filtered.length, "profiles");
    return filtered;
  }, [state.profiles, state.matches]);

  const fetchProfiles = async (category = null) => {
    if (!user) {
      console.log("❌ No user found");
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const filters = {
        category: category || "all",
        ageMin: state.filters.ageMin,
        ageMax: state.filters.ageMax,
        distance: state.filters.distance,
        ...(state.filters.relationshipType && {
          relationshipType: state.filters.relationshipType,
        }),
        ...(state.filters.lookingFor && {
          lookingFor: state.filters.lookingFor,
        }),
        ...(state.filters.interests.length > 0 && {
          interests: state.filters.interests.join(","),
        }),
        limit: 50,
      };

      console.log("🔄 Fetching profiles with filters:", filters);

      const data = await ApiService.getFilteredUsers(filters);

      console.log("📦 API Response:", data);

      if (data.success) {
        console.log(`✅ Found ${data.users?.length || 0} real profiles`);

        if (data.users) {
          // Log some profile details for debugging
          data.users.slice(0, 3).forEach((profile, index) => {
            console.log(
              `   ${index + 1}. ${profile.name} (${profile.gender}), ${
                profile.age
              }, ${profile.interestedIn}`
            );
            if (profile.commonInterests) {
              console.log(
                `      Common interests: ${profile.commonInterests.join(", ")}`
              );
            }
            console.log(
              `      Compatibility: ${profile.compatibilityScore || "N/A"}%`
            );
          });

          dispatch({ type: "SET_PROFILES", payload: data.users });
        } else {
          console.warn("⚠️ No users array in response");
          dispatch({ type: "SET_PROFILES", payload: [] });
        }
      } else {
        console.error("❌ API returned error:", data.message);
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("❌ Error fetching real profiles:", error);
      console.log("🚨 API call failed, check backend connection");
      dispatch({ type: "SET_PROFILES", payload: [] });
    }
  };

  // Fetch user's matches from backend
  const fetchMatches = async () => {
    if (!user) return;

    try {
      console.log("🔄 Fetching user matches...");
      const response = await ApiService.getMatches();
      console.log(response);

      if (response.success) {
        console.log(`✅ Found ${response.matches?.length || 0} matches`);

        // Format matches for consistent structure
        const formattedMatches = (response.matches || []).map((match) => ({
          ...match,
          matchId: match._id || match.id,
          user:
            match.user || match.users?.find((u) => u._id !== user.id) || match,
          messages: match.messages || [],
          matchedAt:
            match.createdAt || match.matchedAt || new Date().toISOString(),
        }));

        dispatch({ type: "SET_MATCHES", payload: formattedMatches });
      } else {
        console.error("❌ Failed to fetch matches:", response.message);
      }
    } catch (error) {
      console.error("❌ Error fetching matches:", error);
    }
  };

  // Real swipe functionality with API integration
  const swipeLeft = async (profileId) => {
    console.log("👈 Swipe left on:", profileId);

    try {
      // Option 1: Use swipe endpoint if available
      await ApiService.swipeUser(profileId, "left");
    } catch (error) {
      console.log("🔄 Using fallback for left swipe");
      // If swipe endpoint fails, we can just record locally
    }

    // Update local state regardless of API success
    dispatch({ type: "SWIPE_LEFT" });
  };

  const swipeRight = async (profileId) => {
    console.log("👉 Swipe right on:", profileId);

    try {
      // Try using the like endpoint first
      const response = await ApiService.likeUser(profileId);

      if (response.success) {
        console.log("✅ Like recorded:", response.message);

        // Dispatch swipe action with match info
        dispatch({
          type: "SWIPE_RIGHT",
          payload: { isMatch: response.isMatch },
        });

        // If it's a match, add to matches and refetch matches
        if (response.isMatch) {
          console.log("🎉 It's a match!", response.match);

          // Format the match object
          const newMatch = {
            ...response.match,
            matchId: response.match._id || response.match.id,
            user: response.match.user || response.match,
            messages: [],
            matchedAt: response.match.createdAt || new Date().toISOString(),
          };

          dispatch({ type: "ADD_MATCH", payload: newMatch });

          // Refetch matches to ensure we have the latest data
          await fetchMatches();
        }

        return response;
      } else {
        console.error("❌ Like failed:", response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(
        "❌ Error with like endpoint, trying swipe endpoint:",
        error
      );

      try {
        // Fallback to swipe endpoint
        const response = await ApiService.swipeUser(profileId, "right");

        if (response.success) {
          console.log("✅ Swipe recorded via fallback");
          dispatch({
            type: "SWIPE_RIGHT",
            payload: { isMatch: response.isMatch },
          });

          if (response.isMatch) {
            const newMatch = {
              ...response.match,
              matchId: response.match._id || response.match.id,
              user: response.match.user || response.match,
              messages: [],
              matchedAt: response.match.createdAt || new Date().toISOString(),
            };
            dispatch({ type: "ADD_MATCH", payload: newMatch });
            await fetchMatches();
          }

          return response;
        }
      } catch (fallbackError) {
        console.error("❌ All swipe methods failed:", fallbackError);
      }

      // Advance to next profile even on error
      dispatch({ type: "SWIPE_RIGHT" });
    }
  };

  // In MatchContext.js - Fix the sendMessage function
  const sendMessage = async (matchId, messageText) => {
    try {
      console.log("💬 Sending message to match:", matchId, messageText);

      const response = await ApiService.sendMessage({
        matchId,
        message: messageText, // Changed from messageText to message
      });

      if (response.success) {
        console.log("✅ Message sent successfully:", response.message);

        // Add message to local state with correct structure
        const message = {
          id: response.message.id || Date.now(),
          text: response.message.text,
          sender: "user", // Since current user sent it
          timestamp: response.message.timestamp || new Date().toISOString(),
          isRead: true,
        };

        dispatch({
          type: "ADD_MESSAGE",
          payload: {
            matchId,
            message,
          },
        });

        return response;
      } else {
        console.error("❌ Failed to send message:", response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
      throw error;
    }
  };

  // Fix the getMessages function in MatchContext
  const getMessages = async (matchId) => {
    try {
      console.log("🔄 Fetching messages for match:", matchId);

      const response = await ApiService.getMessages(matchId);

      if (response.success) {
        console.log(`✅ Found ${response.messages?.length || 0} messages`);

        // Format messages for consistent structure
        const formattedMessages = (response.messages || []).map((msg) => ({
          id: msg.id,
          text: msg.text,
          sender: msg.sender, // This should now be "user" or "match"
          timestamp: msg.timestamp,
          isRead: msg.isRead || true,
        }));

        // Update match with messages
        dispatch({
          type: "SET_MESSAGES",
          payload: {
            matchId,
            messages: formattedMessages,
          },
        });

        return formattedMessages;
      } else {
        console.error("❌ Failed to fetch messages:", response.message);
        return [];
      }
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      return [];
    }
  };

  const setFilter = (category) => {
    console.log("🎯 Setting category filter:", category);
    dispatch({ type: "SET_FILTER", payload: category });
    fetchProfiles(category);
  };

  const updateFilters = (newFilters) => {
    console.log("⚙️ Updating filters:", newFilters);
    dispatch({ type: "UPDATE_FILTERS", payload: newFilters });
  };

  const loadProfiles = () => {
    return fetchProfiles(state.categoryFilter);
  };

  const resetProfiles = () => {
    console.log("🔄 Resetting profiles and refetching...");
    dispatch({ type: "RESET_PROFILES" });
    fetchProfiles(state.categoryFilter);
  };

  const loadMatchMessages = async (matchId) => {
    return await getMessages(matchId);
  };

  // Get current profile from FILTERED profiles (excluding matches)
  const getCurrentProfile = () => {
    const profile = filteredProfiles[state.currentProfileIndex] || null;
    console.log("📱 Current profile:", profile ? profile.name : "No profile");
    console.log("📊 Available profiles:", filteredProfiles.length);
    return profile;
  };

  // Get a specific match by ID
  const getMatchById = (matchId) => {
    return state.matches.find(
      (match) =>
        match._id === matchId ||
        match.id === matchId ||
        match.matchId === matchId
    );
  };

  // Initialize data when user logs in
  useEffect(() => {
    if (user) {
      console.log("👤 User detected, fetching profiles and matches...");
      fetchProfiles(state.categoryFilter);
      fetchMatches();
    }
  }, [user]);

  // Refresh data when filters change
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        fetchProfiles(state.categoryFilter);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [state.filters, user]);

  const value = {
    ...state,
    filteredProfiles, // Add filteredProfiles to context value
    fetchProfiles,
    fetchMatches,
    swipeLeft,
    swipeRight,
    sendMessage,
    getMessages,
    setFilter,
    updateFilters,
    loadProfiles,
    resetProfiles,
    getCurrentProfile,
    getMatchById,
    loadMatchMessages,
  };

  return (
    <MatchContext.Provider value={value}>{children}</MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error("useMatch must be used within a MatchProvider");
  }
  return context;
};
