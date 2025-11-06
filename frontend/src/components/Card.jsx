import React from 'react';

const Card = ({ children, className = '', title, action }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {action && action}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
