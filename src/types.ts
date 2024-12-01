export interface Task {
  id: string;
  name: string;
  mostLikely: number;
  optimistic: number;
  pessimistic: number;
  startDate: Date;
  overrides?: {
    optimistic?: number;
    mostLikely?: number;
    pessimistic?: number;
  };
}

export interface SimulationResult {
  duration: number;
  frequency: number;
  endDate: Date;
}

export interface ConfidenceIntervals {
  p30: { days: number; date: Date };
  p70: { days: number; date: Date };
  p90: { days: number; date: Date };
}

export interface ExcelTask {
  'Task Name': string;
  'Duration (days)': number;
  'Start Date': string;
}