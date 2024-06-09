import { useState } from 'react'
import './App.css'
import './styles/style.css'

import { Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/side-adminbar/side-adminbar.jsx';

// Importa páginas
import TestPage from './pages/test.jsx';
import LoremPage from './pages/lorem.jsx';
import GestaoSala from './pages/GestaoSala.jsx';


function App() {
  return (
    <div className="app">
      <Sidebar />
      <Routes>
        <Route path="/teste" element={<TestPage />} />
        <Route path="/lorem" element={<LoremPage />} />
        <Route path="/gestaosala" element={<GestaoSala />} />
        <Route path="/" element={<Navigate to="/gestaosala" />} />
      </Routes>
    </div>
    );
  }

export default App
