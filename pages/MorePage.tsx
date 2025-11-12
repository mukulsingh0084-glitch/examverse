
import React from 'react';

const MorePage: React.FC = () => {
  return (
    <div className="p-6 animate-fadeIn text-slate-300">
      <h2 className="text-2xl font-bold text-white mb-6">About Examverse</h2>
      <div className="space-y-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <p>
          <strong>Examverse</strong> is an innovative AI-powered study companion designed to help students in India (grades 5-12) excel in their exams.
        </p>
        <p>
          Leveraging the power of Google's Gemini AI, Examverse offers a suite of tools to make studying smarter, not harder.
        </p>
        <h3 className="text-xl font-bold text-white pt-4">Features:</h3>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Predict Questions:</strong> Get a list of likely questions for your upcoming exams based on past trends and syllabus.</li>
          <li><strong>Analyze Paper:</strong> Upload a photo of a question paper to get an instant analysis of topics, difficulty, and related concepts.</li>
          <li><strong>AI Tutor:</strong> Chat with 'EduBrain', a friendly and knowledgeable AI tutor, to clear your doubts on any subject, anytime.</li>
        </ul>
        <p className="pt-4">
          This application was built with React, TypeScript, and Tailwind CSS, powered by the Google Gemini API.
        </p>
      </div>
    </div>
  );
};

export default MorePage;
