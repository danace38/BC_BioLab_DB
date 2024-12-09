import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Experiments from './components/Experiments';
import Query from './components/Query';
import RunList from './components/RunList';  

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root path to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Home Route */}
        <Route path="/home" element={<Home />} />

        {/* Experiments Route */}
        <Route path="/experiments" element={<Experiments />} />

        {/* Query Route */}
        <Route path="/query" element={<Query />} />

        {/* RunList Route: to view the runs of a specific experiment */}
        <Route path="/runs" element={<RunList />} />

        {/* Logout Route */}
        <Route path="/logout" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
