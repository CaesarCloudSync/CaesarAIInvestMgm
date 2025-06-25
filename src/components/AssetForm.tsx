import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Asset } from '../types/portfolio';

interface AssetFormProps {
  onAddAsset: (asset: Omit<Asset, 'id'>) => void;
  onClose: () => void;
}

const AssetForm: React.FC<AssetFormProps> = ({ onAddAsset, onClose }) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState<Asset['type']>('stock');
  const [riskProfile, setRiskProfile] = useState<Asset['riskProfile']>('balanced');
  const [pot, setPot] = useState<Asset['pot']>('balanced');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && value) {
      onAddAsset({
        name,
        value: parseFloat(value),
        type,
        riskProfile,
        pot,
      });
      setName('');
      setValue('');
      setType('stock');
      setRiskProfile('balanced');
      setPot('balanced');
      onClose();
    }
  };

  const getRiskProfileLabel = (profile: Asset['riskProfile']) => {
    switch (profile) {
      case 'very-cautious': return 'Very Cautious';
      case 'moderately-cautious': return 'Moderately Cautious';
      case 'balanced': return 'Balanced';
      case 'moderately-adventurous': return 'Moderately Adventurous';
      case 'adventurous': return 'Adventurous';
      case 'very-adventurous': return 'Very Adventurous';
    }
  };

  const getRiskDescription = (profile: Asset['riskProfile']) => {
    switch (profile) {
      case 'very-cautious': return 'Capital preservation, minimal risk';
      case 'moderately-cautious': return 'Low risk, steady growth';
      case 'balanced': return 'Moderate risk, balanced returns';
      case 'moderately-adventurous': return 'Higher risk, growth focused';
      case 'adventurous': return 'High risk, aggressive growth';
      case 'very-adventurous': return 'Very high risk, maximum growth potential';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add New Asset</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., Apple Inc. (AAPL)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value (£)
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Asset['type'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="stock">Stock</option>
                <option value="fund">Fund</option>
                <option value="sipp">SIPP</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset Risk Profile
              </label>
              <select
                value={riskProfile}
                onChange={(e) => setRiskProfile(e.target.value as Asset['riskProfile'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="very-cautious">Very Cautious</option>
                <option value="moderately-cautious">Moderately Cautious</option>
                <option value="balanced">Balanced</option>
                <option value="moderately-adventurous">Moderately Adventurous</option>
                <option value="adventurous">Adventurous</option>
                <option value="very-adventurous">Very Adventurous</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {getRiskDescription(riskProfile)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset Pot
              </label>
              <select
                value={pot}
                onChange={(e) => setPot(e.target.value as Asset['pot'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="very-cautious">Very Cautious Pot</option>
                <option value="moderately-cautious">Moderately Cautious Pot</option>
                <option value="balanced">Balanced Pot</option>
                <option value="moderately-adventurous">Moderately Adventurous Pot</option>
                <option value="adventurous">Adventurous Pot</option>
                <option value="very-adventurous">Very Adventurous Pot</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Group assets by risk tolerance for better portfolio management
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Asset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssetForm;