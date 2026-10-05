import React from 'react';
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
  return (
    <div className="App">
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
    </div>
  );
}

export default App;