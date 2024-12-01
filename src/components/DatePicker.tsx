import React from 'react';

interface DatePickerProps {
  startDate: Date;
  onChange: (date: Date) => void;
}

export function DatePicker({ startDate, onChange }: DatePickerProps) {
  return (
    <div className="w-full md:w-auto">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Project Start Date
      </label>
      <input
        type="date"
        value={startDate.toISOString().split('T')[0]}
        onChange={(e) => onChange(new Date(e.target.value))}
        className="w-full md:w-48 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        min={new Date().toISOString().split('T')[0]}
      />
    </div>
  );
}