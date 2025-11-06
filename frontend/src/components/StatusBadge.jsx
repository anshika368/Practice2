import React from 'react';

const StatusBadge = ({ status, type = 'default' }) => {
  const getStatusColor = () => {
    switch (type) {
      case 'density':
        return status === 'low' 
          ? 'bg-green-100 text-green-800' 
          : status === 'moderate' 
          ? 'bg-yellow-100 text-yellow-800' 
          : 'bg-red-100 text-red-800';
      
      case 'event':
        return status === 'upcoming' 
          ? 'bg-blue-100 text-blue-800' 
          : status === 'ongoing' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800';
      
      case 'lostPerson':
        return status === 'found' 
          ? 'bg-green-100 text-green-800' 
          : status === 'searching' 
          ? 'bg-yellow-100 text-yellow-800' 
          : 'bg-red-100 text-red-800';
      
      case 'exit':
        return status === 'clear' 
          ? 'bg-green-100 text-green-800' 
          : status === 'moderate' 
          ? 'bg-yellow-100 text-yellow-800' 
          : status === 'crowded' 
          ? 'bg-red-100 text-red-800'
          : 'bg-gray-100 text-gray-800';
      
      case 'availability':
        return status === 'available' 
          ? 'bg-green-100 text-green-800' 
          : status === 'busy' 
          ? 'bg-yellow-100 text-yellow-800' 
          : 'bg-red-100 text-red-800';
      
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
