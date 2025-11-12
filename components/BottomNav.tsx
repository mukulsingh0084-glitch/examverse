
import React from 'react';
import { Page } from '../types';
import HomeIcon from './icons/HomeIcon';
import PredictIcon from './icons/PredictIcon';
import UploadIcon from './icons/UploadIcon';
import TutorIcon from './icons/TutorIcon';
import MoreIcon from './icons/MoreIcon';

interface BottomNavProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const NavItem: React.FC<{
  label: Page;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon: Icon, isActive, onClick }) => {
  const activeClasses = 'text-indigo-400';
  const inactiveClasses = 'text-slate-400 hover:text-indigo-300';
  
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-full transition-all duration-200">
      <Icon className={`h-6 w-6 mb-1 ${isActive ? activeClasses : inactiveClasses}`} />
      <span className={`text-xs font-medium ${isActive ? activeClasses : inactiveClasses}`}>{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  const navItems: { label: Page; icon: React.ElementType }[] = [
    { label: 'Home', icon: HomeIcon },
    { label: 'Predict', icon: PredictIcon },
    { label: 'Upload', icon: UploadIcon },
    { label: 'Tutor', icon: TutorIcon },
    { label: 'More', icon: MoreIcon },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-slate-900/80 backdrop-blur-lg border-t border-slate-700 z-50">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            isActive={activePage === item.label}
            onClick={() => setActivePage(item.label)}
          />
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
