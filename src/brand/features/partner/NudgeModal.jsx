import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Bell, ChevronDown, Check, User, Info, Loader2, Bold, Italic, Underline, AlignLeft, AlignCenter, Sparkles, Eye, Minimize2, Mail } from 'lucide-react';
import { currentUser } from '../../../data/mockStore/userStore';

export const RISKS = {
    INACTIVE: 'inactive',
    ZERO_ACTIONS: 'zero_actions',
    INCOMPLETE: 'incomplete_profile',
    GENERIC: 'generic'
};

const TEMPLATES = {
    [RISKS.INACTIVE]: {
        subject: "We miss you! New collections are waiting at {Brand Name}",
        message: "Dear {Retailer Name},<br/><br/>We noticed it has been a while since your last visit to the <b>{Brand Name}</b> Brand Center.<br/><br/>We have recently updated our library with exclusive new marketing assets and seasonal collections. Please log in to download the latest materials to support your sales.<br/><br/>Best regards,<br/>The {Brand Name} Team"
    },
    [RISKS.ZERO_ACTIONS]: {
        subject: "Don't miss out on the latest {Brand Name} assets",
        message: "Dear <b>{Retailer Name}</b>,<br/><br/>We noticed you haven't had a chance to download our latest campaign assets yet.<br/><br/>These materials are designed to help drive engagement and foot traffic to your store. We highly recommend updating your social media and email channels with these new visuals.<br/><br/>Log in now to access the full collection.<br/><br/>Best,<br/>The {Brand Name} Team"
    },
    [RISKS.INCOMPLETE]: {
        subject: "Action Required: Please complete your retailer profile",
        message: "Dear <b>{Retailer Name}</b>,<br/><br/>To ensure you have full access to all features and accurate reporting on the <b>{Brand Name}</b> network, please take a moment to complete your profile setup.<br/><br/>You are currently missing important information (e.g., Logo, Timezone). Updating this will help us support you better.<br/><br/>Best,<br/>The {Brand Name} Team"
    },
    [RISKS.GENERIC]: {
        subject: "Friendly reminder from {Brand Name}",
        message: "Hi <b>{Retailer Name}</b>,<br/><br/>Just a quick check-in to ensure you have everything you need for the upcoming season.<br/><br/>Feel free to browse our latest resources in the Partner Hub, or let us know if you need any specific support.<br/><br/>Best,<br/>The {Brand Name} Team"
    }
};

const RichTextEditor = ({ value, onChange, className }) => {
    const editorRef = useRef(null);
    const isInternalUpdate = useRef(false);

    // Sync external value changes to innerHTML
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML && !isInternalUpdate.current) {
            editorRef.current.innerHTML = value;
        }
        isInternalUpdate.current = false;
    }, [value]);

    const execCmd = (cmd) => {
        document.execCommand(cmd, false, null);
        handleInput();
    };

    const handleInput = () => {
        if (editorRef.current) {
            isInternalUpdate.current = true;
            onChange(editorRef.current.innerHTML);
        }
    };

    return (
        <div className={`border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black/5 transition ${className}`}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-gray-100 bg-gray-50/50">
                <button onClick={() => execCmd('bold')} className="p-1.5 hover:bg-white hover:shadow-xs rounded-sm text-gray-600 transition" title="Bold"><Bold size={14}/></button>
                <button onClick={() => execCmd('italic')} className="p-1.5 hover:bg-white hover:shadow-xs rounded-sm text-gray-600 transition" title="Italic"><Italic size={14}/></button>
                <button onClick={() => execCmd('underline')} className="p-1.5 hover:bg-white hover:shadow-xs rounded-sm text-gray-600 transition" title="Underline"><Underline size={14}/></button>
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                <button onClick={() => execCmd('justifyLeft')} className="p-1.5 hover:bg-white hover:shadow-xs rounded-sm text-gray-600 transition" title="Align Left"><AlignLeft size={14}/></button>
                <button onClick={() => execCmd('justifyCenter')} className="p-1.5 hover:bg-white hover:shadow-xs rounded-sm text-gray-600 transition" title="Align Center"><AlignCenter size={14}/></button>
            </div>
            {/* Editor Area */}
            <div 
                ref={editorRef}
                className="p-4 min-h-[160px] text-sm text-gray-800 focus:outline-hidden overflow-y-auto leading-relaxed"
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
            />
        </div>
    );
};

