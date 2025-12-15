import React from 'react';
import { CheckCircle2, Circle, AlertCircle, ArrowRight } from 'lucide-react';

const ReadinessChecklist = ({ campaign, onGoToContent, showHeader = true }) => {
  // Checklist Logic
  const hasContent = (campaign.assets && campaign.assets.length > 0) || (campaign.templates && campaign.templates.length > 0);
  const hasAudience = campaign.audience && campaign.audience !== 'Unspecified';
  const hasCover = !!campaign.coverImage;
  const hasValidity = !!campaign.startDate && !!campaign.endDate;

  const checklist = [
    { label: 'Campaign Content Added', done: hasContent, required: true },
    { label: 'Target Audience Selected', done: hasAudience, required: true },
    { label: 'Cover Image Uploaded', done: hasCover, required: true },
    { label: 'Validity Period Set', done: hasValidity, required: true },
  ];

  const completedCount = checklist.filter(i => i.done).length;
  const totalCount = checklist.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      {showHeader && (
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-900">Readiness Checklist</h3>
            <span className={`text-sm font-bold ${progress === 100 ? 'text-emerald-600' : 'text-gray-900'}`}>
              {progress}% Ready
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-black'}`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-4">
        {checklist.map((item, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              {item.done ? (
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
              ) : (
                <Circle size={20} className="text-gray-300 shrink-0 group-hover:text-gray-400 transition" />
              )}
              <span className={`text-sm ${item.done ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </div>
            {!item.done && item.label === 'Campaign Content Added' && onGoToContent && (
               <button 
                 onClick={onGoToContent}
                 className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition"
               >
                 Add Content <ArrowRight size={12} />
               </button>
            )}
          </div>
        ))}
      </div>
      
      {!showHeader && progress < 100 && (
          <div className="p-4 bg-amber-50 border-t border-amber-100 flex gap-3">
              <AlertCircle size={20} className="text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800">
                  Please complete all required items before publishing this campaign.
              </p>
          </div>
      )}
    </div>
  );
};

export default ReadinessChecklist;
