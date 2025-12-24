import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { campaignData } from '../../../data/mockStore/campaignStore';
import BrandCampaignList from './BrandCampaignList';
import CampaignDetail from './campaigns/CampaignDetail';
import CreateCampaignModal from './campaigns/components/CreateCampaignModal';

const CampaignManager = ({ campaigns: initialCampaigns, setCampaigns: setParentCampaigns, notify, retailers }) => {
  // Local state if not provided by parent
  const [localCampaigns, setLocalCampaigns] = useState([]);
  const campaigns = initialCampaigns || localCampaigns;
  const setCampaigns = setParentCampaigns || setLocalCampaigns;

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Initialize with Centralized Mock Data
  useEffect(() => {
    if (campaigns.length === 0) {
        setCampaigns(campaignData.campaigns);
    }
  }, [campaigns, setCampaigns]);

  // Determine which data to pass to the list
  // Merging props with store mocks
  // const effectivePublishableContent = [...(allTemplates || []), ...campaignData.publishableContent];
  // const effectiveFiles = [...(allFiles || []), ...campaignData.downloadableFiles];

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveNewCampaign = (data) => {
     const newCamp = {
        id: `camp-${Date.now()}`,
        title: data.title,
        description: data.description,
        status: 'Draft',
        startDate: data.startDate,
        endDate: data.validityType === 'permanent' ? 'Permanent' : data.endDate,
        cover: 'bg-gray-100', // Fallback
        coverImage: data.coverImage,
        audience: data.audience,
        
        contentType: [],
        downloadableAssets: [],
        publishableContent: [],

        adoptionRate: null,
        usageCount: null,
        views: 0,
        downloads: 0,

        isPinned: false,
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: {
            name: 'You', // Mock current user
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop'
        }
     };
     setCampaigns([newCamp, ...campaigns]);
     setSelectedCampaign(newCamp);
     notify('New Draft Campaign Created', 'success');
  };

  const handleUpdateCampaign = (updatedCampaign) => {
    setCampaigns(campaigns.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
    setSelectedCampaign(updatedCampaign);
    // notify('Campaign updated', 'success'); // Removed to avoid double toast with specific actions
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(campaigns.filter(c => c.id !== id));
      if (selectedCampaign?.id === id) setSelectedCampaign(null);
      notify('Campaign deleted', 'success');
    }
  };

  if (selectedCampaign) {
    return (
      <CampaignDetail 
        campaign={selectedCampaign}
        onBack={() => setSelectedCampaign(null)}
        onUpdate={handleUpdateCampaign}
        notify={notify}
        retailers={retailers}
      />
    );
  }

  return (
    <>
      <div className="flex justify-between items-end mb-6 px-8 pt-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Marketing Campaigns</h1>
          <p className="text-gray-500 text-sm">Distribute seasonal collections and promotional assets to your network.</p>
        </div>
        <button 
            onClick={handleCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition shadow-xs"
        >
            <Plus size={18} /> New Campaign
        </button>
      </div>
      <BrandCampaignList 
        campaigns={campaigns}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        // Removed unused files/templates props as they are now handled via internal campaign structure or no longer needed for list view
        onCreate={handleCreate}
        onSelect={setSelectedCampaign}
        onDelete={handleDelete}
        onPin={(id) => {
          const c = campaigns.find(x => x.id === id);
          const updated = {...c, isPinned: !c.isPinned};
          setCampaigns(campaigns.map(x => x.id === id ? updated : x));
          notify(updated.isPinned ? 'Campaign Pinned' : 'Campaign Unpinned', 'success');
        }}
      />
      <CreateCampaignModal 
         isOpen={isCreateModalOpen}
         onClose={() => setIsCreateModalOpen(false)}
         onSave={handleSaveNewCampaign}
         retailersCount={retailers?.length || 180}
      />
    </>
  );
};

export default CampaignManager;
