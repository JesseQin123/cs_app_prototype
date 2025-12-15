import React, { useState } from 'react';
import { 
    Search, Phone, Video, MoreVertical, 
    Paperclip, Smile, Send, Image as ImageIcon,
    Check, CheckCheck
} from 'lucide-react';
import { smsData } from '../../../../data/mockStore/inboxStore';

const SmsView = () => {
    const [selectedId, setSelectedId] = useState(smsData.conversations[0]?.id);
    const [inputText, setInputText] = useState('');

    const currentChat = smsData.conversations.find(c => c.id === selectedId);

    const handleSend = (e) => {
        e.preventDefault();
        if(!inputText.trim()) return;
        // Mock send logic would go here
        setInputText('');
    };

    return (
        <div className="flex h-full bg-white">
            {/* 1. Left Sidebar (Conversation List) */}
            <div className="w-80 border-r border-gray-100 flex flex-col bg-white">
                {/* Header / Search */}
                <div className="h-16 border-b border-gray-100 flex items-center px-4">
                     <div className="relative w-full">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search conversation..." 
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition"
                        />
                     </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {smsData.conversations.map(conv => (
                        <div 
                            key={conv.id}
                            onClick={() => setSelectedId(conv.id)}
                            className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition ${
                                selectedId === conv.id ? 'bg-amber-50/30 border-l-2 border-l-brand-gold' : 'border-l-2 border-l-transparent'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img src={conv.contact.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                                    {conv.unreadCount > 0 && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                                            {conv.unreadCount}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-bold text-gray-900 truncate">{conv.contact.name}</h4>
                                        <span className="text-[10px] text-gray-400">{conv.timestamp}</span>
                                    </div>
                                    <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
                                        {conv.lastMessage}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Right Chat Window */}
            {currentChat ? (
                <div className="flex-1 flex flex-col bg-white">
                    {/* Chat Header */}
                    <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
                        <div className="flex items-center gap-3">
                            <img src={currentChat.contact.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">{currentChat.contact.name}</h3>
                                <p className="text-xs text-gray-500">{currentChat.contact.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400">
                             <button className="hover:text-gray-900"><Phone size={20} /></button>
                             <button className="hover:text-gray-900"><Video size={20} /></button>
                             <button className="hover:text-gray-900"><MoreVertical size={20} /></button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
                        {currentChat.messages.length > 0 ? (
                            <>
                                <div className="flex justify-center">
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">Today</span>
                                </div>
                                {currentChat.messages.map(msg => (
                                    <div key={msg.id} className={`flex gap-3 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                                        {msg.sender !== 'me' && (
                                            <img src={currentChat.contact.avatar} alt="" className="w-8 h-8 rounded-full object-cover self-end" />
                                        )}
                                        <div className={`flex flex-col gap-1 max-w-[70%] ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                            {/* Image Attachment */}
                                            {msg.image && (
                                                <div className="rounded-xl overflow-hidden mb-1 border border-gray-100 shadow-xs">
                                                    <img src={msg.image} alt="Attachment" className="max-w-xs object-cover" />
                                                </div>
                                            )}
                                            {/* Text Bubble */}
                                            {msg.text && (
                                                <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                                                    msg.sender === 'me' 
                                                        ? 'bg-gray-900 text-white rounded-br-none' 
                                                        : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
                                                }`}>
                                                    {msg.text}
                                                </div>
                                            )}
                                            {/* Timestamp (Optional) */}
                                            {/* <span className="text-[10px] text-gray-400 px-1">{msg.timestamp}</span> */}
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <p className="text-sm">No recent messages</p>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-end gap-2 p-2 border border-gray-200 rounded-xl bg-white shadow-xs focus-within:ring-2 focus-within:ring-brand-gold/10 focus-within:border-brand-gold/50 transition">
                            <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition">
                                <Paperclip size={20} />
                            </button>
                            <textarea 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Message..." 
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm resize-none py-2.5 max-h-32"
                                rows={1}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend(e);
                                    }
                                }}
                            />
                            <div className="flex items-center gap-1 pb-1">
                                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition">
                                    <Smile size={20} />
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={!inputText.trim()}
                                    className="p-2 bg-gray-900 text-white rounded-lg hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                    Select a conversation
                </div>
            )}
        </div>
    );
};

export default SmsView;
