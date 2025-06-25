import { RetirementAssumptions, RetirementData } from '../types/retirement';

export const calculateRetirementTimeline = (assumptions: RetirementAssumptions): RetirementData[] => {
  const timeline: RetirementData[] = [];
  let currentNetWorth = assumptions.currentSavings;
  let currentIncome = assumptions.currentIncome;
  let currentMonthlyExpenses = assumptions.monthlyExpenses;
  let currentMonthlyHolidayBudget = assumptions.monthlyHolidayBudget;

  // Calculate timeline from current age to 90 (or 25 years past retirement)
  const endAge = Math.max(90, assumptions.retirementAge + 25);

  for (let age = assumptions.currentAge; age <= endAge; age++) {
    const isRetired = age >= assumptions.retirementAge;
    
    // Calculate income for this year
    let yearlyIncome = 0;
    if (!isRetired) {
      yearlyIncome = currentIncome;
    } else {
      // Retirement income based on replacement ratio
      const finalWorkingIncome = assumptions.currentIncome * Math.pow(1 + assumptions.annualIncomeGrowth / 100, assumptions.retirementAge - assumptions.currentAge);
      yearlyIncome = finalWorkingIncome * (assumptions.retirementIncomeReplacement / 100);
    }

    // Calculate expenses for this year (convert monthly to annual)
    const yearlyExpenses = currentMonthlyExpenses * 12;

    // Calculate holiday expenses for this year (convert monthly to annual)
    const yearlyHolidayExpenses = currentMonthlyHolidayBudget * 12;

    // Calculate savings (only while working, convert monthly to annual)
    let yearlySavings = 0;
    if (!isRetired) {
      yearlySavings = assumptions.monthlySavingsAmount * 12;
    }

    // Calculate investment returns on current net worth
    const investmentReturns = currentNetWorth * (assumptions.investmentReturn / 100);

    // Calculate net cash flow for the year
    const totalIncome = yearlyIncome + investmentReturns;
    const totalExpenses = yearlyExpenses + yearlyHolidayExpenses;
    const netCashFlow = totalIncome - totalExpenses;
    
    // Calculate carryover (what's left after expenses, before adding savings)
    const carryover = netCashFlow;

    // Update net worth: start with current net worth, add investment returns, add savings, add net cash flow
    currentNetWorth = Math.max(0, currentNetWorth + investmentReturns + yearlySavings + netCashFlow);

    timeline.push({
      age,
      income: yearlyIncome,
      expenses: yearlyExpenses,
      savings: yearlySavings,
      investmentReturns,
      holidayExpenses: yearlyHolidayExpenses,
      carryover,
      netWorth: currentNetWorth,
      retirementAge: assumptions.retirementAge,
      isRetired,
    });

    // Grow income, expenses, and holiday budget for next year
    if (!isRetired) {
      currentIncome *= (1 + assumptions.annualIncomeGrowth / 100);
    }
    currentMonthlyExpenses *= (1 + assumptions.expenseGrowthRate / 100);
    currentMonthlyHolidayBudget *= (1 + assumptions.holidayGrowthRate / 100);
  }

  return timeline;
};

export const calculateRetirementReadiness = (timeline: RetirementData[]): {
  isReady: boolean;
  shortfall: number;
  recommendedSavingsRate: number;
} => {
  const retirementData = timeline.find(d => d.age === d.retirementAge);
  const finalData = timeline[timeline.length - 1];

  if (!retirementData || !finalData) {
    return { isReady: false, shortfall: 0, recommendedSavingsRate: 0 };
  }

  const isReady = finalData.netWorth > 0;
  const shortfall = Math.max(0, -finalData.netWorth);
  
  // Calculate recommended savings rate based on shortfall
  const yearsToRetirement = retirementData.retirementAge - timeline[0].age;
  const currentIncome = timeline[0].income;
  const recommendedSavingsRate = isReady ? 0 : Math.min(50, (shortfall / (currentIncome * yearsToRetirement)) * 100);

  return {
    isReady,
    shortfall,
    recommendedSavingsRate,
  };
};