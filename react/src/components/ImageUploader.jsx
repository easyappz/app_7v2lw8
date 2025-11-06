import React, { useRef } from 'react';

export default function ImageUploader({ files, setFiles, setMainIndex }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const incoming = Array.from(e.target.files || []);
    if (incoming.length) {
      setFiles([...(files || []), ...incoming]);
    }
  };

  const removeAt = (idx) => {
    const next = [...files];
    next.splice(idx, 1);
    setFiles(next);
  };

  return (
    <div className="space-y-2" data-easytag="id1-react/src/components/ImageUploader.jsx">
      <div className="flex gap-3 flex-wrap" data-easytag="id2-react/src/components/ImageUploader.jsx">
        {(files || []).map((f, idx) => (
          <div key={idx} className="w-24 h-24 bg-ink-50 rounded-lg flex items-center justify-center relative" data-easytag="id3-react/src/components/ImageUploader.jsx">
            <span className="text-xs text-ink-500" data-easytag="id4-react/src/components/ImageUploader.jsx">{f.name || 'Изображение'}</span>
            <button type="button" onClick={() => removeAt(idx)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white text-xs" aria-label="Удалить" data-easytag="id5-react/src/components/ImageUploader.jsx">×</button>
            <label className="absolute left-1 bottom-1 flex items-center gap-1 text-[11px] bg-white/90 px-1 rounded border border-ink-200" data-easytag="id6-react/src/components/ImageUploader.jsx">
              <input type="radio" name="mainImage" onChange={() => setMainIndex(idx)} aria-label="Сделать основным" />
              <span data-easytag="id7-react/src/components/ImageUploader.jsx">Главное</span>
            </label>
          </div>
        ))}
      </div>
      <input ref={inputRef} id="uploader" type="file" accept="image/*" multiple onChange={handleChange} className="hidden" data-easytag="id8-react/src/components/ImageUploader.jsx" />
      <button type="button" onClick={() => inputRef.current?.click()} className="btn btn-outline" data-easytag="id9-react/src/components/ImageUploader.jsx">Добавить изображения</button>
    </div>
  );
}
