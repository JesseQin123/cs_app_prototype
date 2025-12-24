import React, { useState } from 'react';
import { TrendingUp, Users, BarChart3, Activity, ArrowUpRight, ArrowDownRight, Megaphone, Store, ChevronUp, ChevronDown, Eye, MousePointerClick, Info, Calendar } from 'lucide-react';
import Tooltip from '../../../components/Tooltip';
import FilterDropdown from '../analytics/components/FilterDropdown';

const PerformanceOverview = ({ campaigns }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [dateRange, setDateRange] = useState('Last 90 Days'); // Default as requested

  const activeCampaigns = campaigns.filter(c => c.status === 'Active');
  
  if (campaigns.length === 0) return null;

  // Mock Date Range Logic (Simulating Data Variation)
  const getMultiplier = (range) => {
      switch(range) {
          case 'Last 30 Days': return 0.4;
          case 'Last 90 Days': return 1.0;
          case 'Last 12 Months': return 3.5;
          case 'Year to Date': return 2.8;
          default: return 1.0;
      }
  };
  const multiplier = getMultiplier(dateRange);

  // 1. Active Campaigns
  // Logic: Count (Status = 'Active') * Multiplier
  const activeCount = Math.ceil(activeCampaigns.length * multiplier);

  // 2. Retailer Adoption (Avg)
  // Logic: Avg Adoption * Subtle Multiplier (Adoption doesn't scale linearly like volume)
  const adoptionMultiplier = dateRange === 'Last 30 Days' ? 0.9 : dateRange === 'Last 90 Days' ? 1.0 : 1.1; 
  const rawAdoption = activeCampaigns.length > 0
      ? activeCampaigns.reduce((acc, c) => acc + (c.adoptionRate || 0), 0) / activeCampaigns.length
      : 0;
  const avgAdoption = Math.min(100, Math.round(rawAdoption * adoptionMultiplier));

  // 3. Est. Audience Reach (B2C Breadth)
  // Logic: Sum (Email Opens + Social Impressions) * Multiplier
  const totalReach = Math.round(
      activeCampaigns.reduce((acc, c) => {
        const m = c.metrics || { emailOpens: 0, socialImpressions: 0 };
        return acc + (m.emailOpens || 0) + (m.socialImpressions || 0);
      }, 0) * multiplier
  );

  // Helper to format large numbers (e.g., 1.2M, 45K)
  const formatCompact = (num) =>
    new Intl.NumberFormat("en-US", { notation: "compact", compactDisplay: "short" }).format(
      num
    );

  // 4. Customer Interactions (B2C Depth/Quality)
  // Logic: Sum (Clicks + Likes + Comments + Shares) * Multiplier
  const totalInteractions = Math.round(
      activeCampaigns.reduce((acc, c) => {
        const m = c.metrics || { clicks: 0, likes: 0, comments: 0, shares: 0 };
        return (
          acc +
          (m.clicks || 0) +
          (m.likes || 0) +
          (m.comments || 0) +
          (m.shares || 0)
        );
      }, 0) * multiplier
  );

  // Core Metrics (Updated for Brand Partner Hub)
  const metrics = [
    {
      label: 'Active Campaigns',
      value: activeCount,
      sub: 'Running in this timeframe',
      trend: '+1', // Mock trend
      trendDir: 'up',
      icon: <Megaphone size={16} className="text-gray-400" />,
      tooltip: "Shows unique campaigns that were active (running) at any point during the selected timeframe, regardless of their start date."
    },
    {
      label: 'Retailer Adoption',
      value: `${avgAdoption}%`,
      sub: 'Avg. per campaign', // Reflecting B2B Breadth
      trend: '+5%',
      trendDir: 'up',
      icon: <Store size={16} className="text-gray-400" />,
      tooltip: "Average adoption rate of all campaigns active within the selected timeframe."
    },
    {
      label: 'Est. Audience Reach',
      value: formatCompact(totalReach),
      sub: 'Total Opens & Impressions', // Reflecting B2C Breadth
      trend: '+12%',
      trendDir: 'up',
      icon: <Eye size={16} className="text-gray-400" />,
      tooltip: "Total estimated reach (email opens + social impressions) aggregated from all campaigns in the current view."
    },
    {
      label: 'Customer Interactions',
      value: formatCompact(totalInteractions),
      sub: 'Clicks & Social Engagement', // Reflecting B2C Depth/Quality
      trend: '+8%',
      trendDir: 'up',
      icon: <MousePointerClick size={16} className="text-gray-400" />, // Using MousePointerClick for interactions
      tooltip: "Total volume of consumer engagement, including clicks, likes, shares, and comments."
    }
  ];

  const MetricCard = ({ metric }) => (
    <div className="bg-white border border-gray-200 rounded-xl py-5 px-6 h-36 flex flex-col relative">
       <div className="flex justify-between items-center h-7 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">{metric.label}</span>
            {metric.tooltip && (
                <Tooltip content={metric.tooltip}>
                     <Info size={12} className="text-gray-300 hover:text-gray-500 transition"/>
                </Tooltip>
            )}
          </div>
          {metric.icon}
       </div>
       
       <div className="text-3xl font-bold text-gray-900 leading-none">
          {metric.value}
       </div>
       
       <div className="mt-auto flex items-center justify-between">
          <span className="text-[11px] text-gray-400 font-medium">{metric.sub}</span>
          <span className={`flex items-center gap-1 text-xs font-bold px-1.5 py-0.5 rounded ${metric.trendDir === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
             {metric.trendDir === 'up' ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
             {metric.trend}
          </span>
       </div>
    </div>
  );

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-top-3 duration-500">
      
      {/* 1. Header & Controls */}
      <div className="flex items-center justify-between mb-4 h-9 border-gray-100 pb-0">
         <div 
            className="flex items-center gap-2 py-1 cursor-pointer select-none group"
            onClick={() => setIsExpanded(!isExpanded)}
         >
            <button 
              className="p-0.5 hover:bg-gray-100 rounded text-gray-400 transition group-hover:text-gray-600"
            >
              {isExpanded ? <ChevronDown size={18} /> : <div className="-rotate-90"><ChevronDown size={18} /></div>}
            </button>
            <h2 className="text-sm font-semibold text-gray-800 group-hover:text-gray-600 transition">Performance Overview</h2>
         </div>

         {isExpanded && (
             <div className="flex items-center gap-2 animate-in fade-in duration-300">
                {/* Date Range Filter */}
                <div className="relative z-20">
                    <FilterDropdown 
                        value={dateRange} 
                        options={['Last 90 Days', 'Last 30 Days', 'Last 12 Months', 'Year to Date']} 
                        onChange={setDateRange} 
                        icon={Calendar} 
                    />
                </div>
             </div>
         )}
      </div>
      
      {/* 2. Content Area */}
      {isExpanded && (
        <div className="animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric, index) => (
                <MetricCard key={index} metric={metric} />
              ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceOverview;
