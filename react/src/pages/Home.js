import React, { useEffect, useMemo, useState } from 'react';
import { fetchCategories } from '../api/categories';
import { fetchPublicListings } from '../api/listings';
import FiltersBar from '../components/FiltersBar';
import SortBar from '../components/SortBar';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';

function ListingCard({ item, onClick }) {
  const main = item.images?.find(i => i.is_main) || item.images?.[0];
  return (
    <div className="card overflow-hidden hover:shadow-soft transition" onClick={onClick} data-easytag="id1-react/src/pages/Home.js">
      <div className="aspect-video bg-ink-100" data-easytag="id2-react/src/pages/Home.js">
        {main ? (
          <img src={main.image} alt={item.title} className="w-full h-full object-cover" data-easytag="id3-react/src/pages/Home.js" />
        ) : (
          <div className="w-full h-full" data-easytag="id4-react/src/pages/Home.js"></div>
        )}
      </div>
      <div className="p-4 space-y-1" data-easytag="id5-react/src/pages/Home.js">
        <div className="font-medium truncate" data-easytag="id6-react/src/pages/Home.js">{item.title}</div>
        <div className="text-sm text-ink-600" data-easytag="id7-react/src/pages/Home.js">{item.category?.name}</div>
        <div className="flex items-center justify-between" data-easytag="id8-react/src/pages/Home.js">
          <div className="text-lg font-semibold" data-easytag="id9-react/src/pages/Home.js">{Number(item.price).toLocaleString('ru-RU')} ₽</div>
          <div className="text-xs text-ink-500" data-easytag="id10-react/src/pages/Home.js">{new Date(item.created_at).toLocaleDateString('ru-RU')}</div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [ordering, setOrdering] = useState('-created_at');
  const [filters, setFilters] = useState({ category: null, price_min: '', price_max: '', query: '' });
  const [data, setData] = useState({ count: 0, results: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const params = useMemo(() => {
    const p = { page, page_size: pageSize, ordering };
    if (filters.category) p.category = filters.category;
    if (filters.price_min !== '') p.price_min = filters.price_min;
    if (filters.price_max !== '') p.price_max = filters.price_max;
    if (filters.query) p.query = filters.query;
    return p;
  }, [page, pageSize, ordering, filters]);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchPublicListings(params)
      .then(setData)
      .catch(() => setError('Не удалось загрузить объявления'))
      .finally(() => setLoading(false));
  }, [params]);

  function onFiltersChange(partial) {
    setFilters(prev => ({ ...prev, ...partial }));
    setPage(1);
  }
  function resetFilters() {
    setFilters({ category: null, price_min: '', price_max: '', query: '' });
    setPage(1);
    setOrdering('-created_at');
  }

  return (
    <div className="container-app py-8 space-y-6" data-easytag="id11-react/src/pages/Home.js">
      <div className="flex items-end justify-between gap-4" data-easytag="id12-react/src/pages/Home.js">
        <h1 className="h2" data-easytag="id13-react/src/pages/Home.js">Каталог объявлений</h1>
        <SortBar ordering={ordering} onChange={setOrdering} />
      </div>
      <FiltersBar categories={categories} values={filters} onChange={onFiltersChange} onReset={resetFilters} />

      {loading ? (
        <div className="py-16 text-center text-ink-500" data-easytag="id14-react/src/pages/Home.js">Загрузка...</div>
      ) : error ? (
        <div className="py-16 text-center text-red-600" data-easytag="id15-react/src/pages/Home.js">{error}</div>
      ) : data.results.length === 0 ? (
        <div className="py-16 text-center text-ink-500" data-easytag="id16-react/src/pages/Home.js">Нет объявлений</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-easytag="id17-react/src/pages/Home.js">
            {data.results.map(item => (
              <div key={item.id} onClick={() => setSelected(item)} data-easytag="id18-react/src/pages/Home.js">
                <ListingCard item={item} onClick={() => setSelected(item)} />
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8" data-easytag="id19-react/src/pages/Home.js">
            <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />
          </div>
        </>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title}>
        {selected && (
          <div className="space-y-3" data-easytag="id20-react/src/pages/Home.js">
            <div className="aspect-video bg-ink-100 rounded-lg overflow-hidden" data-easytag="id21-react/src/pages/Home.js">
              {selected.images?.[0] && <img src={selected.images[0].image} alt="" className="w-full h-full object-cover" data-easytag="id22-react/src/pages/Home.js" />}
            </div>
            <div className="text-lg font-semibold" data-easytag="id23-react/src/pages/Home.js">{Number(selected.price).toLocaleString('ru-RU')} ₽</div>
            <div className="text-sm text-ink-700 whitespace-pre-line" data-easytag="id24-react/src/pages/Home.js">{selected.description}</div>
            <div className="text-sm text-ink-500" data-easytag="id25-react/src/pages/Home.js">Категория: {selected.category?.name} • {new Date(selected.created_at).toLocaleString('ru-RU')}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
