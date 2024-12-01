import { SimulationResult, ConfidenceIntervals, Task } from './types';
import { addBusinessDays } from './utils/dateUtils';
import { 
  calculatePertEstimate, 
  calculatePertStandardDeviation, 
  generateRandomNormal 
} from './utils/pertCalculations';

function simulateTaskDuration(task: Task): number {
  const optimistic = task.overrides?.optimistic ?? task.optimistic;
  const mostLikely = task.overrides?.mostLikely ?? task.mostLikely;
  const pessimistic = task.overrides?.pessimistic ?? task.pessimistic;

  const expectedDuration = calculatePertEstimate(
    optimistic,
    mostLikely,
    pessimistic
  );
  
  const standardDev = calculatePertStandardDeviation(optimistic, pessimistic);
  const z = generateRandomNormal();
  
  // Calculate task duration with weighted standard deviation
  const taskDuration = expectedDuration + (z * standardDev);
  return Math.max(
    optimistic,
    Math.min(pessimistic, Math.round(taskDuration))
  );
}

function simulateProjectDuration(tasks: Task[]): Map<string, number> {
  const taskDurations = new Map<string, number>();
  
  tasks.forEach(task => {
    const duration = simulateTaskDuration(task);
    taskDurations.set(task.id, duration);
  });
  
  return taskDurations;
}

export function calculateConfidenceIntervals(
  results: SimulationResult[],
  startDate: Date
): ConfidenceIntervals {
  const totalFrequency = results.reduce((sum, result) => sum + result.frequency, 0);
  let cumulativeFrequency = 0;
  let p30: SimulationResult | null = null;
  let p70: SimulationResult | null = null;
  let p90: SimulationResult | null = null;

  // Sort by duration ascending - shorter durations mean higher confidence
  const sortedResults = [...results].sort((a, b) => a.duration - b.duration);

  for (const result of sortedResults) {
    cumulativeFrequency += result.frequency;
    const percentile = cumulativeFrequency / totalFrequency;

    // Reversed confidence intervals - lower durations mean higher confidence
    if (!p90 && percentile >= 0.1) p90 = result;  // 90% confidence = shortest 10% of durations
    if (!p70 && percentile >= 0.3) p70 = result;  // 70% confidence = shortest 30% of durations
    if (!p30 && percentile >= 0.7) p30 = result;  // 30% confidence = shortest 70% of durations
  }

  if (!p30 || !p70 || !p90) {
    throw new Error('Unable to calculate confidence intervals');
  }

  return {
    p30: { days: p30.duration, date: p30.endDate },
    p70: { days: p70.duration, date: p70.endDate },
    p90: { days: p90.duration, date: p90.endDate }
  };
}

export function runMonteCarloSimulation(
  tasks: Task[],
  iterations: number = 10000
): SimulationResult[] {
  const projectDurations = new Map<number, number>();
  const startDate = new Date(Math.min(...tasks.map(t => t.startDate.getTime())));
  
  // Run simulation multiple times
  for (let i = 0; i < iterations; i++) {
    const taskDurations = simulateProjectDuration(tasks);
    
    // Find the critical path (longest path) through the tasks
    const maxEndDate = Array.from(taskDurations.entries()).reduce((latestDate, [taskId, duration]) => {
      const task = tasks.find(t => t.id === taskId)!;
      const taskEndDate = addBusinessDays(task.startDate, duration);
      return taskEndDate > latestDate ? taskEndDate : latestDate;
    }, startDate);
    
    // Calculate total business days between start and end
    let businessDays = 0;
    let currentDate = new Date(startDate);
    
    while (currentDate <= maxEndDate) {
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        businessDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    projectDurations.set(businessDays, (projectDurations.get(businessDays) || 0) + 1);
  }
  
  // Convert to array and sort by duration
  return Array.from(projectDurations.entries())
    .map(([duration, frequency]) => ({
      duration,
      frequency,
      endDate: addBusinessDays(startDate, duration)
    }))
    .sort((a, b) => a.duration - b.duration);
}