
import React, { useState } from 'react';
import { Page } from './types';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import PredictPage from './pages/PredictPage';
import UploadPage from './pages/UploadPage';
import TutorPage from './pages/TutorPage';
import MorePage from './pages/MorePage';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Home');

  const renderPage = () => {
    switch (activePage) {
      case 'Home':
        return <HomePage onNavigate={setActivePage} />;
      case 'Predict':
        return <PredictPage />;
      case 'Upload':
        return <UploadPage />;
      case 'Tutor':
        return <TutorPage />;
      case 'More':
        return <MorePage />;
      default:
        return <HomePage onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans">
      <div className="max-w-lg mx-auto h-screen flex flex-col">
        <main className="flex-grow overflow-y-auto pb-20">
          {renderPage()}
        </main>
        <BottomNav activePage={activePage} setActivePage={setActivePage} />
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-popIn {
          animation: popIn 0.3s ease-out;
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default App;
