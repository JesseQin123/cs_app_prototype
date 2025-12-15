import React, { useState } from 'react';
import Drawer from '../../components/Drawer';
import { AlertCircle, ChevronDown, ChevronUp, CheckCircle2, MoreHorizontal, Bell, Clock, ShieldAlert } from 'lucide-react';
import { attentionData } from '../../data/mockStore/attentionStore';
import NudgeModal, { RISKS } from '../features/partner/NudgeModal';
import { useToast } from '../context/ToastContext';
import PortalTooltip from './PortalTooltip';

const RiskGroupAccordion = ({ group, isExpanded, onToggle, onNudgeSingle, onNudgeBulk, resolvedIds, onSnooze }) => {
    // Filter out resolved items
    const activeItems = group.items.filter(item => !resolvedIds.includes(item.id));
    const isGroupResolved = activeItems.length === 0;

    if (isGroupResolved && !isExpanded) return null; // Hide if empty and collapsed

    // Color Styles based on Risk Level
    const styles = {
        high: {
            bg: 'bg-red-50',
            border: 'border-red-100',
            text: 'text-red-700',
            badge: 'bg-red-100 text-red-700',
            icon: 'text-red-500', 
            button: 'bg-white text-red-600 border-red-200 hover:bg-red-50'
        },
        medium: {
            bg: 'bg-orange-50',
            border: 'border-orange-100',
            text: 'text-orange-700',
            badge: 'bg-orange-100 text-orange-700',
            icon: 'text-orange-500',
            button: 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50'
        },
        low: {
            bg: 'bg-gray-50',
            border: 'border-gray-200',
            text: 'text-gray-700',
            badge: 'bg-gray-200 text-gray-600',
            icon: 'text-gray-400',
            button: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
        }
    }[group.riskLevel];

    return (
        <div className={`border rounded-xl transition-all overflow-hidden ${isExpanded ? 'shadow-md border-gray-200 bg-white' : `${styles.bg} ${styles.border} mb-3`}`}>
            {/* Accordion Header */}
            <div 
                className={`px-4 py-3 flex items-center justify-between cursor-pointer select-none transition ${isExpanded ? 'bg-white border-b border-gray-100' : ''}`}
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${styles.bg}`}>
                        <AlertCircle size={16} className={styles.icon} />
                    </div>
                    <div>
                        <div className={`text-sm font-bold flex items-center gap-2 ${isExpanded ? 'text-gray-900' : styles.text}`}>
                            {group.title}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${styles.badge}`}>
                                {activeItems.length}
                            </span>
                        </div>
                        <div className="text-[10px] font-medium opacity-70 uppercase tracking-wide">
                            {group.subtext}
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {!isExpanded && (
                         <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onNudgeBulk(group, activeItems);
                            }}
                            className={`text-[10px] font-bold px-3 py-1.5 rounded-sm border transition shadow-xs flex items-center gap-1 ${styles.button}`}
                         >
                            {group.action} <span className="opacity-60">({activeItems.length})</span>
                         </button>
                    )}
                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-gray-400' : styles.text}`}>
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>

            {/* Accordion Body */}
            <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                    {activeItems.map((retailer) => (
                        <div 
                            key={retailer.id} 
                            className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition group relative"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                    {retailer.avatar}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                                        {retailer.name}
                                        <span className={`text-[9px] px-1 py-0.5 rounded border ${
                                            retailer.tier === 'Platinum' ? 'bg-slate-100 border-slate-200 text-slate-600' : 
                                            retailer.tier === 'Gold' ? 'bg-amber-50 border-amber-100 text-amber-600' : 
                                            'bg-gray-50 border-gray-100 text-gray-400'
                                        }`}>
                                            {retailer.tier}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium">
                                        {retailer.detail}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
                                {/* Snooze Button */}
                                <PortalTooltip content="Snooze 7d">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSnooze(retailer.id);
                                        }}
                                        className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                                    >
                                        <Clock size={16} />
                                    </button>
                                </PortalTooltip>

                                {/* Nudge Button */}
                                <PortalTooltip content={group.id === 'incomplete' ? 'Remind' : 'Send Nudge'}>
                                    <button 
                                        onClick={() => onNudgeSingle(retailer)}
                                        className="p-2 rounded-full text-black bg-gray-100 hover:bg-black hover:text-white transition shadow-xs border border-gray-200 hover:border-black"
                                    >
                                        <Bell size={16} />
                                    </button>
                                </PortalTooltip>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Bulk Action Footer in Expanded View */}
                <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-center">
                    <button 
                         onClick={() => onNudgeBulk(group, activeItems)}
                         className={`text-xs font-bold px-4 py-2 rounded-lg border transition shadow-xs w-full flex items-center justify-center gap-2 ${styles.button}`}
                         disabled={activeItems.length === 0}
                    >
                        {group.action} <span className="opacity-60">({activeItems.length})</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const PartnerAttentionDrawer = ({ isOpen, onClose }) => {
    const { addToast } = useToast();
    const [resolvedIds, setResolvedIds] = useState([]); // Track resolved Retailer IDs
    const [expandedGroup, setExpandedGroup] = useState('disconnected'); // Default open high risk

    // Nudge Modal State
    const [nudgeModalState, setNudgeModalState] = useState({
        isOpen: false,
        mode: 'single', // 'single' | 'bulk'
        retailer: null, // For single
        retailers: [], // For bulk
        riskType: RISKS.GENERIC,
        targetIds: [] // IDs to resolve on success
    });

    // Reset state when drawer opens (optional, maybe we want persistence)
    // useEffect(() => { if(isOpen) setResolvedIds([]); }, [isOpen]);

    const handleSingleNudge = (retailer) => {
        setNudgeModalState({
            isOpen: true,
            mode: 'single',
            retailer: retailer,
            retailers: [retailer],
            riskType: RISKS[retailer.riskType] || RISKS.GENERIC,
            targetIds: [retailer.id]
        });
    };

    const handleBulkNudge = (group, activeItems) => {
        // Map group ID to Risk Const
        const risks = {
            'disconnected': RISKS.INACTIVE,
            'disengaged': RISKS.ZERO_ACTIONS,
            'incomplete': RISKS.INCOMPLETE
        };

        setNudgeModalState({
            isOpen: true,
            mode: 'bulk',
            retailer: null,
            retailers: activeItems,
            riskType: risks[group.id] || RISKS.GENERIC,
            targetIds: activeItems.map(i => i.id)
        });
    };
    
    // Snooze Logic
    const handleSnooze = (id) => {
        setResolvedIds(prev => [...prev, id]);
        addToast('Retailer snoozed for 7 days', 'neutral');
    };

    const handleSendSuccess = (data) => {
        addToast(`Action sent to ${data.count} retailer(s).`, 'success');
        
        // Optimistic UI: Mark IDs as resolved
        if(nudgeModalState.targetIds.length > 0) {
            setResolvedIds(prev => [...prev, ...nudgeModalState.targetIds]);
        }
        
        setNudgeModalState(prev => ({ ...prev, isOpen: false }));
    };

    // Calculate total remaining count
    const totalRemaining = attentionData.groups.reduce((acc, group) => {
        const remainingInGroup = group.items.filter(i => !resolvedIds.includes(i.id)).length;
        return acc + remainingInGroup;
    }, 0);

    // Auto-close if all resolved? Maybe just show empty state.
    
    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <ShieldAlert className="text-red-600" size={20} />
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                    </div>
                    <span className="font-bold text-gray-900 text-lg">Needs Attention</span>
                    {totalRemaining > 0 && (
                        <span className="bg-red-100 text-red-600 text-xs font-extrabold px-2 py-0.5 rounded-full ml-1">
                            {totalRemaining}
                        </span>
                    )}
                </div>
            }
        >
            <div className="px-6 py-6 pb-24">
                {/* Intro Context */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <div className="bg-white p-2 rounded-full border border-gray-100 shadow-xs text-gray-500">
                        <Clock size={16} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">Retailers requiring intervention</h4>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            These partners are exhibiting risk behaviors. Timely communication can prevent churn and improve adoption rates.
                        </p>
                    </div>
                </div>

                {/* Groups */}
                <div className="space-y-4">
                    {attentionData.groups.map(group => (
                        <RiskGroupAccordion 
                            key={group.id} 
                            group={group} 
                            isExpanded={expandedGroup === group.id}
                            onToggle={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                            onNudgeSingle={handleSingleNudge}
                            onNudgeBulk={handleBulkNudge}
                            onSnooze={handleSnooze}
                            resolvedIds={resolvedIds}
                        />
                    ))}
                    
                    {totalRemaining === 0 && (
                        <div className="text-center py-12 opacity-50">
                            <CheckCircle2 size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-gray-900 font-bold">All Caught Up!</h3>
                            <p className="text-sm text-gray-500">Great job clearing the risk queue.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Smart Nudge Modal Integration */}
            <NudgeModal 
                isOpen={nudgeModalState.isOpen}
                onClose={() => setNudgeModalState(prev => ({ ...prev, isOpen: false }))}
                mode={nudgeModalState.mode}
                retailer={nudgeModalState.retailer}   // For single
                retailers={nudgeModalState.retailers} // For bulk
                riskType={nudgeModalState.riskType}
                onSend={handleSendSuccess}
            />
        </Drawer>
    );
};

export default PartnerAttentionDrawer;
