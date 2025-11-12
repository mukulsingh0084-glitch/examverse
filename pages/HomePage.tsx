
import React from 'react';
import { Page } from '../types';
import PredictIcon from '../components/icons/PredictIcon';
import TutorIcon from '../components/icons/TutorIcon';
import UploadIcon from '../components/icons/UploadIcon';
import MoreIcon from '../components/icons/MoreIcon';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const FeatureButton: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon: Icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="bg-slate-800/50 hover:bg-slate-700/70 p-6 rounded-2xl w-full text-left transition-all duration-300 transform hover:-translate-y-1 shadow-lg backdrop-blur-sm border border-slate-700"
  >
    <div className="flex items-center space-x-4">
      <div className="bg-indigo-500/20 p-3 rounded-xl">
        <Icon className="w-8 h-8 text-indigo-400" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  </button>
);

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 space-y-8 animate-fadeIn">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Examverse</h1>
        <p className="text-indigo-300 mt-2">Your AI Exam Study Companion</p>
      </header>

      <main className="space-y-4">
        <FeatureButton
          icon={PredictIcon}
          title="Predict Questions"
          description="Get AI-predicted questions for your exams."
          onClick={() => onNavigate('Predict')}
        />
        <FeatureButton
          icon={TutorIcon}
          title="AI Tutor"
          description="Chat with an AI tutor for any subject."
          onClick={() => onNavigate('Tutor')}
        />
        <FeatureButton
          icon={UploadIcon}
          title="Analyze Paper"
          description="Upload a question paper for analysis."
          onClick={() => onNavigate('Upload')}
        />
        <FeatureButton
          icon={MoreIcon}
          title="More Information"
          description="About the app and resources."
          onClick={() => onNavigate('More')}
        />
      </main>
    </div>
  );
};

export default HomePage;
