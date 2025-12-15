import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowRightLeft, Wrench, X, MonitorOff, MonitorCheck } from 'lucide-react';

const FloatingDevTools = ({ showEmptyState, setShowEmptyState }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isRetailer = location.pathname.startsWith('/retailer');
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show if mode=dev
  if (searchParams.get('mode') !== 'dev') return null;

  return (
    <div 
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ease-in-out ${isExpanded ? 'w-64 h-auto' : 'w-10 h-10'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
       <div className={`bg-black text-white rounded-l-xl shadow-xl overflow-hidden flex flex-col relative transition-all duration-300 ${isExpanded ? 'h-auto' : 'h-10'}`}>
          
          {/* Icon State (Centered) - Visible when collapsed */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
             <Wrench size={18} />
          </div>

          {/* Expanded Content - Visible when expanded */}
          <div className={`transition-opacity duration-300 delay-75 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
             <div className="p-4 border-b border-gray-800 flex justify-between items-center whitespace-nowrap">
                <span className="font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                   <Wrench size={14}/> Dev Tools
                </span>
                {/* Close button for mobile */}
                <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-white md:hidden">
                   <X size={16}/>
                </button>
             </div>
             
             <div className="p-2 space-y-1">
                <button 
                  onClick={() => navigate(isRetailer ? '/' : '/retailer')}
                  className="w-full text-left px-3 py-3 hover:bg-gray-800 rounded-lg transition flex items-center gap-3 text-sm font-medium whitespace-nowrap"
                >
                  <ArrowRightLeft size={18} className="text-indigo-400 shrink-0"/> 
                  <div className="flex flex-col overflow-hidden">
                     <span>Switch View</span>
                     <span className="text-[10px] text-gray-400 truncate">Current: {isRetailer ? 'Retailer' : 'Brand'}</span>
                  </div>
                </button>

                <button 
                  onClick={() => setShowEmptyState(!showEmptyState)}
                  className="w-full text-left px-3 py-3 hover:bg-gray-800 rounded-lg transition flex items-center gap-3 text-sm font-medium whitespace-nowrap"
                >
                  {showEmptyState ? <MonitorCheck size={18} className="text-emerald-400 shrink-0"/> : <MonitorOff size={18} className="text-orange-400 shrink-0"/>}
                  <div className="flex flex-col overflow-hidden">
                     <span>{showEmptyState ? 'Show Content' : 'Test Empty State'}</span>
                     <span className="text-[10px] text-gray-400 truncate">{showEmptyState ? 'Content Hidden' : 'Content Visible'}</span>
                  </div>
                </button>
             </div>
             
             <div className="p-3 bg-gray-900 text-[10px] text-gray-500 text-center whitespace-nowrap">
                CrownSync Prototype v0.1
             </div>
          </div>
       </div>
    </div>
  );
};

export default FloatingDevTools;
