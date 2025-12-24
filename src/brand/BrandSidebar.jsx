import React from 'react';
import { currentUser } from '../data/mockStore/userStore.js';
import { Home, Users, BarChart3, Settings, FolderOpen, Target, MessageSquare } from 'lucide-react';
import BrandLogo from '@/assets/crownsync_logo-with-text.svg';
import Sidebar from '../components/Sidebar';

const BrandSidebar = ({ activePage, setActivePage }) => {
  // Main Navigation Items
  const MAIN_MENU = [
    { id: 'home', icon: Home, label: 'Home' },
    { type: 'separator' },
    { id: 'inbox', icon: MessageSquare, label: 'Unified Inbox' },
    { 
      id: 'partner', 
      icon: Users, 
      label: 'Partner Hub',
      hasSubmenu: true,
      subItems: [
        { id: 'partner-overview', label: 'Overview' },
        { id: 'partner-campaigns', label: 'Campaigns' },
        { id: 'partner-resources', label: 'Resources' },
        { id: 'partner-retailers', label: 'Retailers' },
        // { id: 'partner-tasks', label: 'Tasks' },
      ]
    },
    {
      id: 'direct',
      icon: Target,
      label: 'Direct Marketing',
      hasSubmenu: false
    },
    {
      id: 'analytics',
      icon: BarChart3,
      label: 'Analytics',
    }
  ];

  // Footer Navigation Items
  const FOOTER_MENU = [
    { id: 'files', icon: FolderOpen, label: 'Files' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const logo = (
    <>
      <img src={BrandLogo} alt="CrownSync" className="h-10 max-w-[160px] hidden md:block" />
      <div className="md:hidden w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs ring-4 ring-gray-50">CS</div>
    </>
  );

  // Adapt user object for Sidebar component
  const user = {
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
      initials: currentUser.avatarInitial,
      avatarType: currentUser.avatarType,
      avatarUrl: currentUser.avatarUrl
  };

  return (
    <Sidebar
      activePage={activePage}
      setActivePage={setActivePage}
      menuItems={MAIN_MENU}
      footerMenuItems={FOOTER_MENU}
      user={user}
      logo={logo}
      defaultOpenMenu="partner"
    />
  );
};

export default BrandSidebar;
