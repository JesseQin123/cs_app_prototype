import React, { useState } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Mail, Share2, Instagram, Facebook, 
  ExternalLink, Info, MousePointerClick, Eye, Zap 
} from 'lucide-react';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import { getAnalyticsData } from '@/data/mockStore/retailerAnalyticsStore';
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
      
      {/* Value */}
      <div>
        <div className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>

        {/* Footer / Sub-stats */}
        <div className="flex items-center justify-between">
            {subStats ? (
                <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                    {subStats.map((stat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                            {stat.icon && <stat.icon size={12} className="text-gray-400" />}
                            {stat.label && <span className={stat.bold ? "font-bold text-gray-700" : ""}>{stat.label}</span>}
                            {stat.value}
                            {idx < subStats.length - 1 && <span className="text-gray-300 ml-1.5 opacity-50">•</span>}
                        </div>
                    ))}
                </div>
            ) : trend !== undefined ? (
                <div className="flex items-center gap-2">
                    <TrendIndicator value={trend} direction={trendDirection} />
                    <span className="text-xs text-gray-400 font-medium">vs prev period</span>
                </div>
            ) : null}
        </div>
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

      <div className="h-[300px] w-full">
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
      </div>
    </div>
  );
};

const ChannelPerformance = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       {/* Email Performance */}
       <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-50 rounded-lg">
                   <Mail size={16} className="text-gray-900" />
                </div>
                <h3 className="font-bold text-gray-900">Email Performance</h3>
             </div>
          </div>

          <div className="space-y-6">
              {/* Funnel - Optimized Colors */}
              <div className="space-y-3">
                  {/* Sent */}
                  <div>
                      <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-gray-500 font-medium">{data.email.funnel[0].label}</span>
                          <span className="font-bold text-gray-900">{data.email.funnel[0].value.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-300 rounded-full w-full"></div>
                      </div>
                  </div>
                  
                  {/* Opened */}
                  <div>
                      <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-gray-500 font-medium">{data.email.funnel[1].label}</span>
                          <span className="font-bold text-gray-900">{data.email.funnel[1].value.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-gold rounded-full" style={{ width: `${data.email.funnel[1].percentage}%` }}></div>
                      </div>
                  </div>

                  {/* Clicked */}
                  <div>
                      <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-gray-900 font-bold">{data.email.funnel[2].label}</span>
                          <span className="font-bold text-emerald-600">{data.email.funnel[2].value.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${data.email.funnel[2].percentage}%` }}></div>
                      </div>
                  </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                  {data.email.metrics.map((m, i) => (
                      <div key={i}>
                          <p className="text-xs text-gray-400 mb-1">{m.label}</p>
                          <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold text-gray-900">{m.value}</span>
                              {m.status && <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${m.status === 'good' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'}`}>{m.benchmark}</span>}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
       </div>

       {/* Social Performance */}
       <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-50 rounded-lg">
                   <Share2 size={16} className="text-gray-900" />
                </div>
                <h3 className="font-bold text-gray-900">Social Engagement</h3>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
              {data.social.platforms.map(p => (
                  <div key={p.name} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 mb-2 text-gray-500">
                          {p.icon === 'Instagram' ? <Instagram size={14} /> : <Facebook size={14} />}
                          <span className="text-xs font-semibold">{p.name}</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">{p.engagement}%</div>
                      <div className="text-[10px] text-gray-400 mt-1">Engagement Share</div>
                  </div>
              ))}
          </div>

           <div className="space-y-4">
              {data.social.metrics.map((m, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2">
                          {m.icon === 'Instagram' && <div className="w-1.5 h-1.5 rounded-full bg-[#E1306C]"></div>}
                          <span className="text-sm text-gray-600">{m.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{m.value}</span>
                      </div>
                  </div>
              ))}
          </div>
       </div>
    </div>
  );
};

