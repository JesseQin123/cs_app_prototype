import React, { useState } from 'react';
import TierBadge from './TierBadge';
import { Search, MoreHorizontal, Mail, RefreshCw, Trash2, Ban, CheckCircle2, Clock, AlertCircle, Plus, X } from 'lucide-react';

const InvitationsManager = ({ onInviteRetailer }) => {
  // Mock Data
  const [invitations, setInvitations] = useState([
    {
      id: 'inv1',
      retailerName: 'Downtown Boutique',
      email: 'contact@downtown.com',
      tier: 'Gold',
      status: 'Pending',
      dateSent: '2025-12-01T10:00:00Z',
      quota: 10000
    },
    {
      id: 'inv2',
      retailerName: '',
      email: 'newpartner@gmail.com',
      tier: 'Default Tier',
      status: 'Pending',
      dateSent: '2025-12-02T14:30:00Z',
      quota: 15000
    },
    {
      id: 'inv3',
      retailerName: 'Old Town Shop',
      email: 'manager@oldtown.com',
      tier: 'Silver',
      status: 'Expired',
      dateSent: '2025-11-15T09:00:00Z',
      quota: 10000
    },
    {
      id: 'inv4',
      retailerName: 'Cancelled Partner',
      email: 'info@cancelled.com',
      tier: 'Platinum',
      status: 'Revoked',
      dateSent: '2025-11-20T11:00:00Z',
      quota: 10000
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvitation, setSelectedInvitation] = useState(null);

  // Filter invitations based on search
  const filteredInvitations = invitations.filter(inv => 
    inv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.retailerName && inv.retailerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Action Handlers
  const handleResend = (id) => {
    console.log('Resending invitation:', id);
    // Mock API call
    setInvitations(invitations.map(inv => 
      inv.id === id ? { ...inv, status: 'Pending', dateSent: new Date().toISOString() } : inv
    ));
  };

  const handleRevoke = (id) => {
    console.log('Revoking invitation:', id);
    setInvitations(invitations.map(inv => 
      inv.id === id ? { ...inv, status: 'Revoked' } : inv
    ));
  };

  const handleDelete = (id) => {
    console.log('Deleting invitation:', id);
    setInvitations(invitations.filter(inv => inv.id !== id));
    if (selectedInvitation && selectedInvitation.id === id) {
        setSelectedInvitation(null);
    }
  };

  const handleReinvite = (id) => {
    console.log('Re-inviting:', id);
    // For now, just reset to Pending
    setInvitations(invitations.map(inv => 
      inv.id === id ? { ...inv, status: 'Pending', dateSent: new Date().toISOString() } : inv
    ));
  };

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const styles = {
      Pending: 'bg-amber-50 text-amber-700 border-amber-100',
      Expired: 'bg-red-50 text-red-700 border-red-100',
      Revoked: 'bg-gray-100 text-gray-600 border-gray-200'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.Revoked}`}>
        {status}
      </span>
    );
  };

  // Action Menu Component
  const ActionMenu = ({ invitation }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative" onClick={e => e.stopPropagation()}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition"
        >
          <MoreHorizontal size={16} />
        </button>
        
        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95">
            {invitation.status === 'Pending' && (
              <>
                <button onClick={() => { handleResend(invitation.id); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <RefreshCw size={14} /> Resend
                </button>
                <button onClick={() => { handleRevoke(invitation.id); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <Ban size={14} /> Revoke
                </button>
              </>
            )}
            {invitation.status === 'Expired' && (
              <>
                <button onClick={() => { handleResend(invitation.id); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <RefreshCw size={14} /> Resend
                </button>
                <button onClick={() => { handleDelete(invitation.id); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <Trash2 size={14} /> Delete
                </button>
              </>
            )}
            {invitation.status === 'Revoked' && (
              <>
                <button onClick={() => { handleReinvite(invitation.id); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Mail size={14} /> Re-invite
                </button>
                <button onClick={() => { handleDelete(invitation.id); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <Trash2 size={14} /> Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // Drawer Component
  const InvitationDrawer = ({ invitation, onClose }) => {
    if (!invitation) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 z-50 transform transition-transform duration-300 ease-in-out">
            <div className="h-full flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Invitation Details</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Retailer Name</label>
                        <div className="text-sm font-medium text-gray-900">{invitation.retailerName || 'Not provided'}</div>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Recipient Email</label>
                        <div className="text-sm text-gray-900 flex items-center gap-2">
                            <Mail size={14} className="text-gray-400" />
                            {invitation.email}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Status</label>
                        <StatusBadge status={invitation.status} />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Date Sent</label>
                        <div className="text-sm text-gray-900 flex items-center gap-2">
                            <Clock size={14} className="text-gray-400" />
                            {new Date(invitation.dateSent).toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Tier</label>
                        <TierBadge tier={invitation.tier || 'Default Tier'} />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Initial Email Quota</label>
                        <div className="text-sm text-gray-900">{invitation.quota.toLocaleString()} emails</div>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="flex gap-3">
                        {invitation.status === 'Pending' && (
                            <>
                                <button onClick={() => handleResend(invitation.id)} className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-xs">
                                    Resend
                                </button>
                                <button onClick={() => handleRevoke(invitation.id)} className="flex-1 px-4 py-2 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 shadow-xs">
                                    Revoke
                                </button>
                            </>
                        )}
                        {invitation.status === 'Expired' && (
                            <>
                                <button onClick={() => handleResend(invitation.id)} className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-xs">
                                    Resend
                                </button>
                                <button onClick={() => handleDelete(invitation.id)} className="flex-1 px-4 py-2 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 shadow-xs">
                                    Delete
                                </button>
                            </>
                        )}
                        {invitation.status === 'Revoked' && (
                            <>
                                <button onClick={() => handleReinvite(invitation.id)} className="flex-1 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 shadow-xs">
                                    Re-invite
                                </button>
                                <button onClick={() => handleDelete(invitation.id)} className="flex-1 px-4 py-2 bg-white border border-gray-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 shadow-xs">
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
  };

  // Empty State
  if (invitations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No Pending Invitations</h3>
        <p className="text-sm text-gray-500 max-w-sm mt-2 mb-6">
          All outstanding invitations have been successfully accepted by your Retailer partners.
        </p>
        <button 
          onClick={onInviteRetailer}
          className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-xs flex items-center gap-2"
        >
          <Plus size={18} /> Invite Retailers
        </button>
        <p className="text-xs text-gray-400 mt-6">
          Need to adjust your default allocation? Head over to <span className="font-medium text-gray-600">Settings</span> to update your rules.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-full shadow-xs relative">
      {/* Header / Search */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by email or name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5 transition"
          />
        </div>
        <button 
            onClick={onInviteRetailer}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2 shadow-xs"
        >
            <Plus size={16} /> Invite Retailers
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white text-gray-500 font-medium border-b border-gray-200 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Retailer Name</th>
              <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Recipient Email</th>
              <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Tier</th>
              <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Date Sent</th>
              <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider text-right">Initial Email Quota</th>
              <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredInvitations.length > 0 ? (
              filteredInvitations.map((inv) => (
                <tr 
                    key={inv.id} 
                    onClick={() => setSelectedInvitation(inv)}
                    className={`hover:bg-gray-50 transition group cursor-pointer ${selectedInvitation?.id === inv.id ? 'bg-gray-50' : ''}`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {inv.retailerName || <span className="text-gray-400 italic">Not provided</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{inv.email}</td>
                  <td className="px-6 py-4">
                    <TierBadge tier={inv.tier || 'Default Tier'} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(inv.dateSent).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right tabular-nums text-gray-600">
                    {inv.quota.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ActionMenu invitation={inv} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No invitations found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer Overlay */}
      {selectedInvitation && (
        <div className="absolute inset-0 bg-black/5 z-40" onClick={() => setSelectedInvitation(null)}></div>
      )}

      {/* Drawer */}
      {selectedInvitation && (
          <InvitationDrawer invitation={selectedInvitation} onClose={() => setSelectedInvitation(null)} />
      )}
    </div>
  );
};

export default InvitationsManager;
