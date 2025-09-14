
import React from 'react';

interface BarChartData {
    label: string;
    value: number;
}

interface SimpleBarChartProps {
    data: BarChartData[];
    title: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);
    const chartHeight = 200;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h3>
            <div className="flex justify-around items-end h-56 space-x-2">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                        <div
                            className="w-full bg-blue-400 dark:bg-blue-600 rounded-t-md hover:bg-blue-500 dark:hover:bg-blue-500 transition-all duration-300"
                            style={{ height: `${(item.value / maxValue) * chartHeight}px` }}
                            title={`${item.label}: ${item.value}`}
                        ></div>
                        <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimpleBarChart;
