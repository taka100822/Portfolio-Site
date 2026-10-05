import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Works from './components/Works';
import Timeline from './components/Timeline';
import Links from './components/Links';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

function App() {
  // Hero のリングと Works のカードの両方から作品詳細を開く
  const [selectedWork, setSelectedWork] = useState(null);

  return (
    <div className="App">
      <Header />
      <main>
        <Hero onSelectWork={setSelectedWork} />
        <Works selectedWork={selectedWork} onSelectWork={setSelectedWork} />
        <About />
        <Skills />
        <Timeline />
        <Links />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;