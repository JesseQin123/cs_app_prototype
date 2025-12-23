import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Users, Download, Activity, AlertCircle, Eye, Bell, Calendar, Filter, PieChart, MousePointerClick, XCircle, ChevronRight, ShieldAlert, Zap, Info } from 'lucide-react';
import Tooltip from '../../../components/Tooltip';
import { networkOverviewData } from '../../../data/mockStore/networkOverviewStore';
import FilterDropdown from '../analytics/components/FilterDropdown';
import TierBadge from './retailers/TierBadge';
import PartnerAttentionDrawer from '../../components/PartnerAttentionDrawer';
import NudgeModal, { RISKS } from './NudgeModal';
import { useToast } from '../../context/ToastContext';

// Helper for Risk Type
const getRiskType = (retailer) => {
    if (!retailer) return RISKS.GENERIC;
    const { lastActive } = retailer;
    if (lastActive === 'Never') return RISKS.ZERO_ACTIONS;
    if (typeof lastActive === 'string' && lastActive.includes('days ago')) {
        const days = parseInt(lastActive, 10);
        if (days > 30) return RISKS.INACTIVE;
    }
    return RISKS.GENERIC;
};

const KpiCard = ({ kpi, onReview }) => {
    const isUp = kpi.trendDirection === 'up';
    const isNeutral = kpi.trendDirection === 'neutral';
    
    // Icon Mapping based on data or defaults
    const Icon = kpi.iconName === 'Users' ? Users 
        : kpi.iconName === 'PieChart' ? PieChart 
        : kpi.iconName === 'MousePointerClick' ? MousePointerClick
        : kpi.iconName === 'Zap' ? Zap
        : Activity;
        
    // Specific icon assignment if needed, or rely on mapping
    const DisplayIcon = kpi.isAlert ? AlertCircle : (Icon || Activity);

    return (
        <div 
            onClick={onReview}
            className={`p-5 rounded-xl border transition relative flex flex-col shadow-xs h-36 group ${kpi.isAlert ? 'bg-linear-to-br from-red-50 to-white border-red-100 cursor-pointer hover:shadow-md hover:border-red-200' : onReview ? 'bg-white border-gray-200 hover:shadow-md cursor-pointer' : 'bg-white border-gray-200'}`}
        >
            
            {/* Header Section - Fixed Height for Alignment */}
            <div className="flex justify-between items-center h-7 mb-2">
                <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-semibold uppercase tracking-wide ${kpi.isAlert ? 'text-red-700' : 'text-gray-500'}`}>
                        {kpi.label}
                    </span>
                    {kpi.tooltip && (
                        <Tooltip content={kpi.tooltip}>
                             <Info size={12} className={`${kpi.isAlert ? 'text-red-300 hover:text-red-500' : 'text-gray-300 hover:text-gray-500'} transition`}/>
                        </Tooltip>
                    )}
                </div>
                
                 {/* Top Right: Icon for Standard, Navigation Icon for Alert */}
                 {kpi.isAlert || onReview ? (
                     <div className={`relative flex items-center justify-center transition duration-300 ${kpi.isAlert ? 'text-red-500' : 'text-gray-400 opacity-80 group-hover:opacity-100 group-hover:text-black'}`}>
                        
                        {/* Default State: Icon */}
                        <div className="absolute inset-0 flex items-center justify-center transition duration-300 group-hover:scale-0 group-hover:opacity-0 origin-center">
                            {kpi.isAlert ? <ShieldAlert size={18} /> : <DisplayIcon size={18} />}
                        </div>

                        {/* Hover State: Chevron */}
                        <div className="flex items-center justify-center absolute inset-0 transition duration-300 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100">
                             <ChevronRight size={18}/>
                        </div>
                        
                        {/* Spacer to maintain layout height since absolute children don't contribute size */}
                        <div className="w-[18px] h-[18px]"></div>
                     </div>
                 ) : (
                     <DisplayIcon size={18} className="text-gray-400 opacity-80"/>
                 )}
            </div>

            {/* Main Value Section - Top Pinned */}
            <div className="flex items-end gap-2 mb-1">
                 <h3 className={`text-3xl font-bold tracking-tight leading-none ${kpi.isAlert ? 'text-red-600' : 'text-gray-900'}`}>
                    {kpi.value}
                 </h3>
                 {kpi.total && <span className="text-sm text-gray-400 font-medium mb-1">/ {kpi.total}</span>}
            </div>

            {/* Footer Section - Bottom Pinned */}
            <div className="mt-auto">
                 {/* Standard Trend */}
                 {!kpi.isAlert && kpi.trend && (
                    <div className="flex items-center justify-between">
                         <span className="text-[11px] text-gray-400 font-medium">{kpi.description}</span>
                         <span className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${
                            isUp ? 'bg-emerald-50 text-emerald-600' :
                            isNeutral ? 'bg-gray-100 text-gray-600' :
                            'bg-red-50 text-red-600'
                        }`}>
                            {isUp ? <ArrowUpRight size={12} className="mr-1"/> : isNeutral ? <Minus size={12} className="mr-1"/> : <ArrowDownRight size={12} className="mr-1"/>}
                            {kpi.trend}
                        </span>
                    </div>
                )}

                {/* Alert Breakdown Footer */}
                {kpi.isAlert && kpi.breakdown && (
                    <div className="flex items-center justify-between border-t border-red-100/50 pt-2 mt-1">
                        <div className="flex items-center gap-3">
                             {kpi.breakdown.map((item, idx) => {
                                 // Dynamic Icon for breakdown
                                 const ItemIcon = item.icon === 'XCircle' ? XCircle : AlertCircle;
                                 return (
                                     <React.Fragment key={idx}>
                                        <div className="flex items-center gap-1.5" title={item.label}>
                                            <ItemIcon size={12} className={item.color || "text-gray-500"} />
                                            <span className="text-[10px] font-bold text-gray-600">{item.value} {item.label}</span>
                                        </div>
                                        {/* Add separator if not last item */}
                                        {idx < kpi.breakdown.length - 1 && <div className="w-px h-3 bg-red-200"></div>}
                                     </React.Fragment>
                                 );
                             })}
                        </div>
                        {/* Time Context */}
                        <div className="flex items-center gap-1.5 opacity-90">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                            </span>
                            <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Live</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Abstract Zone Map Component - Fixed Responsive
const AbstractMap = ({ data }) => {
    const zones = {
        'Northwest': { col: 1, row: 1 },
        'Midwest': { col: 2, row: 1 },
        'Northeast': { col: 3, row: 1 },
        'West': { col: 1, row: 2 },
        'South Central': { col: 2, row: 2 },
        'Southeast': { col: 3, row: 2 },
    };

    return (
        <div className="relative bg-gray-50/50 rounded-xl border border-gray-200 p-6 flex items-center justify-center min-h-[300px]">
             <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-lg mx-auto">
                {Object.entries(zones).map(([zoneName, pos]) => {
                    const zoneData = data.find(z => z.zone === zoneName) || { adoption: 0, color: 'bg-gray-200' };
                    return (
                        <div 
                            key={zoneName} 
                            className={`aspect-square rounded-lg flex flex-col items-center justify-center p-2 transition cursor-pointer hover:scale-105 shadow-xs border border-white/50 group ${zoneData.color} ${zoneData.adoption > 50 ? 'text-white' : 'text-gray-600'}`}
                            style={{ gridColumn: pos.col, gridRow: pos.row }}
                            title={`${zoneName}: ${zoneData.adoption}% Adoption`}
                        >
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-80 mb-1 text-center leading-tight">{zoneName}</span>
                            <span className="text-lg sm:text-2xl font-bold">{zoneData.adoption}%</span>
                        </div>
                    );
                })}
             </div>
             <div className="absolute bottom-4 right-4 text-xs text-gray-400 font-medium">
                Data: Adoption Rate
             </div>
        </div>
    );
};

const EngagementTimeline = ({ data }) => (
    <div className="h-[300px] flex items-end gap-3 px-4 pb-2 relative"> {/* Added relative to fix tooltip overflow issues/positioning context if needed, though individual items are relative */}
        {data.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group relative">
                 {/* Tooltip - Fixed Position */}
                <div className="opacity-0 group-hover:opacity-100 transition absolute -top-10 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap bg-gray-900 text-white px-2 py-1 rounded-sm shadow-lg pointer-events-none mb-2 text-xs font-medium">
                    {item.downloads} Downloads
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
                
                 {/* Bar */}
                <div 
                    className="w-full bg-brand-gold/40 rounded-t-sm relative transition-all group-hover:bg-brand-gold/60" 
                    style={{ height: `${(item.downloads / 500) * 100}%` }}
                >
                    {/* Line Point Mockup (Campaigns) */}
                    <div 
                        className="absolute w-2 h-2 bg-black rounded-full left-1/2 -translate-x-1/2 -top-1 border-2 border-white shadow-xs z-10"
                        style={{ bottom: `${(item.campaigns / 5) * 100}%` }} 
                        title={`${item.campaigns} Campaigns`}
                    ></div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{item.month}</span>
            </div>
        ))}
    </div>
);

