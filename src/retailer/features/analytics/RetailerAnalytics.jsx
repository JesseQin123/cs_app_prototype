import React, { useState } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Mail, Share2, Instagram, Facebook, 
  ExternalLink, Info, MousePointerClick, Eye, Zap, BarChart2, ArrowUp, ArrowDown, Clock
} from 'lucide-react';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import { getAnalyticsData, ACTIVE_DEBUG_SCENARIO } from '@/data/mockStore/retailerAnalyticsStore';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import Tooltip from '@/components/Tooltip';

// --- Sub-Components ---

const TrendIndicator = ({ value, direction }) => {
  const isUp = direction === 'up';
  return (
    <div className={`flex items-center gap-1 text-xs font-bold px-1.5 py-0.5 rounded-sm ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
      {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {value}%
    </div>
  );
};

const MetricCard = ({ value, trend, trendDirection, label, desc, subStats, icon: Icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow flex flex-col justify-between h-36 relative overflow-hidden group">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
           <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</h3>
           {desc && (
             <Tooltip content={desc} maxWidth="max-w-[200px]">
                <Info size={12} className="text-gray-300 hover:text-gray-500 cursor-help transition-colors" />
             </Tooltip>
           )}
        </div>
        {Icon && <Icon size={18} className="text-gray-400 group-hover:text-brand-gold transition-colors" />}
      </div>
      
      <div className={`text-3xl font-bold tracking-tight mb-2 ${value === 0 || value === '-' ? 'text-gray-300' : 'text-gray-900'}`}>
        {typeof value === 'number' && value > 0 ? value.toLocaleString() : value === 0 ? '--' : value}
      </div>

      {/* Footer / Sub-stats */}
      <div className="flex items-center justify-between">
          {subStats ? (
              <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                  {subStats.map((stat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                          {stat.icon && <stat.icon size={12} className="text-gray-400" />}
                          {stat.label && <span className={stat.bold ? "font-bold text-gray-700" : ""}>{stat.label}</span>}
                          <span className={stat.value === '0' || stat.value === 0 ? 'text-gray-300' : 'text-gray-900'}>{stat.value}</span>
                          {idx < subStats.length - 1 && <span className="text-gray-300 ml-1.5 opacity-50">•</span>}
                      </div>
                  ))}
              </div>
          ) : trend !== undefined && value > 0 ? (
              <div className="flex items-center gap-2">
                  <TrendIndicator value={trend} direction={trendDirection} />
                  <span className="text-xs text-gray-400 font-medium">vs prev period</span>
              </div>
          ) : (
             <span className="text-[10px] uppercase font-bold text-gray-300 tracking-wide bg-gray-50 px-2 py-0.5 rounded-sm">--</span>
          )}
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white text-xs p-3 rounded-md shadow-xl border border-gray-800 animate-in fade-in zoom-in-95 leading-relaxed">
        <p className="font-bold text-gray-400 mb-2 uppercase tracking-wider">{label}, 2025</p>
        <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Eye size={12} className="text-gray-400" />
              <span className="text-gray-300">Reach:</span>
              <span className="font-bold">{payload[0].value.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-brand-gold" />
              <span className="text-gray-300">Engagement:</span>
              <span className="font-bold text-brand-gold">{payload[1].value.toLocaleString()}</span>
            </div>
        </div>
      </div>
    );
  }
  return null;
};

const PerformanceTrendsChart = ({ data }) => {
  const [filter, setFilter] = useState('All'); // All, Email, Social

  // Process data based on filter
  const chartData = data.map(item => {
    let reach = 0;
    let engagement = 0;

    if (filter === 'All') {
      reach = (item.emailReach || 0) + (item.socialReach || 0);
      engagement = (item.emailEngagement || 0) + (item.socialEngagement || 0);
    } else if (filter === 'Email') {
      reach = item.emailReach || 0;
      engagement = item.emailEngagement || 0;
    } else if (filter === 'Social') {
      reach = item.socialReach || 0;
      engagement = item.socialEngagement || 0;
    }

    return {
      date: item.date,
      reach,
      engagement
    };
  });

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
           <h3 className="font-bold text-gray-900 text-base">Performance Trends</h3>
           <p className="text-xs text-gray-500 mt-1">Reach vs. Engagement over time.</p>
        </div>
        
        {/* Segmented Control */}
        <div className="bg-gray-50/80 p-1 rounded-lg inline-flex border border-gray-100">
           {['All', 'Email', 'Social'].map((f) => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`px-3 py-1 text-xs rounded-md font-medium transition-all duration-200 ${
                 filter === f 
                  ? 'bg-white text-gray-900 shadow-xs ring-1 ring-black/5' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
               }`}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      <div className="h-[300px] w-full relative">
         {chartData.length === 0 ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                 <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                     <BarChart2 size={20} className="text-gray-400" />
                 </div>
                 <p className="text-sm font-bold text-gray-500">No performance data</p>
                 <p className="text-xs text-gray-400 mt-1">Activity in this period will show up here.</p>
             </div>
         ) : (
             <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                   <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#9CA3AF' }} 
                      dy={10}
                   />
                   <YAxis 
                      yAxisId="left" 
                      orientation="left" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      label={{ value: 'Reach', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF', fontSize: 10 } }} 
                   />
                   <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#111827', fontWeight: 500 }}
                      label={{ value: 'Engagement', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#111827', fontSize: 10 } }}
                   />
                   <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                   <Legend 
                      verticalAlign="top" 
                      height={36} 
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '11px', fontWeight: 500, color: '#6B7280' }}
                   />
                   <Bar 
                      yAxisId="left" 
                      dataKey="reach" 
                      name="Total Reach" 
                      fill="#E5E7EB" 
                      radius={[4, 4, 0, 0]} 
                      barSize={14}
                      animationDuration={1500}
                   />
                   <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="engagement" 
                      name="Total Engagement" 
                      stroke="#b5984d" 
                      strokeWidth={2} 
                      dot={{ r: 3, fill: '#b5984d', strokeWidth: 0 }} 
                      activeDot={{ r: 5, strokeWidth: 0 }}
                      animationDuration={1500}
                   />
                </ComposedChart>
             </ResponsiveContainer>
         )}
      </div>
    </div>
  );
};

const ChannelPerformance = ({ data }) => {
  const isEmailEmpty = data.email.openRate === 0;
  const isSocialEmpty = data.social.totalInteractions === 0;

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-8">
        <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900">Channel Performance</h3>
            <p className="text-xs text-gray-500 mt-1">Compare the efficiency of email marketing versus social media.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* Left: Email Performance */}
            <div className={`pr-0 md:pr-12 pt-8 md:pt-0 first:pt-0 flex flex-col justify-between ${isEmailEmpty ? 'justify-center py-8 opacity-90' : ''}`}>
                {!isEmailEmpty ? (
                    <>
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-900">
                                    <Mail size={16} />
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm">Email Performance</h4>
                            </div>
                            
                            <div className="flex justify-between items-start mb-8">
                                {/* Open Rate - Radial Visual */}
                                <div className="flex flex-col items-start gap-2">
                                     <div className="relative w-24 h-24 flex items-center justify-center">
                                         <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="48" cy="48" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                                            <circle 
                                                cx="48" 
                                                cy="48" 
                                                r="40" 
                                                stroke="#C5A572" 
                                                strokeWidth="8" 
                                                fill="none" 
                                                strokeDasharray="251.2" 
                                                strokeDashoffset={251.2 * (1 - data.email.openRate / 100)} 
                                                strokeLinecap="round"
                                                className="drop-shadow-sm"
                                            />
                                         </svg>
                                         <div className="absolute flex flex-col items-center">
                                            <span className="text-xl font-bold text-gray-900">{data.email.openRate}%</span>
                                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Open Rate</span>
                                         </div>
                                     </div>
                                </div>

                                {/* CTR */}
                                <div className="text-right pt-2">
                                     <div className="text-xs text-gray-500 font-medium mb-2">Click-Through Rate (CTR)</div>
                                     <div className="text-2xl font-bold text-gray-900">{data.email.ctr}%</div>
                                     <div className="text-[10px] text-gray-400 mt-1 text-right">Avg. Engagement</div>
                                </div>
                            </div>
                        </div>

                        {/* Insight Box - Aligned with Right Side */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 h-[74px] flex items-center justify-between">
                             <p className="text-sm text-gray-600 leading-snug font-medium">
                                 Your email open rate is <strong className={`${data.email.openRate >= data.email.industryBenchmarks.openRate ? 'text-emerald-600' : 'text-amber-600'}`}>
                                     {data.email.openRate >= data.email.industryBenchmarks.openRate ? 'Higher' : 'Lower'}
                                 </strong> than the industry average.
                             </p>
                             
                             <Tooltip content={`Based on 2024 Retail Industry Standards: Open Rate ${data.email.industryBenchmarks.openRate}%, CTR ${data.email.industryBenchmarks.ctr}%.`} maxWidth="max-w-[220px]">
                                <div className="p-1.5 hover:bg-gray-200 rounded-full transition-colors cursor-help">
                                    <Info size={14} className="text-gray-400" />
                                </div>
                             </Tooltip>
                        </div>
                    </>
                ) : (
                    // Empty State: Email
                    <div className="text-center flex flex-col items-center py-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <Mail size={24} className="text-gray-300" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">No emails sent in this period</h4>
                    </div>
                )}
            </div>

            {/* Right: Social Media Overview */}
            <div className={`pl-0 md:pl-12 pt-8 md:pt-0 flex flex-col justify-between ${isSocialEmpty ? 'justify-center py-8 opacity-90' : ''}`}>
                {!isSocialEmpty ? (
                    <>
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-900">
                                    <Share2 size={16} />
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm">Social Media Overview</h4>
                            </div>

                            <div className="flex justify-between items-start mb-8 h-24">
                                 <div className="pt-2">
                                    <div className="text-xs text-gray-500 font-medium mb-2">Top Platform</div>
                                    <div className="flex items-center gap-2">
                                         <Instagram size={24} className="text-[#E1306C]" />
                                         <span className="text-2xl font-bold text-gray-900 tracking-tight">{data.social.insight.winner}</span>
                                    </div>
                                 </div>
                                 <div className="text-right pt-2">
                                    <div className="text-xs text-gray-500 font-medium mb-2">Total Interactions</div>
                                    <div className="text-2xl font-bold text-gray-900">{data.social.totalInteractions}</div>
                                    <div className="text-[10px] text-gray-400 mt-1">Likes & Comments</div>
                                 </div>
                            </div>
                        </div>

                        {/* Dynamic Insight */}
                        <div className="bg-brand-gold/10 p-4 rounded-lg border border-brand-gold/20 h-[74px] flex items-center">
                             <div className="flex gap-3 items-center">
                                <div className="min-w-6 h-6 rounded-full bg-brand-gold text-white flex items-center justify-center text-xs font-bold shrink-0">
                                    <Zap size={12} fill="currentColor" />
                                </div>
                                <p className="text-sm text-gray-800 leading-snug font-medium">
                                    <span className="font-bold text-gray-900">{data.social.insight.winner}</span> generates <strong className="text-brand-gold">{data.social.insight.multiplier}x more</strong> engagement than {data.social.insight.loser}.
                                </p>
                             </div>
                        </div>
                    </>
                ) : (
                    // Empty State: Social
                    <div className="text-center flex flex-col items-center py-4">
                         <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <Share2 size={24} className="text-gray-300" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">No social activity in this period</h4>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

const CampaignAttribution = ({ campaigns, onNavigate }) => {
  // Sorting State
  const [sortConfig, setSortConfig] = useState({ key: 'reach', direction: 'desc' });

  // Helper to render channel icons
  const getChannelIcon = (channel) => {
      switch(channel.toLowerCase()) {
          case 'email': return <Mail key="email" size={14} className="text-gray-500" />;
          case 'instagram': return <Instagram key="insta" size={14} className="text-[#E1306C]" />;
          case 'facebook': return <Facebook key="fb" size={14} className="text-[#1877F2]" />;
          default: return null;
      }
  };

  // Sort Handler
  const handleSort = (key) => {
      let direction = 'desc';
      if (sortConfig.key === key && sortConfig.direction === 'desc') {
          direction = 'asc';
      }
      setSortConfig({ key, direction });
  };

  // Sorted Data
  const sortedCampaigns = [...campaigns].sort((a, b) => {
      const aValue = a[sortConfig.key] || 0;
      const bValue = b[sortConfig.key] || 0;
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
  });

  // Render Sort Icon
  const renderSortIcon = (columnKey) => {
      if (sortConfig.key !== columnKey) return <ArrowDown size={12} className="text-gray-300 opacity-0 group-hover/th:opacity-50 transition-all" />;
      return sortConfig.direction === 'asc' 
          ? <ArrowUp size={12} className="text-brand-gold" />
          : <ArrowDown size={12} className="text-brand-gold" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
        <div className="px-8 py-7 border-b border-gray-50 flex justify-between items-end bg-white">
            <div>
                <h3 className="font-bold text-gray-900 text-lg">Campaign Effectiveness</h3>
                <p className="text-xs text-gray-500 mt-1">Channel Performance Breakdown</p>
            </div>
            <button className="text-xs font-bold text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                Export Report
            </button>
        </div>

        <div className="overflow-x-auto max-h-[400px] overflow-y-auto scrollbar-hover-trigger">
            <table className="w-full text-sm text-left relative">
                <thead className="bg-white text-xs text-gray-500 uppercase font-bold tracking-wider border-b border-gray-100 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    <tr>
                        <th className="px-6 py-4 pl-8 w-[30%]">Campaign</th>
                        <th className="px-6 py-4 w-[20%]">Brand</th>
                        <th className="px-6 py-4 w-[15%]">Channels</th>
                        {/* Sortable Header: Reach */}
                        <th className="px-6 py-4 text-left w-[15%]">
                           <div className="flex items-center gap-1.5">
                               <div 
                                    className="flex items-center gap-1 cursor-pointer group/th hover:text-brand-gold transition-colors select-none"
                                    onClick={() => handleSort('reach')}
                                    role="button"
                                    tabIndex={0}
                               >
                                   Reach
                                   {renderSortIcon('reach')}
                               </div>
                               <Tooltip content="Total visibility of your content." maxWidth="max-w-[200px]">
                                  <Info size={12} className="text-gray-300 hover:text-gray-500 cursor-help" />
                               </Tooltip>
                           </div>
                        </th>
                         {/* Sortable Header: Engagement */}
                        <th className="px-6 py-4 text-left w-[15%]">
                           <div className="flex items-center gap-1.5">
                               <div 
                                    className="flex items-center gap-1 cursor-pointer group/th hover:text-brand-gold transition-colors select-none"
                                    onClick={() => handleSort('socialEngagement')}
                                    role="button"
                                    tabIndex={0}
                               >
                                   Engagement
                                   {renderSortIcon('socialEngagement')}
                               </div>
                               <Tooltip content="Customer interactions on social platforms." maxWidth="max-w-[200px]">
                                  <Info size={12} className="text-gray-300 hover:text-gray-500 cursor-help" />
                               </Tooltip>
                           </div>
                        </th>
                         {/* Sortable Header: Traffic */}
                        <th className="px-6 py-4 text-left pr-8 w-[15%]">
                           <div className="flex items-center gap-1.5">
                               <div 
                                    className="flex items-center gap-1 cursor-pointer group/th hover:text-brand-gold transition-colors select-none"
                                    onClick={() => handleSort('traffic')}
                                    role="button"
                                    tabIndex={0}
                               >
                                   Traffic
                                   {renderSortIcon('traffic')}
                               </div>
                               <Tooltip content="Total clicks to your website from Emails and Link Posts (excludes in-store traffic)." maxWidth="max-w-[240px]">
                                  <Info size={12} className="text-gray-300 hover:text-gray-500 cursor-help" />
                               </Tooltip>
                           </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {sortedCampaigns.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-16 text-center">
                                <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                                    <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mb-4">
                                        <Zap size={24} className="text-brand-gold" fill="currentColor" />
                                    </div>
                                    <h3 className="text-gray-900 font-bold text-base mb-2">No campaign data yet</h3>
                                    <p className="text-gray-500 text-xs leading-relaxed mb-6">
                                        Tracking starts automatically when you launch your first campaign. 
                                        Get insights on reach, engagement, and traffic here.
                                    </p>
                                    <button 
                                        onClick={() => onNavigate && onNavigate('campaigns')}
                                        className="px-5 py-2.5 bg-brand-gold text-white text-xs font-bold rounded-lg shadow-lg shadow-brand-gold/20 hover:bg-brand-gold-dark hover:shadow-xl transition-all"
                                    >
                                        Go to Campaigns
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        sortedCampaigns.map((camp) => (
                            <tr key={camp.id} className="hover:bg-gray-50/80 transition-colors group">
                                <td className="px-6 py-4 pl-8 max-w-[300px]">
                                    <div className="flex items-center gap-3">
                                        {/* Status Indicator: Refined Jewel & Icon */}
                                        {camp.status === 'active' ? (
                                            <div className="relative flex items-center justify-center shrink-0">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]"></div>
                                            </div>
                                        ) : (
                                            // Expired: Subtle Clock Icon
                                            <Tooltip content="Expired: No longer available for publishing, but still tracking historical traffic.">
                                                 <Clock size={14} className="text-gray-300 shrink-0 cursor-help" />
                                            </Tooltip>
                                        )}
                                        
                                        <button
                                            onClick={() => onNavigate && onNavigate('my-marketing', { campaign: camp.name })}
                                            className="group flex items-center gap-2 min-w-0 text-left"
                                            title={camp.name}
                                        >
                                            <span className={`text-sm font-semibold truncate transition-colors ${camp.status === 'active' ? 'text-gray-900 group-hover:text-brand-gold' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                                {camp.name}
                                            </span>
                                            <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold shrink-0" />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-1.5">
                                        {/* Avatar/Logo Placeholder - Luxury style: Circle with Initial */}
                                        <div className="w-5 h-5 rounded-full bg-gray-100 text-[9px] font-bold flex items-center justify-center text-gray-500 border border-gray-200 shrink-0">
                                            {camp.brand.charAt(0)}
                                        </div>
                                        <span className="text-xs text-gray-600 font-medium">{camp.brand}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        {camp.channels.map(ch => getChannelIcon(ch))}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-left font-medium text-gray-600">
                                    {camp.reach.toLocaleString()}
                                </td>
                                <td className="px-6 py-5 text-left font-medium text-gray-600">
                                    {camp.socialEngagement !== null && camp.socialEngagement !== undefined ? camp.socialEngagement : (
                                        <span className="text-gray-300">--</span>
                                    )}
                                </td>
                                <td className="px-6 py-5 text-left pr-6">
                                    {camp.traffic === null ? (
                                        <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded">--</span>
                                    ) : (
                                        <div className="font-bold text-gray-900">{camp.traffic}</div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};




// --- Main Page ---

// --- Main Page ---

const RetailerAnalytics = ({ initialScenario = ACTIVE_DEBUG_SCENARIO, onNavigate }) => {
  // Scenario controlled via store constant 'ACTIVE_DEBUG_SCENARIO' or prop
  const [scenario] = useState(initialScenario); 
  
  const data = getAnalyticsData(scenario);
  const [dateRange, setDateRange] = useState('30d');

  // Detect Global Empty State
  const isGlobalEmpty = scenario === 'empty';

  if (isGlobalEmpty) {
      return (
          <div className="p-8 w-full bg-gray-50/30 min-h-screen font-sans flex items-center justify-center animate-in fade-in duration-500">
             <div className="max-w-md w-full text-center">
                 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <BarChart2 size={32} className="text-gray-300" />
                 </div>
                 <h1 className="text-2xl font-bold text-gray-900 mb-2">Unlock Your Marketing Insights</h1>
                 <p className="text-gray-500 mb-8 leading-relaxed">
                     Your analytics dashboard is waiting. Launch your first campaign to start tracking reach, engagement, and traffic.
                 </p>
                 <button 
                  onClick={() => onNavigate && onNavigate('campaigns')}
                  className="bg-brand-gold text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg shadow-brand-gold/20 hover:bg-brand-gold-dark hover:shadow-xl transition-all"
                 >
                     Go to Campaigns
                 </button>
             </div>
          </div>
      );
  }

  return (
    <div className="p-8 w-full bg-gray-50/30 min-h-screen font-sans animate-in fade-in duration-500 pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Analytics</h1>
            <p className="text-gray-500">Overview of your brand reach and customer engagement.</p>
          </div>
          <div className="flex items-center gap-4">
               <DateRangeFilter value={dateRange} onChange={setDateRange} options={data.dateRanges} />
          </div>
        </div>

        {/* 1. Performance Trends  */}
        <PerformanceTrendsChart data={data.performanceTrends} />

        {/* 2. North Star Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <MetricCard 
                {...data.northStar.reach} 
                icon={Eye}
           />
           <MetricCard 
                {...data.northStar.engagement} 
                icon={MousePointerClick}
                label="Customer Engagement" 
                trend={undefined} // Hide trend if strictly zero
           />
           <MetricCard 
                {...data.northStar.activities} 
                icon={Share2} 
                trend={undefined} 
                desc="Content published from all participating campaigns."
                subStats={[
                  { label: `${data.northStar.activities.brandCount} Brand`, bold: true },
                  { icon: Mail, value: data.northStar.activities.breakdown.email }, 
                  { icon: Share2, value: data.northStar.activities.breakdown.social }
                ]} 
           />
        </div>

        {/* 3. Campaign Attribution */}
        <CampaignAttribution campaigns={data.campaignAttribution} onNavigate={onNavigate} />

        {/* 4. Channel Performance */}
        <ChannelPerformance data={data.channelPerformance} />

      </div>
    </div>
  );
};

export default RetailerAnalytics;
