import React, { useState } from 'react';
import { Plus, Instagram, Mail, Smartphone } from 'lucide-react';
import ActionMenu from '../../components/ActionMenu';
import EmptyState from '../../components/EmptyState';

const cn = (...classes) => classes.filter(Boolean).join(' ');
let uniqueIdCounter = 100;

const TemplateLibrary = ({ templates, setTemplates, notify, isEmpty }) => {
  const [filter, setFilter] = useState('all');

  if (isEmpty) return <EmptyState title="No Templates" description="Create reusable templates for your retailers." action="Create Template" onAction={() => notify('Create Template Clicked', 'success')} />;

  const filtered = templates.filter(t => filter === 'all' || t.type === filter);

  const handleDuplicate = (tpl) => {
    const copy = { ...tpl, id: `t${++uniqueIdCounter}`, name: `${tpl.name} Copy` };
    setTemplates([...templates, copy]);
    notify('Template duplicated', 'success');
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Template Library</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage reusable designs for Retailers.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-sm hover:bg-gray-800 transition" onClick={() => notify('Opens Template Builder', 'success')}>
          <Plus size={16} /> Create Template
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-1">
        {['all', 'social', 'email', 'sms'].map(type => (
          <button
             key={type}
             onClick={() => setFilter(type)}
             className={cn(
               "px-4 py-2 text-sm font-medium border-b-2 transition -mb-1.5",
               filter === type ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black"
             )}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-auto">
        {filtered.map(t => (
          <div key={t.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-400 transition group relative">
            <div className="flex justify-between items-start mb-3">
               <div className="flex items-center gap-2">
                  {t.type === 'social' && <Instagram size={16} className="text-pink-600"/>}
                  {t.type === 'email' && <Mail size={16} className="text-blue-600"/>}
                  {t.type === 'sms' && <Smartphone size={16} className="text-green-600"/>}
                  <span className="text-xs font-semibold uppercase text-gray-500">{t.type}</span>
               </div>
               <ActionMenu 
                 label="Template"
                 onEdit={() => notify('Edit Template', 'success')}
                 onDuplicate={() => handleDuplicate(t)}
                 onDelete={() => {
                    setTemplates(templates.filter(i => i.id !== t.id));
                    notify('Template deleted', 'success');
                 }}
               />
            </div>
            
            <div className="h-40 bg-gray-100 rounded-sm mb-4 flex items-center justify-center text-gray-400 relative overflow-hidden group-hover:bg-gray-200 transition">
               {t.thumb} Preview
               <button className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition" onClick={() => notify('Preview Template', 'success')}>
                  <span className="bg-white px-3 py-1.5 rounded-full shadow-sm text-sm font-medium text-black">Preview</span>
               </button>
            </div>
            
            <div>
               <h3 className="font-medium text-gray-900">{t.name}</h3>
               <p className="text-xs text-gray-500 mt-1">Last modified: {t.modified}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TemplateLibrary;
