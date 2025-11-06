import React from 'react';

const options = [
  { value: '-created_at', label: 'Сначала новые' },
  { value: 'created_at', label: 'Сначала старые' },
  { value: 'price', label: 'Цена: по возрастанию' },
  { value: '-price', label: 'Цена: по убыванию' },
];

export default function SortBar({ ordering, setOrdering }) {
  return (
    <div className="flex items-center justify-end" data-easytag="id1-react/src/components/SortBar.jsx">
      <label htmlFor="ordering" className="mr-2 text-sm text-ink-600" data-easytag="id2-react/src/components/SortBar.jsx">Сортировка:</label>
      <select id="ordering" className="select w-56" value={ordering} onChange={e => setOrdering(e.target.value)} data-easytag="id3-react/src/components/SortBar.jsx">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
