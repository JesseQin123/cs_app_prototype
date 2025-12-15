import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { homeData } from '../../../../data/mockStore/homeStore';
import { useToast } from '../../../context/ToastContext';

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
};

const SmartHeader = () => {
  const [greeting] = useState(getGreeting());
  const [showAlert, setShowAlert] = useState(true);
  const { user, alerts } = homeData;
  const { addToast } = useToast();
  const primaryAlert = alerts[0];



  const handleAlertAction = () => {
     setShowAlert(false);
     addToast('Action completed. Alert resolved.', 'success');
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
         <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
            {greeting}, {user.greetingName}.
         </h1>
         <p className="text-gray-500 mt-1 flex items-center gap-2">
            Your brand network is active. Last synced: <span className="font-semibold text-gray-700">10 mins ago</span>
         </p>
      </div>

      {/* Priority Alert (if exists) */}
      {primaryAlert && showAlert && (
         <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600 shrink-0">
               <ShieldAlert size={20} />
            </div>
            <div className="flex-1">
               <div className="text-amber-900 font-bold text-sm">{primaryAlert.title}</div>
               <div className="text-amber-800 text-sm mt-0.5">{primaryAlert.message}</div>
            </div>
            <button 
               onClick={handleAlertAction}
               className="px-4 py-2 bg-white border border-amber-200 shadow-xs text-sm font-bold text-amber-700 rounded-lg hover:bg-amber-100 transition"
            >
               {primaryAlert.action}
            </button>
         </div>
      )}
    </div>
  );
};

export default SmartHeader;
