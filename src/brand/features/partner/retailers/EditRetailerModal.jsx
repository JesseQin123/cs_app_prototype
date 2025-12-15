import React, { useState } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';

const EditRetailerModal = ({ isOpen, onClose, onSave, retailer }) => {
  const [formData, setFormData] = useState({
    name: retailer?.name || '',
    internalNotes: retailer?.internalNotes || '',
    contactName: retailer?.contact?.name || '',
    country: retailer?.location?.country || '',
    zone: retailer?.location?.zone || '',
    logo: retailer?.logo || null
  });

  const [errors, setErrors] = useState({});

  if (!isOpen || !retailer) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Retailer Name is required';
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact Name is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (formData.country === 'United States' && (!formData.zone || formData.zone === 'None')) {
        newErrors.zone = 'Sales Zone is required for United States';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCountryChange = (e) => {
      const country = e.target.value;
      let zone = formData.zone;
      
      if (country === 'Canada') {
          zone = 'None';
      } else if (country === 'United States' && zone === 'None') {
          zone = ''; // Reset if switching back to US
      }

      setFormData({ ...formData, country, zone });
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave({
        ...retailer,
        name: formData.name,
        internalNotes: formData.internalNotes,
        contact: {
          ...retailer.contact,
          name: formData.contactName,
          // Email and Phone are read-only, preserved from original object
        },
        location: {
          ...retailer.location,
          country: formData.country,
          zone: formData.zone
        },
        // In a real app, handle logo upload here
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Edit Retailer Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Section 1: Retailer Identity */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Retailer Identity</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Retailer Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5 transition ${errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-black'}`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                <textarea 
                  value={formData.internalNotes}
                  onChange={(e) => setFormData({...formData, internalNotes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5 focus:border-black transition resize-none"
                  placeholder="Internal notes about this retailer..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Retailer Logo</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition cursor-pointer group">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-gray-500" />
                    <div className="flex text-sm text-gray-600">
                      <span className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-hidden focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        Upload a file
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Primary Contact */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Primary Contact</h3>
            <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.contactName}
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5 transition ${errors.contactName ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-black'}`}
                  />
                  {errors.contactName && <p className="text-xs text-red-500 mt-1">{errors.contactName}</p>}
              </div>
            </div>
          </section>



          {/* Section 4: Location */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Location</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country <span className="text-red-500">*</span></label>
                  <select 
                    value={formData.country}
                    onChange={handleCountryChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5 transition ${errors.country ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-black'}`}
                  >
                    <option value="">Select Country</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                  </select>
                  {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sales Zone {formData.country === 'United States' && <span className="text-red-500">*</span>}
                  </label>
                  <select 
                    value={formData.zone}
                    onChange={(e) => setFormData({...formData, zone: e.target.value})}
                    disabled={formData.country === 'Canada'}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5 transition ${formData.country === 'Canada' ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''} ${errors.zone ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-black'}`}
                  >
                    {formData.country === 'Canada' ? (
                      <option value="None">N/A</option>
                    ) : (
                      <>
                        <option value="">Select Zone</option>
                        <option value="Northeast">Northeast</option>
                        <option value="Southeast">Southeast</option>
                        <option value="Midwest">Midwest</option>
                        <option value="Southwest">Southwest</option>
                        <option value="West">West</option>
                      </>
                    )}
                  </select>
                  {errors.zone && <p className="text-xs text-red-500 mt-1">{errors.zone}</p>}
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition shadow-xs"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-xs"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditRetailerModal;