const CampaignAttribution = ({ campaigns }) => {
  // Helper to render channel icons
  const getChannelIcon = (channel) => {
      switch(channel.toLowerCase()) {
          case 'email': return <Mail key="email" size={14} className="text-gray-500" />;
          case 'instagram': return <Instagram key="insta" size={14} className="text-[#E1306C]" />;
          case 'facebook': return <Facebook key="fb" size={14} className="text-[#1877F2]" />;
          default: return null;
      }
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
        <div className="px-8 py-7 border-b border-gray-50 flex justify-between items-end bg-white">
            <div>
                <h3 className="font-bold text-gray-900 text-lg tracking-tight">Campaign Effectiveness</h3>
                <p className="text-xs text-gray-400 mt-1 tracking-wider font-medium">Channel Performance Breakdown</p>
            </div>
            <button className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-100 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all hover:shadow-sm">
                Export Report
            </button>
        </div>

        <div className="overflow-x-auto max-h-[420px] scrollbar-hover-trigger">
            <table className="w-full text-sm text-left relative">
                <thead className="bg-white text-[11px] text-gray-400 uppercase font-bold tracking-widest border-b border-gray-50 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    <tr>
                        <th className="px-6 py-4 pl-6">Campaign</th>
                        <th className="px-6 py-4">Brand</th>
                        <th className="px-6 py-4">Channels</th>
                        <th className="px-6 py-4 text-left">
                           <div className="flex items-center gap-1">
                               Reach
                               <Tooltip content="Total visibility of your content." maxWidth="max-w-[200px]">
                                  <Info size={12} className="text-gray-300 hover:text-gray-500 cursor-help" />
                               </Tooltip>
                           </div>
                        </th>
                        <th className="px-6 py-4 text-left">
                           <div className="flex items-center gap-1">
                               Engagement
                               <Tooltip content="Customer interactions on social platforms." maxWidth="max-w-[200px]">
                                  <Info size={12} className="text-gray-300 hover:text-gray-500 cursor-help" />
                               </Tooltip>
                           </div>
                        </th>
                        <th className="px-6 py-4 text-left pr-6">
                           <div className="flex items-center gap-1">
                               Traffic
                               <Tooltip content="Total clicks to your website from Emails and Link Posts. (Does not include in-store foot traffic)." maxWidth="max-w-[240px]">
                                  <Info size={12} className="text-gray-300 hover:text-gray-500 cursor-help" />
                               </Tooltip>
                           </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {campaigns.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                No campaign data available.
                            </td>
                        </tr>
                    ) : (
                        campaigns.map((camp) => (
                            <tr key={camp.id} className="hover:bg-gray-50/80 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="font-medium text-gray-900">{camp.name}</div>
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
                                    {camp.socialEngagement ?? (
                                        <span className="text-gray-300">--</span>
                                    )}
                                </td>
                                <td className="px-6 py-5 text-left pr-6">
                                    {camp.traffic === null ? (
                                        <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded">N/A</span>
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

const RetailerAnalytics = ({ showEmptyState = false }) => {
  const [data] = useState(getAnalyticsData(showEmptyState));
  const [dateRange, setDateRange] = useState('30d');

  return (
    <div className="p-8 w-full bg-gray-50/30 min-h-screen font-sans animate-in fade-in duration-500 pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Analytics</h1>
            <p className="text-gray-500">Overview of your brand reach and customer engagement.</p>
          </div>
          <DateRangeFilter value={dateRange} onChange={setDateRange} options={data.dateRanges} />
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
                label="Customer Engagement" // Ensure exact label match if store differs slightly
           />
           <MetricCard 
                {...data.northStar.activities} 
                icon={Share2} // 'Activities' implies social+email sharing
                trend={undefined} // Table says "-" for trend
                subStats={[
                  { label: 'Email', value: '4' }, 
                  { label: 'Social', value: '8' }
                ]} // Adding breakdown as it adds value and matches "Activities" count logic
           />
        </div>

        {/* 3. Campaign Attribution */}
        <CampaignAttribution campaigns={data.campaignAttribution} />

        {/* 4. Channel Performance */}
        <ChannelPerformance data={data.channelPerformance} />



      </div>
    </div>
  );
};

export default RetailerAnalytics;
