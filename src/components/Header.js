import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Works', href: '#works' },
    { name: 'Timeline', href: '#timeline' },
    { name: 'Links', href: '#links' },
    { name: 'Contact', href: '#contact' }
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      className={`header ${scrolled ? 'scrolled' : ''}`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="nav-container">
          <motion.div
            className="logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="logo-text gradient-text">Taka’s Portfolio</span>
          </motion.div>

          <nav className="desktop-nav">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                className="nav-link"
                onClick={() => scrollToSection(item.href)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
              </motion.button>
            ))}
          </nav>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.nav
          className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}
          initial={false}
          animate={{ height: mobileMenuOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
        >
          {navItems.map((item, index) => (
            <motion.button
              key={item.name}
              className="mobile-nav-link"
              onClick={() => scrollToSection(item.href)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : -20 }}
              transition={{ duration: 0.3, delay: mobileMenuOpen ? 0.1 * index : 0 }}
            >
              {item.name}
            </motion.button>
          ))}
        </motion.nav>
      </div>
    </motion.header>
  );
};

export default Header;