import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="app-loader">
      <div className="app-loader-content">
        <div className="app-loader-spinner"></div>
        {/* <img  style={{width:"300px", height:"100px"}}
          src="/logo_imagespo.png" 
          alt="Logo" 
          className="app-loader-logo"
        /> */}
      </div>
    </div>
  );
};

export default Loader; 