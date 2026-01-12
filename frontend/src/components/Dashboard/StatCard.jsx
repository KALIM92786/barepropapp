import React from 'react';

const StatCard = ({ title, value, prefix = '', suffix = '', highlight = false }) => {
  // Format number to 2 decimal places if it's a number
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
    : value;

  return (
    <div className={`p-4 rounded-lg shadow-md border border-slate-700 ${highlight ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
      <h3 className={`text-xs font-bold uppercase tracking-wider ${highlight ? 'text-blue-100' : 'text-slate-400'}`}>
        {title}
      </h3>
      <div className="mt-1 text-2xl font-bold">
        {prefix}{formattedValue}{suffix}
      </div>
    </div>
  );
};

export default StatCard;