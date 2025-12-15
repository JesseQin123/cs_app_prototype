
import React, { useState } from 'react';
import { Plus, List, Calendar, Rocket, X, ArrowRight } from 'lucide-react';
import ActivityList from './components/ActivityList';
import ActivityCalendar from './components/ActivityCalendar';
import CreditWallet from './components/CreditWallet';
import { retailerActivityData } from '@/data/mockStore/retailerActivityStore';
import * as Dialog from '@radix-ui/react-dialog';

const MyMarketing = ({ onNavigate }) => {
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
    const [activities, setActivities] = useState(retailerActivityData.activities);
    const [showNewActivityModal, setShowNewActivityModal] = useState(false);

    const handleDuplicate = (id) => {
        const original = activities.find(a => a.id === id);
        if (!original) return;

        const newActivity = {
            ...original,
            id: `act-${Date.now()}`,
            internalName: `${original.internalName} (Copy)`,
            status: 'Draft',
            performance: { metric: '--', value: '' },
            updatedAt: new Date().toISOString(),
            scheduledDate: null,
            author: { name: 'You', avatar: null } // Mock current user
        };

        setActivities([newActivity, ...activities]);
        // Ideally navigate to editor here
        // navigate(`/editor/${newActivity.id}`);
        alert(`Duplicated! Redirecting to Editor for "${newActivity.internalName}"...`);
    };

    const handleNewActivity = () => {
        setShowNewActivityModal(true);
    };

    const goToBrandCenter = () => {
        onNavigate('brand-center-campaigns');
    };

    // Calculate Empty State
    const isEmpty = activities.length === 0;

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="flex-none px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white z-20">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Marketing</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your campaigns, schedule posts, and track performance.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* Credit Wallet */}
                    <CreditWallet />

                    <div className="h-8 w-px bg-gray-200"></div>

                    {/* View Switcher */}
                    <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            title="List View"
                        >
                            <List size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('calendar')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'calendar' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Calendar View"
                        >
                            <Calendar size={18} />
                        </button>
                    </div>

                    {/* Primary Action */}
                    <button 
                        onClick={handleNewActivity}
                        className="bg-black text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={16} /> <span>New Activity</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative px-8 py-6">
                {isEmpty ? (
                    // Empty State
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gray-50/30">
                        <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center mb-6">
                            <Rocket size={40} className="text-brand-gold" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Launch your first marketing activity!</h2>
                        <p className="text-gray-500 max-w-md mb-8">You haven't created any campaigns yet. Visit the Brand Center to find ready-to-use assets from your partners.</p>
                        
                        <div className="flex flex-col items-center gap-4">
                            <button 
                                onClick={goToBrandCenter}
                                className="bg-brand-gold text-white text-sm font-bold px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                                <span>Browse Brand Center</span>
                                <ArrowRight size={16} />
                            </button>
                            <a href="#" className="text-xs text-gray-400 hover:text-gray-600 underline decoration-gray-300 underline-offset-2">
                                How to send an email campaign?
                            </a>
                        </div>
                    </div>
                ) : (
                    // Active View
                    viewMode === 'list' ? (
                        <ActivityList activities={activities} onDuplicate={handleDuplicate} />
                    ) : (
                        <ActivityCalendar activities={activities} />
                    )
                )}
            </div>

            {/* New Activity Modal (MVP) */}
            <Dialog.Root open={showNewActivityModal} onOpenChange={setShowNewActivityModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity animate-in fade-in" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl z-50 p-0 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Plus size={24} className="text-gray-900" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Select a Campaign</h3>
                            <p className="text-sm text-gray-500 mb-6 px-4">
                                To create a new activity, please select a campaign from your Brand partners. You'll be redirected to the Brand Center to pick a source.
                            </p>
                            
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setShowNewActivityModal(false)}
                                    className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors text-xs uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={goToBrandCenter}
                                    className="flex-1 py-2.5 px-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-sm text-xs uppercase tracking-wider whitespace-nowrap"
                                >
                                    Browse Brand Center
                                </button>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

        </div>
    );
};

export default MyMarketing;