const PartnerOverview = ({ files, campaigns, notify, isEmpty, navigateTo }) => {
    const { kpiData, needsAttentionKPI, zoneMap, engagementTimeline, topPerformers, atRisk } = networkOverviewData;
    const { addToast } = useToast();
    
    // Filters
    const [dateRange, setDateRange] = useState('Last 30 Days');
    
    // Helper to get interaction handler
    const getKpiInteraction = (kpi) => {
        if (kpi.label === 'Active Partners') {
            return () => navigateTo('partner-retailers', { status: 'Active' });
        }
        if (kpi.label === 'Adoption Rate') {
            return () => navigateTo('partner-retailers', { sortBy: 'adoptionRate', sortDir: 'desc' });
        }
        if (kpi.label === 'Partner Actions') {
            return () => navigateTo('analytics'); // Assuming Analytics is the value target
        }
        if (kpi.isAlert) {
            return () => setIsAttentionDrawerOpen(true);
        }
        return undefined;
    };
    
    // Dynamic KPI Data Collection
    const currentKpi = [
        ...(kpiData[dateRange] || kpiData['Last 30 Days']),
        needsAttentionKPI
    ];

    // Modals
    const [isAttentionDrawerOpen, setIsAttentionDrawerOpen] = useState(false);
    const [nudgeModalState, setNudgeModalState] = useState({ 
        isOpen: false, 
        retailer: null, 
        mode: 'single', 
        riskType: RISKS.GENERIC 
    });

    const openNudge = (retailer) => {
        const riskType = getRiskType(retailer);
        setNudgeModalState({ 
            isOpen: true, 
            retailer, 
            mode: 'single', 
            riskType 
        });
    };

    const handleSendNudge = (data) => {
        // data contains { count, subject, message, recipients }
        addToast(`Nudge sent to ${data.count} retailer(s): "${data.subject}"`, 'success');
        setNudgeModalState(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <div className="px-8 py-6 h-full overflow-auto space-y-8 bg-gray-50/30">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Partner Overview</h1>
                    <p className="text-gray-500 text-sm">Monitor the performance and adoption health of your B2B partners.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                     <FilterDropdown 
                        value={dateRange} 
                        options={['Last 30 Days', 'Last 90 Days', 'Last 12 Months']} 
                        onChange={setDateRange} 
                        icon={Calendar} 
                     />
                </div>
            </div>

            {/* Section A: KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentKpi.map(item => {
                    const tooltips = {
                       'Active Partners': "Number of partners who logged into the portal at least once during the selected timeframe.",
                       'Adoption Rate': "The percentage of your total connected network (excluding pending invites) that has logged in or performed an action.",
                       'Partner Actions': "Total count of assets downloaded and marketing activities executed (social posts & emails) by all partners.",
                       'Needs Attention': "Partners flagged as 'Inactive' have not logged in for 30+ days. 'Zero Actions' indicates partners who logged in but did not download or publish content."
                    };

                    return (
                        <KpiCard 
                            key={item.id} 
                            kpi={{...item, tooltip: tooltips[item.label]}} 
                            onReview={getKpiInteraction(item)}
                        />
                    );
                })}
            </div>

            {/* Section B: Visual Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-6">Zone Performance</h3>
                    <AbstractMap data={zoneMap} />
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-6">Activity Trends</h3>
                    <EngagementTimeline data={engagementTimeline} />
                </div>
            </div>

            {/* Section C: Leaderboards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performers */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Most Engaged Retailers</h3>
                        <button className="text-xs font-medium text-gray-500 hover:text-black">View All</button>
                    </div>
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider font-semibold sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">Retailer</th>
                                    <th className="px-6 py-3">Active</th>
                                    <th className="px-6 py-3 text-right">Downloads</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {topPerformers.map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-3">
                                            <div className="font-medium text-gray-900">{r.name}</div>
                                            <div className="mt-0.5"><TierBadge tier={r.tier} size="xs"/></div>
                                        </td>
                                        <td className="px-6 py-3 text-gray-500">{r.lastActive}</td>
                                        <td className="px-6 py-3 text-right font-medium">{r.downloads}</td>
                                        <td className="px-6 py-3 text-right">
                                             <button className="text-gray-400 hover:text-indigo-600 transition"><ArrowUpRight size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* At Risk */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">At Risk / Inactive</h3>
                        <div className="flex items-center gap-2 text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded-sm">
                            <AlertCircle size={12}/> Needs Attention
                        </div>
                    </div>
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider font-semibold sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">Retailer</th>
                                    <th className="px-6 py-3">Last Active</th>
                                    <th className="px-6 py-3 text-right">Missed</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {atRisk.map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-3">
                                            <div className="font-medium text-gray-900">{r.name}</div>
                                            <div className="text-xs text-gray-400">{r.zone}</div>
                                        </td>
                                        <td className="px-6 py-3 text-red-500 font-medium">{r.lastActive}</td>
                                        <td className="px-6 py-3 text-right font-medium">{r.missingCampaigns}</td>
                                        <td className="px-6 py-3 text-right">
                                             <button 
                                                onClick={() => openNudge(r)}
                                                className="text-gray-500 font-medium hover:text-black text-xs border border-gray-200 hover:border-black px-2 py-1 rounded-sm transition hover:bg-white bg-gray-50"
                                             >
                                                Nudge
                                             </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <PartnerAttentionDrawer 
                isOpen={isAttentionDrawerOpen} 
                onClose={() => setIsAttentionDrawerOpen(false)} 
            />
            
            <NudgeModal 
                isOpen={nudgeModalState.isOpen}
                onClose={() => setNudgeModalState(prev => ({ ...prev, isOpen: false }))}
                mode={nudgeModalState.mode}
                retailer={nudgeModalState.retailer}
                riskType={nudgeModalState.riskType}
                onSend={handleSendNudge}
            />
        </div>
    );
};

export default PartnerOverview;
