import React, { useState } from 'react';
import { Mail, MessageSquare, Share2 } from 'lucide-react';
import EmailView from './components/EmailView';
import SmsView from './components/SmsView';
import SocialView from './components/SocialView';

const UnifiedInbox = () => {
    const [activeChannel, setActiveChannel] = useState('email'); // 'email', 'sms', 'social'

    return (
        <div className="flex flex-col h-full bg-white font-sans">
            {/* Top Channel Switcher */}
            <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
                <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveChannel('email')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                            activeChannel === 'email' 
                                ? 'bg-white text-gray-900 shadow-xs ring-1 ring-black/5' 
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <Mail size={16} /> Email
                    </button>
                    <button 
                        onClick={() => setActiveChannel('sms')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                            activeChannel === 'sms' 
                                ? 'bg-white text-gray-900 shadow-xs ring-1 ring-black/5' 
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <MessageSquare size={16} /> SMS
                    </button>
                    <button 
                        onClick={() => setActiveChannel('social')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                            activeChannel === 'social' 
                                ? 'bg-white text-gray-900 shadow-xs ring-1 ring-black/5' 
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <Share2 size={16} /> Social
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {activeChannel === 'email' && <EmailView />}
                {activeChannel === 'sms' && <SmsView />}
                {activeChannel === 'social' && <SocialView />}
            </div>
        </div>
    );
};

export default UnifiedInbox;
