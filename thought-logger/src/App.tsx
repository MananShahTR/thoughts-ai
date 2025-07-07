import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { ThoughtLogger } from './components/ThoughtLogger/ThoughtLogger';
import { ThemeAnalyzer } from './components/ThemeAnalyzer/ThemeAnalyzer';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ThoughtLogger />} />
          <Route path="/themes" element={<ThemeAnalyzer />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;