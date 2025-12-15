import React, { useState } from 'react';
import { ArrowUpRight, Search, Filter, Eye } from 'lucide-react';
import { analyticsData } from '../../../../data/mockStore/analyticsStore';
import TierBadge from '../../partner/retailers/TierBadge';
import FilterDropdown from './FilterDropdown';

const SegmentationCard = ({ data }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs h-full flex flex-col">
         <h3 className="font-bold text-gray-900 mb-6">Partner Segmentation</h3>
         <div className="flex flex-col items-center gap-6 flex-1 justify-center">
            {/* Donut Chart Visualization (CSS Conic Gradient) */}
            <div className="relative w-40 h-40 rounded-full shrink-0"
                 style={{
                    background: `conic-gradient(
                        ${data[0].color} 0% 25%, 
                        ${data[1].color} 25% 90%, 
                        ${data[2].color} 90% 95%, 
                        ${data[3].color} 95% 100%
                    )`
                 }}
            >
                <div className="absolute inset-0 m-8 bg-white rounded-full flex flex-col items-center justify-center">
                   <span className="text-3xl font-bold text-gray-900">125</span>
                   <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Partners</span>
                </div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-3">
                {data.map((seg, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }}></span>
                            <span className="text-sm text-gray-700 font-medium">{seg.label}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{seg.value}%</span>
                    </div>
                ))}
            </div>
         </div>
    </div>
);

const PartnerPerformanceTab = () => {
    const { segmentation, leaderboard } = analyticsData.partnerPerformance;
    const [search, setSearch] = useState('');
    const [zone, setZone] = useState('All Zones');
    const [tier, setTier] = useState('All Tiers');

    const filteredLeaderboard = leaderboard.filter(r => 
        r.name.toLowerCase().includes(search.toLowerCase()) || 
        r.zone.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
             {/* Tab Filters */}
             <div className="flex flex-wrap items-center gap-3">
                 <FilterDropdown 
                    label="Zone"
                    value={zone} 
                    options={['All Zones', 'Northeast', 'West', 'South', 'Midwest', 'Northwest']} 
                    onChange={setZone} 
                    icon={Filter} 
                 />
                 <FilterDropdown 
                    label="Tier"
                    value={tier} 
                    options={['All Tiers', 'Platinum', 'Gold', 'Silver', 'Default']} 
                    onChange={setTier} 
                    icon={Filter} 
                 />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Segmentation Chart */}
                <div className="lg:col-span-1">
                    <SegmentationCard data={segmentation} />
                </div>

                {/* Leaderboard */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-xs flex flex-col overflow-hidden h-[600px]">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="font-bold text-gray-900">Partner Leaderboard</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search partners..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5 w-64 transition"
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white sticky top-0 z-10 shadow-xs">
                            <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-3 font-medium">Retailer</th>
                                <th className="px-6 py-3 font-medium">Zone</th>
                                <th className="px-6 py-3 font-medium">Last Active</th>
                                <th className="px-6 py-3 font-medium text-right">Campaigns</th>
                                <th className="px-6 py-3 font-medium text-right">Downloads</th>
                                <th className="px-6 py-3 font-medium text-right">Reach</th>
                                <th className="px-6 py-3 font-medium w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredLeaderboard.map((retailer) => (
                                <tr key={retailer.id} className="hover:bg-gray-50 transition cursor-pointer group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">
                                                {retailer.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 text-sm">{retailer.name}</div>
                                                <div className="mt-0.5"><TierBadge tier={retailer.tier} size="xs"/></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{retailer.zone}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{retailer.lastActive}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">{retailer.campaignsJoined}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">{retailer.downloads}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-mono">{retailer.reach}</td>
                                    <td className="px-6 py-4">
                                        <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition opacity-0 group-hover:opacity-100" title="View Profile">
                                            <ArrowUpRight size={16}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
        </div>
    );
};

export default PartnerPerformanceTab;
