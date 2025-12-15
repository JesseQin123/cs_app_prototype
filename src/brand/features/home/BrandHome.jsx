import React from 'react';
import SmartHeader from './components/SmartHeader';
import Launchpad from './components/Launchpad';
import PartnerNetwork from './components/PartnerNetwork';
import DirectMarketing from './components/DirectMarketing';

import LivePulse from './components/LivePulse';
import { homeData } from '../../../data/mockStore/homeStore';

const BrandHome = () => {
  const { setupProgress } = homeData;
  const showLaunchpad = setupProgress.percentage < 100;

  return (
    <div className="flex h-full bg-gray-50/30 overflow-y-auto animate-in fade-in duration-700">
      {/* --- Single Column Layout --- */}
      <div className="w-full p-8 md:p-10">
         <div className="max-w-6xl mx-auto space-y-10 pb-10">
            
            <SmartHeader />
            
            {showLaunchpad && <Launchpad />}
            
            {/* Modular Sections */}
            <PartnerNetwork />
            <DirectMarketing />
            <LivePulse />
         </div>
      </div>
    </div>
  );
};

export default BrandHome;
