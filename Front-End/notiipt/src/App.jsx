import { useState } from 'react'
import './App.css'

import { Route, Routes } from 'react-router-dom';
import Sidebar from './components/side-adminbar/side-adminbar.jsx';

// Importa páginas
import TestPage from './pages/test.jsx';
import LoremPage from './pages/lorem.jsx';
import GestaoSala from './pages/GestaoSala.jsx';


function App() {
  return (
    <div className="app">
      <Sidebar />
      <h1>App</h1>
      <Routes>
        <Route path="/teste" element={<TestPage />} />
        <Route path="/lorem" element={<LoremPage />} />
        <Route path="/gestaosala" element={<GestaoSala />} />
      </Routes>
    </div>
    );
  }

export default App
