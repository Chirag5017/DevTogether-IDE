import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing DevTogether...');

  useEffect(() => {
    const loadingMessages = [
      'Initializing DevTogether...',
      'Loading file system...',
      'Preparing terminal...',
      'Setting up workspace...',
      'Almost ready...'
    ];

    // Simulate loading progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        
        // Give a small delay before completing
        setTimeout(() => {
          onLoadComplete();
        }, 500);
      }
      
      // Update loading message based on progress
      const messageIndex = Math.min(
        Math.floor(currentProgress / 25),
        loadingMessages.length - 1
      );
      
      setProgress(currentProgress);
      setLoadingText(loadingMessages[messageIndex]);
    }, 500);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 bg-[#0d0d0d] flex flex-col items-center justify-center z-50">
      {/* Logo */}
      <div className="mb-8 animate-pulse">
        <svg 
          className="w-44 h-44 mx-auto text-[#4d4d4d]" 
          viewBox="0 0 100 100" 
          fill="currentColor"
        >
          <path d="M75.7,50.4L99,34.2l-23.3-4v-12L30.1,1.4L0.8,18.2v64.4l29.3,16.6l45.5-16.4l23.3-11.4V17.2L75.7,50.4z M30.1,83.4L8.8,70.8V28.8l21.3,9.4V83.4z M30.1,31.4L9.6,22.5l20.5-11L70.3,25L30.1,31.4z M91.5,67.8L76.5,75V36.7l-37.8,15v31.8l-1.7,0.6l-0.1-0.3V39.7L91.5,23V67.8z"/>
        </svg>
      </div>
      
      {/* Title */}
      <h1 className="text-[#ffffff] text-4xl font-medium mb-6">DevTogether IDE</h1>
      
      {/* Loading message */}
      <div className="text-[#aaaaaa] text-xl mb-8">{loadingText}</div>
      
      {/* Progress bar */}
      <div className="w-96 bg-[#1e1e1e] rounded-full h-3 mb-10">
        <div 
          className="bg-[#ffffff] h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Loading indicators */}
      <div className="flex space-x-4">
        <div className="w-4 h-4 bg-[#ffffff] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
        <div className="w-4 h-4 bg-[#ffffff] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
        <div className="w-4 h-4 bg-[#ffffff] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
      </div>
    </div>
  );
};

export default LoadingScreen;