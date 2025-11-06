import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyListings, deleteMyListing } from '../api/listings';
import Pagination from '../components/Pagination';
import { useToast } from '../contexts/ToastContext';

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [data, setData] = useState({ count: 0, results: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    fetchMyListings({ page, page_size: pageSize })
      .then(setData)
      .finally(() => setLoading(false));
  }, [page, pageSize]);

  async function onDelete(id) {
    if (!window.confirm('Удалить объявление?')) return;
    try {
      await deleteMyListing(id);
      toast.push({ type: 'success', title: 'Удалено' });
      setData((prev) => ({ ...prev, results: prev.results.filter(x => x.id !== id), count: prev.count - 1 }));
    } catch (e) {
      toast.push({ type: 'error', title: 'Ошибка удаления' });
    }
  }

  return (
    <div className="container-app py-8" data-easytag="id1-react/src/pages/Dashboard.js">
      <div className="flex items-center justify-between mb-6" data-easytag="id2-react/src/pages/Dashboard.js">
        <h1 className="h2" data-easytag="id3-react/src/pages/Dashboard.js">Мои объявления</h1>
        <button className="btn btn-primary" onClick={() => navigate('/ad/new')} data-easytag="id4-react/src/pages/Dashboard.js">Создать объявление</button>
      </div>
      {loading ? (
        <div className="py-10 text-center text-ink-500" data-easytag="id5-react/src/pages/Dashboard.js">Загрузка...</div>
      ) : data.results.length === 0 ? (
        <div className="py-10 text-center text-ink-500" data-easytag="id6-react/src/pages/Dashboard.js">У вас пока нет объявлений</div>
      ) : (
        <div className="space-y-3" data-easytag="id7-react/src/pages/Dashboard.js">
          {data.results.map(item => (
            <div key={item.id} className="card p-4 flex items-center justify-between" data-easytag="id8-react/src/pages/Dashboard.js">
              <div className="flex items-center gap-4" data-easytag="id9-react/src/pages/Dashboard.js">
                <div className="w-24 h-16 bg-ink-100 rounded-lg overflow-hidden" data-easytag="id10-react/src/pages/Dashboard.js">
                  {item.images?.[0] && <img src={item.images[0].image} alt="" className="w-full h-full object-cover" data-easytag="id11-react/src/pages/Dashboard.js" />}
                </div>
                <div data-easytag="id12-react/src/pages/Dashboard.js">
                  <div className="font-medium" data-easytag="id13-react/src/pages/Dashboard.js">{item.title}</div>
                  <div className="text-sm text-ink-600" data-easytag="id14-react/src/pages/Dashboard.js">{Number(item.price).toLocaleString('ru-RU')} ₽ • {new Date(item.created_at).toLocaleDateString('ru-RU')} • {item.status}</div>
                </div>
              </div>
              <div className="flex items-center gap-2" data-easytag="id15-react/src/pages/Dashboard.js">
                <button className="btn btn-outline" onClick={() => navigate(`/ad/${item.id}/edit`)} data-easytag="id16-react/src/pages/Dashboard.js">Редактировать</button>
                <button className="btn btn-danger" onClick={() => onDelete(item.id)} data-easytag="id17-react/src/pages/Dashboard.js">Удалить</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center mt-6" data-easytag="id18-react/src/pages/Dashboard.js">
        <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />
      </div>
    </div>
  );
}
