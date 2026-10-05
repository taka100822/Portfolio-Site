import React, { useCallback, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Works from './components/Works';
import Timeline from './components/Timeline';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Intro from './components/Intro';
import './App.css';

function App() {
  // Hero のリングと Works のカードの両方から作品詳細を開く
  const [selectedWork, setSelectedWork] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const handleIntroDone = useCallback(() => setShowIntro(false), []);

  return (
    <div className="App">
      {showIntro && <Intro onDone={handleIntroDone} />}
      <Header />
      <main>
        <Hero onSelectWork={setSelectedWork} />
        <Works selectedWork={selectedWork} onSelectWork={setSelectedWork} />
        <About />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;