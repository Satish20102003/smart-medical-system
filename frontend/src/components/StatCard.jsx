import React from 'react';

const StatCard = ({ title, value, icon, color, subtext }) => {
  // We assign the lowercase 'icon' prop to a Capitalized variable 'Icon'
  // This tells React "Treat this as a Component"
  const Icon = icon;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-dark">{value}</h3>
          {subtext && <p className="text-xs text-gray-400 mt-2">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color} text-white shadow-lg`}>
          {/* Now we render it safely */}
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;