import { useState } from 'react';
import { useMatch } from '../contexts/MatchContext';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle, Heart, Send, ArrowLeft, Phone, Video } from 'lucide-react';
import styles from '../styles/MatchesList.module.css';

const MatchesList = ({ navigate }) => {
  const { user } = useAuth();
  const { matches, sendMessage } = useMatch();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim() && selectedMatch) {
      sendMessage(selectedMatch.id, messageText.trim());
      setMessageText('');
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loginPrompt}>
          <h2>Please log in to view your matches</h2>
          <button onClick={() => navigate('home')}>Go to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.sidebar} ${!showSidebar ? styles.hidden : ''}`}>
        <h2 className={styles.title}>
          <Heart />
          Your Matches ({matches.length})
        </h2>
        
        <div className={styles.matchesList}>
          {matches.length === 0 ? (
            <div className={styles.noMatches}>
              <div className={styles.noMatchesIcon}>💔</div>
              <p>No matches yet!</p>
              <p>Keep swiping to find your perfect match. The more you swipe, the better your chances!</p>
              <button 
                className={styles.swipeBtn}
                onClick={() => navigate('swipe')}
              >
                Start Swiping
              </button>
            </div>
          ) : (
            matches.map((match) => (
              <div
                key={match.id}
                className={`${styles.matchItem} ${selectedMatch?.id === match.id ? styles.active : ''}`}
                onClick={() => {
                  setSelectedMatch(match);
                  setShowSidebar(false); // Hide sidebar on mobile when selecting a match
                }}
              >
                <div className={styles.matchAvatar}>
                  <img
                    src={match.profile.images[0]}
                    alt={match.profile.name}
                  />
                </div>
                <div className={styles.matchInfo}>
                  <h3>{match.profile.name}</h3>
                  <p className={styles.lastMessage}>
                    {match.messages.length > 0 
                      ? `${match.messages[match.messages.length - 1].sender === 'user' ? 'You: ' : ''}${match.messages[match.messages.length - 1].text}`
                      : 'Say hello!'
                    }
                  </p>
                </div>
                {match.messages.length === 0 && (
                  <div className={styles.newMatch}>New</div>
                )}
                {match.messages.length > 0 && match.messages[match.messages.length - 1].sender === 'match' && (
                  <div className={styles.unreadIndicator}></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.chatArea}>
        {selectedMatch ? (
          <>
            <div className={styles.chatHeader}>
              <button 
                className={styles.backBtn}
                onClick={() => setShowSidebar(true)}
              >
                <ArrowLeft />
              </button>
              <div className={styles.chatAvatar}>
                <img
                  src={selectedMatch.profile.images[0]}
                  alt={selectedMatch.profile.name}
                />
                <div className={styles.onlineIndicator}></div>
              </div>
              <div className={styles.chatInfo}>
                <h3>{selectedMatch.profile.name}</h3>
                <p>Active now • Matched {new Date(selectedMatch.matchedAt).toLocaleDateString()}</p>
              </div>
              <div className={styles.chatActions}>
                <button className={styles.callBtn}><Phone /></button>
                <button className={styles.videoBtn}><Video /></button>
              </div>
            </div>

            <div className={styles.messages}>
              {selectedMatch.messages.length === 0 ? (
                <div className={styles.noMessages}>
                  <Heart />
                  <h3>You matched with {selectedMatch.profile.name}!</h3>
                  <p>Start the conversation with a friendly message. Here are some ideas:</p>
                  <div className={styles.messageStarters}>
                    <button 
                      className={styles.starterBtn}
                      onClick={() => setMessageText("Hey! How's your day going? 😊")}
                    >
                      "Hey! How's your day going? 😊"
                    </button>
                    <button 
                      className={styles.starterBtn}
                      onClick={() => setMessageText("I love your profile! What's your favorite hobby?")}
                    >
                      "I love your profile! What's your favorite hobby?"
                    </button>
                    <button 
                      className={styles.starterBtn}
                      onClick={() => setMessageText("Nice to match with you! Tell me something interesting about yourself.")}
                    >
                      "Tell me something interesting about yourself."
                    </button>
                  </div>
                </div>
              ) : (
                selectedMatch.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.message} ${
                      message.sender === 'user' ? styles.sent : styles.received
                    }`}
                  >
                    <div className={styles.messageContent}>
                      {message.text}
                    </div>
                    <div className={styles.messageTime}>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
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
                placeholder={`Message ${selectedMatch.profile.name}...`}
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
            <p>Select a match from the sidebar to start chatting and build meaningful connections.</p>
            {matches.length === 0 && (
              <button 
                className={styles.startSwipingBtn}
                onClick={() => navigate('swipe')}
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
