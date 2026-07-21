import React from 'react';

const STATUS_MAP = {
  aguardando_aprovacao: { label: 'Aguardando Aprovação', className: 'bg-yellow-500/20 text-yellow-400' },
  aprovado: { label: 'Aprovado', className: 'bg-green-500/20 text-green-400' },
  em_andamento: { label: 'Em Andamento', className: 'bg-blue-500/20 text-blue-400' },
  aguardando_pecas: { label: 'Aguardando Peças', className: 'bg-orange-500/20 text-orange-400' },
  concluido: { label: 'Concluído', className: 'bg-purple-500/20 text-purple-400' },
  entregue: { label: 'Entregue', className: 'bg-emerald-500/20 text-emerald-400' },
  cancelado: { label: 'Cancelado', className: 'bg-red-500/20 text-red-400' },
};

export function StatusBadge({ status }) {
  const info = STATUS_MAP[status] || { label: status || 'Desconhecido', className: 'bg-gray-500/20 text-gray-400' };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${info.className}`}>
      {info.label}
    </span>
  );
}