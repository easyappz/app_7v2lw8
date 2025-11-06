import React from 'react';

export default function FiltersBar({ query, setQuery, categories, filters, setFilters, onApply }) {
  return (
    <div className="card p-4 flex flex-col md:flex-row gap-3 md:items-end" data-easytag="id1-react/src/components/FiltersBar.jsx" aria-label="Фильтры">
      <div className="flex-1" data-easytag="id2-react/src/components/FiltersBar.jsx">
        <label className="sr-only" htmlFor="q">Поиск</label>
        <input id="q" className="input" placeholder="Поиск по заголовку" value={query} onChange={e => setQuery(e.target.value)} data-easytag="id3-react/src/components/FiltersBar.jsx" />
      </div>
      <div className="w-full md:w-56" data-easytag="id4-react/src/components/FiltersBar.jsx">
        <label className="sr-only" htmlFor="cat">Категория</label>
        <select id="cat" className="select" value={filters.category || ''} onChange={e => setFilters(f => ({...f, category: e.target.value || undefined}))} data-easytag="id5-react/src/components/FiltersBar.jsx">
          <option value="">Все категории</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="w-full md:w-40" data-easytag="id6-react/src/components/FiltersBar.jsx">
        <input className="input" placeholder="Цена от" value={filters.price_min || ''} onChange={e => setFilters(f => ({...f, price_min: e.target.value || undefined}))} data-easytag="id7-react/src/components/FiltersBar.jsx" />
      </div>
      <div className="w-full md:w-40" data-easytag="id8-react/src/components/FiltersBar.jsx">
        <input className="input" placeholder="Цена до" value={filters.price_max || ''} onChange={e => setFilters(f => ({...f, price_max: e.target.value || undefined}))} data-easytag="id9-react/src/components/FiltersBar.jsx" />
      </div>
      <button className="btn btn-primary" onClick={onApply} data-easytag="id10-react/src/components/FiltersBar.jsx">Применить</button>
    </div>
  );
}
