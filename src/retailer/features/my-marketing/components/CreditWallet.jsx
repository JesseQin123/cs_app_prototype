
import React, { useState } from 'react';
import { Wallet, ChevronDown, HelpCircle, Info, Plus, X } from 'lucide-react';
import { retailerActivityData } from '@/data/mockStore/retailerActivityStore';
import * as Popover from '@radix-ui/react-popover';

const CreditWallet = () => {
    const { credits } = retailerActivityData;

    // Calculate generic "Low" status if any brand is low to show a dot
    const hasLowCredits = credits.some(c => c.status === 'Low' || c.status === 'Empty');

    // Request Modal State
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [requestAmount, setRequestAmount] = useState('');
    const [requestReason, setRequestReason] = useState('');
    const [sendEmail, setSendEmail] = useState(true);

    // Popover State
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const openRequestModal = (brand) => {
        setSelectedBrand(brand);
        setIsRequestModalOpen(true);
        setIsPopoverOpen(false); // Close popover
        setRequestAmount('');
        setRequestReason('');
        setSendEmail(true);
    };

    const handleRequestSubmit = (e) => {
        e.preventDefault();
        // Mock API Call
        console.log("Requesting credits:", {
             brand: selectedBrand,
             amount: requestAmount,
             reason: requestReason,
             sendEmail
        });
        setIsRequestModalOpen(false);
    };

    return (
        <>
        <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <Popover.Trigger asChild>
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full hover:bg-gray-50 cursor-pointer transition-all group outline-none focus:outline-none">
                    <div className="relative">
                        <Wallet size={16} className="text-gray-500 group-hover:text-black transition-colors" />
                        {hasLowCredits && (
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Sponsor Credits</span>
                    <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
                </div>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content 
                    className="z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-100 p-0 animate-in fade-in zoom-in-95 duration-200"
                    sideOffset={8}
                    align="end"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
                        <h4 className="text-sm font-bold text-gray-900">Email Credits</h4>
                        <p className="text-xs text-gray-500 mt-1">Sponsored by your partners. Resets on Nov 1st.</p>
                    </div>

                    {/* List */}
                    <div className="max-h-[300px] overflow-y-auto p-2">
                        {credits.map((item, idx) => (
                            <div key={idx} className="group flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md transition-colors">
                                {/* Logo */}
                                <div className="w-8 h-8 rounded-full border border-gray-100 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    {item.logo ? (
                                        <img src={item.logo} alt={item.brandName} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[10px] font-bold text-gray-400">{item.brandName.substring(0, 2).toUpperCase()}</span>
                                    )}
                                </div>

                                {/* Progress */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-xs font-semibold text-gray-900 truncate">{item.brandName}</span>
                                        <span className={`text-[10px] font-bold uppercase ${
                                            item.status === 'Active' ? 'text-green-600' :
                                            item.status === 'Low' ? 'text-yellow-600' : 'text-red-500'
                                        }`}>{item.status}</span>
                                    </div>
                                    
                                    {/* Bar */}
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                item.status === 'Active' ? 'bg-green-500' :
                                                item.status === 'Low' ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${(item.used / item.total) * 100}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-mono">
                                        <span>{item.used.toLocaleString()} used</span>
                                        <span>{item.total.toLocaleString()} limit</span>
                                    </div>
                                </div>
                                
                                {/* Request Button (Hover) */}
                                <button 
                                    onClick={() => openRequestModal(item)}
                                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black opacity-0 group-hover:opacity-100 transition-all"
                                    title="Request Additional Credits"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-gray-100 text-center bg-gray-50/30 rounded-b-lg">
                        <a href="#" className="flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-brand-gold transition-colors">
                            <HelpCircle size={12} />
                            <span>How do these credits work?</span>
                        </a>
                    </div>

                    <Popover.Arrow className="fill-white" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>

        {/* Request Modal */}
        {isRequestModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-bold text-gray-900">Request Email Limit Increase</h3>
                        <button onClick={() => setIsRequestModalOpen(false)} className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 transition"><X size={16}/></button>
                    </div>

                    <form onSubmit={handleRequestSubmit}>
                    <div className="p-6 space-y-4">
                         {/* Context */}
                         <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                             <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center font-bold text-xs text-gray-500 overflow-hidden">
                                {selectedBrand?.logo ? <img src={selectedBrand.logo} className="w-full h-full object-cover"/> : selectedBrand?.brandName.substring(0,2)}
                             </div>
                             <div>
                                 <p className="text-sm font-medium text-gray-900">Requesting for {selectedBrand?.brandName}</p>
                                 <p className="text-xs text-gray-500">Current Email Limit: {selectedBrand?.total.toLocaleString()}</p>
                             </div>
                         </div>

                         {/* Amount */}
                         <div>
                             <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Requested Increase Amount</label>
                             <input 
                                type="number" 
                                required
                                value={requestAmount}
                                onChange={e => setRequestAmount(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 font-mono text-sm"
                                placeholder="e.g. 5000"
                             />
                         </div>

                         {/* Reason */}
                         <div>
                             <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Reason</label>
                             <textarea 
                                required
                                value={requestReason}
                                onChange={e => setRequestReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm resize-none h-20"
                                placeholder="Why do you need more credits?"
                             />
                         </div>

                         {/* Email Checkbox */}
                         <label className="flex items-center gap-2 cursor-pointer group">
                             <input 
                                type="checkbox" 
                                checked={sendEmail}
                                onChange={e => setSendEmail(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black/5"
                             />
                             <span className="text-sm text-gray-600 group-hover:text-gray-900">Send email notification to Brand Rep</span>
                         </label>
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
                        <button type="button" onClick={() => setIsRequestModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-black rounded-lg hover:bg-gray-800 shadow-sm">Submit Request</button>
                    </div>
                    </form>
                </div>
            </div>
        )}
        </>
    );
};

export default CreditWallet;
