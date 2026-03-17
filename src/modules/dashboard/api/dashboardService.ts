// Dashboard Service - Mock data for analytics metrics
// Will be replaced with real API calls when backend endpoints are ready

interface MetricResult {
  value: number;
  previousValue: number;
}

function randomInRange(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

function simulateDelay(): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(resolve, 300 + Math.random() * 200),
  );
}

export async function getTotalRevenue(
  _startDate: Date,
  _endDate: Date,
  _propertyId?: string,
): Promise<MetricResult> {
  await simulateDelay();
  const value = randomInRange(120000, 280000);
  return { value, previousValue: value * randomInRange(0.85, 1.1) };
}

export async function getOccupancyRate(
  _startDate: Date,
  _endDate: Date,
  _propertyId?: string,
): Promise<MetricResult> {
  await simulateDelay();
  const value = randomInRange(0.78, 0.98);
  return { value, previousValue: value * randomInRange(0.9, 1.05) };
}

export async function getAverageRent(
  _startDate: Date,
  _endDate: Date,
  _propertyId?: string,
): Promise<MetricResult> {
  await simulateDelay();
  const value = randomInRange(1800, 3200);
  return { value, previousValue: value * randomInRange(0.9, 1.08) };
}

export async function getMaintenanceCosts(
  _startDate: Date,
  _endDate: Date,
  _propertyId?: string,
): Promise<MetricResult> {
  await simulateDelay();
  const value = randomInRange(8000, 25000);
  return { value, previousValue: value * randomInRange(0.85, 1.15) };
}

export async function getVacancyRate(
  _startDate: Date,
  _endDate: Date,
  _propertyId?: string,
): Promise<MetricResult> {
  await simulateDelay();
  const value = randomInRange(0.02, 0.22);
  return { value, previousValue: value * randomInRange(0.8, 1.2) };
}

export async function getAverageDaysToRent(
  _startDate: Date,
  _endDate: Date,
  _propertyId?: string,
): Promise<MetricResult> {
  await simulateDelay();
  const value = randomInRange(12, 45);
  return { value, previousValue: value * randomInRange(0.85, 1.15) };
}
