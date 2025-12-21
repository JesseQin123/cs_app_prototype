import React, { useState } from 'react';
import { ArrowUpRight, Video, Image as ImageIcon, FileText, Mail, Search, Download, Calendar, Filter } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Bar, Line, ComposedChart } from 'recharts';
import { analyticsData } from '../../../../data/mockStore/analyticsStore';
import FilterDropdown from './FilterDropdown';

const ContentInsightsTab = ({ notify }) => {
    const { topCampaigns, assetPreferences, contentDrilldown } = analyticsData.contentInsights;
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [zone, setZone] = useState('All Zones');

    // Mock Trend Data (Migrated from PerformanceOverview)
    const trendData = [
        { month: 'Jun', reach: 1.2, engagement: 85, invited: 800, participating: 500 },
        { month: 'Jul', reach: 1.5, engagement: 110, invited: 950, participating: 650 },
        { month: 'Aug', reach: 1.8, engagement: 140, invited: 1100, participating: 800 },
        { month: 'Sep', reach: 2.1, engagement: 160, invited: 1200, participating: 950 },
        { month: 'Oct', reach: 2.3, engagement: 175, invited: 1248, participating: 1100 },
        { month: 'Nov', reach: 2.4, engagement: 185, invited: 1250, participating: 1150 },
    ];

    const filteredContent = contentDrilldown.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.source.toLowerCase().includes(search.toLowerCase())
    );

    const getIconForType = (type) => {
        switch (type.toLowerCase()) {
            case 'video': return <Video size={16} className="text-purple-500"/>
            case 'social image': return <ImageIcon size={16} className="text-pink-500"/>
            case 'image': return <ImageIcon size={16} className="text-pink-500"/>
            case 'pdf': return <FileText size={16} className="text-orange-500"/>
            case 'email': return <Mail size={16} className="text-blue-500"/>
            default: return <FileText size={16} className="text-gray-500"/>
        }
    };

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

            {/* Participation & Engagement Trends (Migrated) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Content Impact (Combo) */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs">
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-900">Content Impact</h3>
                      <div className="flex gap-4 text-xs">
                          <span className="flex items-center gap-1.5 text-gray-400"><span className="w-2 h-2 rounded-full bg-[#C5D1C7]"></span> Reach</span>
                          <span className="flex items-center gap-1.5 text-gray-400"><span className="w-2 h-2 rounded-full bg-brand-gold"></span> Engagement</span>
                      </div>
                   </div>
                   <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <ComposedChart data={trendData}>
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} dy={10} />
                            <YAxis yAxisId="left" hide />
                            <YAxis yAxisId="right" orientation="right" hide />
                            <RechartsTooltip 
                                contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                itemStyle={{fontSize: '12px', fontWeight: 500}}
                                separator=": "
                            />
                            <Bar yAxisId="left" dataKey="reach" fill="#C5D1C7" barSize={32} radius={[4, 4, 0, 0]} />
                            <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#b5984d" strokeWidth={3} dot={{r: 3, fill: '#b5984d', strokeWidth: 2, stroke: '#fff'}} />
                         </ComposedChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* Chart 2: Retailer Participation (Double Area) */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs">
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-900">Retailer Participation</h3>
                      <div className="flex gap-4 text-xs">
                          <span className="flex items-center gap-1.5 text-gray-400"><span className="w-2 h-2 rounded-full bg-gray-200"></span> Invited</span>
                          <span className="flex items-center gap-1.5 text-gray-400"><span className="w-2 h-2 rounded-full bg-brand-gold"></span> Participating</span>
                      </div>
                   </div>
                   <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorParticipating" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#b5984d" stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor="#b5984d" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} dy={10} />
                            <RechartsTooltip 
                                contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                itemStyle={{fontSize: '12px', fontWeight: 500}}
                            />
                            <Area type="monotone" dataKey="invited" stroke="#E5E7EB" strokeWidth={2} fill="transparent" strokeDasharray="4 4" />
                            <Area type="monotone" dataKey="participating" stroke="#b5984d" strokeWidth={2} fill="url(#colorParticipating)" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Campaigns Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
                    <h3 className="font-bold text-gray-900 mb-6">Top Performing Campaigns</h3>
                    <div className="space-y-5">
                        {topCampaigns.map((camp, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-gray-700">{camp.title}</span>
                                    <span className="font-bold text-gray-900">{camp.downloadRate}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                     <div 
                                        className="h-full rounded-full bg-brand-gold/50" 
                                        style={{ width: `${camp.downloadRate}%` }}
                                     ></div>
                                </div>
                                <div className="text-xs text-gray-400">{camp.type}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Asset Preferences Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
                    <h3 className="font-bold text-gray-900 mb-6">Asset Type Preferences</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-8 h-full pb-6">
                         {/* Donut Chart Visualization (CSS Conic Gradient) */}
                        <div className="relative w-40 h-40 rounded-full shrink-0"
                             style={{
                                background: `conic-gradient(
                                    ${assetPreferences[0].color} 0% 45%, 
                                    ${assetPreferences[1].color} 45% 75%, 
                                    ${assetPreferences[2].color} 75% 90%, 
                                    ${assetPreferences[3].color} 90% 100%
                                )`
                             }}
                        >
                            <div className="absolute inset-0 m-8 bg-white rounded-full flex flex-col items-center justify-center">
                               <Video size={24} className="text-gray-400 mb-1"/>
                            </div>
                        </div>

                        <div className="flex-1 w-full space-y-4">
                            {assetPreferences.map((pref, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pref.color }}></span>
                                        <span className="text-sm text-gray-700 font-medium">{pref.type}</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{pref.value}%</span>
                                </div>
                            ))}
                             <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400">💡 Insight: Video assets have <span className="font-bold text-gray-600">2x</span> higher download rates than static images this month.</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Drill Down Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-xs flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="font-bold text-gray-900">Content Performance Detail</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search assets..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5 w-64 transition"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50">
                            <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-3 font-medium">Asset Name</th>
                                <th className="px-6 py-3 font-medium">Source</th>
                                <th className="px-6 py-3 font-medium">Type</th>
                                <th className="px-6 py-3 font-medium text-right">Total Downloads</th>
                                <th className="px-6 py-3 font-medium text-right">Usage Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredContent.map(file => (
                                <tr key={file.id} className="hover:bg-gray-50 transition cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-sm bg-gray-100 flex items-center justify-center shrink-0">
                                                {/* Placeholder for Thumb */}
                                                {getIconForType(file.type)} 
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-medium text-gray-900 text-sm truncate max-w-[200px]">{file.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{file.source}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                            {getIconForType(file.type)} {file.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">{file.downloads}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-mono font-bold text-gray-900">{file.usageRate}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ContentInsightsTab;
