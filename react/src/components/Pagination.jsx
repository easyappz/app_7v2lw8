import React from 'react';

export default function Pagination({ page, setPage, pageSize, total }) {
  const maxPage = Math.max(1, Math.ceil((total || 0) / (pageSize || 10)));
  const prev = () => setPage(Math.max(1, page - 1));
  const next = () => setPage(Math.min(maxPage, page + 1));
  return (
    <div className="flex items-center justify-center gap-2 mt-6" data-easytag="id1-react/src/components/Pagination.jsx" aria-label="Пагинация">
      <button className="btn btn-outline" onClick={prev} disabled={page <= 1} data-easytag="id2-react/src/components/Pagination.jsx">Назад</button>
      <div className="text-sm text-ink-600" data-easytag="id3-react/src/components/Pagination.jsx">Стр. {page} из {maxPage}</div>
      <button className="btn btn-outline" onClick={next} disabled={page >= maxPage} data-easytag="id4-react/src/components/Pagination.jsx">Вперед</button>
    </div>
  );
}
