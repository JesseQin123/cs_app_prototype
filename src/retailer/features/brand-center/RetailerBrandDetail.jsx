import React from 'react';
import { ArrowLeft } from 'lucide-react';

const RetailerBrandDetail = ({ brand, onBack }) => {
  if (!brand) return null;

  return (
    <div className="p-8">
       <button 
         onClick={onBack}
         className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition"
       >
         <ArrowLeft size={16} />
         Back to Brands
       </button>

       <div className="bg-white rounded-xl border-gray-200 p-8 shadow-xs text-center py-20">
          <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white mb-6 shadow-lg overflow-hidden ${brand.logo?.startsWith('bg-') ? brand.logo : 'bg-white'}`}>
              {brand.logo?.startsWith('bg-') ? (
                 brand.name.substring(0,1)
              ) : (
                 <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
              )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{brand.name}</h1>
          <p className="text-gray-500 max-w-md mx-auto">
             This is the brand detail view for {brand.name}. Here you will see all campaigns, resources, and specific information for this brand.
          </p>
          <div className="mt-8 p-4 bg-gray-50 rounded-lg inline-block border border-gray-100 text-sm text-gray-400">
             Brand Detail View Placeholder
          </div>
       </div>
    </div>
  );
};

export default RetailerBrandDetail;
