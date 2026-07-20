import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AcompanharOS from './components/AcompanharOS'; // Ajuste o caminho conforme necessário

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota para a página de acompanhamento com ou sem ID na URL */}
        <Route path="/acompanhar/:osId?" element={<AcompanharOS />} />
        {/* Adicione outras rotas do seu aplicativo aqui, se houver */}
        {/* Exemplo: <Route path="/" element={<HomePage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
