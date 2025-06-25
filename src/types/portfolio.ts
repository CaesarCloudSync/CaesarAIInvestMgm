export interface Asset {
  id: string;
  name: string;
  value: number;
  type: 'stock' | 'fund' | 'sipp' | 'cash';
  riskProfile: 'very-cautious' | 'moderately-cautious' | 'balanced' | 'moderately-adventurous' | 'adventurous' | 'very-adventurous';
  pot: 'very-cautious' | 'moderately-cautious' | 'balanced' | 'moderately-adventurous' | 'adventurous' | 'very-adventurous';
  allocation?: number;
}

export interface Portfolio {
  totalValue: number;
  assets: Asset[];
  lastUpdated: Date;
  riskProfile?: 'very-cautious' | 'moderately-cautious' | 'balanced' | 'moderately-adventurous' | 'adventurous' | 'very-adventurous';
}

export interface AssetAllocation {
  type: string;
  value: number;
  percentage: number;
  color: string;
}

export interface RiskAllocation {
  riskProfile: string;
  value: number;
  percentage: number;
  color: string;
}

export interface PotAllocation {
  pot: string;
  value: number;
  percentage: number;
  color: string;
  assets: Asset[];
}