import React, { useState, useEffect, useRef } from 'react';
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
import axios from 'axios';
import useDeviceDetect from './hooks/useDeviceDetect';

function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRetirementForm, setShowRetirementForm] = useState(false);
  const [retirementData, setRetirementData] = useState<RetirementData[]>([]);
  const { isMobile } = useDeviceDetect();
  const [riskProfile, setRiskProfile] = useState('');
  const [savedRiskProfile, setSavedRiskProfile] = useState<string | null>(null);
  const [isEditingRiskProfile, setIsEditingRiskProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Define risk profile options with initial years and labels
  const [riskProfileOptions, setRiskProfileOptions] = useState([
    { profile: 'Cautious', label: 'Cautious', years: '3-5 Years' },
    { profile: 'Balanced', label: 'BALANCED', years: '5-10 Years' },
    { profile: 'Moderately Adventurous', label: 'Moderately Adventurous', years: '11-15 Years' },
    { profile: 'Adventurous', label: 'Adventurous', years: '15-20 Years' },
    { profile: 'Very Adventurous', label: 'Very Adventurous', years: '20+ Years' },
  ]);

  // Update years and labels dynamically based on selected risk profile
  useEffect(() => {
    if (riskProfile) {
      setRiskProfileOptions((prevOptions) =>
        prevOptions.map((option) => {
          // Store the base label without any suffix
          const baseLabel = option.label.replace(' - In Cash', '');
          // Determine the years based on the selected risk profile
          let years: string;
          if (option.profile === riskProfile) {
            years = '5-10 Years'; // Selected profile always gets 5-10 Years
          } else {
            switch (riskProfile) {
              case 'Cautious':
                years =
                  option.profile === 'Balanced' ? '11-15 Years' :
                  option.profile === 'Moderately Adventurous' ? '16-20 Years' :
                  option.profile === 'Adventurous' ? '21-25 Years' :
                  option.profile === 'Very Adventurous' ? '25+ Years' :
                  '5-10 Years'; // Should not reach here for Cautious
                break;
              case 'Balanced':
                years =
                  option.profile === 'Cautious' ? '3-5 Years' :
                  option.profile === 'Moderately Adventurous' ? '11-15 Years' :
                  option.profile === 'Adventurous' ? '16-20 Years' :
                  option.profile === 'Very Adventurous' ? '20+ Years' :
                  '5-10 Years'; // Should not reach here for Balanced
                break;
              case 'Moderately Adventurous':
                years =
                  option.profile === 'Cautious' ? '1-2 Years' :
                  option.profile === 'Balanced' ? '3-5 Years' :
                  option.profile === 'Adventurous' ? '11-15 Years' :
                  option.profile === 'Very Adventurous' ? '16-20 Years' :
                  '5-10 Years'; // Should not reach here for Moderately Adventurous
                break;
              case 'Adventurous':
                years =
                  option.profile === 'Cautious' ? '0 Years' :
                  option.profile === 'Balanced' ? '1-2 Years' :
                  option.profile === 'Moderately Adventurous' ? '3-5 Years' :
                  option.profile === 'Very Adventurous' ? '11-15 Years' :
                  '5-10 Years'; // Should not reach here for Adventurous
                break;
              case 'Very Adventurous':
                years =
                  option.profile === 'Cautious' ? '0 Years' :
                  option.profile === 'Balanced' ? '0-1 Years' :
                  option.profile === 'Moderately Adventurous' ? '1-2 Years' :
                  option.profile === 'Adventurous' ? '3-5 Years' :
                  '5-10 Years'; // Should not reach here for Very Adventurous
                break;
              default:
                years = option.years;
            }
          }
          // Append "- In Cash" to the label if years is 2 years or below
          const cashYears = ['0 Years', '0-1 Years', '1-2 Years'];
          const label = cashYears.includes(years) ? `${baseLabel} - In Cash` : baseLabel;
          return { ...option, years, label };
        })
      );
    }
  }, [riskProfile]);

  const get_assets = async () => {
    try {
      const response = await axios.get('https://caesaraiinvestmgm-qqbn26mgpa-uc.a.run.app/api/get-assets');
      const result = response.data;
      console.log('Assets fetched successfully:', result);
      if (result.assets.length > 0) {
        setAssets(result.assets);
      }
    } catch (err) {
      console.error('Error fetching assets:', err);
    }
  };

  const get_risk_profile = async () => {
    try {
      const response = await axios.get('https://caesaraiinvestmgm-qqbn26mgpa-uc.a.run.app/api/get-risk-profile');
      const result = response.data;
      console.log('Get Risk Profile:', result);
      if ('riskProfile' in result && result.riskProfile) {
        setSavedRiskProfile(result.riskProfile);
        setRiskProfile(result.riskProfile);
        setIsEditingRiskProfile(false);
      }
    } catch (err) {
      console.error('Error fetching risk profile:', err);
      setError('Failed to load risk profile');
    }
  };

  const save_risk_profile = async () => {
    if (!riskProfile) {
      setError('Please select a risk profile');
      return;
    }
    try {
      const response = await axios.post('https://caesaraiinvestmgm-qqbn26mgpa-uc.a.run.app/api/save-risk-profile', { riskProfile });
      const result = response.data;
      console.log('Risk profile saved successfully:', result);
      setSavedRiskProfile(riskProfile);
      setIsEditingRiskProfile(false);
      setError(null);
    } catch (err) {
      console.error('Error saving risk profile:', err);
      setError('Failed to save risk profile');
    }
  };

  useEffect(() => {
    get_assets();
    get_risk_profile();
    const savedRetirementData = localStorage.getItem('retirement-data');
    if (savedRetirementData) {
      console.log('Loading retirement data from localStorage:', savedRetirementData);
      setRetirementData(JSON.parse(savedRetirementData));
    }
  }, []);

  useEffect(() => {
    if (assets.length > 0) {
      save_assets();
    }
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('retirement-data', JSON.stringify(retirementData));
  }, [retirementData]);

  const save_assets = async () => {
    try {
      const response = await axios.post('https://caesaraiinvestmgm-qqbn26mgpa-uc.a.run.app/api/save-assets', { assets });
      const result = response.data;
      console.log('Assets saved successfully:', result);
    } catch (err) {
      console.error('Error saving assets:', err);
    }
  };

  const handleAddAsset = (newAsset: Omit<Asset, 'id'>) => {
    const asset: Asset = {
      ...newAsset,
      id: Date.now().toString(),
    };
    setAssets(prev => [...prev, asset]);
  };

  const handleDeleteAsset = async (id: string) => {
    try {
      const response = await axios.delete(`https://caesaraiinvestmgm-qqbn26mgpa-uc.a.run.app/api/delete-asset?id=${id}`);
      const result = response.data;
      console.log('Asset deleted successfully:', result);
      setAssets(prev => prev.filter(asset => asset.id !== id));
    } catch (err) {
      console.error('Error deleting asset:', err);
    }
  };

  const handleRetirementCalculation = (assumptions: RetirementAssumptions) => {
    const timeline = calculateRetirementTimeline(assumptions);
    setRetirementData(timeline);
  };

  const handleEditRiskProfile = () => {
    setIsEditingRiskProfile(true);
  };

  const handleRiskProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    save_risk_profile();
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
        {/* Risk Profile Section */}
        <div className="mb-8">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {savedRiskProfile && !isEditingRiskProfile ? (
            <div className="flex items-center gap-4">
              <p className="text-lg font-medium text-gray-900">
                Risk Profile: <span className="font-normal">{savedRiskProfile}</span>
              </p>
              <button
                onClick={handleEditRiskProfile}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
            </div>
          ) : (
            <form onSubmit={handleRiskProfileSubmit} className="flex items-center gap-4">
              <select
                value={riskProfile}
                onChange={(e) => setRiskProfile(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ height: '40px', backgroundColor: 'transparent' }}
              >
                <option value="" disabled>Select Risk Profile</option>
                {riskProfileOptions.map((option) => (
                  <option key={option.profile} value={option.profile}>
                    {option.profile}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Save
              </button>
            </form>
          )}
          {/* Risk Profile List (No Scrollbar) */}
          <div 
            ref={carouselRef}
            className="mt-4 w-full max-w-md"
          >
            {riskProfileOptions.map((item, index) => (
              <div
                key={index}
                className={`mb-2 p-4 bg-gray-200 rounded-lg shadow-md flex justify-between items-center
                  ${item.profile === riskProfile ? 'border-2 border-red-500' : 'border-2 border-transparent'}`}
                style={{ height: '50px' }}
              >
                <span className="text-lg font-medium">{item.label}</span>
                <span className="text-sm text-gray-600">{item.years}</span>
              </div>
            ))}
          </div>
        </div>

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
          <div className="lg:col-span-4">
            <AssetList 
              assets={portfolio.assets} 
              onDeleteAsset={handleDeleteAsset} 
            />
          </div>
        </div>
        <div className={isMobile ? "lg:col-span-1 space-y-8" : "flex flex-row space-x-20 lg:col-span-1 mt-8"}>
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

          {/* Individual Asset Breakdown Chart */}
          <AssetBreakdownChart assets={portfolio.assets} />
        </div>

        {/* Asset Pot Allocation Chart */}
        {potAllocations.length > 0 && (
          <div className="mt-8">
            <PotAllocationChart allocations={potAllocations} />
          </div>
        )}

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
    </div>
  )
}
export default App;