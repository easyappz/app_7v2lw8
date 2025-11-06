import React from 'react';
import { formatCurrency, formatDate } from '../utils/format';

export default function ListingCard({ item }) {
  const mainImage = (item.images || []).find(i => i.is_main) || item.images?.[0];
  return (
    <article className="card overflow-hidden hover:shadow-hover transition-shadow" data-easytag="id1-react/src/components/ListingCard.jsx">
      <div className="aspect-[4/3] bg-ink-50" data-easytag="id2-react/src/components/ListingCard.jsx" aria-label="Превью объявления">
        {/* image placeholder */}
      </div>
      <div className="p-4 space-y-2" data-easytag="id3-react/src/components/ListingCard.jsx">
        <h3 className="text-lg font-semibold line-clamp-1" data-easytag="id4-react/src/components/ListingCard.jsx">{item.title}</h3>
        <p className="text-ink-500 text-sm line-clamp-2" data-easytag="id5-react/src/components/ListingCard.jsx">{item.category?.name}</p>
        <div className="flex items-center justify-between" data-easytag="id6-react/src/components/ListingCard.jsx">
          <span className="font-semibold" data-easytag="id7-react/src/components/ListingCard.jsx">{formatCurrency(item.price)}</span>
          <span className="text-ink-400 text-sm" data-easytag="id8-react/src/components/ListingCard.jsx">{formatDate(item.created_at)}</span>
        </div>
      </div>
    </article>
  );
}
