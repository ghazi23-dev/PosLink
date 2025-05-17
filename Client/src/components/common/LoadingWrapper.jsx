import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Loader from './Loader';

const LoadingWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Show loader when location changes
    setIsLoading(true);

    // Hide loader after delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 430); // 1 second delay

    return () => clearTimeout(timer);
  }, [location]);

  if (isLoading) {
    return <Loader />;
  }

  return children;
};

export default LoadingWrapper; 