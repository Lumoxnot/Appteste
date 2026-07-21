
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Cpu, Search, Wrench, DollarSign, ShieldCheck, Camera, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/Badges';
import { formatCurrency, formatDate } from '@/lib/format';
import { Image } from '@/components/ui/image';

export default function Acompanhar() {
  const [codigo, setCodigo] = useState('');
  const [os, setOs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function buscar(e) {
    e?.preventDefault();
    if (!codigo.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const results = await base44.entities.OrdemServico.filter({ numero: codigo.trim() }, '-created_date', 5);
      if (results.length > 0) {
        setOs(results[0]);
      } else {
        setOs(null);
      }
    } catch (err) {
      setOs(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary glow-primary mb-4">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">DARK CACHE</h1>
          <p className="text-sm text-muted-foreground mt-1">Acompanhe sua ordem de serviço</p>
        </div>

        {/* Search */}
        <Card className="glass-card border-border p-6 mb-6">
          <form onSubmit={buscar} className="space-y-3">
            <label className="text-sm text-muted-foreground">Digite o número da sua OS</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Ex: OS-2025-123456"
                  value={codigo}
                  onChange={e => setCodigo(e.target.value)}
                  className="pl-9 bg-secondary/50 border-border h-11"
                />
              </div>
              <Button type="submit" disabled={loading} className="gradient-primary glow-primary-sm text-white border-0 px-6">
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Result */}
        {searched && !loading && !os && (
          <Card className="glass-card border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">Nenhuma ordem de serviço encontrada com o código <span className="text-white font-medium">{codigo}</span></p>
          </Card>
        )}

        {os && (
          <div className="space-y-4 animate-fade-in">
            {/* Status card */}
            <Card className="glass-card border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Ordem de Serviço</p>
                  <p className="text-lg font-bold text-white">{os.numero}</p>
                </div>
                <StatusBadge status={os.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Wrench className="w-3 h-3" /> Equipamento</p>
                  <p className="text-sm text-white mt-0.5">{os.equipamento_tipo} {os.marca} {os.modelo}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Previsão</p>
                  <p className="text-sm text-white mt-0.5">{formatDate(os.data_previsao)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><DollarSign className="w-3 h-3" /> Valor</p>
                  <p className="text-sm text-white mt-0.5">{formatCurrency(os.valor_total)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Garantia</p>
                  <p className="text-sm text-white mt-0.5">{os.garantia_dias} dias</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Pagamento</span>
                <span className={`text-sm font-medium ${os.pago ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {os.pago ? '✓ Pago' : 'Pendente'}
                </span>
              </div>
            </Card>

            {/* Defeito */}
            {os.defeito && (
              <Card className="glass-card border-border p-5">
                <p className="text-xs text-muted-foreground mb-1">Defeito Relatado</p>
                <p className="text-sm text-white">{os.defeito}</p>
              </Card>
            )}

            {/* Fotos */}
            {(os.fotos_entrada?.length > 0 || os.fotos_durante?.length > 0 || os.fotos_entrega?.length > 0) && (
              <Card className="glass-card border-border p-5">
                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1"><Camera className="w-3 h-3" /> Fotos</p>
                <div className="grid grid-cols-3 gap-2">
                  {[...(os.fotos_entrada || []), ...(os.fotos_durante || []), ...(os.fotos_entrega || [])].map((url, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-secondary/30">
                      <Image src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Timeline */}
            {os.linha_tempo && os.linha_tempo.length > 0 && (
              <Card className="glass-card border-border p-5">
                <p className="text-xs text-muted-foreground mb-3">Histórico</p>
                <div className="space-y-3">
                  {os.linha_tempo.slice().reverse().map((evt, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0 glow-primary-sm" />
                      <div>
                        <p className="text-sm text-white">{evt.descricao}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(evt.data)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8">
          Dark Cache • Assistência Técnica Especializada
        </p>
      </div>
    </div>
  );
}
