import React from 'react';
import { CheckSquare, AlertTriangle, Calendar, MoreHorizontal } from 'lucide-react';
import { homeData } from '../../../../data/mockStore/homeStore';

const ActionQueue = () => {
   const { actions } = homeData;

   return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
         <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
               <CheckSquare size={18} /> Action Queue
               <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{actions.length}</span>
            </h3>
            <button className="text-xs text-gray-500 hover:text-black">View All</button>
         </div>
         
         <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {actions.map((action) => (
               <div key={action.id} className="min-w-[300px] flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:shadow-md transition snap-start group relative overflow-hidden">
                  {action.priority === 'high' && <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>}
                  
                  <div className="flex justify-between items-start mb-3">
                     <div className={`p-2 rounded-lg ${
                        action.type === 'approval' ? 'bg-blue-50 text-blue-600' :
                        action.type === 'alert' ? 'bg-amber-50 text-amber-600' : 'bg-purple-50 text-purple-600'
                     }`}>
                        {action.type === 'approval' ? <CheckSquare size={16}/> : 
                         action.type === 'alert' ? <AlertTriangle size={16}/> : <Calendar size={16}/>}
                     </div>
                     <button className="text-gray-300 hover:text-gray-600"><MoreHorizontal size={16}/></button>
                  </div>
                  
                  <h4 className="font-bold text-gray-900 mb-1">{action.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2 h-8">{action.desc}</p>
                  
                  <button className="text-xs font-bold bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md hover:bg-black hover:text-white transition w-full">
                     {action.cta}
                  </button>
               </div>
            ))}
            
            {/* End Spacer */}
            <div className="min-w-[20px]"></div>
         </div>
      </div>
   );
};

export default ActionQueue;
