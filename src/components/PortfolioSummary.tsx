import React from 'react';
import { TrendingUp, DollarSign, PieChart, Target } from 'lucide-react';
import { Portfolio } from '../types/portfolio';

interface PortfolioSummaryProps {
  portfolio: Portfolio;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ portfolio }) => {
  const assetCount = portfolio.assets.length;
  const avgAssetValue = assetCount > 0 ? portfolio.totalValue / assetCount : 0;
  
  const assetTypes = portfolio.assets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const diversificationScore = Object.keys(assetTypes).length;

  const summaryCards = [
    {
      title: 'Total Portfolio Value',
      value: `£${portfolio.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Assets',
      value: assetCount.toString(),
      icon: PieChart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Average Asset Value',
      value: `£${avgAssetValue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Asset Types',
      value: diversificationScore.toString(),
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {summaryCards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioSummary;