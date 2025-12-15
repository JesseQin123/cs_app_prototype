import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Plus, Trash2, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, Download, Users, Mail } from 'lucide-react';

const InviteRetailerModal = ({ isOpen, onClose, onSend, availableSlots = 40, totalSlots = 50 }) => {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState('manual'); // 'manual' or 'bulk'
  const [file, setFile] = useState(null);
  const [manualRows, setManualRows] = useState([{ id: 1, name: '', email: '', country: '', zone: '' }]);
  const [settings, setSettings] = useState({
    quota: 10000,
    useDefaultQuota: true,
    groups: []
  });
  
  // Mock data for bulk import preview
  const [csvPreview, setCsvPreview] = useState([]);
  const [mappings, setMappings] = useState({
    name: 'Company Name',
    email: 'Contact Email',
    country: 'Region Code',
    zone: 'US Zone'
  });

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // --- Handlers ---

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Mock parsing CSV
      setCsvPreview([
        { 'Company Name': 'Luxury Boutique', 'Contact Email': 'admin@boutique.com', 'Region Code': 'US', 'US Zone': 'Northeast' },
        { 'Company Name': 'Global Retail', 'Contact Email': 'john@global.com', 'Region Code': 'US', 'US Zone': 'West' },
        { 'Company Name': 'Parisian Chic', 'Contact Email': 'marie@parisian.fr', 'Region Code': 'CA', 'US Zone': '' },
      ]);
    }
  };

  const handleAddRow = () => {
    setManualRows([...manualRows, { id: Date.now(), name: '', email: '', country: '', zone: '' }]);
  };

  const handleRemoveRow = (id) => {
    if (manualRows.length > 1) {
      setManualRows(manualRows.filter(row => row.id !== id));
    }
  };

  const handleRowChange = (id, field, value) => {
    setManualRows(manualRows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleNext = () => {
    if (step === 1) {
      if (mode === 'manual') setStep(3);
      else if (mode === 'bulk' && file) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 3) {
      if (mode === 'manual') setStep(1);
      else setStep(2);
    } else if (step === 2) {
      setStep(1);
    }
  };

  const handleSend = () => {
    const retailers = mode === 'manual' ? manualRows : csvPreview; // In real app, parse full CSV
    const totalQuota = retailers.length * (settings.useDefaultQuota ? 10000 : settings.quota);
    
    onSend({
      retailers,
      settings,
      totalQuota,
      count: retailers.length
    });
    onClose();
  };

  // --- Render Steps ---

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-200">
        <button 
          className={`pb-3 px-1 text-sm font-medium transition border-b-2 ${mode === 'manual' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setMode('manual')}
        >
          Manual Entry
        </button>
        <button 
          className={`pb-3 px-1 text-sm font-medium transition border-b-2 ${mode === 'bulk' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setMode('bulk')}
        >
          Bulk Import
        </button>
      </div>

      {mode === 'manual' ? (
        <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <FileText size={32} />
            </div>
            <div>
                <h3 className="text-lg font-medium text-gray-900">Manual Entry Selected</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">Best for inviting a small number of retailers (1-5). You'll enter their details in the next step.</p>
            </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileChange} />
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
              <Upload size={24} />
            </div>
            <h4 className="text-sm font-medium text-gray-900">Click to upload or drag and drop</h4>
            <p className="text-xs text-gray-500 mt-1">CSV files only (max 5MB)</p>
            {file && (
                <div className="mt-4 flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    <FileText size={16} />
                    {file.name}
                </div>
            )}
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white border border-gray-200 rounded-lg">
                    <FileText size={20} className="text-gray-500" />
                </div>
                <div>
                    <div className="text-sm font-medium text-gray-900">Need a template?</div>
                    <div className="text-xs text-gray-500">Download our pre-formatted CSV file</div>
                </div>
            </div>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <Download size={16} /> Download CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Slots Check */}
      <div className={`p-4 rounded-lg border flex items-center justify-between ${csvPreview.length > availableSlots ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
        <div className="flex items-center gap-3">
            <Users size={20} className={csvPreview.length > availableSlots ? 'text-red-600' : 'text-blue-600'} />
            <div>
                <div className={`text-sm font-medium ${csvPreview.length > availableSlots ? 'text-red-900' : 'text-blue-900'}`}>
                    Retailer Slots: {totalSlots - availableSlots} / {totalSlots} Used
                </div>
                <div className={`text-xs ${csvPreview.length > availableSlots ? 'text-red-700' : 'text-blue-700'}`}>
                    Importing {csvPreview.length} retailers. {availableSlots} slots remaining.
                </div>
            </div>
        </div>
        {csvPreview.length > availableSlots && (
            <button className="text-xs font-bold text-red-700 hover:underline">Buy More Slots</button>
        )}
      </div>

      {/* Mapping */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Map Columns</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                    <tr>
                        <th className="px-4 py-3">System Field</th>
                        <th className="px-4 py-3">CSV Column</th>
                        <th className="px-4 py-3">Preview (Row 1)</th>
                        <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {Object.entries(mappings).map(([key, value]) => (
                        <tr key={key}>
                            <td className="px-4 py-3 font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()} <span className="text-red-500">*</span></td>
                            <td className="px-4 py-3">
                                <select 
                                    className="w-full border-gray-200 rounded-md text-sm focus:ring-black focus:border-black"
                                    value={value}
                                    onChange={(e) => setMappings({...mappings, [key]: e.target.value})}
                                >
                                    <option>Company Name</option>
                                    <option>Contact Email</option>
                                    <option>Region Code</option>
                                    <option>US Zone</option>
                                </select>
                            </td>
                            <td className="px-4 py-3 text-gray-500 italic">
                                {csvPreview[0] ? csvPreview[0][value] : '-'}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                    <CheckCircle2 size={12} /> Mapped
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      
      {/* Manual Entry Input */}
      {mode === 'manual' && (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Retailer Details</h3>
                <button onClick={handleAddRow} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    <Plus size={16} /> Add Row
                </button>
            </div>
            <div className="space-y-3">
                {manualRows.map((row, index) => (
                    <div key={row.id} className="flex gap-3 items-start animate-in slide-in-from-left-2 duration-300">
                        <div className="flex-1 space-y-1">
                            {index === 0 && <label className="text-xs text-gray-500">Retailer Name <span className="text-red-500">*</span></label>}
                            <input 
                                type="text" 
                                placeholder="Name"
                                value={row.name}
                                onChange={(e) => handleRowChange(row.id, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5"
                            />
                        </div>
                        <div className="flex-1 space-y-1">
                            {index === 0 && <label className="text-xs text-gray-500">Email <span className="text-red-500">*</span></label>}
                            <input 
                                type="email" 
                                placeholder="Email"
                                value={row.email}
                                onChange={(e) => handleRowChange(row.id, 'email', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5"
                            />
                        </div>
                        <div className="w-32 space-y-1">
                            {index === 0 && <label className="text-xs text-gray-500">Country <span className="text-red-500">*</span></label>}
                            <select 
                                value={row.country}
                                onChange={(e) => handleRowChange(row.id, 'country', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5 bg-white"
                            >
                                <option value="">Select</option>
                                <option value="US">US</option>
                                <option value="CA">CA</option>
                            </select>
                        </div>
                        <div className="w-32 space-y-1">
                            {index === 0 && <label className="text-xs text-gray-500">Zone</label>}
                            <select 
                                value={row.zone}
                                onChange={(e) => handleRowChange(row.id, 'zone', e.target.value)}
                                disabled={row.country === 'CA'}
                                className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5 bg-white ${row.country === 'CA' ? 'bg-gray-50 text-gray-400' : ''}`}
                            >
                                <option value="">Select</option>
                                <option value="Northeast">Northeast</option>
                                <option value="West">West</option>
                                <option value="South">South</option>
                                <option value="Midwest">Midwest</option>
                            </select>
                        </div>
                        <div className="w-32 space-y-1">
                            {index === 0 && <label className="text-xs text-gray-500">Tier</label>}
                            <select 
                                value={row.tier}
                                onChange={(e) => handleRowChange(row.id, 'tier', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5 bg-white"
                            >
                                <option value="Default Tier">Default Tier</option>
                                <option value="Platinum">Platinum</option>
                                <option value="Gold">Gold</option>
                                <option value="Silver">Silver</option>
                            </select>
                        </div>
                        <div className={`pt-2 ${index === 0 ? 'mt-5' : ''}`}>
                            <button 
                                onClick={() => handleRemoveRow(row.id)}
                                disabled={manualRows.length === 1}
                                className={`p-2 rounded-lg transition ${manualRows.length === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* Allocation Settings */}
      <div className="space-y-6 pt-4 border-t border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Allocation Settings</h3>
        
        {/* Email Quota */}
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Email Quota per Retailer <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-3">
                <input 
                    type="checkbox" 
                    id="defaultQuota"
                    checked={settings.useDefaultQuota}
                    onChange={(e) => setSettings({...settings, useDefaultQuota: e.target.checked})}
                    className="rounded-sm border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="defaultQuota" className="text-sm text-gray-600">Apply Default Quota (10,000 emails)</label>
            </div>
            {!settings.useDefaultQuota && (
                <div className="max-w-xs animate-in slide-in-from-top-2">
                    <input 
                        type="number" 
                        value={settings.quota}
                        onChange={(e) => setSettings({...settings, quota: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5"
                        placeholder="Enter quota amount"
                    />
                </div>
            )}
        </div>

        {/* Groups */}
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Group Assignment (Optional)</label>
            <div className="flex flex-wrap gap-2">
                {['New Batch Q4', 'Tier 2', 'VIP', 'Holiday Promo'].map(group => (
                    <button
                        key={group}
                        onClick={() => {
                            const newGroups = settings.groups.includes(group) 
                                ? settings.groups.filter(g => g !== group)
                                : [...settings.groups, group];
                            setSettings({...settings, groups: newGroups});
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                            settings.groups.includes(group)
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        {group}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 flex items-center justify-between">
        <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Total Impact</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
                {mode === 'manual' ? manualRows.length : csvPreview.length} Retailers
            </div>
            <div className="text-sm text-gray-500">
                Will consume <span className="font-medium text-gray-900">{(mode === 'manual' ? manualRows.length : csvPreview.length) * (settings.useDefaultQuota ? 10000 : settings.quota)}</span> emails from pool
            </div>
        </div>
        <div className="h-10 w-px bg-gray-200 mx-6"></div>
        <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Remaining Pool</div>
            <div className="text-lg font-semibold text-gray-900 mt-1">125,000</div>
        </div>
      </div>

    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Invite Retailers</h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <span className={step >= 1 ? 'text-black font-medium' : ''}>1. Selection</span>
                <ChevronRight size={14} />
                <span className={step >= 2 ? 'text-black font-medium' : ''}>2. Mapping</span>
                <ChevronRight size={14} />
                <span className={step >= 3 ? 'text-black font-medium' : ''}>3. Settings</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-between items-center rounded-b-xl">
          {step > 1 ? (
            <button 
                onClick={handleBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center gap-2 transition"
            >
                <ChevronLeft size={16} /> Back
            </button>
          ) : (
            <div></div> 
          )}
          
          <div className="flex gap-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition shadow-xs"
            >
                Cancel
            </button>
            {step < 3 ? (
                <button 
                    onClick={handleNext}
                    disabled={mode === 'bulk' && !file}
                    className={`px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-xs flex items-center gap-2 ${mode === 'bulk' && !file ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {step === 1 && mode === 'bulk' ? 'Upload & Continue' : 'Continue'} <ChevronRight size={16} />
                </button>
            ) : (
                <button 
                    onClick={handleSend}
                    className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-xs flex items-center gap-2"
                >
                    <Mail size={16} /> Send {(mode === 'manual' ? manualRows.length : csvPreview.length)} Invitations
                </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default InviteRetailerModal;
