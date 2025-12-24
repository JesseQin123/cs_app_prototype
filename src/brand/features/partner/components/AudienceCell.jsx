import React, { useState } from 'react';
import { Globe, Users, Filter } from 'lucide-react';
import Popover from '../../../../components/common/Popover';
import { retailers as allRetailers, zones, getRetailerCount } from '../../../../data/mockStore/retailerStore';

const AudienceCell = ({ campaign, showIcon = true, stopPropagation = true }) => {
    const [isOpen, setIsOpen] = useState(false);
    const config = campaign.audienceConfig;

    const timeoutRef = React.useRef(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 100);
    };


    if (!config) {
        if (campaign.audience === 'Unspecified') return <span className="text-gray-400 italic text-xs">Unspecified</span>;
        return (
            <div className="flex items-center gap-2 text-gray-600 text-xs">
                {showIcon && <Globe size={14} className="text-gray-400"/>}
                <span>{campaign.audience}</span>
            </div>
        );
    }

    if (config.type === 'all') {
        const content = (
            <div 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => stopPropagation && e.stopPropagation()}
                className="cursor-default"
            >
                <div className="px-3 py-2 text-xs font-medium text-gray-700 bg-white">
                    Total: {config.count} Retailers
                </div>
            </div>
        );

        return (
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={(e) => stopPropagation && e.stopPropagation()} className="inline-block">
                <Popover
                    isOpen={isOpen}
                    onOpenChange={setIsOpen}
                    stopPropagation={stopPropagation}
                    trigger={
                        <div className="flex items-center gap-2 cursor-help">
                            {showIcon && <Globe size={14} className="text-gray-400 shrink-0"/>}
                            <span className="text-gray-900 text-xs">All Retailers</span>
                        </div>
                    }
                    content={content}
                    position="bottom"
                    className="p-0 border-0"
                />
            </div>
        );
    }

    if (config.type === 'segment') {
        const filters = config.filters || [];
        
        let contentDisplay = (
            <div className="text-xs">
                <span className="font-bold text-gray-900">{filters.length}</span> {filters.length === 1 ? 'Segment' : 'Segments'}
            </div>
        );

        // Robust matching logic for legacy/mock strings
        const checkMatch = (filter, keywords) => {
            const str = String(filter).toLowerCase();
            return keywords.some(k => str.includes(k.toLowerCase()));
        };

        const tierKeywords = ['Platinum', 'Gold', 'Silver', 'T1', 'T2', 'T3', 'Tier'];
        const zoneKeywords = [...zones.map(z => z.label), 'North', 'East', 'South', 'West', 'Zone', 'Coast', 'Canada'];


        // Re-implement with this logic:
        const tFilters = filters.filter(f => checkMatch(f, tierKeywords));
        const zFilters = filters.filter(f => !tFilters.includes(f) && checkMatch(f, zoneKeywords));
        const gFilters = filters.filter(f => !tFilters.includes(f) && !zFilters.includes(f));

        const popoverContent = (
            <div 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => stopPropagation && e.stopPropagation()}
                className="cursor-default"
            >
                <div className="w-64 text-left">
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Applied Filters
                    </div>
                    <div className="p-4 space-y-4">
                        {tFilters.length > 0 && (
                            <div className="space-y-2">
                                <div className="text-[10px] font-semibold text-gray-400 uppercase">Tier</div>
                                <div className="flex flex-wrap gap-2">
                                    {tFilters.map((f, i) => {
                                        let color = 'bg-gray-300';
                                        if (f.includes('Platinum') || f.includes('T1')) color = 'bg-purple-500';
                                        else if (f.includes('Gold') || f.includes('T2')) color = 'bg-amber-400';
                                        
                                        return (
                                            <span key={i} className="flex items-center gap-1.5 text-xs font-medium text-gray-900 border border-gray-100 rounded-full px-2 py-0.5 bg-white shadow-xs">
                                                <span className={`w-1.5 h-1.5 rounded-full ${color}`}></span>
                                                {f}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        
                        {zFilters.length > 0 && (
                            <div className="space-y-2">
                                <div className="text-[10px] font-semibold text-gray-400 uppercase">Zone</div>
                                 <div className="flex flex-wrap gap-2">
                                    {zFilters.map((f, i) => (
                                       <span key={i} className="text-xs text-gray-700 bg-gray-50 border border-gray-100 rounded px-2 py-1">
                                          {f}
                                       </span>
                                    ))}
                                 </div>
                            </div>
                        )}

                        {gFilters.length > 0 && (
                            <div className="space-y-2">
                                <div className="text-[10px] font-semibold text-gray-400 uppercase">Group</div>
                                <div className="flex flex-wrap gap-2">
                                    {gFilters.map((f, i) => (
                                        <span key={i} className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium border border-gray-200 whitespace-nowrap">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500 font-medium rounded-b-md">
                        Est. Total: {getRetailerCount()} Retailers
                    </div>
                </div>
            </div>
        );

        return (
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={(e) => stopPropagation && e.stopPropagation()} className="inline-block">
                <Popover
                    isOpen={isOpen}
                    onOpenChange={setIsOpen}
                    stopPropagation={stopPropagation}
                    trigger={
                        <div className="flex items-center gap-2 cursor-help">
                            {showIcon && <Filter size={14} className="text-gray-400 shrink-0" />}
                            <div className="flex items-center gap-1 overflow-hidden">
                                {contentDisplay}
                            </div>
                        </div>
                    }
                    content={popoverContent}
                    position="bottom"
                />
            </div>
        );
    }

    if (config.type === 'specific') {
        const retailers = config.retailers || [];
        const count = config.count || retailers.length;
        
        const popoverContent = (
            <div 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => stopPropagation && e.stopPropagation()}
                className="cursor-default"
            >
                <div className="w-72 text-left">
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Selected Retailers
                    </div>
                    <div className="max-h-64 overflow-y-auto py-2">
                        {retailers.slice(0, 10).map((name, idx) => {
                            const details = allRetailers.find(r => r.name === name) || {};
                            return (
                                <div key={idx} className="px-4 py-2 flex items-center gap-3 hover:bg-gray-50">
                                    {details.logo ? (
                                        <img src={details.logo} alt={name} className="w-6 h-6 rounded-full border border-gray-200 object-cover" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                            {name.charAt(0)}
                                        </div>
                                    )}
                                    <span className="text-sm text-gray-700 font-medium truncate">{name}</span>
                                </div>
                            );
                        })}
                        {retailers.length > 10 && (
                            <div className="px-4 py-2 text-xs text-gray-500 italic pl-13">
                                + {retailers.length - 10} others
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );

        return (
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={(e) => stopPropagation && e.stopPropagation()} className="inline-block">
                <Popover
                    isOpen={isOpen}
                    onOpenChange={setIsOpen}
                    stopPropagation={stopPropagation}
                    trigger={
                        <div className="flex items-center gap-2 text-gray-600 cursor-help">
                            {showIcon && <Users size={14} className="text-gray-400 shrink-0"/>}
                            <div className="text-xs">
                                <span className="font-bold text-gray-900">{count}</span> Specific
                            </div>
                        </div>
                    }
                    content={popoverContent}
                    position="bottom"
                />
            </div>
        );
    }

    return null;
};

export default AudienceCell;
