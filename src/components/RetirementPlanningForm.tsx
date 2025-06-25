import React, { useState } from 'react';
import { Calculator, X, Shield, AlertTriangle } from 'lucide-react';
import { RetirementAssumptions } from '../types/retirement';

interface RetirementPlanningFormProps {
  onCalculate: (assumptions: RetirementAssumptions) => void;
  onClose: () => void;
}

const RetirementPlanningForm: React.FC<RetirementPlanningFormProps> = ({ onCalculate, onClose }) => {
  const [assumptions, setAssumptions] = useState<RetirementAssumptions>({
    currentAge: 30,
    retirementAge: 65,
    currentIncome: 50000,
    annualIncomeGrowth: 3,
    monthlyExpenses: 2900,
    expenseGrowthRate: 2.5,
    currentSavings: 10000,
    monthlySavingsAmount: 625,
    investmentReturn: 7,
    monthlyHolidayBudget: 415,
    holidayGrowthRate: 2,
    inflationRate: 2.5,
    retirementIncomeReplacement: 70,
    riskProfile: 'balanced',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(assumptions);
    onClose();
  };

  const handleChange = (field: keyof RetirementAssumptions, value: number | string) => {
    setAssumptions(prev => ({ ...prev, [field]: value }));
  };

  const getRiskProfileDescription = (profile: RetirementAssumptions['riskProfile']) => {
    switch (profile) {
      case 'very-cautious': return 'Capital preservation focus, 3-4% expected returns';
      case 'moderately-cautious': return 'Low risk approach, 4-5% expected returns';
      case 'balanced': return 'Moderate risk/reward balance, 6-7% expected returns';
      case 'moderately-adventurous': return 'Growth focused approach, 7-8% expected returns';
      case 'adventurous': return 'High growth potential, 8-9% expected returns';
      case 'very-adventurous': return 'Maximum growth focus, 9-10% expected returns';
    }
  };

  const getRiskIcon = (profile: RetirementAssumptions['riskProfile']) => {
    const riskLevel = ['very-cautious', 'moderately-cautious', 'balanced', 'moderately-adventurous', 'adventurous', 'very-adventurous'].indexOf(profile);
    if (riskLevel <= 1) return <Shield className="w-4 h-4 text-green-600" />;
    if (riskLevel <= 3) return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  // Auto-adjust investment return based on risk profile
  React.useEffect(() => {
    const riskReturnMap = {
      'very-cautious': 3.5,
      'moderately-cautious': 4.5,
      'balanced': 6.5,
      'moderately-adventurous': 7.5,
      'adventurous': 8.5,
      'very-adventurous': 9.5,
    };
    
    setAssumptions(prev => ({
      ...prev,
      investmentReturn: riskReturnMap[prev.riskProfile]
    }));
  }, [assumptions.riskProfile]);

  // Calculate annual equivalents for display
  const annualExpenses = assumptions.monthlyExpenses * 12;
  const annualSavings = assumptions.monthlySavingsAmount * 12;
  const annualHolidayBudget = assumptions.monthlyHolidayBudget * 12;
  const savingsRate = assumptions.currentIncome > 0 ? (annualSavings / assumptions.currentIncome) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Retirement Planning Assumptions</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Age
                  </label>
                  <input
                    type="number"
                    value={assumptions.currentAge}
                    onChange={(e) => handleChange('currentAge', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="18"
                    max="100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retirement Age
                  </label>
                  <input
                    type="number"
                    value={assumptions.retirementAge}
                    onChange={(e) => handleChange('retirementAge', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="50"
                    max="100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risk Profile
                  </label>
                  <select
                    value={assumptions.riskProfile}
                    onChange={(e) => handleChange('riskProfile', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="very-cautious">Very Cautious</option>
                    <option value="moderately-cautious">Moderately Cautious</option>
                    <option value="balanced">Balanced</option>
                    <option value="moderately-adventurous">Moderately Adventurous</option>
                    <option value="adventurous">Adventurous</option>
                    <option value="very-adventurous">Very Adventurous</option>
                  </select>
                  <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50 rounded-lg">
                    {getRiskIcon(assumptions.riskProfile)}
                    <p className="text-xs text-gray-600">
                      {getRiskProfileDescription(assumptions.riskProfile)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Income & Growth */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Income & Growth</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Annual Income (£)
                  </label>
                  <input
                    type="number"
                    value={assumptions.currentIncome}
                    onChange={(e) => handleChange('currentIncome', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Income Growth (%)
                  </label>
                  <input
                    type="number"
                    value={assumptions.annualIncomeGrowth}
                    onChange={(e) => handleChange('annualIncomeGrowth', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="20"
                    step="0.1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retirement Income Replacement (%)
                  </label>
                  <input
                    type="number"
                    value={assumptions.retirementIncomeReplacement}
                    onChange={(e) => handleChange('retirementIncomeReplacement', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="100"
                    step="5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inflation Rate (%)
                  </label>
                  <input
                    type="number"
                    value={assumptions.inflationRate}
                    onChange={(e) => handleChange('inflationRate', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="20"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              {/* Monthly Expenses */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Monthly Expenses</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Living Expenses (£)
                  </label>
                  <input
                    type="number"
                    value={assumptions.monthlyExpenses}
                    onChange={(e) => handleChange('monthlyExpenses', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="50"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Annual equivalent: £{annualExpenses.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expense Growth Rate (%)
                  </label>
                  <input
                    type="number"
                    value={assumptions.expenseGrowthRate}
                    onChange={(e) => handleChange('expenseGrowthRate', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="20"
                    step="0.1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Holiday Budget (£)
                  </label>
                  <input
                    type="number"
                    value={assumptions.monthlyHolidayBudget}
                    onChange={(e) => handleChange('monthlyHolidayBudget', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="25"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Annual holiday budget: £{annualHolidayBudget.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Holiday Budget Growth (%)
                  </label>
                  <input
                    type="number"
                    value={assumptions.holidayGrowthRate}
                    onChange={(e) => handleChange('holidayGrowthRate', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="20"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              {/* Monthly Savings & Investments */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Savings & Investments</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Savings (£)
                  </label>
                  <input
                    type="number"
                    value={assumptions.currentSavings}
                    onChange={(e) => handleChange('currentSavings', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Savings Amount (£)
                  </label>
                  <input
                    type="number"
                    value={assumptions.monthlySavingsAmount}
                    onChange={(e) => handleChange('monthlySavingsAmount', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="50"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Annual savings: £{annualSavings.toLocaleString()} ({savingsRate.toFixed(1)}% of income)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Investment Return (%)
                  </label>
                  <input
                    type="number"
                    value={assumptions.investmentReturn}
                    onChange={(e) => handleChange('investmentReturn', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    min="0"
                    max="20"
                    step="0.1"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-adjusted based on risk profile
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t">
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
                <Calculator className="w-4 h-4" />
                Calculate Timeline
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RetirementPlanningForm;