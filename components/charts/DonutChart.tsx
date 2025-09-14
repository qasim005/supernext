import React from 'react';
import { DeviceDistribution } from '../../types';

interface DonutChartProps {
  data: DeviceDistribution[];
  title: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, title }) => {
  const size = 150;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h3>
      <div className="relative w-[150px] h-[150px]">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {data.map((item, index) => {
            const percent = (item.value / 100) * circumference;
            const offset = circumference - accumulatedPercent;
            accumulatedPercent += percent;
            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${percent} ${circumference - percent}`}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
      </div>
      <div className="mt-4 w-full flex flex-col items-center space-y-2">
        {data.map(item => (
          <div key={item.name} className="flex items-center justify-between w-4/5">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
            </div>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.value.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
