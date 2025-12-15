import React, { useState } from 'react';
import { campaignData } from '../../../../../data/mockStore/campaignStore'; // Fixed path depth
import { Plus, Filter, MoreHorizontal, Download, FileText, Image as ImageIcon, Video, Mail, Smartphone, Instagram, Facebook, Twitter, Edit2, Eye, Trash2, UploadCloud } from 'lucide-react';

const ContentTab = ({ campaign }) => { 
  const [filter, setFilter] = useState('all'); // all, ready, assets

  // 1. Data Source Resolution
  const content = campaignData.contentMap[campaign.contentId] || { publishable: [], downloadable: [] };

  // 2. Publishable Content (New Schema)
  const readyContent = (content.publishable || []).map(t => ({
      id: t.id,
      // Normalize type
      type: t.type === 'social post' ? 'social' : t.type,
      platforms: Array.isArray(t.platform) ? t.platform.map(p => p.toLowerCase()) : [],
      subject: t.subject || t.name || 'Untitled Content',
      previewText: t.previewText || "Ready-to-use content",
      message: t.message,
      caption: t.caption,
      image: t.image || (t.type === 'social post' ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop' : null),
      lastEdited: t.lastEdited || 'Recently'
  }));

  // 3. Downloadable Assets (New Schema)
  const assets = (content.downloadable || []).map(a => ({
      id: a.id,
      name: a.name,
      type: a.type?.toLowerCase().includes('zip') ? 'zip' : a.type?.toLowerCase().includes('pdf') ? 'pdf' : 'image',
      size: a.size,
      thumb: a.type === 'Image' || a.type === 'image' ? 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop' : null
  }));

  // --- Card Components ---

  const SocialCard = ({ item }) => (
    <div className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer">
      {/* Background Image */}
      {item.image ? (
        <img src={item.image} alt="Social Post" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-gray-800 to-black flex items-center justify-center p-6">
           <span className="text-white text-2xl font-bold opacity-20">BRAND</span>
        </div>
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        {/* Top Left: Platforms */}
        <div className="flex gap-2">
          {item.platforms.includes('instagram') && <div className="w-6 h-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"><Instagram size={14}/></div>}
          {item.platforms.includes('facebook') && <div className="w-6 h-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"><Facebook size={14}/></div>}
          {item.platforms.includes('x') && <div className="w-6 h-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"><Twitter size={14}/></div>}
        </div>

        {/* Bottom: Caption */}
        <div>
          <p className="text-white text-sm font-medium line-clamp-2 mb-2">{item.caption}</p>
          <div className="flex items-center justify-between">
             <span className="text-[10px] text-white/60 uppercase tracking-wider font-bold">Social Post</span>
             <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-md"><Edit2 size={12}/></button>
                <button className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-md"><Eye size={12}/></button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const EmailCard = ({ item }) => (
    <div className="group relative aspect-square bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-md border border-gray-200 transition cursor-pointer flex flex-col">
      <div className="flex-1 p-6 flex flex-col relative">
         {/* Decorative Envelope Top */}
         <div className="absolute top-0 left-0 w-full h-2 bg-blue-500 opacity-0 group-hover:opacity-100 transition"></div>
         
         <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3 line-clamp-3">
              {item.subject}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">{item.previewText}</p>
         </div>
      </div>
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
         <div className="flex items-center gap-2 text-blue-600">
            <Mail size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Email Draft</span>
         </div>
         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
            <button className="p-1.5 hover:bg-gray-200 rounded-full text-gray-600"><Edit2 size={14}/></button>
         </div>
      </div>
    </div>
  );

  const SmsCard = ({ item }) => (
    <div className="group relative aspect-square bg-gray-50 rounded-xl overflow-hidden shadow-xs hover:shadow-md border border-gray-200 transition cursor-pointer flex flex-col items-center justify-center p-6">
       {/* Bubble UI */}
       <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-xs border border-gray-200 max-w-full mb-4 relative">
          <p className="text-sm text-gray-800 line-clamp-3">{item.message}</p>
       </div>
       
       <div className="absolute bottom-0 left-0 w-full p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-600">
             <Smartphone size={16} />
             <span className="text-xs font-bold uppercase tracking-wider">SMS</span>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
             <button className="p-1.5 hover:bg-gray-200 rounded-full text-gray-600"><Edit2 size={14}/></button>
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Toolbar */}
      <div className="flex items-center justify-between">
         <div className="flex bg-gray-200 p-1 rounded-lg">
            {['all', 'ready', 'assets'].map(f => (
               <button 
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition ${filter === f ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
               >
                 {f === 'all' ? 'All' : f === 'ready' ? 'Publishable' : 'Assets'}
               </button>
            ))}
         </div>
         <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition shadow-xs">
            <Plus size={16} /> Add Content
         </button>
      </div>

      {/* Section 1: Ready-to-Publish */}
      {(filter === 'all' || filter === 'ready') && (
        <section>
           <div className="mb-6">
               <h3 className="text-lg font-bold text-gray-900">Publishable Content</h3>
               <p className="text-sm text-gray-500">Multi-channel content that retailers can publish directly or customize before sharing.</p>
           </div>
           
           {campaign.status === 'Draft' && readyContent.length === 0 ? (
               <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                   <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                       <Plus size={24} />
                   </div>
                   <h4 className="font-bold text-gray-900 mb-1">No Content Yet</h4>
                   <p className="text-sm text-gray-500 mb-4 max-w-xs">Add social posts, email templates, or SMS drafts for your retailers to use.</p>
                   <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                       Create Content
                   </button>
               </div>
           ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {/* Mocking empty content for Draft if not explicitly provided, otherwise show mock data */}
                  {(campaign.status === 'Draft' ? [] : readyContent).map(item => (
                     <React.Fragment key={item.id}>
                        {item.type === 'social' && <SocialCard item={item} />}
                        {item.type === 'email' && <EmailCard item={item} />}
                        {item.type === 'sms' && <SmsCard item={item} />}
                     </React.Fragment>
                  ))}
                  {campaign.status === 'Draft' && (
                       <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[250px] hover:border-gray-300 hover:bg-gray-50 transition cursor-pointer">
                           <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                               <Plus size={20} />
                           </div>
                           <span className="text-sm font-medium text-gray-600">Add New Content</span>
                       </div>
                  )}
               </div>
           )}
        </section>
      )}

      {/* Section 2: Downloadable Assets */}
      {(filter === 'all' || filter === 'assets') && (
        <section>
           <div className="mb-6">
               <h3 className="text-lg font-bold text-gray-900">Downloadable Assets</h3>
               <p className="text-sm text-gray-500">Files and resources provided for retailers to download and use.</p>
           </div>

           {campaign.status === 'Draft' && assets.length === 0 ? (
               <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                   <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                       <UploadCloud size={24} />
                   </div>
                   <h4 className="font-bold text-gray-900 mb-1">No Assets Uploaded</h4>
                   <p className="text-sm text-gray-500 mb-4 max-w-xs">Upload high-res images, PDFs, or guidelines for your retailers.</p>
                   <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                       Upload Assets
                   </button>
               </div>
           ) : (
               <>
                   {campaign.status === 'Draft' && (
                       <div className="mb-4 border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-gray-300 hover:bg-gray-50 transition cursor-pointer">
                           <div className="flex items-center gap-2 text-gray-500">
                               <Plus size={16} />
                               <span className="font-medium">Upload New Asset</span>
                           </div>
                       </div>
                   )}
                   {(campaign.status === 'Draft' ? [] : assets).length > 0 && (
                       <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                          <table className="w-full text-left">
                             <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <tr>
                                   <th className="px-6 py-4">Preview</th>
                                   <th className="px-6 py-4">Name</th>
                                   <th className="px-6 py-4">Type</th>
                                   <th className="px-6 py-4">Size</th>
                                   <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-100">
                                {(campaign.status === 'Draft' ? [] : assets).map(asset => (
                                   <tr key={asset.id} className="hover:bg-gray-50 transition group">
                                      <td className="px-6 py-4 w-20">
                                         <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                                            {asset.thumb ? (
                                               <img src={asset.thumb} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                               <FileText size={20} className="text-gray-400" />
                                            )}
                                         </div>
                                      </td>
                                      <td className="px-6 py-4 font-medium text-gray-900">{asset.name}</td>
                                      <td className="px-6 py-4 text-sm text-gray-500 uppercase">{asset.type}</td>
                                      <td className="px-6 py-4 text-sm text-gray-500">{asset.size}</td>
                                      <td className="px-6 py-4 text-right">
                                         <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                                            <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-600"><Download size={16}/></button>
                                            <button className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 size={16}/></button>
                                         </div>
                                      </td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                   )}
               </>
           )}
        </section>
      )}
    </div>
  );
};

export default ContentTab;
