import React, { useEffect, useState } from 'react';
import Container from '../components/Container';
import FiltersBar from '../components/FiltersBar';
import SortBar from '../components/SortBar';
import ListingCard from '../components/ListingCard';
import Pagination from '../components/Pagination';
import * as apiCategories from '../api/categories';
import * as apiListings from '../api/listings';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [ordering, setOrdering] = useState('-created_at');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    apiCategories.list().then(setCategories).catch(() => {});
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        page_size: pageSize,
        ordering,
        query: query || undefined,
        category: filters.category || undefined,
        price_min: filters.price_min || undefined,
        price_max: filters.price_max || undefined,
      };
      const data = await apiListings.publicList(params);
      setItems(data.results || []);
      setTotal(data.count || 0);
    } catch (e) {
      setError('Не удалось загрузить объявления');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, ordering]);

  const onApply = () => {
    setPage(1);
    fetchListings();
  };

  return (
    <section className="py-8" data-easytag="id1-react/src/pages/Home.jsx">
      <Container>
        <div className="mb-6" data-easytag="id2-react/src/pages/Home.jsx">
          <h1 className="h1 mb-2" data-easytag="id3-react/src/pages/Home.jsx">Доска объявлений</h1>
          <p className="muted" data-easytag="id4-react/src/pages/Home.jsx">Покупайте и продавайте легко. Минимализм и скорость.</p>
        </div>
        <div className="space-y-3" data-easytag="id5-react/src/pages/Home.jsx">
          <FiltersBar query={query} setQuery={setQuery} categories={categories} filters={filters} setFilters={setFilters} onApply={onApply} />
          <SortBar ordering={ordering} setOrdering={setOrdering} />
        </div>

        {loading && (
          <div className="mt-8 text-center" data-easytag="id6-react/src/pages/Home.jsx">Загрузка...</div>
        )}
        {error && (
          <div className="mt-8 text-red-600" role="alert" data-easytag="id7-react/src/pages/Home.jsx">{error}</div>
        )}
        {!loading && !error && items.length === 0 && (
          <div className="mt-8 text-center text-ink-500" data-easytag="id8-react/src/pages/Home.jsx">Объявления не найдены</div>
        )}

        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" data-easytag="id9-react/src/pages/Home.jsx">
          {items.map(item => (
            <ListingCard key={item.id} item={item} />
          ))}
        </div>

        <Pagination page={page} setPage={setPage} pageSize={pageSize} total={total} />
      </Container>
    </section>
  );
}
