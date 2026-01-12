import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Background from "../components/Background";

/* ===========================
   API IMPORTS
=========================== */
import { playMovie } from "../api/movieService";
import {
  createWatchParty,
  joinWatchParty,
  getWatchPartySync,
} from "../api/watchPartyService";

import {
  connectWatchPartySocket,
  disconnectWatchPartySocket,
  sendPlaybackEvent,
  sendChatMessage,
} from "../api/watchPartySocket";
import { getCurrentUserId, getUserFromToken } from "../utils/jwtUtils";

/* ===========================
   COMPONENT
=========================== */
function MoviePlayer() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  /* ===========================
     REFS
  =========================== */
  const videoRef = useRef(null);

  /* ===========================
     STATE
  =========================== */
  const [movie, setMovie] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showChat, setShowChat] = useState(false);

  /* ===========================
     LOAD MOVIE (NORMAL PLAY)
  =========================== */
  useEffect(() => {
    playMovie(movieId)
      .then((res) => setMovie(res.token))
      .catch(() => {
        alert("Not allowed to play this movie");
        navigate("/movies");
      });
  }, [movieId]);


  /* ===========================
     WATCH PARTY SYNC SOCKET
  =========================== */
  useEffect(() => {
    if (!roomCode) return;

    connectWatchPartySocket(
      roomCode,
      // Playback event handler
      (event) => {
        // Host should ignore incoming sync events
        if (isHost) return;

        const video = videoRef.current;
        if (!video) return;

        switch (event.action) {
          case "PLAY":
            video.currentTime = event.currentTime;
            video.play();
            break;

          case "PAUSE":
            video.currentTime = event.currentTime;
            video.pause();
            break;

          case "SEEK":
            video.currentTime = event.currentTime;
            break;

          case "SYNC":
            video.currentTime = event.currentTime;
            break;

          default:
            break;
        }
      },
      // Chat message handler
      (chatMessage) => {
        setChatMessages(prev => [...prev, chatMessage]);
      }
    );

    return () => disconnectWatchPartySocket();
  }, [roomCode, isHost]);

  /* ===========================
     HOST SENDS PLAY EVENTS
  =========================== */
  useEffect(() => {
    if (!isHost || !roomCode || !videoRef.current) return;

    const video = videoRef.current;

    const onPlay = () =>
      sendPlaybackEvent({
        roomCode,
        action: "PLAY",
        currentTime: video.currentTime,
      });

    const onPause = () =>
      sendPlaybackEvent({
        roomCode,
        action: "PAUSE",
        currentTime: video.currentTime,
      });

    const onSeeked = () =>
      sendPlaybackEvent({
        roomCode,
        action: "SEEK",
        currentTime: video.currentTime,
      });

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("seeked", onSeeked);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [isHost, roomCode]);


  const handleStartWatchParty = async () => {
    try {
      const res = await createWatchParty(movieId);
      const code = res.token;

      setRoomCode(code);
      setIsHost(true);

      alert("Room Code: " + code);
    } catch {
      alert("Failed to create watch party");
    }
  };

  const handleJoinWatchParty = async () => {
    try {
      await joinWatchParty(joinCode);

      setRoomCode(joinCode);
      setIsHost(false);

      const syncRes = await getWatchPartySync(joinCode);
      if (videoRef.current) {
        videoRef.current.currentTime = syncRes.token.currentTime;
      }
    } catch {
      alert("Failed to join watch party");
    }
  };

  /* ===========================
     CHAT FUNCTIONS
  =========================== */
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!currentMessage.trim() || !roomCode) return;

    const userId = getCurrentUserId();
    if (!userId) {
      alert("User not authenticated. Please login again.");
      return;
    }

    const chatMessage = {
      roomCode,
      senderId: parseInt(userId), // Convert to Long as expected by ChatDTO
      message: currentMessage.trim(),
    };

    sendChatMessage(chatMessage);
    setCurrentMessage("");
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  if (!movie) {
    return (
      <div className="player-container">
        <Background />
        <div className="loading-screen">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <h3>Loading movie...</h3>
            <p>Please wait while we prepare your content</p>
          </div>
        </div>
      </div>
    );
  }

  /* ===========================
     UI
  =========================== */
  return (
    <div className="player-container">
      <Background />

      {/* Header */}
      <header className="player-header">
        <div className="header-content">
          <button
            className="back-btn"
            onClick={() => navigate("/movies")}
          >
            <span className="back-icon">←</span>
            Back to Movies
          </button>

          <div className="movie-title-section">
            <h1 className="movie-title">{movie.title}</h1>
            {roomCode && (
              <div className="watch-party-badge">
                <span className="badge-icon">👥</span>
                Watch Party: {roomCode}
                <span className="role-badge">{isHost ? "HOST" : "GUEST"}</span>
              </div>
            )}
          </div>

          <div className="header-actions">
            <button className="action-btn favorite">
              <span className="btn-icon">❤️</span>
            </button>
            <button className="action-btn share">
              <span className="btn-icon">📤</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Player */}
      <main className="player-main">
        <div className="video-wrapper">
          <video
            ref={videoRef}
            className="video-player"
            controls={!roomCode || isHost}
            src={movie.movieUrl}
            poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMWE0MTZlIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMjI1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjdlZWEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7ilrDvuI8gTW92aWU8L3RleHQ+Cjwvc3ZnPg=="
          />

          {/* Custom Controls Overlay for Watch Party */}
          {roomCode && !isHost && (
            <div className="watch-party-overlay">
              <div className="overlay-content">
                <div className="sync-indicator">
                  <div className="sync-icon">🔄</div>
                  <p>Synced with host</p>
                </div>
              </div>
            </div>
          )}

          {/* Chat Toggle Button */}
          {roomCode && (
            <button
              className={`chat-toggle-btn ${showChat ? 'active' : ''}`}
              onClick={toggleChat}
              title={showChat ? 'Hide Chat' : 'Show Chat'}
            >
              <span className="chat-icon">💬</span>
              {chatMessages.length > 0 && (
                <span className="message-count">{chatMessages.length}</span>
              )}
            </button>
          )}
        </div>

        {/* Chat Panel */}
        {roomCode && showChat && (
          <div className="chat-panel">
            <div className="chat-header">
              <h3>Watch Party Chat</h3>
              <button className="chat-close-btn" onClick={toggleChat}>×</button>
            </div>

            <div className="chat-messages">
              {chatMessages.length === 0 ? (
                <div className="no-messages">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                chatMessages.map((msg, index) => {
                  const currentUserId = getCurrentUserId();
                  const isCurrentUser = currentUserId && parseInt(currentUserId) === msg.senderId;

                  return (
                    <div key={index} className={`chat-message ${isCurrentUser ? 'own-message' : ''}`}>
                      <div className="message-sender">
                        {isCurrentUser ? 'You' : `User ${msg.senderId}`}
                      </div>
                      <div className="message-content">{msg.message}</div>
                      <div className="message-time">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="chat-input"
                placeholder="Type a message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                maxLength={200}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={!currentMessage.trim()}
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* Watch Party Controls */}
        <div className="controls-section">
          {!roomCode ? (
            <div className="watch-party-setup">
              <h3 className="section-title">
                <span className="title-icon">👥</span>
                Start a Watch Party
              </h3>
              <p className="section-description">
                Invite friends to watch together in real-time synchronization
              </p>

              <div className="control-group">
                <button
                  className="control-btn primary"
                  onClick={handleStartWatchParty}
                >
                  <span className="btn-icon">🎬</span>
                  Create Watch Party
                </button>

                <div className="divider">
                  <span>or join existing</span>
                </div>

                <div className="join-section">
                  <input
                    type="text"
                    className="room-input"
                    placeholder="Enter Room Code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                  />
                  <button
                    className="control-btn secondary"
                    onClick={handleJoinWatchParty}
                  >
                    <span className="btn-icon">🚪</span>
                    Join Party
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="watch-party-active">
              <div className="party-info">
                <div className="party-status">
                  <div className={`status-indicator ${isHost ? 'host' : 'guest'}`}>
                    <span className="status-icon">{isHost ? '👑' : '👤'}</span>
                  </div>
                  <div className="party-details">
                    <h4>Watch Party Active</h4>
                    <p>Room Code: <strong>{roomCode}</strong></p>
                    <p>Role: <span className={`role-text ${isHost ? 'host' : 'guest'}`}>
                      {isHost ? 'Host (Controls enabled)' : 'Guest (Synced playback)'}
                    </span></p>
                  </div>
                </div>

                <div className="party-actions">
                  <button className="action-btn invite">
                    <span className="btn-icon">📤</span>
                    Invite Friends
                  </button>
                  <button
                    className="action-btn leave"
                    onClick={() => {
                      // Reset watch party state
                      setRoomCode(null);
                      setIsHost(false);
                      setJoinCode("");
                    }}
                  >
                    <span className="btn-icon">🚪</span>
                    Leave Party
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MoviePlayer;
