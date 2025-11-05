import { createContext, useContext, useState, useEffect } from 'react';
import { profilesData } from '../data/profiles';

const MatchContext = createContext();

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};

export const MatchProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(null);


  useEffect(() => {
    setProfiles(profilesData);
  }, []);

  const setFilter = (category) => {
    setCategoryFilter(category);
    setCurrentProfileIndex(0);
  };

  const getFilteredProfiles = () => {
    if (!categoryFilter) return profiles;
    const normalizedCategory = categoryFilter.replace(/-/g, '');
    return profiles.filter(profile => 
      profile.category.toLowerCase().replace(/\s+/g, '') === normalizedCategory
    );
  };

  const swipeLeft = (profileId) => {
    setCurrentProfileIndex(prev => prev + 1);
  };

  const swipeRight = (profileId) => {
    const filteredProfiles = getFilteredProfiles();
    const profile = filteredProfiles.find(p => p.id === profileId);
    if (profile) {
      // Simulate match (70% chance for better user experience)
      if (Math.random() > 0.3) {
        setMatches(prev => [...prev, {
          id: Date.now(),
          profile,
          matchedAt: new Date(),
          messages: []
        }]);
      }
    }
    setCurrentProfileIndex(prev => prev + 1);
  };

  const getCurrentProfile = () => {
    const filteredProfiles = getFilteredProfiles();
    return filteredProfiles[currentProfileIndex] || null;
  };

  const resetProfiles = () => {
    setCurrentProfileIndex(0);
  };

  const sendMessage = (matchId, message) => {
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? {
            ...match,
            messages: [...match.messages, {
              id: Date.now(),
              text: message,
              sender: 'user',
              timestamp: new Date()
            }]
          }
        : match
    ));

    // Simulate response after 2 seconds
    setTimeout(() => {
      const responses = [
        "Hey! Thanks for the message 😊 How are you doing?",
        "Nice to meet you! I'm excited to chat with you.",
        "How's your day going? I hope it's been great!",
        "I'd love to chat more! Tell me about yourself.",
        "What are you up to today? Any fun plans?",
        "Thanks for reaching out! I love your profile 💕",
        "Hi there! What's your favorite thing to do on weekends?",
        "Hey! I noticed we have similar interests. That's awesome!",
        "Hello! What made you swipe right on me? 😉",
        "Hi! I'm looking forward to getting to know you better."
      ];
      
      setMatches(prev => prev.map(match => 
        match.id === matchId 
          ? {
              ...match,
              messages: [...match.messages, {
                id: Date.now() + 1,
                text: responses[Math.floor(Math.random() * responses.length)],
                sender: 'match',
                timestamp: new Date()
              }]
            }
          : match
      ));
    }, 1500 + Math.random() * 2000); // Random delay between 1.5-3.5 seconds
  };

  const value = {
    profiles,
    matches,
    currentProfileIndex,
    isLoading,
    swipeLeft,
    swipeRight,
    getCurrentProfile,
    resetProfiles,
    sendMessage,
    setFilter,
    categoryFilter
  };

  return (
    <MatchContext.Provider value={value}>
      {children}
    </MatchContext.Provider>
  );
};