import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importe useNavigate
import { createClient } from '@base44/sdk';

// Inicialize o cliente Base44 fora do componente para evitar recriações desnecessárias
const base44 = createClient({
  appId: "6a5e6000f52d90d1feb75b81",
  headers: {
    "api_key": "ce79ff5dd4fe49399e08e75e4c9d81b0"
  }
});

function AcompanharOS() {
  const { osId } = useParams(); // Pega o ID da OS da URL
  const navigate = useNavigate(); // Hook para navegação programática
  const [numeroOS, setNumeroOS] = useState(osId || ''); // Estado para o input da OS
  const [ordemServico, setOrdemServico] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para buscar a OS
  const buscarOrdemServico = async (id) => {
    if (!id) {
      setOrdemServico(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // A API do Base44 não tem um endpoint para buscar por 'numero', apenas por 'id' (UUID)
      // e por query em /entities/OrdemServico.
      // Vamos usar a busca por query para encontrar pelo campo 'numero'.
      const response = await base44.entities.OrdemServico.list({
        filter: {
          numero: {
            _eq: id // Busca exata pelo número da OS
          }
        }
      });

      if (response.data && response.data.length > 0) {
        setOrdemServico(response.data[0]); // Pega a primeira OS encontrada
      } else {
        setOrdemServico(null);
        setError('Ordem de Serviço não encontrada.');
      }
    } catch (err) {
      console.error('Erro ao buscar Ordem de Serviço:', err);
      setError('Erro ao buscar Ordem de Serviço. Tente novamente.');
      setOrdemServico(null);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para buscar a OS quando o componente carrega ou o osId da URL muda
  useEffect(() => {
    if (osId) {
      setNumeroOS(osId); // Preenche o input com o ID da URL
      buscarOrdemServico(osId);
    }
  }, [osId]);

  // Lida com a submissão do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    if (numeroOS) {
      // Atualiza a URL para refletir a busca, permitindo compartilhar o link
      navigate(`/acompanhar/${numeroOS}`);
      buscarOrdemServico(numeroOS);
    }
  };

  // Renderização do componente
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Seus divs de fundo e layout */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary glow-primary mb-4">
            {/* Ícone CPU */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cpu w-8 h-8 text-white">
              <rect width="16" height="16" x="4" y="4" rx="2"></rect>
              <rect width="6" height="6" x="9" y="9" rx="1"></rect>
              <path d="M15 2v2"></path>
              <path d="M15 20v2"></path>
              <path d="M2 15h2"></path>
              <path d="M2 9h2"></path>
              <path d="M20 15h2"></path>
              <path d="M20 9h2"></path>
              <path d="M9 2v2"></path>
              <path d="M9 20v2"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">DARK CACHE</h1>
          <p className="text-sm text-muted-foreground mt-1">Acompanhe sua ordem de serviço</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow glass-card border-border p-6 mb-6">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <label htmlFor="os-input" className="text-sm text-muted-foreground">Digite o número da sua OS</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                {/* Ícone de busca */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
                <input
                  id="os-input"
                  className="flex w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-9 bg-secondary/50 border-border h-11"
                  placeholder="Ex: OS-2025-123456"
                  value={numeroOS}
                  onChange={(e) => setNumeroOS(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary shadow hover:bg-primary/90 h-9 py-2 gradient-primary glow-primary-sm text-white border-0 px-6"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </form>

          {/* Área para exibir os resultados */}
          {loading && <p className="text-center text-primary mt-4">Carregando dados da OS...</p>}
          {error && <p className="text-center text-red-500 mt-4">{error}</p>}

          {ordemServico && (
            <div className="mt-6 p-4 border rounded-md bg-secondary/30 border-border">
              <h2 className="text-xl font-semibold text-white mb-3">Detalhes da Ordem de Serviço: {ordemServico.numero}</h2>
              <p className="text-muted-foreground">
                <span className="font-medium text-white">Cliente:</span> {ordemServico.cliente_nome}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium text-white">Equipamento:</span> {ordemServico.equipamento_tipo} - {ordemServico.marca} {ordemServico.modelo}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium text-white">Status:</span> {ordemServico.status}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium text-white">Defeito Relatado:</span> {ordemServico.defeito}
              </p>
              {ordemServico.diagnostico && (
                <p className="text-muted-foreground">
                  <span className="font-medium text-white">Diagnóstico:</span> {ordemServico.diagnostico}
                </p>
              )}
              {ordemServico.observacoes && (
                <p className="text-muted-foreground">
                  <span className="font-medium text-white">Observações:</span> {ordemServico.observacoes}
                </p>
              )}
              {ordemServico.data_previsao && (
                <p className="text-muted-foreground">
                  <span className="font-medium text-white">Previsão de Conclusão:</span> {new Date(ordemServico.data_previsao).toLocaleDateString('pt-BR')}
                </p>
              )}
              {/* Adicione mais campos conforme desejar exibir */}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">Dark Cache • Assistência Técnica Especializada</p>
      </div>
    </div>
  );
}

export default AcompanharOS;
