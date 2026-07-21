import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Acompanhar from './pages/Acompanhar'; // Ajuste o caminho se necessário

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota para a página de acompanhamento com ou sem ID na URL */}
        <Route path="/acompanhar/:osId?" element={<Acompanhar />} />

        {/* Se você tiver outras páginas, adicione-as aqui. */}
        {/* Exemplo: <Route path="/" element={<div>Página Inicial</div>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
