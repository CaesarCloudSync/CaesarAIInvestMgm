import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { RiskAllocation } from '../types/portfolio';

ChartJS.register(ArcElement, Tooltip, Legend);

interface RiskAllocationChartProps {
  allocations: RiskAllocation[];
}

const RiskAllocationChart: React.FC<RiskAllocationChartProps> = ({ allocations }) => {
  const data = {
    labels: allocations.map(a => a.riskProfile),
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

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif',
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const allocation = allocations[context.dataIndex];
            return `${allocation.riskProfile}: £${allocation.value.toLocaleString()} (${allocation.percentage.toFixed(1)}%)`;
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Profile Allocation</h3>
      <div className="h-80">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default RiskAllocationChart;