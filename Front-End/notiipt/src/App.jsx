import { useState } from 'react'
import './App.css'

import { Route, Routes } from 'react-router-dom';
import Sidebar from './components/side-adminbar/side-adminbar.jsx';
import TestPage from './pages/test.jsx';

function App() {
  return (
    <div className="app">
      <Sidebar />
      <h1>App</h1>
      <Routes>
        <Route path="/teste" element={<TestPage />} />
      </Routes>
    </div>
    );
  }

export default App
