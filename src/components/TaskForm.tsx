import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Task } from '../types';

interface TaskFormProps {
  task: Partial<Task>;
  onChange: (field: keyof Task, value: string | Date) => void;
  onAdd: () => void;
}

export function TaskForm({ task, onChange, onAdd }: TaskFormProps) {
  return (
    <div className="flex flex-col md:flex-row items-end gap-4">
      <div className="w-full md:w-1/3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Name
        </label>
        <input
          type="text"
          value={task.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task name"
        />
      </div>
      <div className="w-full md:w-1/4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Most Likely Duration (days)
        </label>
        <input
          type="number"
          value={task.mostLikely || ''}
          onChange={(e) => onChange('mostLikely', e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          min="1"
        />
      </div>
      <div className="w-full md:w-1/4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Date
        </label>
        <input
          type="date"
          value={task.startDate?.toISOString().split('T')[0] || ''}
          onChange={(e) => onChange('startDate', new Date(e.target.value))}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <button
        onClick={onAdd}
        disabled={!task.name || !task.mostLikely || !task.startDate}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PlusCircle className="w-5 h-5" />
        Add Task
      </button>
    </div>
  );
}