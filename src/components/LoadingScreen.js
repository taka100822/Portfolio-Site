import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiSparklingFill } from 'react-icons/ri';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Delay before calling onComplete to show 100% briefly
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 800);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    // Show main content after initial delay
    setTimeout(() => setShowContent(true), 300);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  return (
    <motion.div
      className="loading-screen stylish-loading"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Animated background grid */}
      <div className="grid-background">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="grid-dot"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="loading-content">
        <AnimatePresence>
          {showContent && (
            <>
              {/* Sparkle icon */}
              <motion.div
                className="loading-icon"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                }}
                transition={{ duration: 1.5, ease: "backOut" }}
              >
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <RiSparklingFill />
                </motion.div>
              </motion.div>

              {/* Logo */}
              <motion.div
                className="loading-logo"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.5 }}
              >
                <motion.h1 
                  className="logo-text"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  Taka10
                </motion.h1>
                <motion.p
                  className="logo-subtitle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.8 }}
                >
                  Portfolio
                </motion.p>
              </motion.div>

              {/* Progress section */}
              <motion.div
                className="progress-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
              >
                <div className="progress-wrapper">
                  <div className="progress-track">
                    <motion.div
                      className="progress-bar"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut" }}
                    />
                    <motion.div
                      className="progress-glow"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut" }}
                    />
                  </div>
                  <motion.div
                    className="progress-text"
                    key={progress}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                  >
                    {progress}%
                  </motion.div>
                </div>
                <motion.p
                  className="loading-message"
                  animate={{ 
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Preparing experience...
                </motion.p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Floating particles */}
      <div className="particles">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 20,
              opacity: 0
            }}
            animate={{
              y: -100,
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 6 + Math.random() * 3,
              delay: Math.random() * 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingScreen;