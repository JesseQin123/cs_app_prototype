import React, { useState } from 'react';
import { Plus, Search, Filter, ChevronDown } from 'lucide-react';
import { taskData } from '../../../data/mockStore/taskStore';
import TaskList from './tasks/TaskList';
import TaskReview from './tasks/TaskReview';
import CreateTaskModal from './tasks/components/CreateTaskModal';

const TasksManager = ({ notify }) => {
  const [tasks, setTasks] = useState(taskData.tasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('Active'); // All, Active, Ended
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreate = (newTask) => {
    setTasks([newTask, ...tasks]);
    notify('Task created successfully', 'success');
    setIsCreateModalOpen(false);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    if (selectedTask && selectedTask.id === updatedTask.id) {
        setSelectedTask(updatedTask);
    }
  };

  if (selectedTask) {
      return (
          <TaskReview 
            task={selectedTask} 
            onBack={() => setSelectedTask(null)}
            onUpdateTask={handleUpdateTask}
            notify={notify}
          />
      );
  }

  const filteredTasks = tasks.filter(t => {
      // Status Filter
      if (statusFilter !== 'All') {
          if (t.status !== statusFilter) return false;
      }
      // Search Filter
      if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      }
      return true;
  });

  const FilterPill = ({ label, active, onClick }) => (
      <button 
          onClick={onClick}
          className={`px-4 py-2 text-sm font-bold rounded-full transition border ${active ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
      >
          {label}
      </button>
  );

  return (
    <div className="h-full flex flex-col px-8 py-6 w-full animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Retailer Tasks</h1>
          <p className="text-gray-500 text-sm">Track task completion and approve retailer submissions.</p>
        </div>
        <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition shadow-xs"
        >
            <Plus size={18} /> Create Task
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black/5 focus:border-black w-72 transition outline-hidden shadow-xs"
                  />
              </div>

               <div className="w-px h-8 bg-gray-200"></div>

              {/* Status Filters */}
              <div className="flex items-center gap-2">
                   {['Active', 'Ended', 'All'].map(s => (
                       <FilterPill key={s} label={s} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
                   ))}
              </div>
          </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto -mx-8 px-8 pb-12">
          {filteredTasks.length > 0 ? (
              <TaskList 
                tasks={filteredTasks} 
                onSelect={setSelectedTask} 
              />
          ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <Filter size={32} className="mb-3 opacity-20"/>
                  <span className="text-sm font-medium">No tasks found matching your filters.</span>
              </div>
          )}
      </div>

      {/* Create Modal */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default TasksManager;
