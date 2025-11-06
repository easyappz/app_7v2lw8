import React from 'react';

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" data-easytag="id1-react/src/components/Modal.js">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} data-easytag="id2-react/src/components/Modal.js"></div>
      <div className="relative z-10 card max-w-2xl w-full p-6" data-easytag="id3-react/src/components/Modal.js">
        <div className="flex items-center justify-between" data-easytag="id4-react/src/components/Modal.js">
          <h3 className="h3" data-easytag="id5-react/src/components/Modal.js">{title}</h3>
          <button onClick={onClose} className="text-ink-500 hover:text-ink-800" data-easytag="id6-react/src/components/Modal.js">✕</button>
        </div>
        <div className="mt-4" data-easytag="id7-react/src/components/Modal.js">{children}</div>
      </div>
    </div>
  );
}
