import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import JobForm from './components/JobForm';
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm'; // 🔹 Yeni eklenecek
import RecommendationPage from './components/RecommendationPage'; // 🔹 Yeni eklendi

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} /> {/* 🔹 Yeni Login sayfası */}
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/add-job" element={<JobForm />} />
        <Route path="/recommend" element={<RecommendationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
