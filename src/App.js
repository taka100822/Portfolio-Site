import React, { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Works from './components/Works';
import Timeline from './components/Timeline';
import Links from './components/Links';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Intro from './components/Intro';
import SpaceGame from './components/SpaceGame';
import AchievementToast from './components/AchievementToast';
import { emit } from './game/bus';
import './App.css';

function App() {
  // Hero のリングと Works のカードの両方から作品詳細を開く
  const [selectedWork, setSelectedWork] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const handleIntroDone = useCallback(() => setShowIntro(false), []);

  // 「作品を3つ開いた」の実績に使う
  useEffect(() => {
    if (selectedWork) emit('workOpen', { id: selectedWork.id });
  }, [selectedWork]);

  return (
    <div className="App">
      {showIntro && <Intro onDone={handleIntroDone} />}
      <SpaceGame ready={!showIntro} />
      <Header />
      <main>
        <Hero onSelectWork={setSelectedWork} />
        <About />
        <Works selectedWork={selectedWork} onSelectWork={setSelectedWork} />
        <Timeline />
        <Links />
        <Contact />
      </main>
      <Footer />
      <AchievementToast />
    </div>
  );
}

export default App;