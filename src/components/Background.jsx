import React from 'react';

function Background() {
  return (
    <>
      {/* Video Background - Disabled on mobile for performance */}
      <video
        className="video-background"
        autoPlay
        muted
        loop
        playsInline
        style={{ display: window.innerWidth <= 768 ? 'none' : 'block' }}
      >
        <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        Your browser does not support the video tag.
      </video>

      {/* Video Overlay */}
      <div className="video-overlay"></div>

      {/* Animated Particles - Reduced on mobile */}
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
    </>
  );
}

export default Background;

