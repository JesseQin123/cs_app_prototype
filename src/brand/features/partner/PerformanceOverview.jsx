import React, { useState } from 'react';
import { TrendingUp, Users, BarChart3, Activity, ArrowUpRight, ArrowDownRight, Megaphone, Store, ChevronUp, ChevronDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, Line, ComposedChart, CartesianGrid, Legend } from 'recharts';

const PerformanceOverview = ({ campaigns }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [viewMode, setViewMode] = useState('numbers'); // numbers | trends

  const activeCampaigns = campaigns.filter(c => c.status === 'Active');
  
  if (campaigns.length === 0) return null;

  // Mock Trend Data (6 Months)
  const trendData = [
    { month: 'Jun', reach: 1.2, engagement: 85, invited: 800, participating: 500 },
    { month: 'Jul', reach: 1.5, engagement: 110, invited: 950, participating: 650 },
    { month: 'Aug', reach: 1.8, engagement: 140, invited: 1100, participating: 800 },
    { month: 'Sep', reach: 2.1, engagement: 160, invited: 1200, participating: 950 },
    { month: 'Oct', reach: 2.3, engagement: 175, invited: 1248, participating: 1100 },
    { month: 'Nov', reach: 2.4, engagement: 185, invited: 1250, participating: 1150 },
  ];

  // Core Metrics (Reduced to 4)
  const metrics = [
    {
      label: 'Active Campaigns',
      value: activeCampaigns.length,
      sub: 'Currently running',
      trend: '+2',
      trendDir: 'up',
      icon: <Megaphone size={16} className="text-gray-400"/>
    },
    {
      label: 'Avg. Adoption Rate',
      value: '68%',
      trend: '+5%',
      trendDir: 'up',
      sub: 'Retailer participation',
      icon: <Store size={16} className="text-gray-400"/>
    },
    {
      label: 'Total Consumer Reach',
      value: '2.4M',
      trend: '+18%',
      trendDir: 'up',
      sub: 'Across all channels',
      icon: <Users size={16} className="text-gray-400"/>
    },
    {
      label: 'Avg. Engagement Rate',
      value: '4.2%',
      trend: '-0.5%',
      trendDir: 'down',
      sub: 'Per campaign average',
      icon: <Activity size={16} className="text-gray-400"/>
    }
  ];

  // Colors
  const colors = {
    emerald: '#10B981', // Trends Up
    emeraldText: 'text-emerald-500',
    coral: '#F87171',   // Trends Down
    coralText: 'text-rose-500',
    grid: '#F3F4F6'
  };

  const MetricCard = ({ metric }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300 group h-32 flex flex-col justify-between">
       <div className="flex justify-between items-start">
          <span className="text-xs font-semibold text-gray-500  tracking-wide uppercase mb-2">{metric.label}</span>
          {metric.icon}
       </div>
       <div className="flex items-end justify-between">
          <div>
             <div className="text-3xl font-semibold text-gray-900 leading-none mb-2">{metric.value}</div>
             <div className="text-[11px] text-gray-400 font-medium">{metric.sub}</div>
          </div>
          <div className={`flex items-center gap-1 text-xs font-bold ${metric.trendDir === 'up' ? colors.emeraldText : colors.coralText}`}>
             {metric.trendDir === 'up' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
             {metric.trend}
          </div>
       </div>
    </div>
  );

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* 1. Header & Controls */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
         <div className="flex items-center gap-4 py-1">
            <div className="flex items-baseline gap-3">
               <h2 className="text-lg font-bold text-gray-900">Performance Overview</h2>
               <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">Last 30 Days</span>
            </div>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400 transition"
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {/* Collapsed Summary */}
            {!isExpanded && (
               <div className="flex items-center gap-6 text-sm text-gray-500 animate-in fade-in duration-300">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Active Campaigns: <strong className="text-gray-900">{activeCampaigns.length}</strong>
                  </span>
                  <span className="w-px h-3 bg-gray-200"></span>
                  <span>Avg. Adoption: <strong className="text-gray-900">68%</strong></span>
               </div>
            )}
         </div>

         {isExpanded && (
            <div className="flex bg-gray-50 p-1 rounded-lg">
               <button 
                onClick={() => setViewMode('numbers')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${viewMode === 'numbers' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
               >
                 Overview Numbers
               </button>
               <button 
                onClick={() => setViewMode('trends')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${viewMode === 'trends' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
               >
                 Trend Visualization
               </button>
            </div>
         )}
      </div>
      
      {/* 2. Content Area */}
      {isExpanded && (
        <div className="animate-in fade-in duration-300">
          
          {/* View: Overview Numbers */}
          {viewMode === 'numbers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric, index) => (
                <MetricCard key={index} metric={metric} />
              ))}
            </div>
          )}

          {/* View: Trend Visualization (Charts) */}
          {viewMode === 'trends' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-64">
                
                {/* Chart 1: Content Impact (Combo) */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-gray-900">Content Impact</h3>
                      <div className="flex gap-4 text-xs">
                          <span className="flex items-center gap-1.5 text-gray-400"><span className="w-2 h-2 rounded-full bg-[#C5D1C7]"></span> Reach</span>
                          <span className="flex items-center gap-1.5 text-gray-400"><span className="w-2 h-2 rounded-full bg-brand-gold"></span> Engagement</span>
                      </div>
                   </div>
                   <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <ComposedChart data={trendData}>
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} dy={10} />
                            <YAxis yAxisId="left" hide />
                            <YAxis yAxisId="right" orientation="right" hide />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                itemStyle={{fontSize: '12px', fontWeight: 500}}
                                separator=": "
                            />
                            {/* Reach (Bar Background) */}
                            <Bar yAxisId="left" dataKey="reach" fill="#C5D1C7" barSize={32} radius={[4, 4, 0, 0]} />
                            {/* Engagement (Line Foreground) */}
                            <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#b5984d" strokeWidth={3} dot={{r: 3, fill: '#b5984d', strokeWidth: 2, stroke: '#fff'}} />
                         </ComposedChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* Chart 2: Retailer Participation (Double Area) */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-gray-900">Retailer Participation</h3>
                      <div className="flex gap-4 text-xs">
                          <span className="flex items-center gap-1.5 text-gray-400"><span className="w-2 h-2 rounded-full bg-gray-200"></span> Invited</span>
                          <span className="flex items-center gap-1.5 text-gray-400"><span className="w-2 h-2 rounded-full bg-brand-gold"></span> Participating</span>
                      </div>
                   </div>
                   <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorParticipating" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#b5984d" stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor="#b5984d" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} dy={10} />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                itemStyle={{fontSize: '12px', fontWeight: 500}}
                            />
                            {/* Invited (Gray Area) */}
                            <Area type="monotone" dataKey="invited" stroke="#E5E7EB" strokeWidth={2} fill="transparent" strokeDasharray="4 4" />
                            {/* Participating (Black Area) */}
                            <Area type="monotone" dataKey="participating" stroke="#b5984d" strokeWidth={2} fill="url(#colorParticipating)" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceOverview;
