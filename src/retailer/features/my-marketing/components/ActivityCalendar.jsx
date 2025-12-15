
import React from 'react';
import { ChevronLeft, ChevronRight, Mail } from 'lucide-react';

const ActivityCalendar = ({ activities }) => {
    // Hardcoded for MVP Visuals: December 2025
    const CURRENT_MONTH = "December 2025";
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Calendar Grid Logic (Dec 2025 starts on Monday)
    // 0: Empty, 1-31: Days
    const calendarDays = [
        null, 1, 2, 3, 4, 5, 6,
        7, 8, 9, 10, 11, 12, 13,
        14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27,
        28, 29, 30, 31, null, null, null
    ];

    const getActivitiesForDay = (day) => {
        if (!day) return [];
        // Mock filtering by day for MVP
        // In real app, parse ISO date string
        return activities.filter(act => {
            if (!act.scheduledDate && !act.updatedAt) return false;
            const d = new Date(act.scheduledDate || act.updatedAt);
            return d.getDate() === day;
        });
    };

    const STATUS_COLORS = {
        'Draft': 'bg-gray-100 text-gray-600 border-gray-200',
        'Scheduled': 'bg-blue-50 text-blue-700 border-blue-100',
        'Sent': 'bg-green-50 text-green-700 border-green-100',
        'Posted': 'bg-green-50 text-green-700 border-green-100',
        'Failed': 'bg-red-50 text-red-700 border-red-100',
    };

    return (
        <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-900">{CURRENT_MONTH}</h2>
                    <div className="flex items-center bg-gray-50 rounded-md border border-gray-200 p-0.5">
                        <button className="p-1 hover:bg-white hover:shadow-xs rounded-sm transition-all text-gray-500"><ChevronLeft size={16} /></button>
                        <button className="p-1 hover:bg-white hover:shadow-xs rounded-sm transition-all text-gray-500"><ChevronRight size={16} /></button>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-300"></span> Draft</div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Scheduled</div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400"></span> Sent</div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-7 border-b border-gray-200">
                    {DAYS.map(d => (
                        <div key={d} className="py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider border-r border-gray-100 last:border-r-0 bg-gray-50/50">
                            {d}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 auto-rows-fr min-h-[500px]">
                    {calendarDays.map((day, idx) => {
                        const dayActivities = getActivitiesForDay(day);
                        return (
                            <div key={idx} className={`border-b border-r border-gray-100 p-2 min-h-[100px] relative hover:bg-gray-50/30 transition-colors ${!day ? 'bg-gray-50/30' : ''}`}>
                                {day && (
                                    <>
                                        <span className={`text-xs font-medium ${dayActivities.length > 0 ? 'text-gray-900' : 'text-gray-400'}`}>{day}</span>
                                        <div className="flex flex-col gap-1.5 mt-2">
                                            {dayActivities.map(act => (
                                                <div 
                                                    key={act.id} 
                                                    className={`px-2 py-1.5 rounded-sm border text-[10px] font-medium truncate cursor-pointer hover:opacity-80 transition-opacity ${STATUS_COLORS[act.status] || STATUS_COLORS['Draft']}`}
                                                >
                                                   {/* Flex Icon + Text */}
                                                   <div className="flex items-center gap-1.5">
                                                        {/* Brand Dot */}
                                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                                            act.status === 'Draft' ? 'bg-gray-400' :
                                                            act.status === 'Scheduled' ? 'bg-blue-400' : 'bg-green-400'
                                                        }`}></div>
                                                        <span className="truncate">{act.internalName}</span>
                                                   </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ActivityCalendar;
