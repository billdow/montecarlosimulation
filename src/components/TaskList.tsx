import React, { useState } from 'react';
import { Trash2, Edit2, Save, X } from 'lucide-react';
import { Task } from '../types';
import { formatDate } from '../utils/dateUtils';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onUpdate: (task: Task) => void;
}

interface EditableTask {
  id: string;
  field: 'optimistic' | 'mostLikely' | 'pessimistic';
  value: string;
}

export function TaskList({ tasks, onDelete, onUpdate }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<EditableTask | null>(null);

  if (tasks.length === 0) {
    return null;
  }

  const handleEdit = (task: Task, field: 'optimistic' | 'mostLikely' | 'pessimistic') => {
    const value = task.overrides?.[field]?.toString() || task[field].toString();
    setEditingTask({ id: task.id, field, value });
  };

  const handleSave = (task: Task) => {
    if (!editingTask) return;

    const value = parseInt(editingTask.value, 10);
    if (isNaN(value) || value < 0) {
      setEditingTask(null);
      return;
    }

    const updatedTask: Task = {
      ...task,
      overrides: {
        ...task.overrides,
        [editingTask.field]: value
      }
    };

    onUpdate(updatedTask);
    setEditingTask(null);
  };

  const handleCancel = () => {
    setEditingTask(null);
  };

  const renderDurationField = (task: Task, field: 'optimistic' | 'mostLikely' | 'pessimistic', label: string) => {
    const isEditing = editingTask?.id === task.id && editingTask?.field === field;
    const value = task.overrides?.[field] ?? task[field];
    const isOverridden = task.overrides?.[field] !== undefined;

    if (isEditing) {
      return (
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={editingTask.value}
            onChange={(e) => setEditingTask({ ...editingTask, value: e.target.value })}
            className="w-16 px-1 py-0.5 text-sm border rounded"
            min="0"
          />
          <button
            onClick={() => handleSave(task)}
            className="text-emerald-500 hover:text-emerald-600"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="text-red-500 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <p className={`text-sm ${isOverridden ? 'font-semibold text-indigo-600' : ''}`}>
          {label}: {value} days
        </p>
        <button
          onClick={() => handleEdit(task, field)}
          className="text-gray-400 hover:text-gray-600"
        >
          <Edit2 className="w-3 h-3" />
        </button>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-800">{task.name}</h3>
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {renderDurationField(task, 'optimistic', 'Optimistic')}
            {renderDurationField(task, 'mostLikely', 'Most Likely')}
            {renderDurationField(task, 'pessimistic', 'Pessimistic')}
            <p className="text-sm text-purple-600">Start Date: {formatDate(task.startDate)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}