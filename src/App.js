import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Works from './components/Works';
import Timeline from './components/Timeline';
import Links from './components/Links';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import ParticleBackground from './components/ParticleBackground';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>
      
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ParticleBackground />
          <Header />
          <main>
            <Hero />
            <About />
            <Skills />
            <Works />
            <Timeline />
            <Links />
            <Contact />
          </main>
          <Footer />
        </motion.div>
      )}
    </div>
  );
}

export default App;