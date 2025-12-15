import React from 'react';
import { Activity, Download, UserPlus, Rocket, RefreshCcw, HandCoins } from 'lucide-react';
import { homeData } from '../../../../data/mockStore/homeStore';

const LivePulse = () => {
   const { livePulse } = homeData;

   const getIcon = (action) => {
      switch(action) {
         case 'downloaded': return <Download size={14} />;
         case 'joined': return <UserPlus size={14} />;
         case 'launched': return <Rocket size={14} />;
         case 'synced': return <RefreshCcw size={14} />;
         case 'requested': return <HandCoins size={14} />;
         default: return <Activity size={14} />;
      }
   };

   return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden h-fit sticky top-6">
         <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
               <Activity size={18} className="text-indigo-500" /> Live Pulse
            </h3>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
         </div>
         
         <div className="divide-y divide-gray-50">
            {livePulse.map((item) => (
               <div key={item.id} className="p-4 hover:bg-gray-50 transition group cursor-default">
                  <div className="flex items-start gap-3">
                     <div className="mt-0.5 text-gray-400">
                        {getIcon(item.action)}
                     </div>
                     <div className="flex-1">
                        <div className="text-sm text-gray-900 leading-snug">
                           <span className="font-bold">{item.actor}</span> {item.action} <span className="font-medium text-gray-600">'{item.target}'</span>.
                        </div>
                        <div className="text-xs text-gray-400 mt-1 font-mono">{item.time}</div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
         
         <div className="p-3 border-t border-gray-100 bg-gray-50/30 text-center">
            <button className="text-xs uppercase font-bold text-gray-400 hover:text-black transition">View Full History</button>
         </div>
      </div>
   );
};

export default LivePulse;
