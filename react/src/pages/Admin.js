import React, { useEffect, useState } from 'react';
import { adminApproveListing, adminDeleteListing, adminFetchListings, adminFetchUsers, adminRejectListing, adminToggleListingActive, adminToggleUserActive } from '../api/admin';
import { fetchCategories, adminCreateCategory, adminDeleteCategory, adminUpdateCategory } from '../api/categories';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';

function AdminListingsTab() {
  const [filters, setFilters] = useState({ status: '', category: '', author: '', is_active: '' });
  const [ordering, setOrdering] = useState('-created_at');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [data, setData] = useState({ count: 0, results: [] });
  const [loading, setLoading] = useState(false);
  const [rejectItem, setRejectItem] = useState(null);
  const [reason, setReason] = useState('');
  const toast = useToast();

  useEffect(() => { fetchCategories().then(setCategories).catch(() => {}); }, []);
  useEffect(() => { load(); }, [filters, ordering, page]);

  function load() {
    setLoading(true);
    const params = { page, page_size: pageSize, ordering };
    if (filters.status) params.status = filters.status;
    if (filters.category) params.category = filters.category;
    if (filters.author) params.author = filters.author;
    if (filters.is_active !== '') params.is_active = filters.is_active;
    adminFetchListings(params).then(setData).finally(() => setLoading(false));
  }

  async function approve(id) { await adminApproveListing(id); toast.push({ type: 'success', title: 'Одобрено' }); load(); }
  async function toggleActive(id) { await adminToggleListingActive(id); toast.push({ type: 'success', title: 'Статус изменён' }); load(); }
  async function remove(id) { if (!window.confirm('Удалить?')) return; await adminDeleteListing(id); toast.push({ type: 'success', title: 'Удалено' }); load(); }
  async function doReject() { if (!rejectItem) return; if (!reason.trim()) { toast.push({ type: 'error', title: 'Укажите причину' }); return; } await adminRejectListing(rejectItem.id, reason.trim()); toast.push({ type: 'success', title: 'Отклонено' }); setRejectItem(null); setReason(''); load(); }

  return (
    <div className="space-y-4" data-easytag="id1-react/src/pages/Admin.js">
      <div className="card p-4 grid grid-cols-1 md:grid-cols-5 gap-2" data-easytag="id2-react/src/pages/Admin.js">
        <select className="select" value={filters.status} onChange={(e) => { setFilters({...filters, status: e.target.value}); setPage(1); }} data-easytag="id3-react/src/pages/Admin.js">
          <option value="" data-easytag="id4-react/src/pages/Admin.js">Статус: все</option>
          <option value="DRAFT" data-easytag="id5-react/src/pages/Admin.js">DRAFT</option>
          <option value="PENDING" data-easytag="id6-react/src/pages/Admin.js">PENDING</option>
          <option value="APPROVED" data-easytag="id7-react/src/pages/Admin.js">APPROVED</option>
          <option value="REJECTED" data-easytag="id8-react/src/pages/Admin.js">REJECTED</option>
        </select>
        <select className="select" value={filters.category} onChange={(e) => { setFilters({...filters, category: e.target.value}); setPage(1); }} data-easytag="id9-react/src/pages/Admin.js">
          <option value="" data-easytag="id10-react/src/pages/Admin.js">Категория: все</option>
          {categories.map(c => <option key={c.id} value={c.id} data-easytag="id11-react/src/pages/Admin.js">{c.name}</option>)}
        </select>
        <input className="input" placeholder="ID автора" value={filters.author} onChange={(e) => { setFilters({...filters, author: e.target.value}); setPage(1); }} data-easytag="id12-react/src/pages/Admin.js" />
        <select className="select" value={filters.is_active} onChange={(e) => { setFilters({...filters, is_active: e.target.value}); setPage(1); }} data-easytag="id13-react/src/pages/Admin.js">
          <option value="" data-easytag="id14-react/src/pages/Admin.js">Активные: все</option>
          <option value="true" data-easytag="id15-react/src/pages/Admin.js">Активные</option>
          <option value="false" data-easytag="id16-react/src/pages/Admin.js">Неактивные</option>
        </select>
        <div className="flex items-center gap-2" data-easytag="id17-react/src/pages/Admin.js">
          <button className="btn btn-outline" onClick={() => setOrdering(ordering === '-created_at' ? 'created_at' : '-created_at')} data-easytag="id18-react/src/pages/Admin.js">По дате {ordering === 'created_at' ? '↑' : '↓'}</button>
          <button className="btn btn-outline" onClick={() => setOrdering(ordering === '-price' ? 'price' : '-price')} data-easytag="id19-react/src/pages/Admin.js">По цене {ordering === 'price' ? '↑' : '↓'}</button>
        </div>
      </div>

      {loading ? (
        <div className="py-6 text-center text-ink-500" data-easytag="id20-react/src/pages/Admin.js">Загрузка...</div>
      ) : (
        <div className="card overflow-x-auto" data-easytag="id21-react/src/pages/Admin.js">
          <table className="min-w-full text-sm" data-easytag="id22-react/src/pages/Admin.js">
            <thead className="bg-ink-50" data-easytag="id23-react/src/pages/Admin.js">
              <tr data-easytag="id24-react/src/pages/Admin.js">
                <th className="text-left p-3" data-easytag="id25-react/src/pages/Admin.js">ID</th>
                <th className="text-left p-3" data-easytag="id26-react/src/pages/Admin.js">Заголовок</th>
                <th className="text-left p-3" data-easytag="id27-react/src/pages/Admin.js">Автор</th>
                <th className="text-left p-3" data-easytag="id28-react/src/pages/Admin.js">Категория</th>
                <th className="text-left p-3" data-easytag="id29-react/src/pages/Admin.js">Цена</th>
                <th className="text-left p-3" data-easytag="id30-react/src/pages/Admin.js">Статус</th>
                <th className="text-left p-3" data-easytag="id31-react/src/pages/Admin.js">Активен</th>
                <th className="text-left p-3" data-easytag="id32-react/src/pages/Admin.js">Действия</th>
              </tr>
            </thead>
            <tbody data-easytag="id33-react/src/pages/Admin.js">
              {data.results.map(row => (
                <tr key={row.id} className="border-t" data-easytag="id34-react/src/pages/Admin.js">
                  <td className="p-3" data-easytag="id35-react/src/pages/Admin.js">{row.id}</td>
                  <td className="p-3" data-easytag="id36-react/src/pages/Admin.js">{row.title}</td>
                  <td className="p-3" data-easytag="id37-react/src/pages/Admin.js">{row.author?.username} (#{row.author?.id})</td>
                  <td className="p-3" data-easytag="id38-react/src/pages/Admin.js">{row.category?.name}</td>
                  <td className="p-3" data-easytag="id39-react/src/pages/Admin.js">{Number(row.price).toLocaleString('ru-RU')} ₽</td>
                  <td className="p-3" data-easytag="id40-react/src/pages/Admin.js">{row.status}</td>
                  <td className="p-3" data-easytag="id41-react/src/pages/Admin.js">{row.is_active ? 'Да' : 'Нет'}</td>
                  <td className="p-3 space-x-2" data-easytag="id42-react/src/pages/Admin.js">
                    <button className="btn btn-outline" onClick={() => approve(row.id)} data-easytag="id43-react/src/pages/Admin.js">Approve</button>
                    <button className="btn btn-outline" onClick={() => setRejectItem(row)} data-easytag="id44-react/src/pages/Admin.js">Reject</button>
                    <button className="btn btn-outline" onClick={() => toggleActive(row.id)} data-easytag="id45-react/src/pages/Admin.js">Toggle</button>
                    <button className="btn btn-danger" onClick={() => remove(row.id)} data-easytag="id46-react/src/pages/Admin.js">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-center mt-4" data-easytag="id47-react/src/pages/Admin.js">
        <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />
      </div>

      <Modal open={!!rejectItem} onClose={() => setRejectItem(null)} title="Причина отклонения">
        <textarea className="textarea w-full" value={reason} onChange={(e) => setReason(e.target.value)} rows={4} data-easytag="id48-react/src/pages/Admin.js"></textarea>
        <div className="mt-4 flex justify-end gap-2" data-easytag="id49-react/src/pages/Admin.js">
          <button className="btn btn-ghost" onClick={() => setRejectItem(null)} data-easytag="id50-react/src/pages/Admin.js">Отмена</button>
          <button className="btn btn-danger" onClick={doReject} data-easytag="id51-react/src/pages/Admin.js">Отклонить</button>
        </div>
      </Modal>
    </div>
  );
}

function AdminCategoriesTab() {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [is_active, setActive] = useState(true);
  const toast = useToast();

  function load() { fetchCategories().then(setList); }
  useEffect(() => { load(); }, []);

  async function create() {
    if (!name.trim()) return;
    await adminCreateCategory({ name, slug: name.trim().toLowerCase().replaceAll(' ', '-') , is_active });
    setName(''); setActive(true); toast.push({ type: 'success', title: 'Категория создана' }); load();
  }

  return (
    <div className="space-y-4" data-easytag="id52-react/src/pages/Admin.js">
      <div className="card p-4 flex flex-wrap gap-2" data-easytag="id53-react/src/pages/Admin.js">
        <input className="input w-64" placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} data-easytag="id54-react/src/pages/Admin.js" />
        <label className="flex items-center gap-2 text-sm" data-easytag="id55-react/src/pages/Admin.js">
          <input type="checkbox" checked={is_active} onChange={(e) => setActive(e.target.checked)} data-easytag="id56-react/src/pages/Admin.js" /> Активна
        </label>
        <button className="btn btn-primary" onClick={create} data-easytag="id57-react/src/pages/Admin.js">Создать</button>
      </div>
      <div className="card" data-easytag="id58-react/src/pages/Admin.js">
        <table className="min-w-full text-sm" data-easytag="id59-react/src/pages/Admin.js">
          <thead className="bg-ink-50" data-easytag="id60-react/src/pages/Admin.js">
            <tr data-easytag="id61-react/src/pages/Admin.js">
              <th className="text-left p-3" data-easytag="id62-react/src/pages/Admin.js">ID</th>
              <th className="text-left p-3" data-easytag="id63-react/src/pages/Admin.js">Название</th>
              <th className="text-left p-3" data-easytag="id64-react/src/pages/Admin.js">Slug</th>
              <th className="text-left p-3" data-easytag="id65-react/src/pages/Admin.js">Активна</th>
              <th className="text-left p-3" data-easytag="id66-react/src/pages/Admin.js">Действия</th>
            </tr>
          </thead>
          <tbody data-easytag="id67-react/src/pages/Admin.js">
            {list.map(row => (
              <tr key={row.id} className="border-t" data-easytag="id68-react/src/pages/Admin.js">
                <td className="p-3" data-easytag="id69-react/src/pages/Admin.js">{row.id}</td>
                <td className="p-3" data-easytag="id70-react/src/pages/Admin.js">
                  <input className="input" defaultValue={row.name} onBlur={async (e) => { await adminUpdateCategory(row.id, { name: e.target.value }); toast.push({ type: 'success', title: 'Сохранено' }); load(); }} data-easytag="id71-react/src/pages/Admin.js" />
                </td>
                <td className="p-3" data-easytag="id72-react/src/pages/Admin.js">{row.slug}</td>
                <td className="p-3" data-easytag="id73-react/src/pages/Admin.js">
                  <input type="checkbox" defaultChecked={row.is_active} onChange={async (e) => { await adminUpdateCategory(row.id, { is_active: e.target.checked }); toast.push({ type: 'success', title: 'Сохранено' }); load(); }} data-easytag="id74-react/src/pages/Admin.js" />
                </td>
                <td className="p-3" data-easytag="id75-react/src/pages/Admin.js">
                  <button className="btn btn-danger" onClick={async () => { if (!window.confirm('Удалить категорию?')) return; await adminDeleteCategory(row.id); toast.push({ type: 'success', title: 'Удалено' }); load(); }} data-easytag="id76-react/src/pages/Admin.js">Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminUsersTab() {
  const [data, setData] = useState({ count: 0, results: [] });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [is_active, setActive] = useState('');
  const toast = useToast();

  function load() {
    const params = { page, page_size: pageSize };
    if (is_active !== '') params.is_active = is_active;
    adminFetchUsers(params).then(setData);
  }
  useEffect(() => { load(); }, [page, is_active]);

  return (
    <div className="space-y-4" data-easytag="id77-react/src/pages/Admin.js">
      <div className="card p-4" data-easytag="id78-react/src/pages/Admin.js">
        <select className="select w-64" value={is_active} onChange={(e) => { setActive(e.target.value); setPage(1); }} data-easytag="id79-react/src/pages/Admin.js">
          <option value="" data-easytag="id80-react/src/pages/Admin.js">Все</option>
          <option value="true" data-easytag="id81-react/src/pages/Admin.js">Активные</option>
          <option value="false" data-easytag="id82-react/src/pages/Admin.js">Заблокированные</option>
        </select>
      </div>
      <div className="card overflow-x-auto" data-easytag="id83-react/src/pages/Admin.js">
        <table className="min-w-full text-sm" data-easytag="id84-react/src/pages/Admin.js">
          <thead className="bg-ink-50" data-easytag="id85-react/src/pages/Admin.js">
            <tr data-easytag="id86-react/src/pages/Admin.js">
              <th className="text-left p-3" data-easytag="id87-react/src/pages/Admin.js">ID</th>
              <th className="text-left p-3" data-easytag="id88-react/src/pages/Admin.js">Username</th>
              <th className="text-left p-3" data-easytag="id89-react/src/pages/Admin.js">Email</th>
              <th className="text-left p-3" data-easytag="id90-react/src/pages/Admin.js">is_staff</th>
              <th className="text-left p-3" data-easytag="id91-react/src/pages/Admin.js">is_active</th>
              <th className="text-left p-3" data-easytag="id92-react/src/pages/Admin.js">Действия</th>
            </tr>
          </thead>
          <tbody data-easytag="id93-react/src/pages/Admin.js">
            {data.results.map(u => (
              <tr key={u.id} className="border-t" data-easytag="id94-react/src/pages/Admin.js">
                <td className="p-3" data-easytag="id95-react/src/pages/Admin.js">{u.id}</td>
                <td className="p-3" data-easytag="id96-react/src/pages/Admin.js">{u.username}</td>
                <td className="p-3" data-easytag="id97-react/src/pages/Admin.js">{u.email || '-'}</td>
                <td className="p-3" data-easytag="id98-react/src/pages/Admin.js">{u.is_staff ? 'Да' : 'Нет'}</td>
                <td className="p-3" data-easytag="id99-react/src/pages/Admin.js">{u.is_active ? 'Да' : 'Нет'}</td>
                <td className="p-3" data-easytag="id100-react/src/pages/Admin.js">
                  <button className="btn btn-outline" onClick={async () => { await adminToggleUserActive(u.id); toast.push({ type: 'success', title: 'Сохранено' }); load(); }} data-easytag="id101-react/src/pages/Admin.js">Toggle Active</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center" data-easytag="id102-react/src/pages/Admin.js">
        <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />
      </div>
    </div>
  );
}

export default function Admin() {
  const [tab, setTab] = useState('listings');
  return (
    <div className="container-app py-8" data-easytag="id103-react/src/pages/Admin.js">
      <h1 className="h2 mb-4" data-easytag="id104-react/src/pages/Admin.js">Админ-панель</h1>
      <div className="flex gap-2 mb-6" data-easytag="id105-react/src/pages/Admin.js">
        <button className={`btn ${tab==='listings' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('listings')} data-easytag="id106-react/src/pages/Admin.js">Объявления</button>
        <button className={`btn ${tab==='categories' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('categories')} data-easytag="id107-react/src/pages/Admin.js">Категории</button>
        <button className={`btn ${tab==='users' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('users')} data-easytag="id108-react/src/pages/Admin.js">Пользователи</button>
      </div>
      {tab === 'listings' && <AdminListingsTab />}
      {tab === 'categories' && <AdminCategoriesTab />}
      {tab === 'users' && <AdminUsersTab />}
    </div>
  );
}
