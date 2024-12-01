import React, { useState, useCallback } from 'react';
import { Calculator } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Task, SimulationResult, ConfidenceIntervals } from './types';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { SimulationChart } from './components/SimulationChart';
import { ConfidenceCards } from './components/ConfidenceCards';
import { DatePicker } from './components/DatePicker';
import { FileImport } from './components/FileImport';
import { TaskSummaryTable } from './components/TaskSummaryTable';
import { runMonteCarloSimulation, calculateConfidenceIntervals } from './simulation';
import { formatDate } from './utils/dateUtils';

function App() {
  const [newTask, setNewTask] = useState<Partial<Task>>({ 
    name: '', 
    mostLikely: '', 
    startDate: new Date() 
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [iterations, setIterations] = useState<string>('10000');
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [confidenceIntervals, setConfidenceIntervals] = useState<ConfidenceIntervals | null>(null);

  const handleTaskChange = (field: keyof Task, value: string | Date) => {
    setNewTask(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTask = useCallback(() => {
    if (!newTask.name || !newTask.mostLikely || !newTask.startDate) return;

    const mostLikely = Number(newTask.mostLikely);
    const task: Task = {
      id: uuidv4(),
      name: newTask.name,
      mostLikely,
      optimistic: Math.round(mostLikely * 0.6),
      pessimistic: Math.round(mostLikely * 1.6),
      startDate: newTask.startDate
    };

    setTasks(prev => [...prev, task]);
    setNewTask({ name: '', mostLikely: '', startDate: new Date() });
  }, [newTask]);

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleImportTasks = (importedTasks: Task[]) => {
    setTasks(importedTasks);
  };

  const handleRefreshTasks = useCallback(() => {
    setTasks(prev => [...prev]); // Force re-render
    if (simulationResults.length > 0) {
      handleSimulate(); // Re-run simulation with updated values
    }
  }, [tasks, simulationResults.length]);

  const handleSimulate = useCallback(() => {
    if (tasks.length === 0) return;

    const iterationCount = parseInt(iterations, 10);
    if (isNaN(iterationCount) || iterationCount <= 0) return;

    const results = runMonteCarloSimulation(tasks, iterationCount);
    setSimulationResults(results);
    
    const startDate = new Date(Math.min(...tasks.map(t => t.startDate.getTime())));
    setConfidenceIntervals(calculateConfidenceIntervals(results, startDate));
  }, [tasks, iterations]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Dow Publishing LLC's Project Duration Simulator</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Add your project tasks and their estimated durations to simulate the overall project timeline.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Import Tasks</h2>
            <FileImport onImport={handleImportTasks} />
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Manual Task Entry</h2>
            <TaskForm
              task={newTask}
              onChange={handleTaskChange}
              onAdd={handleAddTask}
            />
          </div>
          
          <div className="mt-8">
            <TaskList 
              tasks={tasks} 
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
            />
          </div>

          {tasks.length > 0 && (
            <>
              <div className="mt-8">
                <TaskSummaryTable 
                  tasks={tasks}
                  onRefresh={handleRefreshTasks}
                />
              </div>

              <div className="mt-8 flex flex-col md:flex-row items-center gap-4">
                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Simulation Count
                  </label>
                  <input
                    type="number"
                    value={iterations}
                    onChange={(e) => setIterations(e.target.value)}
                    className="w-full md:w-48 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="100"
                    step="100"
                  />
                </div>
                <button
                  onClick={handleSimulate}
                  className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Calculator className="w-5 h-5" />
                  <span>Run Simulation</span>
                </button>
              </div>
            </>
          )}
        </div>

        {simulationResults.length > 0 && confidenceIntervals && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Simulation Results</h2>
            <ConfidenceCards confidenceIntervals={confidenceIntervals} />
            <div className="mt-8">
              <SimulationChart 
                results={simulationResults}
                confidenceIntervals={confidenceIntervals}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;