import { Asset, Portfolio, AssetAllocation, RiskAllocation, PotAllocation } from '../types/portfolio';

export const calculatePortfolioValue = (assets: Asset[]): number => {
  return assets.reduce((total, asset) => total + asset.value, 0);
};

export const calculateAssetAllocations = (assets: Asset[]): AssetAllocation[] => {
  const totalValue = calculatePortfolioValue(assets);
  
  const typeGroups = assets.reduce((acc, asset) => {
    if (!acc[asset.type]) {
      acc[asset.type] = { value: 0, count: 0 };
    }
    acc[asset.type].value += asset.value;
    acc[asset.type].count += 1;
    return acc;
  }, {} as Record<string, { value: number; count: number }>);

  const colorMap: Record<string, string> = {
    stock: '#3B82F6',
    fund: '#059669',
    sipp: '#7C3AED',
    cash: '#D97706',
  };

  return Object.entries(typeGroups).map(([type, data]) => ({
    type: type.toUpperCase(),
    value: data.value,
    percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
    color: colorMap[type] || '#6B7280',
  }));
};

export const calculateRiskAllocations = (assets: Asset[]): RiskAllocation[] => {
  const totalValue = calculatePortfolioValue(assets);
  
  const riskGroups = assets.reduce((acc, asset) => {
    if (!acc[asset.riskProfile]) {
      acc[asset.riskProfile] = { value: 0, count: 0 };
    }
    acc[asset.riskProfile].value += asset.value;
    acc[asset.riskProfile].count += 1;
    return acc;
  }, {} as Record<string, { value: number; count: number }>);

  const colorMap: Record<string, string> = {
    'very-cautious': '#10B981',
    'moderately-cautious': '#34D399',
    'balanced': '#FBBF24',
    'moderately-adventurous': '#F59E0B',
    'adventurous': '#EF4444',
    'very-adventurous': '#DC2626',
  };

  const labelMap: Record<string, string> = {
    'very-cautious': 'Very Cautious',
    'moderately-cautious': 'Moderately Cautious',
    'balanced': 'Balanced',
    'moderately-adventurous': 'Moderately Adventurous',
    'adventurous': 'Adventurous',
    'very-adventurous': 'Very Adventurous',
  };

  return Object.entries(riskGroups).map(([riskProfile, data]) => ({
    riskProfile: labelMap[riskProfile] || riskProfile,
    value: data.value,
    percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
    color: colorMap[riskProfile] || '#6B7280',
  }));
};

export const calculatePotAllocations = (assets: Asset[]): PotAllocation[] => {
  const totalValue = calculatePortfolioValue(assets);
  
  const potGroups = assets.reduce((acc, asset) => {
    if (!acc[asset.pot]) {
      acc[asset.pot] = { value: 0, assets: [] };
    }
    acc[asset.pot].value += asset.value;
    acc[asset.pot].assets.push(asset);
    return acc;
  }, {} as Record<string, { value: number; assets: Asset[] }>);

  const colorMap: Record<string, string> = {
    'very-cautious': '#64748B',
    'moderately-cautious': '#94A3B8',
    'balanced': '#3B82F6',
    'moderately-adventurous': '#6366F1',
    'adventurous': '#8B5CF6',
    'very-adventurous': '#A855F7',
  };

  const labelMap: Record<string, string> = {
    'very-cautious': 'Very Cautious Pot',
    'moderately-cautious': 'Moderately Cautious Pot',
    'balanced': 'Balanced Pot',
    'moderately-adventurous': 'Moderately Adventurous Pot',
    'adventurous': 'Adventurous Pot',
    'very-adventurous': 'Very Adventurous Pot',
  };

  return Object.entries(potGroups).map(([pot, data]) => ({
    pot: labelMap[pot] || pot,
    value: data.value,
    percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
    color: colorMap[pot] || '#6B7280',
    assets: data.assets,
  }));
};

export const updateAssetAllocations = (assets: Asset[]): Asset[] => {
  const totalValue = calculatePortfolioValue(assets);
  
  return assets.map(asset => ({
    ...asset,
    allocation: totalValue > 0 ? (asset.value / totalValue) * 100 : 0,
  }));
};

export const createPortfolio = (assets: Asset[]): Portfolio => {
  const assetsWithAllocations = updateAssetAllocations(assets);
  
  return {
    totalValue: calculatePortfolioValue(assets),
    assets: assetsWithAllocations,
    lastUpdated: new Date(),
  };
};