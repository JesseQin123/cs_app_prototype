import React, { useState } from 'react';
import { Download, Calendar, Filter, ChevronDown } from 'lucide-react';
import OverviewTab from './components/OverviewTab';
import PartnerPerformanceTab from './components/PartnerPerformanceTab';
import ContentInsightsTab from './components/ContentInsightsTab';
import ComplianceTab from './components/ComplianceTab';
import { useToast } from '../../context/ToastContext';

const BrandAnalytics = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { addToast } = useToast();

    const handleExport = () => {
        addToast('Generating Analytics Report...', 'info');
        setTimeout(() => {
            addToast('Report downloaded successfully.', 'success');
        }, 1500);
    };

    const TABS = [
        { id: 'overview', label: 'Overview' },
        { id: 'partner', label: 'Partner Performance' },
        { id: 'content', label: 'Campaign Insights' },
        { id: 'compliance', label: 'Compliance' }
    ];

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* [A] Header with Global Filters */}
            <div className="bg-white border-b border-gray-200 px-8 pt-5 pb-0 flex flex-col gap-4 sticky top-0 z-20 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Analytics</h1>
                        <p className="text-gray-500 text-sm">Insights into partner adoption, asset performance, and network growth.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                         {/* Action Button */}
                        <button 
                            onClick={handleExport}
                            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-xs flex items-center gap-2"
                        >
                            <Download size={16}/> Export Report
                        </button>
                    </div>
                </div>

                {/* Filters Removed from here - moved to individual tabs as requested */}

                {/* Tabs */}
                <div className="flex items-center gap-8">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 text-sm font-medium transition relative ${
                                activeTab === tab.id ? 'text-black' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute -bottom-px left-0 w-full h-0.5 bg-black rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* [B] Tab Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                    {activeTab === 'overview' && <OverviewTab />}
                    {activeTab === 'partner' && <PartnerPerformanceTab />}
                    {activeTab === 'content' && <ContentInsightsTab notify={addToast} />}
                    {activeTab === 'compliance' && <ComplianceTab />}
                </div>
            </div>
        </div>
    );
};

export default BrandAnalytics;
