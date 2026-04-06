import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './VisitorCounter.css';

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getVisitorCount = async () => {
      try {
        // GitHub API を使用してリポジトリのビュー数を取得
        // 注意：GitHub APIにはレート制限があります
        const response = await fetch('https://api.github.com/repos/Taka100822/Portfolio-Site/traffic/views', {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setVisitorCount(data.count || 0);
        } else {
          // APIが利用できない場合はlocalStorageでカウント
          const storedCount = localStorage.getItem('portfolioVisitorCount');
          const count = storedCount ? parseInt(storedCount) : 0;
          const newCount = count + 1;
          localStorage.setItem('portfolioVisitorCount', newCount.toString());
          setVisitorCount(newCount);
        }
      } catch (error) {
        // エラー時はlocalStorageでカウント
        const storedCount = localStorage.getItem('portfolioVisitorCount');
        const count = storedCount ? parseInt(storedCount) : 0;
        const newCount = count + 1;
        localStorage.setItem('portfolioVisitorCount', newCount.toString());
        setVisitorCount(newCount);
      } finally {
        setIsLoading(false);
      }
    };

    getVisitorCount();
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <motion.div 
        className="visitor-counter loading"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <span className="loading-text">Loading views...</span>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="visitor-counter"
      initial={{ opacity: 0, y: -30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 1, 
        ease: [0.4, 0, 0.2, 1],
        delay: 0.2
      }}
    >
      <div className="counter-background"></div>
      <div className="counter-border"></div>
      
      <motion.div className="counter-inner">
        <div className="counter-icon-wrapper">
          <motion.div 
            className="counter-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 0.8,
              duration: 0.8,
              type: "spring",
              stiffness: 100
            }}
          >
            <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
              <path 
                d="M12 0C7.2 0 2.73 2.61 0 6.75C2.73 10.89 7.2 13.5 12 13.5C16.8 13.5 21.27 10.89 24 6.75C21.27 2.61 16.8 0 12 0ZM12 11.25C9.38 11.25 7.25 9.12 7.25 6.5C7.25 3.88 9.38 1.75 12 1.75C14.62 1.75 16.75 3.88 16.75 6.5C16.75 9.12 14.62 11.25 12 11.25Z" 
                fill="url(#eyeGradient)"
              />
              <circle cx="12" cy="6.5" r="2.5" fill="#ffffff" opacity="0.9"/>
              <defs>
                <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          <div className="icon-glow"></div>
        </div>
        
        <div className="counter-content">
          <motion.div 
            className="counter-number"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 1,
              duration: 0.8,
              type: "spring",
              stiffness: 120
            }}
          >
            {formatNumber(visitorCount)}
          </motion.div>
          
          <motion.div 
            className="counter-label"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: 1.2,
              duration: 0.6
            }}
          >
            Total Views
          </motion.div>
        </div>
      </motion.div>
      
      <div className="floating-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
      </div>
    </motion.div>
  );
};

export default VisitorCounter;