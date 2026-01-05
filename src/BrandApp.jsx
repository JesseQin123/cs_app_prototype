import React, { useState } from 'react';
import BrandSidebar from './brand/BrandSidebar';
import PartnerOverview from './brand/features/partner/PartnerOverview';
import CampaignManager from './brand/features/partner/CampaignManager';
import ResourcesManager from './brand/features/partner/ResourcesManager';
import AssetLibrary from './brand/features/assets/AssetLibrary';
import TemplateLibrary from './brand/features/assets/TemplateLibrary';
import RetailersManager from './brand/features/partner/retailers/RetailersManager';
import TasksManager from './brand/features/partner/TasksManager';
import DirectMarketingPage from './brand/features/direct/DirectMarketingPage';
import BrandAnalytics from './brand/features/analytics/BrandAnalytics';
import BrandHome from './brand/features/home/BrandHome';
import ChatbotPage from './brand/features/chatbot/ChatbotPage';

import UnifiedInbox from './brand/features/inbox/UnifiedInbox';
import { useToast } from './brand/context/ToastContext';

import { NotificationProvider } from './context/NotificationContext';
import NotificationPanel from './components/NotificationCenter/NotificationPanel';
import { currentUser } from './data/mockStore/userStore';

const BrandApp = ({ 
  files, setFiles, 
  campaigns, setCampaigns, 
  templates, setTemplates, 
  catalogs, setCatalogs, 
  retailers,
  showEmptyState 
}) => {
  // Navigation State
  const [activePage, setActivePage] = useState('home');
  const [navParams, setNavParams] = useState({});

  const navigateTo = (page, params = {}) => {
    setActivePage(page);
    setNavParams(params);
  };
  const { addToast } = useToast();

  const notify = (message, type = 'success') => {
    addToast(message, type);
  };
 
  // Map User Role
  const userRole = currentUser.role === 'Admin' ? 'brand_admin' : 'brand_member';

  const renderContent = () => {
      switch(activePage) {
          // Home (Command Center)
          case 'home':
              return <BrandHome />;
          
          // Unified Inbox
          case 'inbox':
              return <UnifiedInbox />;

          // Files (Global)
          case 'files':
              return <AssetLibrary files={files} setFiles={setFiles} campaigns={campaigns} notify={notify} isEmpty={showEmptyState} />;

          // Partner Hub
          case 'partner-overview':
              return <PartnerOverview 
                files={files} 
                campaigns={campaigns} 
                notify={notify} 
                isEmpty={showEmptyState} 
                navigateTo={navigateTo}
              />;
          case 'partner-campaigns':
              return <CampaignManager campaigns={campaigns} setCampaigns={setCampaigns} notify={notify} allFiles={files} setFiles={setFiles} allTemplates={templates} retailers={retailers} isEmpty={showEmptyState} />;
          case 'partner-resources':
              return <ResourcesManager catalogs={catalogs} setCatalogs={setCatalogs} notify={notify} isEmpty={showEmptyState} files={files} setFiles={setFiles} />;
          case 'partner-tasks':
              return <TasksManager notify={notify} />;
          case 'partner-retailers':
              return <RetailersManager notify={notify} initialParams={navParams} />;

          // Direct Marketing
          case 'direct':
              return <DirectMarketingPage />;

          // Analytics
          case 'analytics':
              return <BrandAnalytics />;

          // AI Assistant
          case 'chatbot':
              return <ChatbotPage />;

          // Settings
          case 'settings':
              return (
                  <div className="p-12 flex items-center justify-center h-full text-gray-400 flex-col gap-4">
                      <div className="text-6xl">⚙️</div>
                      <div className="text-xl font-medium">Settings</div>
                      <div className="text-sm">Configure your brand account.</div>
                  </div>
              );

          default:
              return (
                  <div className="p-12 flex items-center justify-center h-full text-gray-400">
                     Page Not Found
                  </div>
              );
      }
  };

  return (
    <NotificationProvider userRole={userRole}>
        <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-900 relative">
        <BrandSidebar activePage={activePage} setActivePage={(page) => navigateTo(page)} />

        <main className="flex-1 overflow-hidden flex flex-col bg-gray-50">
            <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden relative">
                {renderContent()}
            </div>
            </div>
        </main>
        
        {/* Global Notification Panel */}
        <NotificationPanel onNavigate={navigateTo} currentView={activePage} />

        </div>
    </NotificationProvider>
  );
};

export default BrandApp;
