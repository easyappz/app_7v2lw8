import React, { useEffect, useState } from 'react';
import Container from '../components/Container';
import { Link, useNavigate } from 'react-router-dom';
import * as apiMy from '../api/my';
import { formatCurrency, formatDate } from '../utils/format';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiMy.list({ page_size: 100 });
      setItems(data.results || []);
    } catch (e) {
      setError('Не удалось загрузить ваши объявления');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!window.confirm('Удалить объявление?')) return;
    try {
      await apiMy.remove(id);
      await load();
    } catch (e) {
      alert('Ошибка удаления');
    }
  };

  return (
    <section className="py-8" data-easytag="id1-react/src/pages/Dashboard.jsx">
      <Container>
        <div className="flex items-center justify-between mb-6" data-easytag="id2-react/src/pages/Dashboard.jsx">
          <h1 className="h1" data-easytag="id3-react/src/pages/Dashboard.jsx">Мои объявления</h1>
          <Link to="/ad/new" className="btn btn-primary" data-easytag="id4-react/src/pages/Dashboard.jsx">+ Создать</Link>
        </div>

        {loading && <div data-easytag="id5-react/src/pages/Dashboard.jsx">Загрузка...</div>}
        {error && <div className="text-red-600" role="alert" data-easytag="id6-react/src/pages/Dashboard.jsx">{error}</div>}
        {!loading && items.length === 0 && <div className="text-ink-500" data-easytag="id7-react/src/pages/Dashboard.jsx">У вас пока нет объявлений</div>}

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2" data-easytag="id8-react/src/pages/Dashboard.jsx">
          {items.map(it => (
            <div key={it.id} className="card p-4" data-easytag="id9-react/src/pages/Dashboard.jsx">
              <div className="flex items-start justify-between" data-easytag="id10-react/src/pages/Dashboard.jsx">
                <div className="space-y-1" data-easytag="id11-react/src/pages/Dashboard.jsx">
                  <div className="font-semibold" data-easytag="id12-react/src/pages/Dashboard.jsx">{it.title}</div>
                  <div className="text-sm text-ink-500" data-easytag="id13-react/src/pages/Dashboard.jsx">{formatCurrency(it.price)} · {it.category?.name}</div>
                  <div className="text-sm text-ink-400" data-easytag="id14-react/src/pages/Dashboard.jsx">{formatDate(it.created_at)}</div>
                  <div className="text-xs" data-easytag="id15-react/src/pages/Dashboard.jsx">Статус: <span className="font-medium">{it.status}</span> {it.rejected_reason ? `(Причина: ${it.rejected_reason})` : ''}</div>
                </div>
                <div className="flex gap-2" data-easytag="id16-react/src/pages/Dashboard.jsx">
                  <button className="btn btn-outline" onClick={() => navigate(`/ad/${it.id}/edit`)} data-easytag="id17-react/src/pages/Dashboard.jsx">Редактировать</button>
                  <button className="btn btn-danger" onClick={() => onDelete(it.id)} data-easytag="id18-react/src/pages/Dashboard.jsx">Удалить</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
