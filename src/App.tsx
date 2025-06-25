import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, Calculator } from 'lucide-react';
import { Asset } from './types/portfolio';
import { RetirementAssumptions, RetirementData } from './types/retirement';
import AssetForm from './components/AssetForm';
import AssetList from './components/AssetList';
import AllocationChart from './components/AllocationChart';
import AssetBreakdownChart from './components/AssetBreakdownChart';
import RiskAllocationChart from './components/RiskAllocationChart';
import PotAllocationChart from './components/PotAllocationChart';
import PortfolioSummary from './components/PortfolioSummary';
import RetirementTimelineChart from './components/RetirementTimelineChart';
import RetirementPlanningForm from './components/RetirementPlanningForm';
import { createPortfolio, calculateAssetAllocations, calculateRiskAllocations, calculatePotAllocations } from './utils/portfolioCalculations';
import { calculateRetirementTimeline } from './utils/retirementCalculations';

function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRetirementForm, setShowRetirementForm] = useState(false);
  const [retirementData, setRetirementData] = useState<RetirementData[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedAssets = localStorage.getItem('portfolio-assets');
    if (savedAssets) {
      setAssets(JSON.parse(savedAssets));
    }

    const savedRetirementData = localStorage.getItem('retirement-data');
    if (savedRetirementData) {
      setRetirementData(JSON.parse(savedRetirementData));
    }
  }, []);

  // Save data to localStorage whenever assets change
  useEffect(() => {
    localStorage.setItem('portfolio-assets', JSON.stringify(assets));
  }, [assets]);

  // Save retirement data to localStorage
  useEffect(() => {
    localStorage.setItem('retirement-data', JSON.stringify(retirementData));
  }, [retirementData]);

  const handleAddAsset = (newAsset: Omit<Asset, 'id'>) => {
    const asset: Asset = {
      ...newAsset,
      id: Date.now().toString(),
    };
    setAssets(prev => [...prev, asset]);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const handleRetirementCalculation = (assumptions: RetirementAssumptions) => {
    const timeline = calculateRetirementTimeline(assumptions);
    setRetirementData(timeline);
  };

  const portfolio = createPortfolio(assets);
  const allocations = calculateAssetAllocations(assets);
  const riskAllocations = calculateRiskAllocations(assets);
  const potAllocations = calculatePotAllocations(assets);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Financial Planning Tracker</h1>
                <p className="text-sm text-gray-500">Portfolio & retirement planning with risk profiling</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRetirementForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
              >
                <Calculator className="w-4 h-4" />
                Plan Retirement
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Asset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Summary */}
        <PortfolioSummary portfolio={portfolio} />

        {/* Retirement Timeline Chart */}
        {retirementData.length > 0 && (
          <div className="mb-8">
            <RetirementTimelineChart retirementData={retirementData} />
          </div>
        )}

        {/* Charts and Asset List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AssetList 
              assets={portfolio.assets} 
              onDeleteAsset={handleDeleteAsset} 
            />
          </div>
          
          <div className="lg:col-span-1 space-y-8">
            {/* Inline Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Asset Type Allocation Chart */}
              {allocations.length > 0 ? (
                <AllocationChart allocations={allocations} />
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <BarChart3 className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Data to Display</h3>
                  <p className="text-gray-500">Add assets to see your allocation chart.</p>
                </div>
              )}

              {/* Risk Profile Allocation Chart */}
              {riskAllocations.length > 0 ? (
                <RiskAllocationChart allocations={riskAllocations} />
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <BarChart3 className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Risk Data</h3>
                  <p className="text-gray-500">Add assets to see risk allocation.</p>
                </div>
              )}
            </div>

            {/* Individual Asset Breakdown Chart */}
            <AssetBreakdownChart assets={portfolio.assets} />
          </div>
        </div>

        {/* Asset Pot Allocation Chart */}
        {potAllocations.length > 0 && (
          <div className="mt-8">
            <PotAllocationChart allocations={potAllocations} />
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      {showAddForm && (
        <AssetForm 
          onAddAsset={handleAddAsset}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* Retirement Planning Modal */}
      {showRetirementForm && (
        <RetirementPlanningForm
          onCalculate={handleRetirementCalculation}
          onClose={() => setShowRetirementForm(false)}
        />
      )}
    </div>
  );
}

export default App;