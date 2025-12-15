import React, { useState } from 'react';
import { 
    Instagram, Facebook, Twitter, Search, Filter, 
    MoreHorizontal, ChevronDown, CheckSquare, 
    Heart, MessageCircle, Share2, Bookmark,
    CornerUpLeft, Trash2, MapPin
} from 'lucide-react';
import { socialData } from '../../../../data/mockStore/inboxStore';

const SocialView = () => {
    const [selectedTab, setSelectedTab] = useState('comment'); // 'comment' or 'dm'
    const [selectedPlatform, setSelectedPlatform] = useState('all');
    const [selectedItemId, setSelectedItemId] = useState(socialData.items[0]?.id);

    const currentItem = socialData.items.find(i => i.id === selectedItemId);

    const getPlatformIcon = (id) => {
        switch(id) {
            case 'instagram': return Instagram;
            case 'facebook': return Facebook;
            case 'twitter': return Twitter;
            case 'google': return MapPin; // Google Business
            default: return Filter;
        }
    };

    return (
        <div className="flex h-full bg-white">
            {/* 1. Left Sidebar (Platforms) */}
            <div className="w-60 border-r border-gray-100 flex flex-col bg-gray-50/30 p-4">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Channels</div>
                <div className="space-y-1">
                    {socialData.platforms.map(p => {
                        const Icon = getPlatformIcon(p.id);
                        const isActive = selectedPlatform === p.id;
                        return (
                             <button
                                key={p.id}
                                onClick={() => setSelectedPlatform(p.id)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition ${
                                    isActive 
                                        ? 'bg-white shadow-xs text-gray-900 font-medium border border-gray-100' 
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={18} className={p.id === 'instagram' ? '' : ''} />
                                    <span>{p.label}</span>
                                </div>
                                {p.count > 0 && (
                                    <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
                                        {p.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. Middle Column (Notification/Message List) */}
            <div className="w-96 border-r border-gray-100 flex flex-col bg-white">
                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button 
                        onClick={() => setSelectedTab('comment')}
                        className={`flex-1 py-4 text-sm font-medium border-b-2 transition ${
                            selectedTab === 'comment' ? 'border-brand-gold text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Comment
                    </button>
                    <button 
                        onClick={() => setSelectedTab('dm')}
                        className={`flex-1 py-4 text-sm font-medium border-b-2 transition ${
                            selectedTab === 'dm' ? 'border-brand-gold text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Direct Message
                    </button>
                </div>

                {/* List Items */}
                <div className="flex-1 overflow-y-auto">
                    {socialData.items.filter(item => selectedPlatform === 'all' || item.platform === selectedPlatform).map(item => (
                        <div 
                            key={item.id}
                            onClick={() => setSelectedItemId(item.id)}
                            className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition flex gap-3 group ${
                                selectedItemId === item.id ? 'bg-amber-50/20' : ''
                            }`}
                        >
                            {/* Checkbox (Mock) */}
                            <div className="pt-1">
                                <div className={`w-4 h-4 rounded-sm border ${selectedItemId === item.id ? 'border-brand-gold bg-brand-gold' : 'border-gray-300'}`}></div>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    {/* Unread Dot */}
                                    {!item.isRead && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                                    
                                    <img src={item.user.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                                    <span className="text-sm font-bold text-gray-900 truncate">{item.user.name}</span>
                                </div>
                                <p className="text-sm text-gray-800 line-clamp-2 mb-1">{item.content}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        {item.platform === 'instagram' && <Instagram size={10} />}
                                        {item.platform === 'facebook' && <Facebook size={10} />}
                                        <span>{item.type === 'comment' ? 'commented' : 'sent a message'}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{item.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Right Column (Detail & Response) */}
            <div className="flex-1 flex flex-col bg-gray-50/50 p-6 overflow-hidden">
                {currentItem ? (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-xs flex flex-col h-full overflow-hidden max-w-3xl mx-auto w-full">
                        {/* Header Post Context */}
                        <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center text-white">
                                    <img src="https://ui-avatars.com/api/?name=Rolex&background=0D3B26&color=fff" alt="Rolex" className="w-full h-full rounded-full" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1">
                                        Rolex <span className="text-blue-500"><CheckSquare size={12} fill="currentColor" stroke="none" /></span>
                                    </h3>
                                    <p className="text-xs text-gray-500">California, USA</p>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-900"><MoreHorizontal size={20} /></button>
                        </div>

                        {/* Content Scroll Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                           <div className="p-6">
                                {/* Post Image */}
                                {currentItem.post && currentItem.post.imageUrl && (
                                    <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 shadow-xs border border-gray-100">
                                        <img src={currentItem.post.imageUrl} alt="Post" className="w-full h-auto object-cover max-h-[500px]" />
                                    </div>
                                )}
                                
                                {/* Engagement Bar */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <Heart size={24} className="text-gray-900" />
                                        <MessageCircle size={24} className="text-gray-900" />
                                        <Share2 size={24} className="text-gray-900" />
                                    </div>
                                    <Bookmark size={24} className="text-gray-900" />
                                </div>
                                <div className="font-bold text-sm mb-2">{currentItem.post?.likes || '123'} likes</div>

                                {/* Caption */}
                                {currentItem.post?.caption && (
                                    <div className="text-sm text-gray-800 mb-6 leading-relaxed">
                                        <span className="font-bold mr-1">Rolex</span>
                                        {currentItem.post.caption}
                                    </div>
                                )}

                                <div className="h-px bg-gray-100 my-4"></div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Comments</h4>

                                {/* The Comment Being Viewed */}
                                <div className="flex gap-3 mb-6">
                                    <img src={currentItem.user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-bold text-gray-900">{currentItem.user.name}</span>
                                            <button className="text-gray-400 hover:text-red-500"><Heart size={14} /></button>
                                        </div>
                                        <p className="text-sm text-gray-700 mt-0.5">{currentItem.content}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 font-medium">
                                            <span>{currentItem.timestamp}</span>
                                            <button className="hover:text-gray-600">Reply</button>
                                            <button className="hover:text-red-600">Delete</button>
                                        </div>
                                    </div>
                                </div>
                           </div>
                        </div>

                        {/* Reply Input */}
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Add comment..." 
                                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-gold font-medium text-xs uppercase tracking-wide">
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        Select an item
                    </div>
                )}
            </div>
        </div>
    );
};

export default SocialView;
