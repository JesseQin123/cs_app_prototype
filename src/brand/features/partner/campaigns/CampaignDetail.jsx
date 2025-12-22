import React, { useState } from 'react';
import { ArrowLeft, MoreHorizontal, Settings, Share2, AlertCircle, Clock, Users, Calendar, CheckCircle2, Pin, X } from 'lucide-react';
import { campaignData } from '../../../../data/mockStore/campaignStore'; // Added import
import OverviewTab from './components/OverviewTab';
import ContentTab from './components/ContentTab';
import ContentInsightsTab from './components/ContentInsightsTab';
import SettingsTab from './components/SettingsTab';
import RetailerAdoptionTab from './components/RetailerAdoptionTab';
import ReadinessChecklist from './components/ReadinessChecklist';

const CampaignDetail = ({ campaign, onBack, onUpdate, notify, allFiles, retailers }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: '',
    onConfirm: () => {},
    isDestructive: false
  });

  const closeConfirmation = () => setConfirmation(prev => ({ ...prev, isOpen: false }));

  const [showReadinessModal, setShowReadinessModal] = useState(false);

  const checkReadiness = () => {
      const hasContent = (campaign.assets && campaign.assets.length > 0) || (campaign.templates && campaign.templates.length > 0);
      const hasAudience = campaign.audience && campaign.audience !== 'Unspecified';
      const hasCover = !!campaign.coverImage;
      const hasValidity = !!campaign.startDate && !!campaign.endDate;
      
      return hasContent && hasAudience && hasCover && hasValidity;
  };

  const handlePublishClick = () => {
      if (checkReadiness()) {
          setConfirmation({
            isOpen: true,
            title: 'Publish Campaign?',
            message: `This will make the campaign visible to ${campaign.audience === 'All Retailers' ? 'all retailers' : 'selected retailers'}. They will be notified immediately.`,
            confirmLabel: 'Publish Now',
            onConfirm: () => {
                onUpdate({...campaign, status: 'Active'});
                notify('Campaign Published Successfully', 'success');
                closeConfirmation();
            }
          });
      } else {
          setShowReadinessModal(true);
      }
  };

  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  // Helper to render status badge
  const renderStatusBadge = (status) => {
    const styles = {
      'Draft': 'border border-dashed border-gray-400 text-gray-500',
      'Scheduled': 'bg-blue-50 text-blue-700 border border-blue-100',
      'Active': 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
      'Ended': 'bg-gray-900 text-white border border-gray-900',
      'Maintenance': 'bg-amber-50 text-amber-700 border border-amber-100'
    };

    return (
      <span className={`px-2.5 py-0.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${styles[status] || styles['Draft']}`}>
        {status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
        {status}
      </span>
    );
  };

  // Helper for audience label
  const getAudienceLabel = () => {
     if (campaign.audience === 'All Retailers') return `All Retailers (${retailers?.length || 180})`;
     return campaign.audience || 'Unspecified Audience';
  };

  // Resolve Tab Data based on campaign IDs
  // CRITICAL: Look up fresh campaign object from store to support HMR/Live Editing
  const freshCampaign = campaignData.campaigns.find(c => c.id === campaign.id) || campaign;

  const overviewData = campaignData.overviewMap[freshCampaign.overviewId] || campaignData.overviewMap['draft'];
  const contentData = campaignData.contentMap[freshCampaign.contentId] || campaignData.contentMap['draft-empty'];
  const insightsData = campaignData.insightsMap[freshCampaign.insightsId] || campaignData.insightsMap['empty'];
  const adoptionData = campaignData.adoptionMap[freshCampaign.adoptionId] || campaignData.adoptionMap['empty'];

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* 1. Context Bar (Sticky Header) */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all">
        {/* Background Gradient Hint */}
        <div className="absolute inset-0 bg-linear-to-r from-gray-50 to-white opacity-50 pointer-events-none"></div>
        
        <div className="relative px-6 py-4 flex items-center justify-between gap-6">
          {/* Left: Identity */}
          <div className="flex items-center gap-6 flex-1 min-w-0">
            <button 
              onClick={onBack}
              className="p-2 -ml-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition shrink-0"
            >
              <ArrowLeft size={20} />
            </button>

            {/* Thumbnail */}
            <div className="w-32 aspect-video rounded-lg overflow-hidden shadow-xs border border-gray-200 shrink-0 relative group cursor-pointer bg-gray-100">
              <img 
                src={campaign.coverImage} 
                alt={campaign.title} 
                className="w-full h-full object-cover" 
                onError={(e) => {e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop'}} // Fallback
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"></div>
            </div>

            {/* Title & Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                 <h1 className="text-xl font-bold text-gray-900 leading-tight truncate" title={campaign.title}>{campaign.title}</h1>
                 
                 {/* Pin Button */}
                 <button 
                    onClick={() => onUpdate({...campaign, isPinned: !campaign.isPinned})}
                    className={`p-1.5 rounded-full transition ${campaign.isPinned ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-gray-100'}`}
                    title={campaign.isPinned ? "Unpin Campaign" : "Pin Campaign"}
                 >
                    <Pin size={14} className={campaign.isPinned ? "fill-white" : ""} />
                 </button>
              </div>

              {/* Description (Truncated) */}
              {campaign.description && (
                 <div 
                    onClick={() => setIsDescriptionOpen(true)}
                    className="text-sm text-gray-500 line-clamp-2 mb-3 max-w-2xl cursor-pointer hover:text-gray-700 transition"
                    title="Click to read full description"
                 >
                    {campaign.description}
                 </div>
              )}

              <div className="flex flex-col gap-3">
                  {/* Row 1: Status & Core Metrics */}
                  <div className="flex items-center gap-4 text-xs">
                    {renderStatusBadge(campaign.status)}
                    
                    <span className="w-px h-3 bg-gray-300"></span>
                    
                    <div className="flex items-center gap-4 text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-gray-400"/>
                            <span className="font-medium">
                                {campaign.endDate === 'Permanent' ? 'No Expiration' : `${campaign.startDate} - ${campaign.endDate}`}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                            <Users size={12} className="text-gray-400"/>
                            <span className="font-medium">{getAudienceLabel()}</span>
                        </div>
                    </div>
                  </div>

                  {/* Row 2: Creator Info */}
                  {campaign.createdBy && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="text-gray-400">Created</span>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                            <img src={campaign.createdBy.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                            <span className="font-medium text-gray-900">{campaign.createdBy.name}</span>
                            <span className="text-gray-400">•</span>
                            <span>{campaign.createdAt}</span>
                        </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Menu Button (Moved to Left) */}
            <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition mr-1">
              <MoreHorizontal size={20} />
            </button>



            {campaign.status === 'Draft' && (
              <>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black border border-gray-200 hover:border-gray-300 rounded-lg transition bg-white">
                  Preview as Retailer
                </button>
                <button 
                  onClick={handlePublishClick}
                  className="px-4 py-2 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded-lg shadow-xs transition"
                >
                  Publish Campaign
                </button>
              </>
            )}

            {campaign.status === 'Active' && (
              <>
                <button 
                  onClick={() => setConfirmation({
                    isOpen: true,
                    title: 'End Campaign?',
                    message: 'This will remove the campaign from retailer dashboards. Retailers will no longer be able to access these assets. This action cannot be undone.',
                    confirmLabel: 'End Campaign',
                    isDestructive: true,
                    onConfirm: () => {
                        onUpdate({...campaign, status: 'Ended'});
                        notify('Campaign Ended', 'success');
                        closeConfirmation();
                    }
                  })}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 rounded-lg transition"
                >
                  End Campaign
                </button>
                <button 
                  disabled={!campaign.updatePending}
                  onClick={() => setConfirmation({
                    isOpen: true,
                    title: 'Push Changes?',
                    message: 'Updates made to this campaign will be synced to all retailers. They may receive a notification about the update.',
                    confirmLabel: 'Push Updates',
                    onConfirm: () => {
                        // Mock push logic
                        onUpdate({...campaign, updatePending: false});
                        notify('Changes Pushed to Retailers', 'success');
                        closeConfirmation();
                    }
                  })}
                  className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow-xs transition flex items-center gap-2 ${
                    campaign.updatePending ? 'bg-black hover:bg-gray-800' : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Push Changes
                </button>
              </>
            )}

            {campaign.status === 'Ended' && (
              <button 
                onClick={() => {
                  onUpdate({...campaign, status: 'Active'});
                  notify('Campaign Re-activated', 'success');
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded-lg shadow-xs transition"
              >
                Re-activate
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 flex items-center gap-8 border-t border-gray-100">
          {['Overview', 'Retailers', 'Content Insights', 'Content', 'Settings']
            .filter(tab => !((campaign.status === 'Draft' || campaign.status === 'Scheduled') && (tab === 'Content Insights' || tab === 'Retailers')))
            .map((tab) => {
            const id = tab.toLowerCase();
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Description Modal */}
      {isDescriptionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in" onClick={() => setIsDescriptionOpen(false)}></div>
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">About this Campaign</h3>
                    <button onClick={() => setIsDescriptionOpen(false)} className="p-1 hover:bg-gray-100 rounded-full text-gray-500"><X size={20}/></button>
                </div>
                <div className="prose prose-sm max-w-none text-gray-600">
                    <p className="whitespace-pre-wrap">{campaign.description}</p>
                </div>
            </div>
        </div>
      )}

      {/* 2. Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="w-full mx-auto">
          {activeTab === 'overview' && (
            <div className="p-6">
                <OverviewTab 
                    campaign={campaign} 
                    data={overviewData} 
                    onUpdate={onUpdate} 
                    setActiveTab={setActiveTab} 
                />
            </div>
          )}
          {activeTab === 'retailers' && (
             <div className="p-6">
                <RetailerAdoptionTab 
                    campaign={campaign} 
                    data={adoptionData}
                    retailers={retailers} 
                />
             </div>
          )}
          {activeTab === 'content insights' && (
             <ContentInsightsTab 
                campaign={campaign} 
                data={insightsData}
                retailers={retailers} 
             />
          )}
          {activeTab === 'content' && (
            <div className="p-6">
                <ContentTab 
                    campaign={campaign} 
                    data={contentData} 
                    onUpdate={onUpdate} 
                    notify={notify} 
                    allFiles={allFiles} 
                />
            </div>
          )}
          {activeTab === 'settings' && <div className="p-6"><SettingsTab campaign={campaign} onUpdate={onUpdate} /></div>}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmation.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in" onClick={closeConfirmation}></div>
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-full shrink-0 ${confirmation.isDestructive ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-900'}`}>
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{confirmation.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{confirmation.message}</p>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3 mt-6">
                    <button 
                        onClick={closeConfirmation}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmation.onConfirm}
                        className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow-xs transition ${confirmation.isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-gray-800'}`}
                    >
                        {confirmation.confirmLabel}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Readiness Modal */}
      {showReadinessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in" onClick={() => setShowReadinessModal(false)}></div>
            <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Campaign Not Ready</h3>
                    <button onClick={() => setShowReadinessModal(false)} className="p-1 hover:bg-gray-100 rounded-full text-gray-500"><X size={20}/></button>
                </div>
                <p className="text-gray-500 mb-6">Please complete the following items before publishing this campaign.</p>
                
                <ReadinessChecklist 
                    campaign={campaign} 
                    onGoToContent={() => {
                        setShowReadinessModal(false);
                        setActiveTab('content');
                    }}
                    showHeader={false}
                />

                <div className="flex justify-end mt-6">
                    <button 
                        onClick={() => setShowReadinessModal(false)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};


export default CampaignDetail;
