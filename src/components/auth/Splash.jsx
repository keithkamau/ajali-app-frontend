import React from "react";
import { Link } from "react-router-dom";

export const Splash = () => {
  return (
    <div className='splash-container'>

      <div className='splash-logo'>Ajali</div>
      <p className='splash-tagline'>Smart. Fast. Verified.</p>

      <p className='splash-description'>
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

    </div>
  );
};
