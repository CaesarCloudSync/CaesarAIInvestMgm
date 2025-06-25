import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { PotAllocation } from '../types/portfolio';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PotAllocationChartProps {
  allocations: PotAllocation[];
}

const PotAllocationChart: React.FC<PotAllocationChartProps> = ({ allocations }) => {
  const data = {
    labels: allocations.map(a => a.pot),
    datasets: [
      {
        data: allocations.map(a => a.value),
        backgroundColor: allocations.map(a => a.color),
        borderColor: allocations.map(a => a.color),
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 16,
          usePointStyle: true,
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif',
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels && data.datasets.length) {
              return data.labels.map((label, i) => {
                const allocation = allocations[i];
                return {
                  text: `${label} (${allocation.percentage.toFixed(1)}%)`,
                  fillStyle: allocation.color,
                  strokeStyle: allocation.color,
                  lineWidth: 2,
                  hidden: false,
                  index: i,
                  pointStyle: 'circle'
                };
              });
            }
            return [];
          }
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const allocation = allocations[context.dataIndex];
            return `${allocation.pot}: £${allocation.value.toLocaleString()} (${allocation.percentage.toFixed(1)}%)`;
          },
          afterLabel: function(context) {
            const allocation = allocations[context.dataIndex];
            return `Assets: ${allocation.assets.length}`;
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    cutout: '50%',
  };

  if (allocations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Asset Pots</h3>
        <p className="text-gray-500">Add assets to different pots to see allocation breakdown.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Pot Allocation</h3>
      <div className="h-80">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default PotAllocationChart;