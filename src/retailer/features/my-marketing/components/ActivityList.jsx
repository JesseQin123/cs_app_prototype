
import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Edit, BarChart2, Copy, Trash2, Mail, ExternalLink, XCircle, MessageSquare, Instagram, Facebook, Twitter, MapPin } from 'lucide-react';
import DropdownSelect from '@/components/common/DropdownSelect';
import { getCampaignById } from '@/data/mockStore/retailerActivityStore';
import * as Popover from '@radix-ui/react-popover';

const STATUS_CONFIG = {
    'Draft': 'bg-gray-100 text-gray-600 border-gray-200',
    'Scheduled': 'bg-blue-50 text-blue-700 border-blue-100',
    'Sent': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Posted': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Failed': 'bg-red-50 text-red-700 border-red-100',
};

import ActivityPerformanceDrawer from './ActivityPerformanceDrawer';

const ActivityList = ({ activities, onDuplicate }) => {
    // Local Filters State
    const [searchQuery, setSearchQuery] = useState('');
    const [brandFilter, setBrandFilter] = useState('All');
    const [channelFilter, setChannelFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const handleViewPerformance = (activity) => {
        setSelectedActivity(activity);
        setIsDrawerOpen(true);
    };

    // Filter Logic
    const filteredActivities = activities.filter(act => {
        // TEMPORARY: Hide SMS as per requirement
        if (act.type === 'sms') return false;

        const matchesSearch = act.internalName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBrand = brandFilter === 'All' || act.brandId === brandFilter; // Simplified Brand ID check
        const matchesChannel = channelFilter === 'All' || act.type.toLowerCase() === channelFilter.toLowerCase();
        const matchesStatus = statusFilter === 'All' 
            ? true 
            : statusFilter === 'Published' 
                ? ['Sent', 'Posted'].includes(act.status)
                : act.status === statusFilter;
        return matchesSearch && matchesBrand && matchesChannel && matchesStatus;
    });

    const hasFilters = brandFilter !== 'All' || channelFilter !== 'All' || statusFilter !== 'All' || searchQuery;

    const clearFilters = () => {
        setSearchQuery('');
        setBrandFilter('All');
        setChannelFilter('All');
        setStatusFilter('All');
    };

    const getBrandName = (brandId) => {
        // Mock lookup, ideally from brandStore
        if (brandId === 'b-verragio') return 'Verragio';
        if (brandId === 'b-rolex') return 'Rolex';
        if (brandId === 'b-cartier') return 'Cartier';
        return 'Brand';
    };

    return (
        <>
        <div className="flex flex-col h-full">
            {/* Unified Card Container */}
            <div className="flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                
                {/* 1. Integrated Filter Header (Workbench Style) */}
                <div className="flex-none px-6 py-5 border-b border-gray-100 flex flex-wrap items-center gap-4 bg-white">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[240px] max-w-sm">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search activity name..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-gray-200 transition-all font-medium placeholder:text-gray-400"
                        />
                    </div>

                    <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                    {/* Filters */}
                    <div className="flex items-center gap-2">
                        <DropdownSelect 
                            label="Brand"
                            options={['All', 'Verragio', 'Rolex', 'Cartier']} 
                            value={brandFilter === 'All' ? 'All' : getBrandName(brandFilter)}
                            onChange={(val) => setBrandFilter(val === 'Verragio' ? 'b-verragio' : val === 'Rolex' ? 'b-rolex' : val === 'Cartier' ? 'b-cartier' : 'All')}
                        />
                        <DropdownSelect 
                            label="Channel"
                            options={['All', 'Email', 'Social']}
                            value={channelFilter}
                            onChange={setChannelFilter}
                        />
                        <DropdownSelect 
                            label="Status"
                            options={['All', 'Draft', 'Scheduled', 'Published', 'Failed']}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        />
                    </div>

                    {/* Clear Filter */}
                    {hasFilters && (
                        <button 
                            onClick={clearFilters}
                            className="ml-auto flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-500 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                        >
                            <XCircle size={14} /> Clear
                        </button>
                    )}
                </div>

                {/* 2. Table Area */}
                <div className="flex-1 overflow-auto bg-white">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead className="bg-white border-b border-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[20%]">Activity Name</th>
                                <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[12%]">Brand</th>
                                <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[16%]">Source Campaign</th>
                                <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[10%]">Date</th>
                                <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[10%]">Channel</th>
                                <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[10%]">Status</th>
                                <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[10%]">Performance</th>
                                <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right w-[12%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredActivities.length > 0 ? (
                                filteredActivities.map((act) => {
                                    const sourceCampaign = getCampaignById(act.campaignId);
                                    const statusClass = STATUS_CONFIG[act.status] || STATUS_CONFIG['Draft'];
                                    const brandName = getBrandName(act.brandId);
                                    const canViewPerformance = ['Sent', 'Posted'].includes(act.status);

                                    return (
                                        <tr key={act.id} className="group hover:bg-gray-50/50 transition-colors">
                                            {/* Name */}
                                            <td className="py-4 px-6 align-middle">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-900 group-hover:text-black transition-colors cursor-pointer">{act.internalName}</span>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        {act.author?.avatar ? (
                                                            <img src={act.author.avatar} alt={act.author.name} className="w-4 h-4 rounded-full object-cover border border-gray-100" />
                                                        ) : (
                                                            <div className="w-4 h-4 rounded-full bg-gray-200" />
                                                        )}
                                                        <span className="text-[10px] text-gray-400 font-medium">{act.author?.name}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Brand */}
                                            <td className="py-4 px-6 align-middle">
                                                <div className="flex items-center gap-2">
                                                    {/* Mock Logo */}
                                                    <div className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500 overflow-hidden shadow-sm">
                                                        {['Verragio', 'Rolex', 'Cartier'].includes(brandName) ? (
                                                             brandName.substring(0,1).toUpperCase()
                                                        ) : brandName.substring(0,2).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-600">{brandName}</span>
                                                </div>
                                            </td>

                                            {/* Source */}
                                            <td className="py-4 px-6 align-middle">
                                                <div className="flex items-center gap-1 group/link cursor-pointer">
                                                    <span className="text-xs text-gray-500 truncate max-w-[140px] group-hover/link:text-gray-900 group-hover/link:underline transition-colors">{sourceCampaign?.title || 'Unknown Source'}</span>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="py-4 px-6 align-middle">
                                                <span className="text-xs font-medium text-gray-600 whitespace-nowrap bg-gray-50 px-2 py-1 rounded">
                                                    {act.scheduledDate || act.updatedAt ? new Date(act.scheduledDate || act.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '--'}
                                                </span>
                                            </td>

                                            {/* Channel */}
                                            <td className="py-4 px-6 align-middle">
                                                <div className="flex items-center">
                                                    <ChannelIcon type={act.type} platform={act.platform} />
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-6 align-middle">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border ${statusClass}`}>
                                                    {act.status}
                                                </span>
                                            </td>

                                            {/* Performance */}
                                            <td className="py-4 px-6 align-middle">
                                                {act.performance.metric !== "--" ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-900">{act.performance.value}</span>
                                                        <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">{act.performance.metric}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-300 text-xs">-</span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 align-middle text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {canViewPerformance && (
                                                         <button 
                                                            onClick={() => handleViewPerformance(act)}
                                                            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                                                            title="View Activity Performance"
                                                         >
                                                            <BarChart2 size={16} />
                                                         </button>
                                                    )}
                                                    
                                                    <Popover.Root>
                                                        <Popover.Trigger asChild>
                                                            <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors outline-none focus:outline-none">
                                                                <MoreHorizontal size={16} />
                                                            </button>
                                                        </Popover.Trigger>
                                                        <Popover.Portal>
                                                            <Popover.Content className="w-48 bg-white border border-gray-100 rounded-lg shadow-xl p-1 z-50 animate-in fade-in zoom-in-95" align="end" sideOffset={5}>
                                                                 <div className="flex flex-col gap-0.5">
                                                                    {/* Edit */}
                                                                    <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-md text-left w-full transition-colors">
                                                                        <Edit size={14} className="text-gray-400" /> Edit Activity
                                                                    </button>

                                                                    <div className="h-px bg-gray-100 my-1"></div>

                                                                    {/* Duplicate */}
                                                                    <button 
                                                                        onClick={() => onDuplicate && onDuplicate(act.id)}
                                                                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-md text-left w-full transition-colors"
                                                                    >
                                                                        <Copy size={14} className="text-gray-400" /> Duplicate
                                                                    </button>

                                                                    {/* Delete */}
                                                                    <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md text-left w-full transition-colors">
                                                                        <Trash2 size={14} /> Delete
                                                                    </button>
                                                                 </div>
                                                            </Popover.Content>
                                                        </Popover.Portal>
                                                    </Popover.Root>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" className="py-24 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <Search size={32} className="mb-3 text-gray-200" />
                                            <p className="text-sm font-medium">No activities match your filters</p>
                                            <button onClick={clearFilters} className="mt-2 text-xs text-brand-gold hover:underline">Clear all filters</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Performance Drawer */}
        <ActivityPerformanceDrawer 
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            activity={selectedActivity}
        />
        </>
    );
};

// Helper: Channel Icon
const ChannelIcon = ({ type, platform }) => {
    if (type === 'email') {
        return <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600" title="Email"><Mail size={12}/></div>;
    }
    if (type === 'sms') {
        return <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-purple-600" title="SMS"><MessageSquare size={12}/></div>;
    }
    
    // Social
    const getPlatformIcon = (p) => {
        const lowerP = (p || '').toLowerCase();
        switch(lowerP) {
            case 'instagram': return <Instagram size={14} className="text-pink-600"/>;
            case 'facebook': return <div className="w-3.5 h-3.5 bg-blue-600 rounded-full flex items-center justify-center text-[9px] text-white font-bold">f</div>;
            case 'x': 
            case 'twitter': return <div className="w-3.5 h-3.5 bg-black rounded-sm flex items-center justify-center text-white font-black text-[10px]">𝕏</div>;
            case 'google':
            case 'gmb': 
            case 'google business profile': return <div className="w-3.5 h-3.5 rounded-sm flex items-center justify-center text-white font-bold text-[9px]" style={{backgroundColor: '#4285F4'}}>G</div>;
            default: return null;
        }
    };

    // If platform is array, render stack
    if (Array.isArray(platform)) {
         return (
             <div className="flex items-center -space-x-1.5">
                 {platform.map((p, idx) => (
                      <div key={idx} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shadow-sm z-10 relative border border-white">
                          {getPlatformIcon(p)}
                      </div>
                 ))}
             </div>
         );
    }

    // Default single
    return (
        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shadow-sm border border-white">
            {getPlatformIcon(platform) || getPlatformIcon(type)}
        </div>
    );
};

export default ActivityList;
