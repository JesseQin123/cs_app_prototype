import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, CheckCircle2, AlertCircle, Calendar, Filter } from 'lucide-react';
import { analyticsData } from '../../../../data/mockStore/analyticsStore';
import FilterDropdown from './FilterDropdown';

const ComplianceTab = () => {
    const { kpi, tasks } = analyticsData.compliance;
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [zone, setZone] = useState('All Zones');

    return (
        <div className="space-y-6">
             {/* Tab Filters */}
             <div className="flex flex-wrap items-center gap-3">
                 <FilterDropdown 
                    value={dateRange} 
                    options={['Last 30 Days', 'This Quarter', 'Year to Date']} 
                    onChange={setDateRange} 
                    icon={Calendar} 
                 />
                 <div className="h-4 w-px bg-gray-200"></div>
                 <FilterDropdown 
                    label="Zone"
                    value={zone} 
                    options={['All Zones', 'Northeast', 'West', 'South', 'Midwest', 'Northwest']} 
                    onChange={setZone} 
                    icon={Filter} 
                 />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpi.map((item, idx) => {
                    const isUp = item.trendDirection === 'up';
                     return (
                        <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs col-span-1 md:col-span-2">
                             <div className="flex justify-between items-start mb-2">
                                <span className="text-gray-500 text-sm font-medium">{item.label}</span>
                                {idx === 0 ? <CheckCircle2 size={18} className="text-gray-300"/> : <AlertCircle size={18} className="text-gray-300"/>}
                            </div>
                            <div className="flex items-baseline gap-2 mb-1">
                                <h3 className="text-3xl font-bold text-gray-900">{item.value}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded ${
                                    isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                }`}>
                                    {isUp ? <ArrowUpRight size={12} className="mr-1"/> : <ArrowDownRight size={12} className="mr-1"/>}
                                    {item.trend}
                                </span>
                                <span className="text-xs text-gray-400">vs last month</span>
                            </div>
                        </div>
                     )
                })}
            </div>

            {/* Compliance Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-xs flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Task Completion Breakdown</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50">
                            <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-3 font-medium">Task Name</th>
                                <th className="px-6 py-3 font-medium">Deadline</th>
                                <th className="px-6 py-3 font-medium text-center">Assigned</th>
                                <th className="px-6 py-3 font-medium text-center">Submitted</th>
                                <th className="px-6 py-3 font-medium text-center">Approved</th>
                                <th className="px-6 py-3 font-medium text-center">Completion Rate</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {tasks.map(task => {
                                const rate = Math.round((task.approved / task.assigned) * 100);
                                return (
                                <tr key={task.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900 text-sm">{task.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{task.deadline}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 text-center">{task.assigned}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 text-center">{task.submitted}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 text-center font-bold">{task.approved}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 justify-center">
                                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${rate >= 75 ? 'bg-emerald-500' : rate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                                    style={{ width: `${rate}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-bold w-8 text-right">{rate}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                         <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                            task.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' :
                                            'bg-gray-50 text-gray-600 border-gray-100'
                                        }`}>
                                            {task.status}
                                        </span>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ComplianceTab;