const NudgeModal = ({ isOpen, onClose, mode = 'single', retailer, retailers = [], riskType = RISKS.GENERIC, onSend }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [selectedRetailerIds, setSelectedRetailerIds] = useState([]);
    const [isRecipientDropdownOpen, setIsRecipientDropdownOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    
    // Use logged in user's brand name
    const brandName = currentUser.name || 'CrownSync AI';

    // Initialize Data on Open
    useEffect(() => {
        if (isOpen) {
            // 1. Setup Template
            const template = TEMPLATES[riskType] || TEMPLATES[RISKS.GENERIC];
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setSubject(template.subject.replace(/{Brand Name}/g, brandName));
            
            let rawMessage = template.message.replace(/{Brand Name}/g, brandName);

            // 2. Variable Replacement based on Mode
            if (mode === 'single' && retailer) {
                rawMessage = rawMessage.replace(/{Retailer Name}/g, retailer.name);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setMessage(rawMessage);

            // 3. Setup Bulk Selection
            if (mode === 'bulk' && retailers.length > 0) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                setSelectedRetailerIds(retailers.map(r => r.id));
            }
            setShowPreview(false);
        }
    }, [isOpen, mode, retailer, retailers, riskType, brandName]);

    if (!isOpen) return null;

    const handleSend = () => {
        setIsSending(true);
        // Simulate API call
        setTimeout(() => {
            const count = mode === 'single' ? 1 : selectedRetailerIds.length;
            onSend && onSend({ 
                count, 
                subject, 
                message, 
                recipients: mode === 'single' ? [retailer.id] : selectedRetailerIds 
            });
            setIsSending(false);
            onClose();
        }, 800);
    };

    const toggleRetailerSelection = (id) => {
        setSelectedRetailerIds(prev => 
            prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
        );
    };

    const recipientCount = mode === 'single' ? 1 : selectedRetailerIds.length;
    const effectiveRetailerName = mode === 'single' ? retailer?.name : "{Retailer Name}";

    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            {/* Full Screen Mask */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity" onClick={onClose}></div>
            
            {/* Modal Container with Explicit Width Transitions and overflow hidden */}
            <div 
                className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-500 ease-in-out`}
                style={{ width: showPreview ? '1100px' : '500px' }}
            >
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                             <Bell size={18} />
                        </div>
                        <div>
                             <h3 className="font-bold text-gray-900 text-lg">Smart Nudge</h3>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-black transition p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Panel: Inputs */}
                    <div className="w-[500px] shrink-0 flex flex-col overflow-y-auto border-r border-gray-100">
                        <div className="p-6 space-y-6">
                            
                            {/* TO Field */}
                            <div className="relative z-20">
                                 <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <User size={12}/> To
                                </label>
                                {mode === 'single' ? (
                                    <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                            {retailer?.name?.charAt(0)}
                                        </div>
                                        {retailer?.name}
                                        {retailer?.tier && <span className="ml-auto text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-sm text-gray-500 uppercase font-bold">{retailer.tier}</span>}
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <button 
                                            onClick={() => setIsRecipientDropdownOpen(!isRecipientDropdownOpen)}
                                            className="w-full p-3 bg-white border border-gray-200 hover:border-black rounded-lg text-left text-sm font-medium flex justify-between items-center transition shadow-xs group"
                                        >
                                            <span className="flex items-center gap-2 text-gray-900">
                                                <div className="bg-black text-white px-2 py-0.5 rounded-sm text-xs font-bold">{selectedRetailerIds.length}</div>
                                                Selected Retailers
                                            </span>
                                            <div className="flex items-center gap-2 text-xs text-black font-bold group-hover:underline">
                                                {isRecipientDropdownOpen ? 'Done' : 'Edit Selection'} <ChevronDown size={14} className={`transition duration-200 ${isRecipientDropdownOpen ? 'rotate-180' : ''}`}/>
                                            </div>
                                        </button>
                                        
                                        {/* Bulk Recipient Dropdown */}
                                        {isRecipientDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto z-30 p-2 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
                                                {retailers.map(r => (
                                                    <div 
                                                        key={r.id} 
                                                        onClick={() => toggleRetailerSelection(r.id)}
                                                        className="flex items-center px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition select-none"
                                                    >
                                                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center mr-3 transition ${selectedRetailerIds.includes(r.id) ? 'bg-black border-black text-white' : 'border-gray-300 bg-white'}`}>
                                                            {selectedRetailerIds.includes(r.id) && <Check size={10} strokeWidth={4} />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-sm font-medium text-gray-900">{r.name}</div>
                                                        </div>
                                                        <div className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-sm">{r.tier || 'Standard'}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Subject Field */}
                            <div>
                                 <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Mail size={12}/> Subject
                                 </label>
                                 <input 
                                    type="text" 
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-black/5 focus:border-black transition placeholder-gray-400"
                                    placeholder="Enter subject line..."
                                />
                            </div>

                            {/* Message Area with Rich Text */}
                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-center mb-2">
                                     <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">Email Message</label>
                                     <button 
                                          onClick={() => setShowPreview(!showPreview)}
                                          className={`text-[10px] font-bold px-2 py-1 rounded-sm transition flex items-center gap-1.5 ${showPreview ? 'bg-black text-white' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
                                     >
                                          {showPreview ? <Minimize2 size={12}/> : <Eye size={12}/>}
                                          {showPreview ? 'Hide Preview' : 'Preview Email'}
                                     </button>
                                </div>
                                <RichTextEditor 
                                    value={message} 
                                    onChange={setMessage} 
                                    className="flex-1"
                                />
                                {mode !== 'single' && (
                                    <div className="mt-2 flex items-start gap-2 bg-blue-50 p-2 rounded-lg border border-blue-100">
                                        <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
                                        <p className="text-xs text-blue-600 leading-snug">
                                            Variables like <span className="font-mono bg-white border border-blue-200 px-1 rounded-sm text-blue-700 font-bold">{`{Retailer Name}`}</span> will be dynamically replaced for each recipient.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 flex items-center justify-end bg-white mt-auto">


                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={onClose}
                                    className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSend}
                                    disabled={recipientCount === 0 || isSending}
                                    className={`px-6 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 active:scale-95 transition flex items-center gap-2 shadow-lg shadow-black/10 ${recipientCount === 0 || isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} 
                                    Send Email {recipientCount > 1 ? `(${recipientCount})` : ''}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Preview */}
                    {showPreview && (
                        <div 
                            className={`flex-1 border-l border-gray-200 bg-gray-50 flex flex-col transition-opacity duration-300 animate-in fade-in min-w-[600px]`}
                        >
                             <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                 <Eye size={14} /> Live Preview
                             </div>
                             <div className="p-6 overflow-y-auto flex-1">
                                 {/* Email Mockup */}
                                 <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden max-w-2xl mx-auto h-full flex flex-col">
                                     <div className="bg-gray-50 p-6 border-b border-gray-100 shrink-0">
                                         <div className="flex items-center gap-4 mb-4">
                                             <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                                                 {brandName.charAt(0)}
                                             </div>
                                             <div>
                                                 <div className="text-sm font-bold text-gray-900">{brandName}</div>
                                                 <div className="text-xs text-gray-500">via CrownSync AI</div>
                                             </div>
                                         </div>
                                         <div className="text-lg font-bold text-gray-900 leading-snug">{subject || '(No Subject)'}</div>
                                     </div>
                                     <div className="p-8 text-base text-gray-800 leading-relaxed whitespace-pre-wrap flex-1 overflow-y-auto font-sans">
                                         <div dangerouslySetInnerHTML={{ __html: message.replace(/{Retailer Name}/g, effectiveRetailerName) }}></div>
                                     </div>
                                     <div className="p-4 bg-gray-50 border-t border-gray-100 text-center shrink-0">
                                         <div className="text-xs text-gray-400">
                                            Sent via CrownSync AI • <span className="underline cursor-pointer">Unsubscribe</span>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default NudgeModal;
