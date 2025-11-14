import { useState, useEffect, useRef } from "react";
import { useMatch } from "../contexts/MatchContext";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import {
  MessageCircle,
  Heart,
  Send,
  ArrowLeft,
  Phone,
  Video,
  Menu,
  Trash2,
  Check,
  CheckCheck,
} from "lucide-react";
import styles from "../styles/MatchesList.module.css";

const MatchesList = ({ navigate }) => {
  const { user } = useAuth();
  const { matches, loadMatchMessages } = useMatch();
  const { socket, onlineUsers } = useSocket();

  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [deletingMsgId, setDeletingMsgId] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile && selectedMatch) setShowSidebar(false);
  }, [selectedMatch, isMobile]);

  // Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (selectedMatch?.messages) scrollToBottom();
  }, [selectedMatch?.messages]);

  // === SOCKET LISTENERS ===
  useEffect(() => {
    if (!socket || !selectedMatch) return;

    const matchId = selectedMatch._id;

    const handleNewMessage = (msg) => {
      // Normalize structure for consistent rendering
      const normalizedMsg = {
        id: msg.id || msg._id,
        text: msg.text || "",
        senderId: msg.senderId?._id || msg.senderId,
        sender: msg.sender || (msg.senderId === user.id ? "user" : "match"),
        timestamp: msg.timestamp || Date.now(),
        isRead: msg.isRead ?? false,
      };

      setSelectedMatch((prev) => ({
        ...prev,
        messages: [...(prev.messages || []), normalizedMsg],
      }));
    };

    const handleTyping = (userId) => {
      setTypingUsers((prev) => new Set(prev).add(userId.toString()));
    };

    const handleStopTyping = (userId) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId.toString());
        return next;
      });
    };

    const handleMessageSeen = ({ messageId }) => {
      setSelectedMatch((prev) => ({
        ...prev,
        messages: prev.messages.map((m) =>
          m.id === messageId ? { ...m, isRead: true } : m
        ),
      }));
    };

    const handleMessageDeleted = ({ messageId }) => {
      setSelectedMatch((prev) => ({
        ...prev,
        messages: prev.messages.filter((m) => m.id !== messageId),
      }));
    };

    socket.on("new-message", handleNewMessage);
    socket.on("user-typing", handleTyping);
    socket.on("user-stop-typing", handleStopTyping);
    socket.on("message-seen", handleMessageSeen);
    socket.on("message-deleted", handleMessageDeleted);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("user-typing", handleTyping);
      socket.off("user-stop-typing", handleStopTyping);
      socket.off("message-seen", handleMessageSeen);
      socket.off("message-deleted", handleMessageDeleted);
    };
  }, [socket, selectedMatch]);

  // === SEND MESSAGE ===
  const sendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedMatch || !socket) return;

    socket.emit("send-message", {
      matchId: selectedMatch._id,
      text: messageText.trim(),
    });
    setMessageText("");
    stopTyping();
  };

  // === TYPING ===
  const startTyping = () => {
    if (!socket || !selectedMatch) return;
    socket.emit("typing", { matchId: selectedMatch._id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(stopTyping, 1000);
  };

  const stopTyping = () => {
    if (!socket || !selectedMatch) return;
    socket.emit("stop-typing", { matchId: selectedMatch._id });
  };

  // === MATCH CLICK ===
  const handleMatchClick = async (match) => {
    const matchId = match._id;
    setSelectedMatch({ ...match, messages: [] });
    if (isMobile) setShowSidebar(false);

    socket.emit("join-match", matchId);

    setLoadingMessages(true);
    try {
      const msgs = await loadMatchMessages(matchId);
      setSelectedMatch((prev) => ({ ...prev, messages: msgs || [] }));
    } catch (err) {
      console.error("Load failed:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  // === DELETE MESSAGE ===
  const deleteMessage = (messageId) => {
    if (!socket || !selectedMatch) return;
    setDeletingMsgId(messageId);
    socket.emit("delete-message", { matchId: selectedMatch._id, messageId });
  };

  // === HELPERS ===
  const getOtherUserId = (match) => {
    return match.users?.find((id) => id !== user.id) || match.user?._id;
  };

  const isOnline = (match) => {
    const otherId = getOtherUserId(match);
    return onlineUsers.has(otherId?.toString());
  };

  const isTyping = (match) => {
    const otherId = getOtherUserId(match);
    return typingUsers.has(otherId?.toString());
  };

  const getMatchImage = (match) => {
    if (!match)
      return "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg";
    if (match.user?.avatar) return match.user.avatar;
    if (match.users?.length === 2) {
      const other = match.users.find(
        (u) => u._id && u._id.toString() !== user.id
      );
      if (other?.avatar) return other.avatar;
    }
    return (
      match.avatar ||
      match.images?.[0] ||
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
    );
  };

  const getMatchName = (match) => {
    if (!match) return "Unknown";
    if (match.user?.name) return match.user.name;
    if (match.users?.length === 2) {
      const other = match.users.find(
        (u) => u._id && u._id.toString() !== user.id
      );
      if (other?.name) return other.name;
    }
    return match.name || "Unknown";
  };

  const getMatchMessages = (match) => match?.messages || [];
  const getLastMessagePreview = (match) => {
    const msgs = getMatchMessages(match);
    if (!msgs.length) return "Say hello!";
    const last = msgs[msgs.length - 1];
    return last.sender === "user" ? `You: ${last.text}` : last.text;
  };

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
      {isMobile && (
        <button
          className={styles.mobileToggle}
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <Menu />
        </button>
      )}

      {isMobile && showSidebar && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${!showSidebar ? styles.hidden : ""}`}>
        <h2 className={styles.title}>
          <Heart /> Your Matches ({matches.length})
        </h2>
        <div className={styles.matchesList}>
          {matches.length === 0 ? (
            <div className={styles.noMatches}>
              <div className={styles.noMatchesIcon}>Broken Heart</div>
              <p>No matches yet!</p>
              <p>Keep swiping to find your perfect match!</p>
              <button
                className={styles.swipeBtn}
                onClick={() => navigate("swipe")}
              >
                Start Swiping
              </button>
            </div>
          ) : (
            matches.map((match) => {
              const name = getMatchName(match);
              const img = getMatchImage(match);
              const lastMsg = getLastMessagePreview(match);
              const hasUnread = getMatchMessages(match).some(
                (m) => m.sender === "match" && !m.isRead
              );

              return (
                <div
                  key={match._id}
                  className={`${styles.matchItem} ${
                    selectedMatch?._id === match._id ? styles.active : ""
                  }`}
                  onClick={() => handleMatchClick(match)}
                >
                  <div className={styles.matchAvatar}>
                    <img
                      src={img}
                      alt={name}
                      onError={(e) =>
                        (e.target.src =
                          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg")
                      }
                    />
                    {isOnline(match) && (
                      <div className={styles.onlineDot}></div>
                    )}
                    {hasUnread && (
                      <div className={styles.unreadIndicator}></div>
                    )}
                  </div>
                  <div className={styles.matchInfo}>
                    <h3>{name}</h3>
                    <p className={styles.lastMessage}>{lastMsg}</p>
                  </div>
                  {getMatchMessages(match).length === 0 && (
                    <div className={styles.newMatch}>New</div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
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
                  onError={(e) =>
                    (e.target.src =
                      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg")
                  }
                />
                {isOnline(selectedMatch) && (
                  <div className={styles.onlineIndicator}></div>
                )}
              </div>
              <div className={styles.chatInfo}>
                <h3>{getMatchName(selectedMatch)}</h3>
                <p>
                  {isTyping(selectedMatch)
                    ? "typing..."
                    : isOnline(selectedMatch)
                    ? "Active now"
                    : "Offline"}
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
                  <p>Start the conversation with a friendly message.</p>
                  <div className={styles.messageStarters}>
                    <button
                      type="button"
                      className={styles.starterBtn}
                      onClick={() =>
                        setMessageText("Hey! How's your day going?")
                      }
                    >
                      "Hey! How's your day going?"
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
                          "Nice to match! Tell me something interesting."
                        )
                      }
                    >
                      "Tell me something interesting."
                    </button>
                  </div>
                </div>
              ) : (
                getMatchMessages(selectedMatch).map((msg, i) => {
                  const senderId =
                    typeof msg.senderId === "object"
                      ? msg.senderId?._id?.toString()
                      : msg.senderId?.toString();

                  const isSentByMe =
                    senderId === user.id || msg.sender === "user";

                  const avatar = isSentByMe
                    ? user.avatar
                    : getMatchImage(selectedMatch);

                  const isDeleting = deletingMsgId === msg.id;

                  return (
                    <div
                      key={msg.id || `msg-${i}`}
                      className={`${styles.message} ${
                        isSentByMe ? styles.sent : styles.received
                      }`}
                    >
                      {!isSentByMe && (
                        <img
                          src={avatar}
                          alt="avatar"
                          className={styles.msgAvatar}
                          onError={(e) =>
                            (e.target.src =
                              "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg")
                          }
                        />
                      )}
                      <div className={styles.messageBubble}>
                        <div className={styles.messageContent}>{msg.text}</div>
                        <div className={styles.messageMeta}>
                          <span className={styles.messageTime}>
                            {new Date(
                              msg.timestamp || Date.now()
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {isSentByMe && (
                            <span className={styles.readStatus}>
                              {msg.isRead ? (
                                <CheckCheck size={14} />
                              ) : (
                                <Check size={14} />
                              )}
                            </span>
                          )}
                        </div>
                        {isSentByMe && (
                          <button
                            className={styles.deleteBtn}
                            onClick={() => deleteMessage(msg.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className={styles.messageForm} onSubmit={sendMessage}>
              <input
                type="text"
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                  startTyping();
                }}
                onKeyUp={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage(e)
                }
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
                ? "Start swiping to find your perfect match."
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
