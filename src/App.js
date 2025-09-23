import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from './Componentes/Login/Login';
import Navbar from './Componentes/Menu/Menu';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route 
        path="/menu" 
        element={
          <ProtectedRoute>
            <Navbar />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
