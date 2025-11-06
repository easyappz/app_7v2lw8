import React, { useEffect, useState } from 'react';
import Container from '../components/Container';
import * as apiAdmin from '../api/admin';

export default function Admin() {
  const [tab, setTab] = useState('listings');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState([]);

  const load = async () => {
    setLoading(true); setError('');
    try {
      if (tab === 'listings') {
        const res = await apiAdmin.adminListings({ page_size: 20 });
        setData(res.results || []);
      } else if (tab === 'users') {
        const res = await apiAdmin.adminUsers({ page_size: 50 });
        setData(res.results || []);
      } else {
        // categories are public list; admin CRUD via buttons (not implemented fully here)
        setData([]);
      }
    } catch (e) {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); // eslint-disable-next-line
  }, [tab]);

  return (
    <section className="py-8" data-easytag="id1-react/src/pages/Admin.jsx">
      <Container>
        <h1 className="h1 mb-6" data-easytag="id2-react/src/pages/Admin.jsx">Админ-панель</h1>
        <div className="flex gap-2 mb-4" role="tablist" data-easytag="id3-react/src/pages/Admin.jsx">
          <button className={`btn ${tab==='listings' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('listings')} data-easytag="id4-react/src/pages/Admin.jsx">Объявления</button>
          <button className={`btn ${tab==='categories' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('categories')} data-easytag="id5-react/src/pages/Admin.jsx">Категории</button>
          <button className={`btn ${tab==='users' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('users')} data-easytag="id6-react/src/pages/Admin.jsx">Пользователи</button>
        </div>

        {loading && <div data-easytag="id7-react/src/pages/Admin.jsx">Загрузка...</div>}
        {error && <div className="text-red-600" role="alert" data-easytag="id8-react/src/pages/Admin.jsx">{error}</div>}

        {tab === 'listings' && (
          <div className="space-y-3" data-easytag="id9-react/src/pages/Admin.jsx">
            {data.length === 0 && !loading && <div className="text-ink-500" data-easytag="id10-react/src/pages/Admin.jsx">Нет объявлений</div>}
            {data.map(l => (
              <div key={l.id} className="card p-4 flex items-center justify-between" data-easytag="id11-react/src/pages/Admin.jsx">
                <div className="space-y-1" data-easytag="id12-react/src/pages/Admin.jsx">
                  <div className="font-semibold" data-easytag="id13-react/src/pages/Admin.jsx">{l.title}</div>
                  <div className="text-sm text-ink-500" data-easytag="id14-react/src/pages/Admin.jsx">{l.author?.username} · {l.category?.name}</div>
                </div>
                <div className="flex gap-2" data-easytag="id15-react/src/pages/Admin.jsx">
                  <button className="btn btn-outline" onClick={() => apiAdmin.adminListingApprove(l.id).then(load)} data-easytag="id16-react/src/pages/Admin.jsx">Одобрить</button>
                  <button className="btn btn-outline" onClick={() => { const reason = window.prompt('Причина отклонения'); if (reason) apiAdmin.adminListingReject(l.id, reason).then(load); }} data-easytag="id17-react/src/pages/Admin.jsx">Отклонить</button>
                  <button className="btn btn-outline" onClick={() => apiAdmin.adminListingToggleActive(l.id).then(load)} data-easytag="id18-react/src/pages/Admin.jsx">Активность</button>
                  <button className="btn btn-danger" onClick={() => { if (window.confirm('Удалить?')) apiAdmin.adminListingDelete(l.id).then(load); }} data-easytag="id19-react/src/pages/Admin.jsx">Удалить</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'categories' && (
          <div className="text-ink-500" data-easytag="id20-react/src/pages/Admin.jsx">Каркас категорий: добавление/редактирование/удаление будет подключено позже.</div>
        )}

        {tab === 'users' && (
          <div className="space-y-3" data-easytag="id21-react/src/pages/Admin.jsx">
            {data.length === 0 && !loading && <div className="text-ink-500" data-easytag="id22-react/src/pages/Admin.jsx">Нет пользователей</div>}
            {data.map(u => (
              <div key={u.id} className="card p-4 flex items-center justify-between" data-easytag="id23-react/src/pages/Admin.jsx">
                <div className="space-y-1" data-easytag="id24-react/src/pages/Admin.jsx">
                  <div className="font-semibold" data-easytag="id25-react/src/pages/Admin.jsx">{u.username}</div>
                  <div className="text-sm text-ink-500" data-easytag="id26-react/src/pages/Admin.jsx">{u.email || '—'}</div>
                </div>
                <div className="flex gap-2" data-easytag="id27-react/src/pages/Admin.jsx">
                  <button className="btn btn-outline" onClick={() => apiAdmin.adminUserToggleActive(u.id).then(load)} data-easytag="id28-react/src/pages/Admin.jsx">{u.is_active ? 'Деактивировать' : 'Активировать'}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
