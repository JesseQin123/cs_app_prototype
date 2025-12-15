import React from 'react';
import { Calendar, Users, CheckCircle2, AlertCircle, ChevronRight, Clock } from 'lucide-react';

const TaskList = ({ tasks, onSelect }) => {
  if (tasks.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <div className="p-4 bg-white rounded-full shadow-xs mb-4">
                  <CheckCircle2 size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
              <p className="text-gray-500 text-sm mt-1">Create a new task to get started.</p>
          </div>
      );
  }

  return (
    <div className="grid gap-4">
      {tasks.map(task => {
        const isOverdue = new Date(task.deadline) < new Date() && task.status === 'Active';
        
        return (
          <div 
            key={task.id}
            onClick={() => onSelect(task)}
            className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-start gap-4">
                {/* Status Indicator */}
                <div className={`mt-1.5 w-2 shrink-0 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>

                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-brand-gold transition">{task.title}</h3>
                        {task.priority === 'High' && (
                            <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded-sm border border-red-100">Urgent</span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1 mb-3 max-w-xl">{task.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm">
                        <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                            <Calendar size={14} />
                            <span>Due {task.deadline}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                            <Users size={14} />
                            <span>{task.audience} ({task.audienceCount})</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-10">
                {/* Stats */}
                <div className="flex flex-col items-end min-w-[120px]">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-2xl font-bold text-gray-900">{task.completionRate}%</span>
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Completion</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${task.completionRate >= 80 ? 'bg-emerald-500' : task.completionRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${task.completionRate}%` }}></div>
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                        Pending Review: <span className="text-gray-900 font-medium">3</span>
                    </div>
                </div>

                <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-600 transition" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
