/**
 * Singapore CPF (Central Provident Fund) Contribution Calculator
 *
 * Calculates monthly CPF contributions based on age and monthly income.
 * Uses official Singapore CPF rates as of 2024.
 *
 * @see https://www.cpf.gov.sg/employer/employer-guides/paying-cpf-contributions/cpf-contribution-and-allocation-rates
 */

export interface CPFContributions {
  employeeContribution: number;
  employerContribution: number;
  totalContribution: number;
  ordinaryAccount: number;
  specialAccount: number;
  medisaveAccount: number;
  takeHomePay: number;
}

interface CPFRates {
  employee: number;
  employer: number;
  oaAllocation: number;
  saAllocation: number;
  maAllocation: number;
}

/**
 * CPF contribution rates by age group (percentage of wage)
 * Based on Singapore CPF rates for citizens/PRs (3rd year onwards)
 */
function getCPFRates(age: number): CPFRates {
  if (age <= 55) {
    return {
      employee: 0.2,
      employer: 0.17,
      oaAllocation: 0.6217,
      saAllocation: 0.1621,
      maAllocation: 0.2162,
    };
  } else if (age <= 60) {
    return {
      employee: 0.15,
      employer: 0.15,
      oaAllocation: 0.4232,
      saAllocation: 0.2006,
      maAllocation: 0.3762,
    };
  } else if (age <= 65) {
    return {
      employee: 0.095,
      employer: 0.11,
      oaAllocation: 0.1463,
      saAllocation: 0.3415,
      maAllocation: 0.5122,
    };
  } else if (age <= 70) {
    return {
      employee: 0.07,
      employer: 0.085,
      oaAllocation: 0.0607,
      saAllocation: 0.303,
      maAllocation: 0.6364,
    };
  } else {
    return {
      employee: 0.05,
      employer: 0.075,
      oaAllocation: 0.08,
      saAllocation: 0.08,
      maAllocation: 0.84,
    };
  }
}

/**
 * Ordinary Wage (OW) ceiling for CPF contributions
 * As of 2024: $6,800 per month
 */
const OW_CEILING = 6800;

/**
 * Calculate CPF contributions based on age and monthly income.
 *
 * @param age - The person's age
 * @param monthlyIncome - Gross monthly salary/income
 * @returns CPF contribution breakdown
 */
export function calculateCPFContributions(
  age: number,
  monthlyIncome: number
): CPFContributions {
  if (age < 0 || monthlyIncome < 0) {
    return {
      employeeContribution: 0,
      employerContribution: 0,
      totalContribution: 0,
      ordinaryAccount: 0,
      specialAccount: 0,
      medisaveAccount: 0,
      takeHomePay: monthlyIncome,
    };
  }

  const rates = getCPFRates(age);

  // Apply OW ceiling
  const cappedIncome = Math.min(monthlyIncome, OW_CEILING);

  // Calculate contributions
  const employeeContribution = Math.round(cappedIncome * rates.employee * 100) / 100;
  const employerContribution = Math.round(cappedIncome * rates.employer * 100) / 100;
  const totalContribution = employeeContribution + employerContribution;

  // Allocate total contribution to OA, SA, MA
  const ordinaryAccount = Math.round(totalContribution * rates.oaAllocation * 100) / 100;
  const specialAccount = Math.round(totalContribution * rates.saAllocation * 100) / 100;
  const medisaveAccount = Math.round(totalContribution * rates.maAllocation * 100) / 100;

  // Take-home pay (gross minus employee contribution)
  const takeHomePay = monthlyIncome - employeeContribution;

  return {
    employeeContribution,
    employerContribution,
    totalContribution,
    ordinaryAccount,
    specialAccount,
    medisaveAccount,
    takeHomePay,
  };
}
