import { useState, useEffect } from "react";
import { useMatch } from "../contexts/MatchContext";
import { useAuth } from "../contexts/AuthContext";
import {
  MessageCircle,
  Heart,
  Send,
  ArrowLeft,
  Phone,
  Video,
  Menu,
} from "lucide-react";
import styles from "../styles/MatchesList.module.css";

const MatchesList = ({ navigate }) => {
  const { user } = useAuth();
  const { matches, sendMessage, loadMatchMessages } = useMatch();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  console.log("🔍 Current matches:", matches);

  // Auto-hide sidebar on mobile when match is selected
  useEffect(() => {
    if (isMobile && selectedMatch) {
      setShowSidebar(false);
    }
  }, [selectedMatch, isMobile]);

  // Handle match click
  const handleMatchClick = async (match) => {
    console.log("🖱️ Match clicked - Full object:", match);

    // Use _id as the primary identifier
    const matchId = match._id || match.matchId || match.id;
    console.log("🖱️ Match ID to use:", matchId);

    if (!matchId) {
      console.error("❌ No match ID found in match object");
      return;
    }

    setSelectedMatch(match);
    if (isMobile) {
      setShowSidebar(false);
    }

    // Load messages immediately
    await loadMessagesForMatch(matchId);
  };

  // Load messages for a specific match
  const loadMessagesForMatch = async (matchId) => {
    setLoadingMessages(true);
    try {
      console.log("🔄 Loading messages for match ID:", matchId);
      const messages = await loadMatchMessages(matchId);
      console.log("✅ Messages loaded:", messages);

      // Update selected match with loaded messages
      setSelectedMatch((prev) => {
        if (prev && (prev._id === matchId || prev.matchId === matchId)) {
          return {
            ...prev,
            messages: messages || [],
          };
        }
        return prev;
      });
    } catch (error) {
      console.error("❌ Error loading messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim() && selectedMatch) {
      try {
        const matchId = selectedMatch._id || selectedMatch.matchId;
        console.log("💬 Sending message to match ID:", matchId, messageText);

        await sendMessage(matchId, messageText.trim());
        setMessageText("");

        // Refresh messages after sending
        await loadMessagesForMatch(matchId);
      } catch (error) {
        console.error("❌ Error sending message:", error);
        alert("Failed to send message. Please try again.");
      }
    }
  };

  // Safe match data access
  const getMatchImage = (match) => {
    if (!match)
      return "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg";

    // If match has user object with avatar
    if (match.user && match.user.avatar) {
      return match.user.avatar;
    }

    // If match has users array with populated user objects
    if (match.users && match.users.length === 2 && Array.isArray(match.users)) {
      const otherUser = match.users.find(
        (u) => u._id && u._id.toString() !== user.id
      );
      if (otherUser && otherUser.avatar) {
        return otherUser.avatar;
      }
    }

    // Fallback images
    return (
      match.avatar ||
      match.images?.[0] ||
      match.profile?.images?.[0] ||
      match.profile?.avatar ||
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
    );
  };

  const getMatchName = (match) => {
    if (!match) return "Unknown User";

    // If match has user object with name
    if (match.user && match.user.name) {
      return match.user.name;
    }

    // If match has users array with populated user objects
    if (match.users && match.users.length === 2 && Array.isArray(match.users)) {
      const otherUser = match.users.find(
        (u) => u._id && u._id.toString() !== user.id
      );
      if (otherUser && otherUser.name) {
        return otherUser.name;
      }
    }

    // Fallback names
    return match.name || match.profile?.name || "Unknown User";
  };

  const getMatchMessages = (match) => {
    if (!match) return [];
    return match.messages || [];
  };

  const getMatchDate = (match) => {
    if (!match) return new Date().toISOString();
    return match.matchedAt || match.createdAt || new Date().toISOString();
  };

  const getLastMessagePreview = (match) => {
    const messages = getMatchMessages(match);
    if (messages.length === 0) {
      return "Say hello!";
    }

    const lastMessage = messages[messages.length - 1];
    const prefix = lastMessage.sender === "user" ? "You: " : "";
    return `${prefix}${lastMessage.text}`;
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Debug matches structure
  useEffect(() => {
    console.log("🔍 MATCHES STRUCTURE ANALYSIS:");
    matches.forEach((match, index) => {
      console.log(`Match ${index + 1}:`, {
        _id: match._id,
        matchId: match.matchId,
        id: match.id,
        user: match.user,
        hasMessages: !!(match.messages && match.messages.length > 0),
        messagesCount: match.messages?.length || 0,
      });
    });
  }, [matches]);

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loginPrompt}>
          <h2>Please log in to view your matches</h2>
          <button onClick={() => navigate("home")}>Go to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button className={styles.mobileToggle} onClick={toggleSidebar}>
          <Menu />
        </button>
      )}

      {/* Sidebar Overlay for Mobile */}
      {isMobile && showSidebar && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div className={`${styles.sidebar} ${!showSidebar ? styles.hidden : ""}`}>
        <h2 className={styles.title}>
          <Heart />
          Your Matches ({matches.length})
        </h2>

        <div className={styles.matchesList}>
          {matches.length === 0 ? (
            <div className={styles.noMatches}>
              <div className={styles.noMatchesIcon}>💔</div>
              <p>No matches yet!</p>
              <p>
                Keep swiping to find your perfect match. The more you swipe, the
                better your chances!
              </p>
              <button
                className={styles.swipeBtn}
                onClick={() => navigate("swipe")}
              >
                Start Swiping
              </button>
            </div>
          ) : (
            matches.map((match) => {
              const matchImage = getMatchImage(match);
              const matchName = getMatchName(match);
              const lastMessagePreview = getLastMessagePreview(match);
              const messages = getMatchMessages(match);
              const hasUnread = messages.some(
                (msg) => msg.sender === "match" && !msg.isRead
              );

              return (
                <div
                  key={match._id || match.matchId || match.id}
                  className={`${styles.matchItem} ${
                    selectedMatch?._id === match._id ? styles.active : ""
                  }`}
                  onClick={() => handleMatchClick(match)}
                >
                  <div className={styles.matchAvatar}>
                    <img
                      src={matchImage}
                      alt={matchName}
                      onError={(e) => {
                        e.target.src =
                          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg";
                      }}
                    />
                    {hasUnread && (
                      <div className={styles.unreadIndicator}></div>
                    )}
                  </div>
                  <div className={styles.matchInfo}>
                    <h3>{matchName}</h3>
                    <p className={styles.lastMessage}>{lastMessagePreview}</p>
                  </div>
                  {messages.length === 0 && (
                    <div className={styles.newMatch}>New</div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className={styles.chatArea}>
        {selectedMatch ? (
          <>
            <div className={styles.chatHeader}>
              {isMobile && (
                <button
                  className={styles.backBtn}
                  onClick={() => setShowSidebar(true)}
                >
                  <ArrowLeft />
                </button>
              )}
              <div className={styles.chatAvatar}>
                <img
                  src={getMatchImage(selectedMatch)}
                  alt={getMatchName(selectedMatch)}
                  onError={(e) => {
                    e.target.src =
                      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg";
                  }}
                />
                <div className={styles.onlineIndicator}></div>
              </div>
              <div className={styles.chatInfo}>
                <h3>{getMatchName(selectedMatch)}</h3>
                <p>
                  Active now • Matched{" "}
                  {new Date(getMatchDate(selectedMatch)).toLocaleDateString()}
                </p>
              </div>
              <div className={styles.chatActions}>
                <button className={styles.callBtn}>
                  <Phone />
                </button>
                <button className={styles.videoBtn}>
                  <Video />
                </button>
              </div>
            </div>

            <div className={styles.messages}>
              {loadingMessages ? (
                <div className={styles.loadingMessages}>
                  <p>Loading messages...</p>
                </div>
              ) : getMatchMessages(selectedMatch).length === 0 ? (
                <div className={styles.noMessages}>
                  <Heart />
                  <h3>You matched with {getMatchName(selectedMatch)}!</h3>
                  <p>
                    Start the conversation with a friendly message. Here are
                    some ideas:
                  </p>
                  <div className={styles.messageStarters}>
                    <button
                      type="button"
                      className={styles.starterBtn}
                      onClick={() =>
                        setMessageText("Hey! How's your day going? 😊")
                      }
                    >
                      "Hey! How's your day going? 😊"
                    </button>
                    <button
                      type="button"
                      className={styles.starterBtn}
                      onClick={() =>
                        setMessageText(
                          "I love your profile! What's your favorite hobby?"
                        )
                      }
                    >
                      "I love your profile! What's your favorite hobby?"
                    </button>
                    <button
                      type="button"
                      className={styles.starterBtn}
                      onClick={() =>
                        setMessageText(
                          "Nice to match with you! Tell me something interesting about yourself."
                        )
                      }
                    >
                      "Tell me something interesting about yourself."
                    </button>
                  </div>
                </div>
              ) : (
                getMatchMessages(selectedMatch).map((message, index) => (
                  <div
                    key={message.id || `msg-${index}`}
                    className={`${styles.message} ${
                      message.sender === "user" ? styles.sent : styles.received
                    }`}
                  >
                    <div className={styles.messageContent}>{message.text}</div>
                    <div className={styles.messageTime}>
                      {new Date(
                        message.timestamp || new Date()
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            <form className={styles.messageForm} onSubmit={handleSendMessage}>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Message ${getMatchName(selectedMatch)}...`}
                className={styles.messageInput}
              />
              <button
                type="submit"
                className={styles.sendBtn}
                disabled={!messageText.trim()}
              >
                <Send />
              </button>
            </form>
          </>
        ) : (
          <div className={styles.selectMatch}>
            <MessageCircle />
            <h3>Welcome to your matches!</h3>
            <p>
              {matches.length === 0
                ? "Start swiping to find your perfect match and build meaningful connections."
                : "Select a match from the sidebar to start chatting."}
            </p>
            {matches.length === 0 && (
              <button
                className={styles.startSwipingBtn}
                onClick={() => navigate("swipe")}
              >
                Start Swiping to Get Matches
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesList;
