import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Acompanhar from './pages/Acompanhar';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/acompanhar/:osId?" element={<Acompanhar />} />
        <Route path="*" element={<Navigate to="/acompanhar" replace />} />
      </Routes>
    </BrowserRouter>
  );
}