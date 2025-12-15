import React, { useState } from 'react';
import { 
    Inbox, Star, Clock, Send, Trash2, Edit3, 
    Search, RotateCw, MoreVertical, ChevronLeft, ChevronRight,
    Reply, Forward, Archive, AlertCircle, FileText
} from 'lucide-react';
import { emailData } from '../../../../data/mockStore/inboxStore';

const EmailView = () => {
    const [selectedFolder, setSelectedFolder] = useState('inbox');
    const [selectedEmailId, setSelectedEmailId] = useState(emailData.emails[0]?.id);

    const currentEmail = emailData.emails.find(e => e.id === selectedEmailId);

    const getIcon = (iconName) => {
        switch(iconName) {
            case 'inbox': return Inbox;
            case 'star': return Star;
            case 'clock': return Clock;
            case 'send': return Send;
            case 'trash': return Trash2;
            default: return Inbox;
        }
    };

    return (
        <div className="flex h-full bg-white">
            {/* 1. Left Sidebar (Folders) */}
            <div className="w-60 border-r border-gray-100 flex flex-col bg-gray-50/30 p-4">
                <button className="w-full bg-black text-white py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition mb-6 shadow-xs">
                    <Edit3 size={16} /> New Mail
                </button>

                <div className="space-y-1">
                    {emailData.folders.map(folder => {
                        const Icon = getIcon(folder.icon);
                        const isActive = selectedFolder === folder.id;
                        return (
                            <button
                                key={folder.id}
                                onClick={() => setSelectedFolder(folder.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                                    isActive 
                                        ? 'bg-brand-gold/10 text-brand-gold font-medium' 
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={18} />
                                    <span>{folder.label}</span>
                                </div>
                                {folder.count > 0 && (
                                    <span className={`text-xs font-semibold ${isActive ? 'text-brand-gold' : 'text-gray-400'}`}>
                                        {folder.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. Middle Column (Email List) */}
            <div className="w-80 border-r border-gray-100 flex flex-col bg-white">
                {/* Header */}
                <div className="h-16 border-b border-gray-100 flex items-center justify-between px-4">
                    <div className="flex items-center gap-2 text-gray-400">
                        <input type="checkbox" className="rounded-sm border-gray-300" />
                        <RotateCw size={16} className="hover:text-gray-600 cursor-pointer" />
                        <MoreVertical size={16} className="hover:text-gray-600 cursor-pointer" />
                    </div>
                    <div className="text-xs text-gray-400">1-50 of 1,234</div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {emailData.emails.map(email => (
                        <div 
                            key={email.id}
                            onClick={() => setSelectedEmailId(email.id)}
                            className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition group ${
                                selectedEmailId === email.id ? 'bg-amber-50/30 border-l-2 border-l-brand-gold' : 'border-l-2 border-l-transparent'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <img src={email.sender.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h4 className={`text-sm truncate pr-2 ${!email.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                            {email.sender.name}
                                        </h4>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{email.timestamp}</span>
                                    </div>
                                    <div className={`text-xs truncate mb-1 ${!email.isRead ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                        {email.subject}
                                    </div>
                                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                        {email.preview}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Right Column (Detail View) */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
                {/* Header Actions */}
                <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4 text-gray-400">
                        <button className="hover:text-gray-600"><Archive size={18} /></button>
                        <button className="hover:text-gray-600"><AlertCircle size={18} /></button>
                        <button className="hover:text-gray-600"><Trash2 size={18} /></button>
                        <div className="w-px h-4 bg-gray-200 mx-1"></div>
                        <button className="hover:text-gray-600"><FileText size={18} /></button>
                        <button className="hover:text-gray-600"><Clock size={18} /></button>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-xs mr-2">1 of 100</span>
                        <button className="hover:text-black"><ChevronLeft size={20} /></button>
                        <button className="hover:text-black"><ChevronRight size={20} /></button>
                    </div>
                </div>

                {/* Email Body */}
                {currentEmail ? (
                    <div className="flex-1 overflow-y-auto p-8 max-w-4xl">
                        {/* Subject */}
                        <div className="flex items-start justify-between mb-6">
                            <h1 className="text-2xl font-serif text-gray-900">{currentEmail.subject}</h1>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition">
                                    <Star size={18} className={currentEmail.isStarred ? 'text-yellow-400 fill-yellow-400' : ''} />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition">
                                    <Reply size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Sender Info */}
                        <div className="flex items-center gap-4 mb-8">
                            <img src={currentEmail.sender.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                            <div className="flex-1">
                                <div className="text-sm font-bold text-gray-900">
                                    {currentEmail.sender.name} <span className="text-gray-400 font-normal">&lt;{currentEmail.sender.email}&gt;</span>
                                </div>
                                <div className="text-xs text-gray-400">to me • {currentEmail.timestamp}</div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line mb-8">
                            {currentEmail.body}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition flex items-center gap-2">
                                <Reply size={16} /> Reply
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition flex items-center gap-2">
                                <Forward size={16} /> Forward
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                        Select an email to read
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailView;
