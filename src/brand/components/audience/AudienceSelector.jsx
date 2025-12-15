import React, { useState } from 'react';
import { Globe, Target, Lock, ChevronRight, Users, PlusCircle } from 'lucide-react';
import SegmentSelector from './SegmentSelector';
import RetailerPicker from './RetailerPicker';
import { getRetailerCount } from '../../../data/mockStore/retailerStore';

/**
 * Universal Audience Selector
 * 
 * @param {Object} value - Current value { type: 'all' | 'segment' | 'specific', segments: [], retailers: [] }
 * @param {Function} onChange - Callback (newValue) => void
 * @param {Boolean} readOnly - Render read-only view
 */
const AudienceSelector = ({ 
  value = { type: 'all', segments: [], retailers: [] }, 
  onChange, 
  readOnly = false 
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const totalRetailersCount = getRetailerCount(); // 152 mock

  const handleTypeChange = (newType) => {
    if (readOnly) return;
    onChange({ ...value, type: newType });
  };

  const handleSegmentsChange = (newSegments) => {
    onChange({ ...value, segments: newSegments });
  };

  const handleRetailersConfirm = (ids) => {
    onChange({ ...value, retailers: ids });
    setIsPickerOpen(false);
  };

  // --- Read Only View ---
  if (readOnly) {
     return (
        <div className="items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 inline-flex">
           {value.type === 'all' && <><Globe size={14}/> <span>All Retailers ({totalRetailersCount})</span></>}
           {value.type === 'segment' && (
              <>
                 <Target size={14}/> 
                 <span>Targeted Segment ({value.segments.length > 0 ? value.segments.map(s => s.label).join(', ') : 'None'})</span>
              </>
           )}
           {value.type === 'specific' && (
              <>
                 <Lock size={14}/> 
                 <span>Specific Retailers ({value.retailers.length})</span>
              </>
           )}
        </div>
     );
  }

  // --- Interactive Edit View ---
  return (
    <div className="space-y-3">
       {/* Option A: All Retailers */}
       <div 
          onClick={() => handleTypeChange('all')}
          className={`border rounded-xl p-4 cursor-pointer transition relative overflow-hidden group ${value.type === 'all' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
       >
          <div className="flex items-start gap-4">
             <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition ${value.type === 'all' ? 'border-black' : 'border-gray-300'}`}>
                {value.type === 'all' && <div className="w-2 h-2 bg-black rounded-full" />}
             </div>
             <div>
                <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                   All Retailers
                   {value.type === 'all' && <span className="text-xs font-normal text-gray-500 bg-white border border-gray-200 px-1.5 py-0.5 rounded-md">{totalRetailersCount}</span>}
                </div>
                <div className="text-xs text-gray-500 mt-1">Distribute to your entire network.</div>
             </div>
          </div>
       </div>

       {/* Option B: By Segment */}
       <div 
          onClick={() => handleTypeChange('segment')}
          className={`border rounded-xl p-4 cursor-pointer transition relative ${value.type === 'segment' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
       >
          <div className="flex items-start gap-4">
             <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition ${value.type === 'segment' ? 'border-black' : 'border-gray-300'}`}>
                {value.type === 'segment' && <div className="w-2 h-2 bg-black rounded-full" />}
             </div>
             <div className="flex-1">
                <div className="font-bold text-gray-900 text-sm">By Segment</div>
                <div className="text-xs text-gray-500 mt-1 mb-2">Target specific zones, tiers, or groups.</div>
                
                {/* Expand on Select */}
                {value.type === 'segment' && (
                   <div className="mt-3 animate-in slide-in-from-top-2 fade-in duration-200" onClick={(e) => e.stopPropagation()}>
                      <SegmentSelector 
                         selectedSegments={value.segments} 
                         onChange={handleSegmentsChange} 
                      />
                   </div>
                )}
             </div>
          </div>
       </div>

       {/* Option C: Specific Retailers */}
       <div 
          onClick={() => handleTypeChange('specific')}
          className={`border rounded-xl p-4 cursor-pointer transition relative ${value.type === 'specific' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
       >
          <div className="flex items-start gap-4">
             <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition ${value.type === 'specific' ? 'border-black' : 'border-gray-300'}`}>
                {value.type === 'specific' && <div className="w-2 h-2 bg-black rounded-full" />}
             </div>
             <div className="flex-1">
                <div className="font-bold text-gray-900 text-sm">Specific Retailers</div>
                <div className="text-xs text-gray-500 mt-1 mb-2">Manually select retailers from the list.</div>

                {/* Expand on Select */}
                {value.type === 'specific' && (
                   <div className="mt-3 animate-in slide-in-from-top-2 fade-in duration-200" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                         <div className="flex items-center gap-3">
                            <div className="bg-gray-100 p-2 rounded-full text-gray-500">
                               <Users size={16} />
                            </div>
                            <div>
                               <div className="text-sm font-bold text-gray-900">
                                  {value.retailers.length === 0 ? 'No retailers selected' : `${value.retailers.length} Retailers selected`}
                               </div>
                               <div className="text-[10px] text-gray-400">
                                  {value.retailers.length === 0 ? 'Click to browse list' : 'Click to edit selection'}
                               </div>
                            </div>
                         </div>
                         <button 
                            type="button"
                            onClick={() => setIsPickerOpen(true)}
                            className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-md hover:bg-gray-800 transition flex items-center gap-1"
                         >
                            {value.retailers.length === 0 ? 'Select' : 'Edit'}
                            <ChevronRight size={12}/>
                         </button>
                      </div>
                   </div>
                )}
             </div>
          </div>
       </div>

       {/* Drawer Portal */}
       <RetailerPicker 
          isOpen={isPickerOpen} 
          onClose={() => setIsPickerOpen(false)} 
          selectedIds={value.retailers}
          onConfirm={handleRetailersConfirm}
       />

    </div>
  );
};

export default AudienceSelector;
