import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { homeData } from '../../../../data/mockStore/homeStore';

const Launchpad = () => {
   const { setupProgress } = homeData;
   const [isExpanded, setIsExpanded] = useState(true);
   
   if (!setupProgress) return null;

   // Helper to render styled subtext based on task ID
   const renderSubtext = (task) => {
      if (task.id === 1) { // Brand Identity
         return <span className="font-bold text-gray-900 tracking-wide">{task.subtitle}</span>;
      }
      if (task.id === 2) { // Domain
         return <span className="font-mono text-xs text-gray-600 bg-gray-50 px-1 py-0.5 rounded-sm">{task.subtitle}</span>;
      }
      if (task.id === 3) { // Network
         return <span><strong className="text-gray-900">120</strong> Retailers joined</span>;
      }
      return <span className="text-gray-500">{task.subtitle}</span>;
   };

   return (
      <div className="border border-gray-100 rounded-xl bg-white shadow-xs overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-500 transition-all">
         {/* Minimalist Header */}
         <div className={`px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${isExpanded ? 'border-b border-gray-100' : ''}`}>
            <div className="flex items-start justify-between w-full md:w-auto gap-4">
               <div>
                  <h2 className="text-lg font-bold text-gray-900">Get Started</h2>
                  <div className="text-sm text-gray-500 mt-1">
                     Complete these steps to unlock full network potential.
                  </div>
               </div>
               
               {/* Mobile Toggle (Visible on small screens) */}
               <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="md:hidden text-gray-400 hover:text-gray-600"
               >
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
               </button>
            </div>
            
            {/* Slim Elegant Progress + Toggle */}
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="flex-1 h-[6px] bg-gray-100 rounded-full overflow-hidden">
                     <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                           width: `${setupProgress.percentage}%`,
                           backgroundColor: '#b5984d' 
                        }}
                     ></div>
                  </div>
                  <span className="text-xs font-bold text-gray-500 whitespace-nowrap">
                     <span className="text-gray-900">{setupProgress.currentStep}/{setupProgress.totalSteps}</span>
                  </span>
               </div>

               {/* Desktop Toggle */}
               <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden md:flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition"
               >
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
               </button>
            </div>
         </div>

         {/* 4-Column Grid (Collapsible) */}
         {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 animate-in fade-in slide-in-from-top-1 duration-300">
               {setupProgress.tasks.map((task) => {
                  const isDone = task.status === 'done';

                  return (
                     <div key={task.id} className="p-6 flex flex-col h-full hover:bg-gray-50/30 transition-colors">
                        {/* Icon & Status */}
                        <div className="mb-4">
                           {isDone ? (
                              <div className="text-emerald-500">
                                 <CheckCircle2 size={22} className="fill-emerald-50" />
                              </div>
                           ) : (
                              <div className="h-[22px] w-[22px] rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                 <Plus size={12} />
                              </div>
                           )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 mb-6">
                           <h3 className={`font-bold text-sm mb-1 ${isDone ? 'text-gray-700' : 'text-gray-900'}`}>
                              {task.title}
                           </h3>
                           <div className="text-xs text-gray-500">
                              {renderSubtext(task)}
                           </div>
                        </div>
                        
                        {/* Action */}
                        <div>
                           {isDone ? (
                              <button className="text-xs font-medium text-gray-400 hover:text-gray-600 transition underline decoration-gray-300 underline-offset-2">
                                 {task.actionLabel}
                              </button>
                           ) : (
                              <button className="w-full py-2 bg-black text-white text-xs font-bold rounded-sm shadow-xs hover:bg-gray-800 transition flex items-center justify-center gap-2">
                                 {task.actionLabel} <ArrowRight size={12} />
                              </button>
                           )}
                        </div>
                     </div>
                  );
               })}
            </div>
         )}
      </div>
   );
};

export default Launchpad;
