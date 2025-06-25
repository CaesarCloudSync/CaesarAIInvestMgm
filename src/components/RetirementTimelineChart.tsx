import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { RetirementData } from '../types/retirement';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RetirementTimelineChartProps {
  retirementData: RetirementData[];
}

const RetirementTimelineChart: React.FC<RetirementTimelineChartProps> = ({ retirementData }) => {
  // Filter data to show every 2-3 years for better readability
  const filteredData = retirementData.filter((_, index) => index % 2 === 0);

  const data = {
    labels: filteredData.map(d => d.age.toString()),
    datasets: [
      {
        label: 'Income',
        data: filteredData.map(d => d.income),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: filteredData.map(d => -d.expenses),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
      {
        label: 'Savings',
        data: filteredData.map(d => d.savings),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Investment Returns',
        data: filteredData.map(d => d.investmentReturns),
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 1,
      },
      {
        label: 'Holiday Expenses',
        data: filteredData.map(d => -d.holidayExpenses),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif',
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Retirement Planning Timeline - Cash Flows by Age',
        font: {
          size: 16,
          weight: 'bold',
          family: 'Inter, system-ui, sans-serif',
        },
        padding: 20,
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            const dataIndex = context[0].dataIndex;
            const data = filteredData[dataIndex];
            return `Age ${data.age} (${data.isRetired ? 'Retired' : 'Working'})`;
          },
          afterBody: function(context) {
            const dataIndex = context[0].dataIndex;
            const data = filteredData[dataIndex];
            const netCashFlow = data.income + data.investmentReturns - data.expenses - data.holidayExpenses;
            return [
              '',
              `Net Cash Flow: £${netCashFlow.toLocaleString()}`,
              `Net Worth: £${data.netWorth.toLocaleString()}`,
              `Carryover: £${data.carryover.toLocaleString()}`,
            ];
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Age',
          font: {
            size: 14,
            weight: 'bold',
            family: 'Inter, system-ui, sans-serif',
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount (£)',
          font: {
            size: 14,
            weight: 'bold',
            family: 'Inter, system-ui, sans-serif',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            const numValue = Number(value);
            if (numValue >= 0) {
              return '£' + numValue.toLocaleString();
            } else {
              return '-£' + Math.abs(numValue).toLocaleString();
            }
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Retirement Timeline</h3>
            <p className="text-sm text-gray-500">Financial projections over time</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Final Net Worth</div>
            <div className="text-lg font-semibold text-gray-900">
              £{retirementData[retirementData.length - 1]?.netWorth.toLocaleString() || '0'}
            </div>
          </div>
        </div>
      </div>
      <div className="h-96">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default RetirementTimelineChart;