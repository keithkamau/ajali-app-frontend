// src/components/auth/Splash.jsx
import React from "react";
import { Link } from "react-router-dom";

export const Splash = () => {
  return (
    <div className='splash-container'>
      <div className='splash-badge'>🚨 MVP</div>

      <div className='splash-logo'>Ajali</div>
      <p className='splash-tagline'>Smart. Fast. Verified.</p>

      <p
        style={{
          color: "var(--color-ink-muted)",
          maxWidth: "320px",
          marginBottom: "2rem",
        }}
      >
        Connect road accident victims and witnesses to verified responders.
        Streamline the entire accident management process.
      </p>

      <div className='splash-actions'>
        <Link to='/register' className='btn btn-primary btn-block'>
          Get Started
        </Link>
        <Link to='/login' className='btn btn-secondary btn-block'>
          Log In
        </Link>
      </div>

      <div className='splash-features'>
        <div className='splash-feature'>
          <div className='feature-icon'>⚡</div>
          <div className='feature-label'>Fast Response</div>
        </div>
        <div className='splash-feature'>
          <div className='feature-icon'>✅</div>
          <div className='feature-label'>Verified</div>
        </div>
        <div className='splash-feature'>
          <div className='feature-icon'>📍</div>
          <div className='feature-label'>Tracked</div>
        </div>
      </div>
    </div>
  );
};
