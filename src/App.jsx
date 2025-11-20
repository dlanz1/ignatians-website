/**
 * Main application component.
 *
 * This component sets up the routing for the application, defining the paths
 * for the student view (home) and the board view. It also includes a common footer.
 *
 * @module App
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StudentView from './components/StudentView';
import BoardView from './components/BoardView';

/**
 * The root App component containing the router and layout.
 *
 * @component
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<StudentView />} />
          <Route path="/board" element={<BoardView />} />
        </Routes>

        <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>
          <p>&copy; {new Date().getFullYear()} Ignatians Service Organization.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
