import React from 'react';

export default function SortBar({ ordering, onChange }) {
  return (
    <div className="flex items-center gap-2" data-easytag="id1-react/src/components/SortBar.js">
      <span className="text-sm text-ink-600" data-easytag="id2-react/src/components/SortBar.js">Сортировать:</span>
      <button onClick={() => onChange(ordering === '-created_at' ? 'created_at' : '-created_at')} className={`px-3 py-2 rounded-lg border ${ordering?.includes('created_at') ? 'border-ink-900 text-ink-900' : 'border-ink-200 text-ink-700 hover:bg-ink-50'}`} data-easytag="id3-react/src/components/SortBar.js">По новизне {ordering === 'created_at' ? '↑' : ordering === '-created_at' ? '↓' : ''}</button>
      <button onClick={() => onChange(ordering === '-price' ? 'price' : '-price')} className={`px-3 py-2 rounded-lg border ${ordering?.includes('price') ? 'border-ink-900 text-ink-900' : 'border-ink-200 text-ink-700 hover:bg-ink-50'}`} data-easytag="id4-react/src/components/SortBar.js">По цене {ordering === 'price' ? '↑' : ordering === '-price' ? '↓' : ''}</button>
    </div>
  );
}
