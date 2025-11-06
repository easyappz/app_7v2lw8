import React from 'react';

export default function FormField({ label, hint, error, children, required, id }) {
  return (
    <div className="flex flex-col gap-1" data-easytag="id1-react/src/components/FormField.jsx">
      {label && (
        <label htmlFor={id} className="text-sm text-ink-700" data-easytag="id2-react/src/components/FormField.jsx">
          {label} {required && <span aria-hidden>•</span>}
        </label>
      )}
      {children}
      {hint && <p className="muted" data-easytag="id3-react/src/components/FormField.jsx">{hint}</p>}
      {error && <p className="text-red-600 text-sm" role="alert" data-easytag="id4-react/src/components/FormField.jsx">{error}</p>}
    </div>
  );
}
