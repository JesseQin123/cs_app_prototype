import React, { useState } from 'react';
import { Search, Filter, Plus, Download, Upload, MoreHorizontal, Mail, SlidersHorizontal } from 'lucide-react';
import RetailerList from './RetailerList';
import RetailerDetail from './RetailerDetail';
import InvitationsManager from './InvitationsManager';
import SegmentationManager from './SegmentationManager';
import EditRetailerModal from './EditRetailerModal';
import InviteRetailerModal from './InviteRetailerModal';

const RetailersManager = ({ notify, initialParams }) => {
  const [activeTab, setActiveTab] = useState('all-retailers'); // all-retailers, groups, invitations, settings
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [editingRetailer, setEditingRetailer] = useState(null); // For Edit Modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false); // For Invite Modal
  
  // Mock Data
  const [retailers, setRetailers] = useState([
    { 
        id: 'r1', 
        name: 'The Luxury Boutique', 
        description: 'High-end fashion boutique chain.',
        contact: { name: 'Sarah Smith', email: 'sarah@luxuryboutique.com', phone: '+1 (555) 123-4567' },
        location: { country: 'United States', zone: 'West' },
        groups: ['VIP', 'Boutique'],
        tier: 'Platinum',
        stores: 3,
        adoptionRate: 85,
        lastActive: '2025-11-20',
        status: 'Active',
        logo: 'bg-purple-500',
        hasPendingAction: true,
        quota: {
            email: { used: 45000, limit: 50000 },
            social: { connected: 1, limit: 1, platforms: { facebook: true, instagram: true, x: false, gbp: false } }
        },
        activities: [
            { type: 'download', title: 'Downloaded Resource: Holiday_Guide_2025.pdf', date: 'Today, 10:30 AM', user: 'Sarah Smith' },
            { type: 'campaign', title: 'Published Campaign: Winter Collection', date: 'Yesterday, 2:15 PM', user: 'Marketing Team' },
            { type: 'system', title: 'System: Email Quota Warning (80%)', date: 'Nov 28, 2025', user: 'System Automated' }
        ],
        address: '123 Fashion Ave, New York, NY 10001',
        timezone: 'EST (UTC-5)',
        joinedDate: 'Oct 15, 2024',
        internalNotes: 'Key partner for holiday season. Always requests early access to assets.',
        website: 'www.luxuryboutique.com'
    },
    { 
        id: 'r2', 
        name: 'Global Retail Inc', 
        description: 'International retail partner.',
        contact: { name: 'John Doe', email: 'john@globalretail.com', phone: '+1 (555) 987-6543' },
        location: { country: 'United States', zone: 'East' },
        groups: ['Department Store', 'International'],
        tier: 'Gold',
        stores: 12,
        adoptionRate: 45,
        lastActive: '2025-11-18',
        status: 'Active',
        logo: 'bg-blue-500',
        hasPendingAction: false,
        quota: {
            email: { used: 12000, limit: 20000 },
            social: { connected: 1, limit: 1, platforms: { facebook: true, instagram: true, x: true, gbp: true } }
        },
        address: '456 Commerce Blvd, Miami, FL 33101',
        timezone: 'EST (UTC-5)',
        joinedDate: 'Sep 01, 2024',
        internalNotes: '',
        website: 'www.globalretail.com'
    },
    { 
        id: 'r3', 
        name: 'Parisian Chic', 
        description: 'French luxury fashion retailer.',
        contact: { name: 'Marie Laurent', email: 'marie@parisian.fr', phone: '+33 1 23 45 67 89' },
        location: { country: 'Canada', zone: 'None' },
        groups: ['Luxury', 'International'],
        tier: 'Platinum',
        stores: 5,
        adoptionRate: 92,
        lastActive: '2025-11-21',
        status: 'Active',
        logo: 'bg-pink-500',
        hasPendingAction: false,
        quota: {
            email: { used: 8500, limit: 15000 },
            social: { connected: 0, limit: 1, platforms: { facebook: false, instagram: false, x: false, gbp: false } }
        },
        address: '789 Rue de la Mode, Montreal, QC H3B 1A7',
        timezone: 'EST (UTC-5)',
        joinedDate: 'Nov 10, 2024',
        internalNotes: 'French speaking contact preferred.',
        website: 'www.parisianchic.fr'
    },
    { 
        id: 'r4', 
        name: 'Nordic Style', 
        description: 'Minimalist fashion from Scandinavia.',
        contact: { name: 'Lars Jensen', email: 'lars@nordic.dk', phone: '+45 12 34 56 78' },
        location: { country: 'United States', zone: 'Midwest' },
        groups: ['Boutique'],
        tier: 'Silver',
        stores: 2,
        adoptionRate: 60,
        lastActive: '2025-10-15',
        status: 'Inactive',
        logo: 'bg-teal-500',
        hasPendingAction: true,
        quota: {
            email: { used: 2000, limit: 10000 },
            social: { connected: 1, limit: 1, platforms: { facebook: true, instagram: true, x: false, gbp: false } }
        },
        address: '101 Nordic Way, Chicago, IL 60601',
        timezone: 'CST (UTC-6)',
        joinedDate: 'Jan 20, 2025',
        internalNotes: '',
        website: 'www.nordicstyle.dk'
    },
    { 
        id: 'r5', 
        name: 'Dubai Luxury', 
        description: 'Luxury retailer in UAE.',
        contact: { name: 'Ahmed Al-Sayed', email: 'ahmed@dubai.ae', phone: '+971 50 123 4567' },
        location: { country: 'United States', zone: 'South' },
        groups: ['VIP', 'International'],
        tier: 'Gold',
        stores: 8,
        adoptionRate: 78,
        lastActive: '2025-11-19',
        status: 'Active',
        logo: 'bg-amber-500',
        hasPendingAction: false,
        quota: {
            email: { used: 9500, limit: 10000 },
            social: { connected: 1, limit: 1, platforms: { facebook: true, instagram: false, x: false, gbp: false } }
        },
        address: '202 Desert Palm Dr, Houston, TX 77001',
        timezone: 'CST (UTC-6)',
        joinedDate: 'Mar 15, 2025',
        internalNotes: '',
        website: 'www.dubailuxury.ae'
    },
    { 
        id: 'r6', 
        name: 'Tokyo Trends', 
        description: 'Trendy fashion from Japan.',
        contact: { name: 'Kenji Tanaka', email: 'kenji@tokyo.jp', phone: '+81 90 1234 5678' },
        location: { country: 'Canada', zone: 'None' },
        groups: ['New Openings'],
        tier: 'Default Tier',
        stores: 4,
        adoptionRate: 20,
        lastActive: '2025-08-10',
        status: 'Suspended',
        logo: 'bg-red-500',
        hasPendingAction: false,
        quota: {
            email: { used: 500, limit: 5000 },
            social: { connected: 0, limit: 1, platforms: { facebook: false, instagram: false, x: false, gbp: false } }
        },
        address: '303 Sakura St, Toronto, ON M5H 2N2',
        timezone: 'EST (UTC-5)',
        joinedDate: 'Jul 01, 2025',
        internalNotes: '',
        website: 'www.tokyotrends.jp'
    },
    { 
        id: 'r7', 
        name: 'London Fashion', 
        description: 'Classic British fashion.',
        contact: { name: 'Emma Wilson', email: 'emma@london.uk', phone: '+44 20 1234 5678' },
        location: { country: 'United States', zone: 'Northeast' },
        groups: ['Iconic'],
        stores: 6,
        adoptionRate: 88,
        lastActive: '2025-11-22',
        status: 'Active',
        logo: 'bg-indigo-500',
        hasPendingAction: false,
        quota: {
            email: { used: 18000, limit: 25000 },
            social: { connected: 1, limit: 1, platforms: { facebook: true, instagram: true, x: false, gbp: false } }
        },
        address: '404 Thames Rd, Boston, MA 02108',
        timezone: 'EST (UTC-5)',
        joinedDate: 'Jul 12, 2024',
        internalNotes: '',
        website: 'www.londonfashion.uk'
    },
    { 
        id: 'r8', 
        name: 'Milan Moda', 
        description: 'Italian high fashion.',
        contact: { name: 'Giulia Rossi', email: 'giulia@milan.it', phone: '+39 02 1234 5678' },
        location: { country: 'United States', zone: 'West' },
        groups: ['Luxury'],
        stores: 3,
        adoptionRate: 70,
        lastActive: '2025-11-15',
        status: 'Active',
        logo: 'bg-green-500',
        hasPendingAction: true,
        quota: {
            email: { used: 28000, limit: 50000 },
            social: { connected: 1, limit: 1, platforms: { facebook: true, instagram: true, x: true, gbp: true } }
        },
        address: '505 Rodeo Dr, Los Angeles, CA 90210',
        timezone: 'PST (UTC-8)',
        joinedDate: 'Aug 20, 2024',
        internalNotes: '',
        website: 'www.milanmoda.it'
    },
    { 
        id: 'r9', 
        name: 'Sydney Surf', 
        description: 'Australian surf wear.',
        contact: { name: 'Oliver Brown', email: 'oliver@sydney.au', phone: '+61 2 1234 5678' },
        location: { country: 'Canada', zone: 'None' },
        groups: ['Boutique'],
        stores: 2,
        adoptionRate: 55,
        lastActive: '2025-11-10',
        status: 'Active',
        logo: 'bg-cyan-500',
        hasPendingAction: false,
        quota: {
            email: { used: 0, limit: 0 },
            social: { connected: 0, limit: 1, platforms: { facebook: false, instagram: false, x: false, gbp: false } }
        },
        address: '606 Bondi Blvd, Toronto, ON M5V 2T6',
        timezone: 'EST (UTC-5)',
        joinedDate: 'Dec 01, 2024',
        internalNotes: '',
        website: 'www.sydneysurf.com.au'
    },
    { 
        id: 'r10', 
        name: 'Berlin Basics', 
        description: 'Minimalist German fashion.',
        contact: { name: 'Hans Mueller', email: 'hans@berlin.de', phone: '+49 30 1234 5678' },
        location: { country: 'United States', zone: 'Midwest' },
        groups: ['New Openings'],
        stores: 1,
        adoptionRate: 10,
        lastActive: '2025-09-01',
        status: 'Inactive',
        logo: 'bg-slate-500',
        hasPendingAction: false,
        quota: {
            email: { used: 0, limit: 10000 },
            social: { connected: 0, limit: 1, platforms: { facebook: false, instagram: false, x: false, gbp: false } }
        },
        address: '707 Bauhaus St, Detroit, MI 48201',
        timezone: 'EST (UTC-5)',
        joinedDate: 'Feb 14, 2025',
        internalNotes: '',
        website: 'www.berlinbasics.de'
    }
  ]);

  const handleUpdateRetailer = (updatedRetailer) => {
    // Add activity log entry
    const newActivity = {
        type: 'update',
        title: 'Profile Updated: Contact/Location details changed',
        date: 'Just now',
        user: 'Brand Manager'
    };
    
    const retailerWithActivity = {
        ...updatedRetailer,
        activities: [newActivity, ...(updatedRetailer.activities || [])]
    };

    setRetailers(retailers.map(r => r.id === updatedRetailer.id ? retailerWithActivity : r));
    setEditingRetailer(null);
    if (selectedRetailer && selectedRetailer.id === updatedRetailer.id) {
        setSelectedRetailer(retailerWithActivity);
    }
    if (notify) notify('Retailer profile updated successfully', 'success');
  };

  const handleSendInvitations = (data) => {
    console.log('Sending invitations:', data);
    // In a real app, this would make an API call
    // For now, we'll just switch to the invitations tab and show a success message
    setActiveTab('invitations');
    setIsInviteModalOpen(false); // Close the modal after sending
    if (notify) notify(`Sent ${data.count} invitations successfully`, 'success');
  };

  if (selectedRetailer) {
    return (
        <>
            <RetailerDetail 
                retailer={selectedRetailer} 
                onBack={() => setSelectedRetailer(null)} 
                onEditProfile={() => setEditingRetailer(selectedRetailer)}
            />
            <EditRetailerModal 
                isOpen={!!editingRetailer}
                onClose={() => setEditingRetailer(null)}
                onSave={handleUpdateRetailer}
                retailer={editingRetailer}
            />
        </>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Retailer Directory</h1>
          <p className="text-gray-500 text-sm">Manage partner profiles, tiers, and access permissions.</p>
        </div>
        <div className="flex items-center gap-4">
            {/* Unified Quota Display */}
            <div className="hidden md:flex items-center bg-white rounded-xl border border-gray-200 shadow-xs py-2 px-5 gap-6">
                {/* Email Pool */}
                <div className="flex flex-col gap-1.5 min-w-[140px]">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Email</span>
                        <span className="text-gray-900 font-medium text-xs tabular-nums">125k / 500k</span>
                    </div>
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full rounded-full bg-[#B8A77E]" style={{ width: '25%' }}></div>
                    </div>
                </div>

                <div className="w-px h-8 bg-gray-100"></div>

                {/* Seats */}
                <div className="flex flex-col gap-1.5 min-w-[120px]">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Seats</span>
                        <span className="text-gray-900 font-medium text-xs tabular-nums">10 / 50</span>
                    </div>
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full rounded-full bg-[#B8A77E]" style={{ width: '20%' }}></div>
                    </div>
                </div>

                <div className="w-px h-8 bg-gray-100"></div>

                <button className="text-indigo-600 hover:text-indigo-700 text-xs font-bold uppercase tracking-wider hover:underline transition px-1">
                    Upgrade
                </button>
            </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-8 pt-6 pb-0">
        <div className="flex items-center gap-8 border-b border-gray-200">
          {['All Retailers', 'Invitations', 'Segmentation'].map((tab) => {
            const id = tab.toLowerCase().replace(' ', '-');
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`pb-4 text-sm font-medium transition relative ${
                  activeTab === id ? 'text-black' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
                {activeTab === id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-t-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'all-retailers' && (
          <RetailerList 
            retailers={retailers} 
            onSelectRetailer={setSelectedRetailer} 
            onEditRetailer={setEditingRetailer}
            onInviteRetailers={() => setIsInviteModalOpen(true)}
            initialParams={initialParams}
          />
        )}
        {activeTab === 'invitations' && (
            <InvitationsManager onInviteRetailer={() => setIsInviteModalOpen(true)} />
        )}
        {activeTab === 'segmentation' && (
            <SegmentationManager />
        )}
      </div>

      {/* Edit Modal (Global for List View) */}
      <EditRetailerModal 
        key={editingRetailer?.id}
        isOpen={!!editingRetailer && !selectedRetailer} // Only show here if not in detail view (detail view handles its own modal instance or we can share one global instance)
        // Actually, let's use a single global modal instance logic.
        // If selectedRetailer is active, the modal is rendered inside the "if (selectedRetailer)" block above.
        // If NOT selectedRetailer (List View), we render it here.
        onClose={() => setEditingRetailer(null)}
        onSave={handleUpdateRetailer}
        retailer={editingRetailer}
      />

      {/* Invite Modal */}
      <InviteRetailerModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSend={handleSendInvitations}
      />
    </div>
  );
};

export default RetailersManager;
