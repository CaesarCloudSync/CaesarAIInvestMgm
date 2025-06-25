import React from 'react';
import { Trash2, TrendingUp, Building2, PiggyBank, Banknote, Shield, AlertTriangle } from 'lucide-react';
import { Asset } from '../types/portfolio';

interface AssetListProps {
  assets: Asset[];
  onDeleteAsset: (id: string) => void;
}

const AssetList: React.FC<AssetListProps> = ({ assets, onDeleteAsset }) => {
  const getAssetIcon = (type: Asset['type']) => {
    switch (type) {
      case 'stock': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'fund': return <Building2 className="w-5 h-5 text-green-600" />;
      case 'sipp': return <PiggyBank className="w-5 h-5 text-purple-600" />;
      case 'cash': return <Banknote className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getAssetTypeLabel = (type: Asset['type']) => {
    switch (type) {
      case 'stock': return 'Stock';
      case 'fund': return 'Fund';
      case 'sipp': return 'SIPP';
      case 'cash': return 'Cash';
    }
  };

  const getAssetTypeBadgeColor = (type: Asset['type']) => {
    switch (type) {
      case 'stock': return 'bg-blue-100 text-blue-800';
      case 'fund': return 'bg-green-100 text-green-800';
      case 'sipp': return 'bg-purple-100 text-purple-800';
      case 'cash': return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getRiskProfileLabel = (profile: Asset['riskProfile']) => {
    switch (profile) {
      case 'very-cautious': return 'Very Cautious';
      case 'moderately-cautious': return 'Mod. Cautious';
      case 'balanced': return 'Balanced';
      case 'moderately-adventurous': return 'Mod. Adventurous';
      case 'adventurous': return 'Adventurous';
      case 'very-adventurous': return 'Very Adventurous';
    }
  };

  const getRiskProfileColor = (profile: Asset['riskProfile']) => {
    switch (profile) {
      case 'very-cautious': return 'bg-green-100 text-green-800';
      case 'moderately-cautious': return 'bg-green-50 text-green-700';
      case 'balanced': return 'bg-yellow-100 text-yellow-800';
      case 'moderately-adventurous': return 'bg-orange-100 text-orange-800';
      case 'adventurous': return 'bg-red-100 text-red-800';
      case 'very-adventurous': return 'bg-red-200 text-red-900';
    }
  };

  const getRiskIcon = (profile: Asset['riskProfile']) => {
    const riskLevel = ['very-cautious', 'moderately-cautious', 'balanced', 'moderately-adventurous', 'adventurous', 'very-adventurous'].indexOf(profile);
    if (riskLevel <= 1) return <Shield className="w-3 h-3" />;
    if (riskLevel <= 3) return <AlertTriangle className="w-3 h-3" />;
    return <AlertTriangle className="w-3 h-3" />;
  };

  const getPotLabel = (pot: Asset['pot']) => {
    switch (pot) {
      case 'very-cautious': return 'Very Cautious Pot';
      case 'moderately-cautious': return 'Mod. Cautious Pot';
      case 'balanced': return 'Balanced Pot';
      case 'moderately-adventurous': return 'Mod. Adventurous Pot';
      case 'adventurous': return 'Adventurous Pot';
      case 'very-adventurous': return 'Very Adventurous Pot';
    }
  };

  const getPotColor = (pot: Asset['pot']) => {
    switch (pot) {
      case 'very-cautious': return 'bg-slate-100 text-slate-800';
      case 'moderately-cautious': return 'bg-slate-50 text-slate-700';
      case 'balanced': return 'bg-blue-100 text-blue-800';
      case 'moderately-adventurous': return 'bg-indigo-100 text-indigo-800';
      case 'adventurous': return 'bg-purple-100 text-purple-800';
      case 'very-adventurous': return 'bg-purple-200 text-purple-900';
    }
  };

  if (assets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Building2 className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Assets Yet</h3>
        <p className="text-gray-500">Add your first asset to start tracking your portfolio.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Portfolio Assets</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {assets.map((asset) => (
          <div key={asset.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              {getAssetIcon(asset.type)}
              <div>
                <h4 className="font-medium text-gray-900">{asset.name}</h4>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAssetTypeBadgeColor(asset.type)}`}>
                    {getAssetTypeLabel(asset.type)}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskProfileColor(asset.riskProfile)}`}>
                    {getRiskIcon(asset.riskProfile)}
                    {getRiskProfileLabel(asset.riskProfile)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPotColor(asset.pot)}`}>
                    {getPotLabel(asset.pot)}
                  </span>
                  {asset.allocation && (
                    <span className="text-sm text-gray-500">
                      {asset.allocation.toFixed(1)}% of portfolio
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  £{asset.value.toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => onDeleteAsset(asset.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetList;