import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, MoreHorizontal, LogOut, Settings } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const Sidebar = ({ 
  activePage, 
  setActivePage, 
  user, 
  menuItems, 
  footerMenuItems, 
  logo,
  defaultOpenMenu = null
}) => {
  const [openMenu, setOpenMenu] = useState(defaultOpenMenu); 
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = (menuId) => {
    setOpenMenu(openMenu === menuId ? null : menuId);
  };

  const NavItem = ({ item, isFooter = false }) => {
    // Active state logic
    const isActive = activePage === item.id || (item.hasSubmenu && activePage.startsWith(item.id));
    const isSubActive = (subId) => activePage === subId;

    return (
       <div className={cn("mb-2", isFooter && "mb-0")}>
           {item.type === 'separator' ? (
              <div className="h-px bg-gray-100 my-4 mx-4"></div>
           ) : (
             <>
               <button 
                   onClick={() => {
                       if (item.hasSubmenu) {
                           toggleMenu(item.id);
                       } else {
                           setActivePage(item.id);
                       }
                   }} 
                   className={cn(
                       "w-full flex items-center justify-between px-3 py-3 text-sm transition-all duration-300 group relative rounded-xl overflow-hidden", 
                       isActive 
                           ? "text-gray-900 font-semibold bg-gray-50" 
                           : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                   )}
               >
                   <div className="flex items-center gap-3.5 relation z-10">
                       <item.icon size={18} className={cn("transition-colors duration-300", isActive ? "text-gray-900 stroke-[2px]" : "text-gray-400 group-hover:text-gray-600")} />
                       <span className={cn("tracking-wide", isActive ? "text-gray-900" : "font-medium")}>{item.label}</span>
                   </div>
                   
                   {/* Right Side Active Indicator (Luxury Touch) for Top Level if Active and NOT Submenu (unless collapsed?) */}
                   {isActive && !item.hasSubmenu && (
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#C5A065] rounded-l-full shadow-[0_0_10px_rgba(197,160,101,0.3)]"></div>
                   )}

                   {item.hasSubmenu && (
                        <ChevronDown size={14} className={cn("transition-transform duration-300 text-gray-300 group-hover:text-gray-500", openMenu === item.id ? "rotate-180" : "")} />
                   )}
               </button>

                {/* Submenu Render (Smooth Transition) */}
                {item.hasSubmenu && (
                    <div 
                        className={cn(
                            "grid transition-all duration-300 ease-in-out pl-4 ml-4 border-l border-gray-100",
                            openMenu === item.id ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 mt-0"
                        )}
                    >
                        <div className="overflow-hidden">
                            <div className="space-y-1 py-1">
                                {item.subItems.map(({ id, label }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActivePage(id)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-2 text-sm transition-all relative rounded-lg group/sub",
                                            isSubActive(id) 
                                                ? "text-gray-900 font-medium" 
                                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                                        )}
                                    >
                                    <span className={cn("tracking-normal ml-1", isSubActive(id) ? "" : "")}>{label}</span>
                                        
                                        {/* Submenu Right Indicator */}
                                        {isSubActive(id) && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A065] shadow-sm"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
             </>
           )}
       </div>
    );
  };

  return (
    <aside className="w-20 md:w-60 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 transition-all duration-300 z-20 h-screen font-sans">
      {/* 1. Logo Area */}
      <div className="h-20 flex items-center justify-center md:justify-start md:px-8">
        {logo}
      </div>

      {/* 2. Scrollable Navigation Area */}
      <nav className="flex-1 py-4 overflow-y-auto space-y-1 custom-scrollbar px-4">
         {menuItems.map((item, idx) => (
           <NavItem key={item.id || idx} item={item} />
         ))}
      </nav>

      {/* 3. Footer Section (Settings, User) */}
      <div className="mt-auto border-t border-gray-100 bg-gray-50/30">
        <div className="py-2 px-4">
            {footerMenuItems.map((item, idx) => (
                <NavItem key={item.id || idx} item={item} isFooter={true} />
            ))}
        </div>

        {/* User Info Section */}
        <div className="p-4 relative" ref={userMenuRef}>
             <div 
                className={`flex items-center gap-3 cursor-pointer p-2.5 rounded-xl transition border ${isUserMenuOpen ? 'bg-white border-gray-200 shadow-sm' : 'border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm'}`}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
             >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white text-xs">
                   {user.avatarType === 'image' && user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                        user.initials || user.name.charAt(0)
                    )}
                </div>
                <div className="hidden md:block flex-1 min-w-0">
                   <div className="text-sm font-bold text-gray-900 truncate tracking-tight">{user.name}</div>
                   <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{user.role || 'Admin'}</div>
                </div>
                <MoreHorizontal size={16} className={`text-gray-400 hidden md:block transition-transform ${isUserMenuOpen ? 'rotate-90 text-gray-600' : ''}`}/>
             </div>
             
             {/* Logout Popover */}
             {isUserMenuOpen && (
                <div className="absolute left-4 bottom-20 w-max min-w-[240px] max-w-sm bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 animate-in slide-in-from-bottom-2 fade-in duration-200 overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-200 overflow-hidden ring-1 ring-gray-100 flex items-center justify-center font-bold text-gray-600 text-xs">
                             {user.initials || user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-gray-900 truncate">{user.name}</div>
                            <div className="text-xs text-gray-500 truncate font-medium">{user.email}</div>
                        </div>
                    </div>
                    
                    <div className="p-1 space-y-0.5">
                        <button className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg text-sm text-gray-700 flex items-center gap-3 transition">
                            <Settings size={16} className="text-gray-400"/> Account Settings
                        </button>
                    </div>
                    <div className="p-1 border-t border-gray-50">
                        <button onClick={() => console.log('Logout')} className="w-full text-left px-3 py-2.5 hover:bg-red-50 rounded-lg text-sm text-red-600 flex items-center gap-3 transition font-medium">
                            <LogOut size={16}/> Log out
                        </button>
                    </div>
                </div>
             )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
