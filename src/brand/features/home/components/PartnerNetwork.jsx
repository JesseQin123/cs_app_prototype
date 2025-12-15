import React, { useState } from 'react';
import { Users, AlertCircle } from 'lucide-react';
import { homeData } from '../../../../data/mockStore/homeStore';
import { attentionData } from '../../../../data/mockStore/attentionStore';
import PartnerAttentionDrawer from '../../../components/PartnerAttentionDrawer';

const PartnerNetwork = () => {
   const { metrics } = homeData;
   // Use data from attention store for the counter if available, else fallback
   const attentionCount = attentionData.needsAttentionCount || metrics.partner.needsAttentionCount;
   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

   return (
      <>
         <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
               <div className="flex items-center gap-2">
                  <Users size={18} className="text-gray-500" />
                  <div>
                    <h3 className="font-bold text-gray-900 leading-none">Partner Network</h3>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-1">B2B distribution & adoption</div>
                  </div>
               </div>
               <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition">View Hub</button>
            </div>
            
            <div className="p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                   {/* Metrics */}
                   <div className="space-y-6">
                       {/* Metrics Row */}
                       <div className="grid grid-cols-3 divide-x divide-gray-100">
                           {/* 1. Active Retailers */}
                           <div className="pr-4">
                               <div className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-tight">Active Retailers</div>
                               <div className="text-2xl font-bold text-gray-900 leading-none">
                                   {metrics.partner.activeRetailers}
                                   <span className="text-gray-300 text-sm font-medium ml-0.5">/{metrics.partner.totalRetailers}</span>
                               </div>
                           </div>

                           {/* 2. Adoption Rate */}
                           <div className="px-4">
                               <div className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-tight">Adoption</div>
                               <div className="text-2xl font-bold text-gray-900 leading-none">{metrics.partner.adoptionRate}%</div>
                               <div className="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center gap-0.5">
                                   <span className="bg-emerald-100 rounded-full p-0.5">
                                       <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
                                   </span>
                                   2.4%
                               </div>
                           </div>

                           {/* 3. Needs Attention */}
                           <div className="pl-4">
                               <div className="text-xs text-amber-600 font-bold mb-1 uppercase tracking-tight flex items-center gap-1.5">
                                   <AlertCircle size={12} /> Attention
                               </div>
                               <div className="flex items-end justify-between">
                                   <div className="text-2xl font-bold text-gray-900 leading-none">{attentionCount}</div>
                                   <button 
                                       onClick={() => setIsDrawerOpen(true)}
                                       className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold rounded-sm hover:bg-amber-100 transition"
                                   >
                                       Review
                                   </button>
                               </div>
                           </div>
                       </div>
                       
                       <div className="pt-4 border-t border-gray-100">
                            <button className="w-full py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:text-black hover:border-black transition flex items-center justify-center gap-2">
                                + New Partner Campaign
                            </button>
                       </div>
                   </div>

                   {/* Heatmap Micro-visual (Vertical Stack) */}
                   <div className="space-y-3 pl-0 md:pl-8 md:border-l border-gray-100 flex flex-col justify-center">
                      {metrics.partner.regions.map((region, idx) => (
                         <div key={idx} className="flex items-center gap-3 text-xs">
                            <span className="w-24 text-gray-500 font-medium truncate">{region.name}</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                               <div 
                                  className={`h-full rounded-full ${
                                     region.status === 'good' ? 'bg-emerald-500' : 
                                     region.status === 'warning' ? 'bg-amber-400' : 'bg-gray-400'
                                  }`} 
                                  style={{ width: `${region.value}%` }}
                               ></div>
                            </div>
                            <span className="w-8 text-right font-bold text-gray-700">{region.value}%</span>
                         </div>
                      ))}
                   </div>
               </div>
            </div>
         </div>

         {/* Needs Attention Drawer */}
         <PartnerAttentionDrawer 
            isOpen={isDrawerOpen} 
            onClose={() => setIsDrawerOpen(false)} 
         />
      </>
   );
};

export default PartnerNetwork;
