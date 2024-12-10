import React from 'react';
import Header from './components/Header';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Recommendations from './components/Recommendations';
import Contact from './components/Contact';
import './styles/index.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <main>
        <About />
        <Skills />
        <Projects />
        <Recommendations />
        <Contact />
      </main>
    </div>
  );
};

export default App;