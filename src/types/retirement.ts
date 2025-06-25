export interface RetirementAssumptions {
  currentAge: number;
  retirementAge: number;
  currentIncome: number;
  annualIncomeGrowth: number;
  monthlyExpenses: number;
  expenseGrowthRate: number;
  currentSavings: number;
  monthlySavingsAmount: number;
  investmentReturn: number;
  monthlyHolidayBudget: number;
  holidayGrowthRate: number;
  inflationRate: number;
  retirementIncomeReplacement: number;
  riskProfile: 'very-cautious' | 'moderately-cautious' | 'balanced' | 'moderately-adventurous' | 'adventurous' | 'very-adventurous';
}

export interface RetirementData {
  age: number;
  income: number;
  expenses: number;
  savings: number;
  investmentReturns: number;
  holidayExpenses: number;
  carryover: number;
  netWorth: number;
  retirementAge: number;
  isRetired: boolean;
}