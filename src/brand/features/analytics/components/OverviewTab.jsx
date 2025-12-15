import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Download, Users, Globe, Activity, Calendar, Filter } from 'lucide-react';
import { analyticsData } from '../../../../data/mockStore/analyticsStore';
import FilterDropdown from './FilterDropdown';

const KpiCard = ({ kpi }) => {
    const isUp = kpi.trendDirection === 'up';
    const isNeutral = kpi.trendDirection === 'neutral';
    
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
                <span className="text-gray-500 text-sm font-medium">{kpi.label}</span>
                {kpi.id === 'adoption' && <Activity size={18} className="text-gray-300"/>}
                {kpi.id === 'downloads' && <Download size={18} className="text-gray-300"/>}
                {kpi.id === 'reach' && <Globe size={18} className="text-gray-300"/>}
                {kpi.id === 'active_partners' && <Users size={18} className="text-gray-300"/>}
            </div>
            <div className="flex items-baseline gap-2 mb-1">
                <h3 className="text-3xl font-bold text-gray-900">{kpi.value}</h3>
            </div>
            <div className="flex items-center gap-2">
                 <span className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded ${
                    isUp ? 'bg-emerald-50 text-emerald-600' :
                    isNeutral ? 'bg-gray-100 text-gray-600' :
                    'bg-red-50 text-red-600'
                }`}>
                    {isUp ? <ArrowUpRight size={12} className="mr-1"/> : isNeutral ? <Minus size={12} className="mr-1"/> : <ArrowDownRight size={12} className="mr-1"/>}
                    {kpi.trend}
                </span>
                <span className="text-xs text-gray-400">{kpi.description}</span>
            </div>
        </div>
    );
};

const HeatmapRow = ({ zone }) => (
    <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition px-2 rounded-lg">
        <div className="w-24 font-medium text-sm text-gray-700">{zone.zone}</div>
        <div className="flex-1">
            <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${zone.color}`} style={{ width: `${zone.adoption}%` }}></div>
                </div>
                <span className="text-xs font-bold text-gray-900 w-8 text-right">{zone.adoption}%</span>
            </div>
        </div>
        <div className="w-24 text-right text-xs text-gray-500">
            <span className="font-medium text-gray-900">{zone.activeCount}</span> Active
        </div>
    </div>
);

const OverviewTab = () => {
    const { kpi, heatmap, timeline } = analyticsData.overview;
    // Local Filter State
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [zone, setZone] = useState('All Zones');

    return (
        <div className="space-y-6">
            {/* Tab Filters */}
            <div className="flex flex-wrap items-center gap-3">
                 <FilterDropdown 
                    value={dateRange} 
                    options={['Last 30 Days', 'This Quarter', 'Year to Date']} 
                    onChange={setDateRange} 
                    icon={Calendar} 
                 />
                 <div className="h-4 w-px bg-gray-200"></div>
                 <FilterDropdown 
                    label="Zone"
                    value={zone} 
                    options={['All Zones', 'Northeast', 'West', 'South', 'Midwest', 'Northwest']} 
                    onChange={setZone} 
                    icon={Filter} 
                 />
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpi.map(item => (
                    <KpiCard key={item.id} kpi={item} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Regional Heatmap */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs col-span-1">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900">Regional Performance</h3>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">By Adoption Rate</span>
                    </div>
                    
                    <div className="space-y-1">
                        {heatmap.map(zone => (
                            <HeatmapRow key={zone.zone} zone={zone} />
                        ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400">💡 Alert: The <span className="font-bold text-gray-600">Northwest</span> zone is lagging 15% behind national average.</p>
                    </div>
                </div>

                {/* Activity Timeline (Chart Placeholder) */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs col-span-1 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900">Activity Trends</h3>
                         <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-black"></span>
                                <span className="text-gray-600">Downloads</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-brand-gold"></span>
                                <span className="text-gray-600">Campaigns</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* CSS Bar Chart Simulation for Timeline */}
                    <div className="h-64 flex items-end justify-between gap-2 pt-4 px-2">
                        {timeline.map((item, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 flex-1 group relative">
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-black text-white text-[10px] px-2 py-1 rounded-sm shadow-lg whitespace-nowrap z-10">
                                    {item.downloads} Downloads / {item.launches} Launches
                                </div>
                                
                                <div className="w-full max-w-[24px] flex flex-col items-center gap-1 h-full justify-end">
                                    {/* Campaign Marker */}
                                    <div 
                                        className="w-full bg-brand-gold/40 rounded-t-sm" 
                                        style={{ height: `${item.launches * 10}px`, minHeight: '4px' }}
                                    ></div>
                                    {/* Downloads Bar */}
                                    <div 
                                        className="w-full bg-gray-900 rounded-t-sm transition-all hover:bg-indigo-600" 
                                        style={{ height: `${(item.downloads / 1300) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium uppercase">{item.month}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
