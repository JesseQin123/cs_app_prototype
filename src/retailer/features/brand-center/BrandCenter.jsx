import React, { useState } from 'react';
import { Filter, Clock, Download, Pin, FolderOpen } from 'lucide-react';
import AllCampaigns from './AllCampaigns';
import Overview from './Overview';
import PartnerBrands from './PartnerBrands';
import DownloadHistory from './DownloadHistory';
import RetailerBrandDetail from './RetailerBrandDetail';
import { brands } from '../../../data/mockStore/brandStore';

// --- Reusable Page Header ---
const PageHeader = ({ title, subtitle }) => (
    <div className="px-8 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
        <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
);

// --- Mock Data for Retailer View ---

const AllCatalogs = ({ catalogs, brands }) => {
  const [filterBrand, setFilterBrand] = useState('all');
  
  return (
    <div className="space-y-6">
       <div className="flex items-center gap-3 pb-2">
          <Filter size={16} className="text-gray-400"/>
          <select 
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-black focus:border-black block w-full md:w-64 p-2.5"
          >
            <option value="all">All Brands</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {catalogs.map(cat => (
             <div key={cat.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                   <div className={`w-12 h-12 rounded-sm ${cat.cover} flex items-center justify-center`}>
                      <FolderOpen size={20} className="text-gray-700"/>
                   </div>
                   <button className="text-gray-400 hover:text-black"><Download size={18}/></button>
                </div>
                <h3 className="font-medium truncate mb-1">{cat.name}</h3>
                <div className="text-xs text-gray-500 mb-3">Updated {cat.updated}</div>
                <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-sm w-fit">
                   {brands.find(b => b.id === 'b1')?.name}
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

const BrandCenter = ({ view = 'overview', campaigns, catalogs, templates, files, onNavigate }) => {
  const [selectedBrand, setSelectedBrand] = useState(null);
  
  // Local state for internal navigation (like Brand Detail)
  const [internalView, setInternalView] = useState(null); 

  // Reset internal view when main view changes
  React.useEffect(() => {
     setInternalView(null);
  }, [view]);

  const handleSelectBrand = (brand) => {
    setSelectedBrand(brand);
    setInternalView('brand-detail');
  };

  const currentView = internalView || view;

  return (
    <div className="h-full flex flex-col bg-gray-50">
       
       <div className="flex-1 overflow-hidden">
          {currentView === 'overview' && (
             <div className="h-full overflow-auto">
               <PageHeader 
                  title="Brand Center Overview" 
                  subtitle="Your daily snapshot of new releases and brand updates."
               />
               <Overview 
                 campaigns={campaigns} 
                 brands={brands} 
                 templates={templates} 
                 files={files} 
               />
             </div>
           )}
           
           {currentView === 'brands' && (
             <div className="h-full overflow-auto">
               <PageHeader 
                  title="Partner Brands" 
                  subtitle="Access dedicated portals for each of your partners."
               />
               <div className="px-8 pb-8">
                   <PartnerBrands 
                     brands={brands} 
                     onSelectBrand={handleSelectBrand} 
                   />
               </div>
             </div>
           )}

           {currentView === 'brand-detail' && selectedBrand && (
              <div className="h-full overflow-auto">
                 <RetailerBrandDetail 
                    brand={selectedBrand}
                    onBack={() => setInternalView(null)}
                 />
              </div>
           )}

           {currentView === 'campaigns' && (
              <div className="h-full overflow-y-auto flex flex-col">
                  <div className="shrink-0">
                    <PageHeader 
                        title="Campaign Marketplace" 
                        subtitle="Discover and activate new marketing campaigns."
                    />
                  </div>
                  <div className="flex-1">
                      <AllCampaigns 
                        campaigns={campaigns} 
                        brands={brands} 
                        templates={templates}
                        files={files}
                      />
                  </div>
              </div>
           )}

           {currentView === 'resources' && (
               <div className="h-full overflow-auto">
                   <PageHeader 
                        title="Brand Resources" 
                        subtitle="Access official documentation and brand essentials."
                   />
                   <div className="px-8 pb-8">
                       <AllCatalogs catalogs={catalogs} brands={brands} />
                   </div>
               </div>
           )}
           
           {currentView === 'downloads' && (
               <div className="h-full overflow-hidden flex flex-col">
                   <div className="shrink-0">
                       <PageHeader 
                            title="Download History" 
                            subtitle="Log of all assets downloaded from campaigns and resources."
                       />
                   </div>
                   <div className="flex-1 overflow-hidden">
                       <DownloadHistory files={files} brands={brands} onNavigate={onNavigate} />
                   </div>
               </div>
           )}
       </div>
    </div>
  );
};

export default BrandCenter;
