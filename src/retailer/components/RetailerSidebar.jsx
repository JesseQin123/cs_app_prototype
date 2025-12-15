import React from 'react';
import { LayoutDashboard, Store, Users, Mail, FolderOpen, BarChart3, Settings, Megaphone } from 'lucide-react';
import BrandLogo from '@/assets/crownsync_logo-with-text.svg';
import Sidebar from '../../components/Sidebar';

const RetailerSidebar = ({ activePage, setActivePage, user }) => {
  const MENU_ITEMS = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { 
      id: 'brand-center', 
      icon: Store, 
      label: 'Brand Center',
      hasSubmenu: true,
      subItems: [
        { id: 'brand-center-overview', label: 'Overview' },
        { id: 'brand-center-brands', label: 'Brands' },
        { id: 'brand-center-campaigns', label: 'Campaigns' },
        { id: 'brand-center-resources', label: 'Resources' },
        { id: 'brand-center-downloads', label: 'Download History' },
      ]
    },
    { id: 'my-marketing', icon: Megaphone, label: 'My Marketing' },
    { id: 'crm', icon: Users, label: 'CRM' },
    { id: 'inbox', icon: Mail, label: 'Unify Inbox' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const FOOTER_MENU = [
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const logo = (
    <>
      <img src={BrandLogo} alt="CrownSync" className="h-10 max-w-[160px] hidden md:block" />
      <div className="md:hidden w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs ring-4 ring-gray-50">CS</div>
    </>
  );

  return (
    <Sidebar
      activePage={activePage}
      setActivePage={setActivePage}
      menuItems={MENU_ITEMS}
      footerMenuItems={FOOTER_MENU}
      user={user}
      logo={logo}
      defaultOpenMenu="brand-center" // Default open for Retailer flow
    />
  );
};

export default RetailerSidebar;
