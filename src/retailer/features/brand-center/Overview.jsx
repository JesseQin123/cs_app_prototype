import React from 'react';
import { Sparkles, Bell, Activity, ChevronRight, AlertTriangle } from 'lucide-react'; // Remove Clock
import CampaignCard from './components/CampaignCard';
import Carousel from '../../../components/Carousel';

const Overview = ({ campaigns, brands, templates, files }) => {
  // --- Logic for Sections ---
  
  // Expiring Soon: EndDate < Now + 3 Days (72h)
  const expiringCampaigns = campaigns.filter(c => {
      // Only show campaigns that have started
      const now = new Date('2025-11-26'); // Simulated "Now"
      if (c.startDate) {
          const start = new Date(c.startDate);
          if (start > now) return false; // Hide scheduled campaigns
      }

      if (c.endDate === 'Permanent') return false;
      
      // Exclude Used Campaigns
      const isUsed = c.retailerUsage && Object.values(c.retailerUsage).some(v => v === true);
      if (isUsed) return false;

      const end = new Date(c.endDate);
      const diffTime = end - now;
      const diffHours = diffTime / (1000 * 60 * 60);
      return diffHours > 0 && diffHours <= 72; 
  });

  // New Arrivals: StartDate in past 48 hours
  const newArrivals = campaigns.filter(c => {
      if (!c.startDate) return false;
      const start = new Date(c.startDate);
      const now = new Date('2025-11-26');
      
      // Only show if startDate has passed
      if (start > now) return false;
      
      const diffTime = now - start;
      const diffHours = diffTime / (1000 * 60 * 60);
      return diffHours >= 0 && diffHours <= 48;
  });

  // Mock Notifications
  const notifications = [
    { id: 1, type: 'alert', message: 'Gucci "Flash Sale" expires in 24 hours.', time: '2h ago', brandId: 'b2' },
    { id: 2, type: 'new', message: 'Chanel added 3 new assets to "Spring Collection".', time: '4h ago', brandId: 'b1' },
    { id: 3, type: 'update', message: 'Louis Vuitton updated "Influencer Collab" guidelines.', time: '1d ago', brandId: 'b3' },
  ];

  // Mock Recent Activity
  const recentActivity = [
    { id: 1, action: 'Downloaded', item: 'Lookbook_Spring_24.pdf', brand: 'Chanel', time: '10m ago' },
    { id: 2, action: 'Shared', item: 'Holiday Gift Guide 2025', brand: 'Chanel', time: '1h ago' },
    { id: 3, action: 'Viewed', item: 'Digital Exclusive: Cyber Week', brand: 'Louis Vuitton', time: '3h ago' },
  ];

  return (
    <div className="p-8 space-y-4 pb-20">
      {/* 1. High Priority: Expiring Soon */}
      {expiringCampaigns.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="text-amber-600"><AlertTriangle size={20} className="fill-amber-100" /></span>
              Expiring Soon
            </h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-100">
              {expiringCampaigns.length}
            </span>
          </div>
          <Carousel>
             {expiringCampaigns.map(campaign => (
                <div key={campaign.id} className="min-w-[300px] w-[300px] snap-center flex flex-col">
                   <CampaignCard 
                     campaign={campaign} 
                     brand={brands.find(b => b.id === campaign.brandId)}
                     templates={templates}
                     files={files}
                   />
                </div>
             ))}
          </Carousel>
        </section>
      )}

      {/* 2. New Arrivals */}
      {newArrivals.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600"><Sparkles size={20} className="fill-blue-100" /></span>
              New Arrivals
            </h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-100">
              {newArrivals.length}
            </span>
          </div>
          <Carousel>
             {newArrivals.map(campaign => (
                <div key={campaign.id} className="min-w-[300px] w-[300px] snap-center flex flex-col">
                   <CampaignCard 
                     campaign={campaign} 
                     brand={brands.find(b => b.id === campaign.brandId)}
                     templates={templates}
                     files={files}
                     hideExpiringStatus={true}
                   />
                </div>
             ))}
          </Carousel>
        </section>
      )}

      {/* 3. Notifications & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notifications */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <Bell size={20} className="text-gray-400" />
            <h3 className="font-bold text-gray-900">Unread Notifications</h3>
          </div>
          <div className="space-y-4">
            {notifications.map(n => (
              <div key={n.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.type === 'alert' ? 'bg-red-500' : n.type === 'new' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <Activity size={20} className="text-gray-400" />
            <h3 className="font-bold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {recentActivity.map(a => (
              <div key={a.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{a.action}</span> {a.item}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{a.brand}</p>
                </div>
                <span className="text-xs text-gray-400">{a.time}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Overview;
