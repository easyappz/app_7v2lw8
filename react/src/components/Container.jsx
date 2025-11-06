import React from 'react';

export default function Container({ children, className = '' }) {
  return (
    <div className={`container-app ${className}`} data-easytag="id1-react/src/components/Container.jsx">
      {children}
    </div>
  );
}
