import React from 'react';

export default function FiltersBar({ categories, values, onChange, onReset }) {
  return (
    <div className="card p-4 grid grid-cols-1 md:grid-cols-5 gap-3" data-easytag="id1-react/src/components/FiltersBar.js">
      <div className="col-span-1" data-easytag="id2-react/src/components/FiltersBar.js">
        <select value={values.category || ''} onChange={(e) => onChange({ category: e.target.value || null })} className="select" data-easytag="id3-react/src/components/FiltersBar.js">
          <option value="" data-easytag="id4-react/src/components/FiltersBar.js">Все категории</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id} data-easytag="id5-react/src/components/FiltersBar.js">{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="col-span-1 flex gap-2" data-easytag="id6-react/src/components/FiltersBar.js">
        <input type="number" placeholder="Цена от" value={values.price_min ?? ''} onChange={(e) => onChange({ price_min: e.target.value })} className="input" min="0" data-easytag="id7-react/src/components/FiltersBar.js" />
        <input type="number" placeholder="до" value={values.price_max ?? ''} onChange={(e) => onChange({ price_max: e.target.value })} className="input" min="0" data-easytag="id8-react/src/components/FiltersBar.js" />
      </div>
      <div className="col-span-2" data-easytag="id9-react/src/components/FiltersBar.js">
        <input type="text" placeholder="Поиск по тексту" value={values.query || ''} onChange={(e) => onChange({ query: e.target.value })} className="input" data-easytag="id10-react/src/components/FiltersBar.js" />
      </div>
      <div className="col-span-1 flex gap-2 justify-end" data-easytag="id11-react/src/components/FiltersBar.js">
        <button onClick={onReset} className="btn btn-ghost" data-easytag="id12-react/src/components/FiltersBar.js">Сбросить</button>
      </div>
    </div>
  );
}
