import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Users, Image as ImageIcon, Send, Clock, LayoutTemplate } from 'lucide-react';

const ActivityEditorModal = ({ isOpen, onClose, type }) => {
  const [step, setStep] = useState(1); // 1: Content, 2: Configure
  const [activityName, setActivityName] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('');
  const [scheduleType, setScheduleType] = useState('now'); // now, later

  if (!isOpen) return null;

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
         
         {/* --- Top Bar --- */}
         <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
            <div className="flex items-center gap-4 flex-1">
               <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition">
                  <X size={20} />
               </button>
               <div className="h-6 w-px bg-gray-200"></div>
               <input 
                 type="text" 
                 placeholder="Name this activity (e.g., Summer Sale VIP Email)" 
                 className="flex-1 text-lg font-bold text-gray-900 placeholder:text-gray-300 border-none focus:ring-0 px-0"
                 value={activityName}
                 onChange={(e) => setActivityName(e.target.value)}
                 autoFocus
               />
            </div>
            <div className="flex items-center gap-3">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mr-2">
                 Step {step} of 2: {step === 1 ? 'Content' : 'Configure'}
               </span>
               <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition border border-transparent hover:border-gray-200">
                  Save Draft
               </button>
               {step === 1 ? (
                 <button 
                  onClick={handleNext}
                  className="px-6 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
                 >
                    Next: Configure <ChevronRight size={16} />
                 </button>
               ) : (
                 <button 
                  onClick={onClose}
                  className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition flex items-center gap-2 shadow-emerald-200 shadow-lg"
                 >
                    Confirm & Schedule <Send size={16} />
                 </button>
               )}
            </div>
         </div>

         {/* --- Main Content Area --- */}
         <div className="flex-1 flex overflow-hidden">
            
            {/* Left Panel: Configuration */}
            <div className="w-1/2 border-r border-gray-200 overflow-y-auto bg-gray-50/50 p-8">
               {step === 1 ? (
                 <div className="space-y-6 max-w-lg mx-auto">
                    {/* Step 1: Content */}
                    <div>
                       <label className="block text-sm font-bold text-gray-900 mb-2">
                         {type === 'email' ? 'Subject Line' : type === 'social' ? 'Platform' : 'Message Body'}
                       </label>
                       {type === 'social' ? (
                         <div className="flex gap-4 mb-4">
                            {['Instagram', 'Facebook', 'X'].map(p => (
                               <button key={p} className="flex-1 py-3 border border-gray-200 rounded-lg bg-white text-sm font-medium hover:border-black transition shadow-xs">
                                  {p}
                               </button>
                            ))}
                         </div>
                       ) : (
                         <input type="text" className="w-full border-gray-200 rounded-lg shadow-xs focus:border-black focus:ring-0" placeholder={type === 'email' ? "Enter a catchy subject..." : "Enter message..."} />
                       )}
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-4">
                       <label className="block text-sm font-bold text-gray-900">
                          {type === 'sms' ? 'Short Link' : 'Content Builder'}
                       </label>
                       <textarea 
                          className="w-full h-64 border-gray-200 rounded-lg resize-none focus:border-black focus:ring-0 text-sm"
                          placeholder="Start typing or use AI assistant..."
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                       ></textarea>
                       <div className="flex gap-2">
                          <button className="p-2 border border-gray-200 rounded-sm hover:bg-gray-50 text-gray-500"><ImageIcon size={18}/></button>
                          <button className="p-2 border border-gray-200 rounded-sm hover:bg-gray-50 text-gray-500"><LayoutTemplate size={18}/></button>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-8 max-w-lg mx-auto animate-in slide-in-from-right-4 duration-300">
                    <button onClick={handleBack} className="text-sm text-gray-500 hover:text-black flex items-center gap-1 mb-4">
                       <ChevronLeft size={14} /> Back to Content
                    </button>
                    
                    {/* Step 2: Configure */}
                    <div>
                       <label className="block text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Users size={20} className="text-gray-400"/> Select Audience
                       </label>
                       <select 
                        className="w-full border-gray-200 rounded-xl shadow-xs focus:border-black focus:ring-0 p-3 text-lg"
                        onChange={(e) => setAudience(e.target.value)}
                       >
                          <option value="">Choose a segment...</option>
                          <option value="all">All Customers (2.4k)</option>
                          <option value="vip">VIP High Spenders (450)</option>
                          <option value="engaged">Engaged Last 30 Days (1.2k)</option>
                       </select>
                       <div className="mt-2 text-sm text-gray-500 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg inline-block">
                          Est. Audience Size: <strong>{audience === 'vip' ? 450 : audience === 'engaged' ? 1200 : 2400} people</strong>
                       </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8">
                       <label className="block text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Clock size={20} className="text-gray-400"/> Schedule
                       </label>
                       <div className="space-y-3">
                          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-white cursor-pointer hover:border-black transition group">
                             <input type="radio" name="schedule" checked={scheduleType === 'now'} onChange={() => setScheduleType('now')} className="text-black focus:ring-black" />
                             <div>
                                <div className="font-bold text-gray-900">Send Immediately</div>
                                <div className="text-xs text-gray-500">Will be queued instantly upon confirmation</div>
                             </div>
                          </label>
                          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-white cursor-pointer hover:border-black transition group">
                             <input type="radio" name="schedule" checked={scheduleType === 'later'} onChange={() => setScheduleType('later')} className="text-black focus:ring-black" />
                             <div className="flex-1">
                                <div className="font-bold text-gray-900">Schedule for Later</div>
                                <div className="text-xs text-gray-500">Pick a future date and time</div>
                             </div>
                             {scheduleType === 'later' && (
                                <div className="flex bg-gray-50 p-1 rounded-sm border border-gray-200">
                                   <input type="datetime-local" className="border-none bg-transparent text-xs p-1 focus:ring-0" />
                                </div>
                             )}
                          </label>
                       </div>
                    </div>
                 </div>
               )}
            </div>

            {/* Right Panel: Preview */}
            <div className="w-1/2 bg-gray-100 flex items-center justify-center p-8 relative">
               <div className="absolute top-4 right-4 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-500">
                  Live Preview
               </div>
               
               {/* Device Mockup */}
               <div className="w-[375px] h-[700px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-900 flex flex-col overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-6 bg-black z-20 flex justify-center">
                     <div className="w-24 h-4 bg-black rounded-b-xl"></div>
                  </div>
                  
                  {/* Mock Content */}
                  <div className="flex-1 bg-gray-50 overflow-y-auto pt-10 px-4 pb-4">
                     {/* Header */}
                     <div className="flex items-center justify-center mb-6">
                        <div className="font-bold text-xl">BRAND</div>
                     </div>
                     
                     {/* Preview Body */}
                     <div className="space-y-4">
                        <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                           <ImageIcon size={32} />
                        </div>
                        <div className="space-y-2">
                           <div className="h-4 bg-gray-200 rounded-sm w-3/4"></div>
                           <div className="h-4 bg-gray-200 rounded-sm w-full"></div>
                           <div className="h-4 bg-gray-200 rounded-sm w-5/6"></div>
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed">
                           {content || "Your content preview will appear here in real-time as you edit."}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ActivityEditorModal;
