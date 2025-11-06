import React, { useEffect, useMemo, useState } from 'react';
import Container from '../components/Container';
import FormField from '../components/FormField';
import ImageUploader from '../components/ImageUploader';
import * as apiCategories from '../api/categories';
import * as apiMy from '../api/my';
import { useNavigate, useParams } from 'react-router-dom';

export default function AdForm({ mode = 'create' }) {
  const isEdit = mode === 'edit';
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [files, setFiles] = useState([]);
  const [mainIndex, setMainIndex] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { apiCategories.list().then(setCategories).catch(()=>{}); }, []);

  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        try {
          const data = await apiMy.getOne(id);
          setTitle(data.title || '');
          setDescription(data.description || '');
          setPrice(String(data.price ?? ''));
          setCategory(String(data.category?.id || ''));
          setLocation(data.location || '');
          setStatus(data.status || 'PENDING');
        } catch (e) {
          setError('Не удалось загрузить объявление');
        }
      })();
    }
  }, [isEdit, id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('price', price || '0');
      form.append('category', category);
      if (location) form.append('location', location);
      if (status) form.append('status', status);
      (files || []).forEach((f, idx) => form.append('images', f));
      if (mainIndex !== null && mainIndex !== undefined) {
        form.append('main_image_index', String(mainIndex));
      }

      if (isEdit) {
        await apiMy.update(id, form);
        setSuccess('Сохранено');
      } else {
        await apiMy.create(form);
        setSuccess('Создано');
        navigate('/dashboard');
        return;
      }
    } catch (e) {
      setError('Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-8" data-easytag="id1-react/src/pages/AdForm.jsx">
      <Container>
        <h1 className="h1 mb-6" data-easytag="id2-react/src/pages/AdForm.jsx">{isEdit ? 'Редактирование объявления' : 'Создание объявления'}</h1>
        <form onSubmit={onSubmit} className="grid gap-5 max-w-3xl" data-easytag="id3-react/src/pages/AdForm.jsx">
          <FormField label="Заголовок" required id="title">
            <input id="title" className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Например: iPhone 14 Pro" data-easytag="id4-react/src/pages/AdForm.jsx" />
          </FormField>
          <FormField label="Описание" required id="description">
            <textarea id="description" className="textarea min-h-32" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Подробности о товаре" data-easytag="id5-react/src/pages/AdForm.jsx" />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-easytag="id6-react/src/pages/AdForm.jsx">
            <FormField label="Цена" required id="price">
              <input id="price" className="input" value={price} onChange={e=>setPrice(e.target.value)} placeholder="0" data-easytag="id7-react/src/pages/AdForm.jsx" />
            </FormField>
            <FormField label="Категория" required id="category">
              <select id="category" className="select" value={category} onChange={e=>setCategory(e.target.value)} data-easytag="id8-react/src/pages/AdForm.jsx">
                <option value="">Выберите категорию</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </FormField>
            <FormField label="Город" id="location">
              <input id="location" className="input" value={location} onChange={e=>setLocation(e.target.value)} placeholder="Москва" data-easytag="id9-react/src/pages/AdForm.jsx" />
            </FormField>
          </div>
          <FormField label="Изображения" hint="Можно загрузить несколько. Отметьте главное." id="images">
            <ImageUploader files={files} setFiles={setFiles} setMainIndex={setMainIndex} />
          </FormField>
          <FormField label="Статус" id="status">
            <select id="status" className="select" value={status} onChange={e=>setStatus(e.target.value)} data-easytag="id10-react/src/pages/AdForm.jsx">
              <option value="DRAFT">Черновик</option>
              <option value="PENDING">На модерации</option>
            </select>
          </FormField>

          {error && <div className="text-red-600" role="alert" data-easytag="id11-react/src/pages/AdForm.jsx">{error}</div>}
          {success && <div className="text-green-600" role="status" data-easytag="id12-react/src/pages/AdForm.jsx">{success}</div>}

          <div className="flex gap-3" data-easytag="id13-react/src/pages/AdForm.jsx">
            <button className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`} disabled={loading} data-easytag="id14-react/src/pages/AdForm.jsx">{isEdit ? 'Сохранить' : 'Создать'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)} data-easytag="id15-react/src/pages/AdForm.jsx">Отмена</button>
          </div>
        </form>
      </Container>
    </section>
  );
}
