import React from 'react';
import { BandwidthPoint } from '../../types';

interface LiveLineChartProps {
  data: BandwidthPoint[];
  title: string;
}

const LiveLineChart: React.FC<LiveLineChartProps> = ({ data, title }) => {
  const width = 500;
  const height = 200;
  const padding = 40;

  const maxDownload = Math.max(...data.map(p => p.download), 0) || 30;
  
  const getX = (index: number) => (width - padding * 2) / (data.length - 1 || 1) * index + padding;
  const getY = (value: number) => height - padding - ((value / maxDownload) * (height - padding * 2));

  const downloadPath = data.map((point, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(point.download)}`).join(' ');
  const uploadPath = data.map((point, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(point.upload)}`).join(' ');

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h3>
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Y-Axis lines and labels */}
          {[0, 0.25, 0.5, 0.75, 1].map(tick => (
            <g key={tick} className="text-gray-400 dark:text-gray-500">
              <line 
                x1={padding} y1={getY(tick * maxDownload)} 
                x2={width - padding} y2={getY(tick * maxDownload)} 
                stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" 
              />
              <text x={padding - 10} y={getY(tick * maxDownload) + 4} textAnchor="end" fontSize="10" fill="currentColor">
                {(tick * maxDownload).toFixed(0)}
              </text>
            </g>
          ))}
          <text x="10" y={height/2} transform={`rotate(-90, 10, ${height/2})`} textAnchor="middle" fontSize="10" className="fill-current text-gray-500">Mbps</text>

          {/* Data Lines */}
          {data.length > 1 && (
            <>
              <path d={downloadPath} fill="none" stroke="#3B82F6" strokeWidth="2" />
              <path d={uploadPath} fill="none" stroke="#10B981" strokeWidth="2" />
            </>
          )}
        </svg>
      </div>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Download</span>
        </div>
        <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Upload</span>
        </div>
      </div>
    </div>
  );
};

export default LiveLineChart;
