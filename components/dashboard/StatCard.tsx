import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  // Fix: Specify that the icon prop is a React element that accepts a className prop.
  // This resolves the TypeScript error when using React.cloneElement to add a className.
  icon: React.ReactElement<{ className?: string }>;
  colorClass: string;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, suffix }) => {
  return (
    <div className={`relative rounded-lg p-6 shadow-md overflow-hidden animate-pulse-slow ${colorClass}`}>
      <div className="absolute top-0 right-0 -mr-4 -mt-4 text-white opacity-20">
        {React.cloneElement(icon, { className: 'w-24 h-24' })}
      </div>
      <div className="relative z-10">
        <h5 className="text-sm font-semibold uppercase tracking-wider text-white">
          {title}
        </h5>
        <span className="mt-2 block text-4xl font-bold text-white">
          {value.toLocaleString()}
          {suffix && <span className="text-2xl ml-2">{suffix}</span>}
        </span>
      </div>
    </div>
  );
};

export default StatCard;