import React, { useRef } from 'react';
import { FileUp } from 'lucide-react';
import * as XLSX from 'xlsx';
import { ExcelTask, Task } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { parseExcelDate } from '../utils/dateUtils';

interface FileImportProps {
  onImport: (tasks: Task[]) => void;
}

export function FileImport({ onImport }: FileImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<ExcelTask>(worksheet);

      const tasks: Task[] = jsonData.map(row => {
        const startDate = parseExcelDate(row['Start Date']);
        return {
          id: uuidv4(),
          name: row['Task Name'],
          mostLikely: row['Duration (days)'],
          optimistic: Math.round(row['Duration (days)'] * 0.6),
          pessimistic: Math.round(row['Duration (days)'] * 1.6),
          startDate
        };
      });

      onImport(tasks);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const today = new Date();
    const ws = XLSX.utils.json_to_sheet([{
      'Task Name': 'Example Task',
      'Duration (days)': 10,
      'Start Date': today.toISOString().split('T')[0]
    }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
    XLSX.writeFile(wb, 'project_tasks_template.xlsx');
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <FileUp className="w-5 h-5" />
            Import Excel
          </button>
        </div>
        <button
          onClick={downloadTemplate}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Download Template
        </button>
      </div>
      <p className="text-sm text-gray-600">
        Upload an Excel file with columns: Task Name, Duration (days), Start Date
      </p>
    </div>
  );
}