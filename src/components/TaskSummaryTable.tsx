import React from 'react';
import { FileDown, RefreshCw } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Task } from '../types';
import { formatDate } from '../utils/dateUtils';
import { calculatePertEstimate } from '../utils/pertCalculations';

interface TaskSummaryTableProps {
  tasks: Task[];
  onRefresh?: () => void;
}

export function TaskSummaryTable({ tasks, onRefresh }: TaskSummaryTableProps) {
  if (tasks.length === 0) return null;

  const exportToExcel = () => {
    const exportData = tasks.map(task => {
      const optimistic = task.overrides?.optimistic ?? task.optimistic;
      const mostLikely = task.overrides?.mostLikely ?? task.mostLikely;
      const pessimistic = task.overrides?.pessimistic ?? task.pessimistic;
      const pert = calculatePertEstimate(optimistic, mostLikely, pessimistic);

      return {
        'Task Name': task.name,
        'Start Date': formatDate(task.startDate),
        'Optimistic (days)': optimistic,
        'Most Likely (days)': mostLikely,
        'Pessimistic (days)': pessimistic,
        'PERT Estimate (days)': Math.round(pert)
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
    XLSX.writeFile(wb, 'project_tasks.xlsx');
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Task Summary</h2>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh Durations
          </button>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <FileDown className="w-5 h-5" />
            Export to Excel
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Optimistic</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Most Likely</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pessimistic</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PERT Estimate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tasks.map((task) => {
              const optimistic = task.overrides?.optimistic ?? task.optimistic;
              const mostLikely = task.overrides?.mostLikely ?? task.mostLikely;
              const pessimistic = task.overrides?.pessimistic ?? task.pessimistic;
              const pert = calculatePertEstimate(optimistic, mostLikely, pessimistic);

              return (
                <tr key={task.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(task.startDate)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${task.overrides?.optimistic ? 'text-indigo-600 font-semibold' : 'text-emerald-600'}`}>
                    {optimistic} days
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${task.overrides?.mostLikely ? 'text-indigo-600 font-semibold' : 'text-blue-600'}`}>
                    {mostLikely} days
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${task.overrides?.pessimistic ? 'text-indigo-600 font-semibold' : 'text-amber-600'}`}>
                    {pessimistic} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                    {Math.round(pert)} days
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}