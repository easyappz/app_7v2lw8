import React from 'react';

export default function Pagination({ page, pageSize, total, onPageChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-2" data-easytag="id1-react/src/components/Pagination.js">
      <button className="btn btn-outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)} data-easytag="id2-react/src/components/Pagination.js">Назад</button>
      {nums.map(n => (
        <button key={n} onClick={() => onPageChange(n)} className={`px-3 py-2 rounded-lg border ${n === page ? 'bg-ink-900 text-white border-ink-900' : 'border-ink-200 hover:bg-ink-50'}`} data-easytag="id3-react/src/components/Pagination.js">{n}</button>
      ))}
      <button className="btn btn-outline" disabled={page >= pages} onClick={() => onPageChange(page + 1)} data-easytag="id4-react/src/components/Pagination.js">Вперёд</button>
    </div>
  );
}
