import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Asset } from '../types/portfolio';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AssetBreakdownChartProps {
  assets: Asset[];
}

const AssetBreakdownChart: React.FC<AssetBreakdownChartProps> = ({ assets }) => {
  // Generate colors for each asset
  const generateColors = (count: number) => {
    const colors = [
      '#3B82F6', '#059669', '#7C3AED', '#D97706',
      '#DC2626', '#0891B2', '#9333EA', '#CA8A04',
      '#BE123C', '#0D9488', '#7C2D12', '#1E40AF',
      '#166534', '#581C87', '#92400E', '#991B1B'
    ];
    
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length]);
    }
    return result;
  };

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const colors = generateColors(assets.length);

  const data = {
    labels: assets.map(asset => asset.name),
    datasets: [
      {
        data: assets.map(asset => asset.value),
        backgroundColor: colors,
        borderColor: colors.map(color => color),
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
                const asset = assets[i];
                const percentage = totalValue > 0 ? ((asset.value / totalValue) * 100).toFixed(1) : '0.0';
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: colors[i],
                  strokeStyle: colors[i],
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
            const asset = assets[context.dataIndex];
            const percentage = totalValue > 0 ? ((asset.value / totalValue) * 100).toFixed(1) : '0.0';
            return `${asset.name}: £${asset.value.toLocaleString()} (${percentage}%)`;
          },
          afterLabel: function(context) {
            const asset = assets[context.dataIndex];
            return `Type: ${asset.type.toUpperCase()}`;
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

  if (assets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Assets to Display</h3>
        <p className="text-gray-500">Add assets to see individual asset breakdown.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Breakdown</h3>
      <div className="h-80">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default AssetBreakdownChart;