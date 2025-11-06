import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCategories } from '../api/categories';
import { createMyListing, retrieveMyListing, updateMyListing } from '../api/listings';
import { useToast } from '../contexts/ToastContext';

export default function AdForm({ mode }) {
  const isEdit = mode === 'edit';
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
  });
  const [existingImages, setExistingImages] = useState([]); // {id, image, is_main}
  const [removeIds, setRemoveIds] = useState([]);
  const [setMainId, setSetMainId] = useState(null);
  const [files, setFiles] = useState([]); // File[]
  const [mainIndex, setMainIndex] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      retrieveMyListing(id)
        .then(data => {
          setForm({
            title: data.title || '',
            description: data.description || '',
            price: String(data.price ?? ''),
            category: data.category?.id || '',
            location: data.location || '',
          });
          setExistingImages(data.images || []);
          const mainExisting = (data.images || []).find(i => i.is_main);
          setSetMainId(mainExisting?.id || null);
        })
        .finally(() => setLoading(false));
    }
  }, [isEdit, id]);

  const previews = useMemo(() => files.map(f => URL.createObjectURL(f)), [files]);

  function onSelectFiles(e) {
    const f = Array.from(e.target.files || []);
    setFiles(f);
    setMainIndex(null);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.title || !form.description || !form.price || !form.category) {
      setError('Заполните обязательные поля');
      return;
    }
    if (Number(form.price) < 0) {
      setError('Цена не может быть отрицательной');
      return;
    }
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('price', form.price);
    fd.append('category', form.category);
    fd.append('location', form.location);

    files.forEach((file) => fd.append('images', file));
    if (mainIndex !== null && mainIndex !== undefined) {
      fd.append('main_image_index', String(mainIndex));
    }

    if (isEdit) {
      if (removeIds.length) fd.append('remove_image_ids', removeIds.join(','));
      if (setMainId) fd.append('set_main_image_id', String(setMainId));
    }

    try {
      setLoading(true);
      if (isEdit) {
        await updateMyListing(id, fd);
        toast.push({ type: 'success', title: 'Объявление обновлено', message: 'Изменения отправлены на модерацию (статус PENDING)' });
      } else {
        await createMyListing(fd);
        toast.push({ type: 'success', title: 'Объявление создано' });
      }
      navigate('/dashboard');
    } catch (e) {
      const msg = e?.response?.data?.detail || 'Ошибка сохранения';
      setError(msg);
      toast.push({ type: 'error', title: 'Ошибка', message: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-app py-8" data-easytag="id1-react/src/pages/AdForm.js">
      <h1 className="h2 mb-6" data-easytag="id2-react/src/pages/AdForm.js">{isEdit ? 'Редактирование объявления' : 'Новое объявление'}</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6" data-easytag="id3-react/src/pages/AdForm.js">
        <div className="md:col-span-2 space-y-4" data-easytag="id4-react/src/pages/AdForm.js">
          <div data-easytag="id5-react/src/pages/AdForm.js">
            <label className="block text-sm mb-1" data-easytag="id6-react/src/pages/AdForm.js">Заголовок</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required data-easytag="id7-react/src/pages/AdForm.js" />
          </div>
          <div data-easytag="id8-react/src/pages/AdForm.js">
            <label className="block text-sm mb-1" data-easytag="id9-react/src/pages/AdForm.js">Описание</label>
            <textarea className="textarea min-h-40" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required data-easytag="id10-react/src/pages/AdForm.js"></textarea>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" data-easytag="id11-react/src/pages/AdForm.js">
            <div data-easytag="id12-react/src/pages/AdForm.js">
              <label className="block text-sm mb-1" data-easytag="id13-react/src/pages/AdForm.js">Цена</label>
              <input type="number" min="0" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required data-easytag="id14-react/src/pages/AdForm.js" />
            </div>
            <div data-easytag="id15-react/src/pages/AdForm.js">
              <label className="block text-sm mb-1" data-easytag="id16-react/src/pages/AdForm.js">Категория</label>
              <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required data-easytag="id17-react/src/pages/AdForm.js">
                <option value="" data-easytag="id18-react/src/pages/AdForm.js">Выберите</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id} data-easytag="id19-react/src/pages/AdForm.js">{c.name}</option>
                ))}
              </select>
            </div>
            <div data-easytag="id20-react/src/pages/AdForm.js">
              <label className="block text-sm mb-1" data-easytag="id21-react/src/pages/AdForm.js">Локация</label>
              <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} data-easytag="id22-react/src/pages/AdForm.js" />
            </div>
          </div>

          <div data-easytag="id23-react/src/pages/AdForm.js">
            <label className="block text-sm mb-2" data-easytag="id24-react/src/pages/AdForm.js">Изображения</label>
            <input type="file" accept="image/*" multiple onChange={onSelectFiles} data-easytag="id25-react/src/pages/AdForm.js" />
            {files.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3" data-easytag="id26-react/src/pages/AdForm.js">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative" data-easytag="id27-react/src/pages/AdForm.js">
                    <img src={src} alt="preview" className="w-full h-28 object-cover rounded-lg" data-easytag="id28-react/src/pages/AdForm.js" />
                    <label className="absolute top-1 left-1 bg-white rounded px-2 py-1 text-xs" data-easytag="id29-react/src/pages/AdForm.js">
                      <input type="radio" name="mainNew" checked={mainIndex === idx} onChange={() => setMainIndex(idx)} data-easytag="id30-react/src/pages/AdForm.js" /> Главная
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4" data-easytag="id31-react/src/pages/AdForm.js">
          {isEdit && (
            <div className="card p-4" data-easytag="id32-react/src/pages/AdForm.js">
              <div className="font-medium mb-2" data-easytag="id33-react/src/pages/AdForm.js">Текущие изображения</div>
              <div className="space-y-2" data-easytag="id34-react/src/pages/AdForm.js">
                {existingImages.length === 0 ? (
                  <div className="text-sm text-ink-500" data-easytag="id35-react/src/pages/AdForm.js">Нет изображений</div>
                ) : existingImages.map(img => (
                  <div key={img.id} className="flex items-center gap-3" data-easytag="id36-react/src/pages/AdForm.js">
                    <img src={img.image} alt="" className="w-16 h-12 object-cover rounded" data-easytag="id37-react/src/pages/AdForm.js" />
                    <label className="text-sm flex items-center gap-1" data-easytag="id38-react/src/pages/AdForm.js">
                      <input type="checkbox" checked={removeIds.includes(img.id)} onChange={(e) => setRemoveIds(prev => e.target.checked ? [...prev, img.id] : prev.filter(x => x !== img.id))} data-easytag="id39-react/src/pages/AdForm.js" /> Удалить
                    </label>
                    <label className="text-sm flex items-center gap-1" data-easytag="id40-react/src/pages/AdForm.js">
                      <input type="radio" name="mainExisting" checked={setMainId === img.id} onChange={() => setSetMainId(img.id)} data-easytag="id41-react/src/pages/AdForm.js" /> Главная
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-ink-600" data-easytag="id42-react/src/pages/AdForm.js">После изменения объявление отправится на модерацию (статус PENDING).</div>
            </div>
          )}
          {error && <div className="text-sm text-red-600" data-easytag="id43-react/src/pages/AdForm.js">{error}</div>}
          <button type="submit" className="btn btn-primary w-full" disabled={loading} data-easytag="id44-react/src/pages/AdForm.js">{loading ? 'Сохранение...' : (isEdit ? 'Сохранить' : 'Создать')}</button>
        </aside>
      </form>
    </div>
  );
}
