import React, { createContext, useContext, useCallback, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const item = { id, title: toast.title || '', message: toast.message || '', type: toast.type || 'info' };
    setToasts((prev) => [...prev, item]);
    setTimeout(() => dismiss(id), toast.duration || 3000);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50" data-easytag="id1-react/src/contexts/ToastContext.js">
        {toasts.map(t => (
          <div key={t.id} className={`card px-4 py-3 w-80 border ${t.type === 'error' ? 'border-red-200' : t.type === 'success' ? 'border-emerald-200' : 'border-ink-200'}`} data-easytag="id2-react/src/contexts/ToastContext.js">
            <div className="flex items-start gap-3" data-easytag="id3-react/src/contexts/ToastContext.js">
              <div className={`mt-1 h-2 w-2 rounded-full ${t.type === 'error' ? 'bg-red-600' : t.type === 'success' ? 'bg-emerald-600' : 'bg-brand-blue'}`} data-easytag="id4-react/src/contexts/ToastContext.js"></div>
              <div className="flex-1" data-easytag="id5-react/src/contexts/ToastContext.js">
                <div className="font-medium" data-easytag="id6-react/src/contexts/ToastContext.js">{t.title}</div>
                <div className="text-sm text-ink-600" data-easytag="id7-react/src/contexts/ToastContext.js">{t.message}</div>
              </div>
              <button onClick={() => dismiss(t.id)} className="text-ink-500 hover:text-ink-700" data-easytag="id8-react/src/contexts/ToastContext.js">✕</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
