import React, { useState, useEffect } from 'react';

const FloatingMessage = ({ message, duration, onMessageClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onMessageClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onMessageClose]);

  return (
    isVisible && (
      <div className="floating-message">
        {message}
      </div>
    )
  );
};

export default FloatingMessage;
