import React, { useState, useEffect } from 'react';
import { Users, Calendar, Shield, Lock, Unlock, Upload, Image as ImageIcon, X, Check, AlertCircle } from 'lucide-react';
import AudienceSelector from '@/brand/components/audience/AudienceSelector';
import AvailabilitySettings from './AvailabilitySettings';
import FileUploadTrigger from '@/components/FileUploadTrigger';



const SettingsTab = ({ campaign, onUpdate }) => {
  // Local state for buffering changes
  const [localCampaign, setLocalCampaign] = useState(campaign);

  // Sync local state when prop changes
  useEffect(() => {
    // Enrich with audienceData if missing
    let enriched = { ...campaign };
    if (!enriched.audienceData) {
        if (enriched.audience === 'All Retailers') {
            enriched.audienceData = { type: 'all', segments: [], retailers: [] };
        } else if (enriched.audience.includes('Group') || enriched.audience.includes('Segment')) {
            enriched.audienceData = { type: 'segment', segments: [], retailers: [] };
        } else {
            enriched.audienceData = { type: 'specific', segments: [], retailers: [] };
        }
    }
    setLocalCampaign(prev => {
        // Avoid update if identical
        if (JSON.stringify(prev) === JSON.stringify(enriched)) return prev;
        // eslint-disable-next-line
        return enriched;
    });
  }, [campaign]);

  // Derived state for dirty check (fixes ESLint sync-state-in-effect error)
  const isDirty = JSON.stringify(localCampaign) !== JSON.stringify(campaign);

  const handleSave = () => {
    onUpdate(localCampaign);
    // Local state will resync via useEffect when parent updates 'campaign' prop
  };

  const handleCancel = () => {
    setLocalCampaign(campaign);
  };



  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      
      {/* Section 0: General Information */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-1">General Information</h3>
        <p className="text-sm text-gray-500 mb-6">Update the basic details of your campaign.</p>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-6">
           {/* Title */}
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
              <input 
                type="text" 
                value={localCampaign.title}
                onChange={(e) => setLocalCampaign({...localCampaign, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-black/5 font-medium text-gray-900"
                placeholder="e.g., Summer Sale 2024"
              />
           </div>

           {/* Description */}
           <div>
              <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <span className={`text-xs ${localCampaign.description?.length > 1200 ? 'text-red-500' : 'text-gray-400'}`}>
                      {localCampaign.description?.length || 0}/1200
                  </span>
              </div>
              <textarea 
                value={localCampaign.description}
                onChange={(e) => {
                    if (e.target.value.length <= 1200) {
                        setLocalCampaign({...localCampaign, description: e.target.value});
                    }
                }}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-black/5 text-gray-600 resize-none"
                placeholder="Briefly describe the campaign's goal..."
              />
           </div>

           {/* Cover Image */}
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
              <FileUploadTrigger
                  label="Change Cover Image"
                  currentFile={localCampaign.coverImage ? { url: localCampaign.coverImage } : null}
                  onFileSelect={(asset) => setLocalCampaign({...localCampaign, coverImage: asset.url})}
                  requiredAspectRatios={[[16,9]]}
              />
              <p className="text-xs text-gray-500 mt-2">Recommended: 1280x720px (16:9). Max 1MB.</p>
           </div>
        </div>
      </section>

      {/* Section 1: Availability */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Availability</h3>
        <p className="text-sm text-gray-500 mb-6">Define the active timeframe for this campaign.</p>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
           <AvailabilitySettings 
               endDate={localCampaign.endDate}
               onUpdate={(key, value) => setLocalCampaign(prev => ({ ...prev, [key]: value }))}
           />
        </div>
      </section>

      {/* Section 2: Audience */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Audience</h3>
        <p className="text-sm text-gray-500 mb-6">Define which retailers can access this campaign.</p>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
           <AudienceSelector 
              value={localCampaign.audienceData || { type: 'all', segments: [], retailers: [] }}
              onChange={(val) => {
                  let str = 'All Retailers';
                  if (val.type === 'segment') str = 'Targeted Segment';
                  if (val.type === 'specific') str = 'Specific Retailers';
                  
                  setLocalCampaign({
                      ...localCampaign, 
                      audience: str,
                      audienceData: val
                  });
              }}
           />
        </div>
      </section>

      
      {/* Sticky Action Bar */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-transform duration-300 z-50 ${isDirty ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
            <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle size={20} />
                <span className="font-medium">You have unsaved changes</span>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={handleCancel}
                    className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    className="px-6 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition shadow-lg flex items-center gap-2"
                >
                    <Check size={18} /> Save Changes
                </button>
            </div>
        </div>
      </div>

    </div>
  );
};

export default SettingsTab;
