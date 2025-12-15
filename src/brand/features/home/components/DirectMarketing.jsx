import React, { useState } from 'react';
import { Target } from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { homeData } from '../../../../data/mockStore/homeStore';

const DirectMarketing = () => {
   const { metrics } = homeData;
   const [activeTrendTab, setActiveTrendTab] = useState('all');

   // Dynamic Data based on active tab
   const currentKPIs = metrics.directMarketing.kpiData[activeTrendTab];
   const currentChartData = metrics.directMarketing.trendData[activeTrendTab];

   return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
         <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-2">
               {/* Updated icon to match sidebar */}
               <Target size={18} className="text-gray-500" />
               <div>
                 <h3 className="font-bold text-gray-900 leading-none">Direct Marketing</h3>
                 <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-1">Owned social post, email & sms</div>
               </div>
            </div>
            <div className="flex bg-white rounded-sm border border-gray-200 p-0.5">
               {['all', 'email', 'social'].map(tab => (
                  <button 
                     key={tab}
                     onClick={() => setActiveTrendTab(tab)}
                     className={`px-3 py-1 text-[10px] uppercase font-bold rounded transition ${
                        activeTrendTab === tab ? 'bg-black text-white shadow-xs' : 'text-gray-400 hover:text-gray-600'
                     }`}
                  >
                     {tab}
                  </button>
               ))}
            </div>
         </div>
         
         <div className="p-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Metrics (Dynamic) */}
                  <div className="col-span-1 space-y-6">
                     <div className="animate-in fade-in duration-300 transform transition-all" key={activeTrendTab + 'reach'}>
                         <div className="text-sm text-gray-500 mb-1">Total Reach</div>
                         <div className="text-4xl font-bold text-gray-900 tracking-tight">{currentKPIs.totalReach}</div>
                         <div className="text-xs text-emerald-600 font-medium mt-1">across active channels</div>
                     </div>
                     <div className="animate-in fade-in duration-300 delay-75 transform transition-all" key={activeTrendTab + 'eng'}>
                         <div className="text-sm text-gray-500 mb-1">Avg. Engagement</div>
                         <div className="text-3xl font-bold text-gray-900">{currentKPIs.avgEngagement}</div>
                     </div>
                     
                     <div className="pt-2">
                         <button className="w-full py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:text-black hover:border-black transition flex items-center justify-center gap-2">
                             + New Activity
                         </button>
                     </div>
                  </div>
                  
                  {/* Right Chart (Dynamic) */}
                  <div className="col-span-1 md:col-span-2 flex flex-col justify-end h-48 md:h-auto pl-0 md:pl-8 md:border-l border-gray-100">
                      <div className="h-full w-full min-h-[160px]">
                          <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={currentChartData || []}>
                                <defs>
                                   <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                   </linearGradient>
                                </defs>
                                <Tooltip contentStyle={{display:'none'}} cursor={{ stroke: '#e5e7eb' }} />
                                <Area type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorTrend)" animationDuration={500} />
                             </AreaChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
             </div>
         </div>
      </div>
   );
};

export default DirectMarketing;
