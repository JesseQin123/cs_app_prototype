import React, { useState } from 'react';
import { X, ChevronRight, Check } from 'lucide-react';

const CreateTaskModal = ({ isOpen, onClose, onCreate }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
      title: '',
      description: '',
      deadline: '',
      priority: 'Normal',
      audience: 'All Retailers',
      verificationType: 'photo'
  });

  if (!isOpen) return null;

  const handleNext = () => {
      if (step < totalSteps) setStep(step + 1);
      else {
          // Create Mock ID and submit
          onCreate({
              ...formData,
              id: `t-${Date.now()}`,
              status: 'Active',
              completionRate: 0,
              createdAt: new Date().toISOString().split('T')[0],
              submissions: [],
              audienceCount: formData.audience === 'All Retailers' ? 156 : 45 // Mock logic
          });
      }
  };

  const renderStepIndicator = () => (
      <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {step > s ? <Check size={16}/> : s}
                  </div>
                  {s < 4 && <div className={`w-12 h-1 mx-2 rounded-full ${step > s ? 'bg-black' : 'bg-gray-100'}`}></div>}
              </div>
          ))}
      </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Create New Task</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-black transition"><X size={20}/></button>
        </div>

        <div className="p-8">
            {renderStepIndicator()}
            
            {/* Step Content */}
            <div className="min-h-[300px]">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-lg font-bold mb-4">Step 1: Define Task</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                            <input 
                                type="text" 
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-black focus:border-black outline-hidden transition"
                                placeholder="e.g. Holiday Window Display"
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                                <input 
                                    type="date" 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-hidden"
                                    value={formData.deadline}
                                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-hidden"
                                    value={formData.priority}
                                    onChange={e => setFormData({...formData, priority: e.target.value})}
                                >
                                    <option>Normal</option>
                                    <option>High</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description & Instructions</label>
                            <textarea 
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-hidden resize-none h-32"
                                placeholder="Detailed instructions for the retailer..."
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                            ></textarea>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-lg font-bold mb-4">Step 2: Audience</h3>
                        <div className="space-y-2">
                             {['All Retailers', 'Tier: Platinum Only', 'Region: North America', 'Segment: Boutiques'].map(opt => (
                                 <label key={opt} className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${formData.audience === opt ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}`}>
                                     <input 
                                        type="radio" 
                                        name="audience" 
                                        checked={formData.audience === opt}
                                        onChange={() => setFormData({...formData, audience: opt})}
                                        className="w-4 h-4 accent-black"
                                     />
                                     <span className="font-medium text-gray-900">{opt}</span>
                                 </label>
                             ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-lg font-bold mb-4">Step 3: Attachments</h3>
                        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center hover:bg-gray-50 transition cursor-pointer">
                            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-500">
                                <PlusIcon />
                            </div>
                            <p className="font-medium text-gray-900">Link Campaign or Resource</p>
                            <p className="text-sm text-gray-500 mt-1">Select from existing brand assets</p>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-lg font-bold mb-4">Step 4: Verification Method</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                {id: 'photo', label: 'Photo Upload', desc: 'Retailer must take a photo'},
                                {id: 'link', label: 'URL Link', desc: 'Retailer provides a web link'},
                                {id: 'text', label: 'Text Input', desc: 'Simple text feedback'},
                                {id: 'check', label: 'Checkbox Only', desc: 'Self-confirmation'}
                            ].map(type => (
                                <div 
                                    key={type.id}
                                    onClick={() => setFormData({...formData, verificationType: type.id})}
                                    className={`p-4 border rounded-lg cursor-pointer transition ${formData.verificationType === type.id ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <div className="font-bold mb-1">{type.label}</div>
                                    <div className={`text-xs ${formData.verificationType === type.id ? 'text-gray-400' : 'text-gray-500'}`}>{type.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            {step > 1 ? (
                <button onClick={() => setStep(step - 1)} className="text-gray-600 font-medium hover:text-black">Back</button>
            ) : <div></div>}
            
            <button 
                onClick={handleNext}
                disabled={step === 1 && !formData.title} // Simple validation
                className="px-6 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {step === totalSteps ? 'Publish Task' : 'Next Step'}
                {step < totalSteps && <ChevronRight size={16}/>}
            </button>
        </div>

      </div>
    </div>
  );
};

// Simple icon for internal use
const PlusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

export default CreateTaskModal;
