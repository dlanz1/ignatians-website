import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StudentView from './components/StudentView';
import AdminView from './components/AdminView';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<StudentView />} />
          <Route path="/board" element={<AdminView />} />
        </Routes>

        <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>
          <p>&copy; {new Date().getFullYear()} Ignatians Service Organization.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
