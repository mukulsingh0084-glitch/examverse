
import React, { useState, useEffect } from 'react';
import { indianStates, subjectsByClass } from '../constants';
import { PredictedQuestion } from '../types';
import { predictQuestions } from '../services/geminiService';
import Spinner from '../components/Spinner';

const PredictPage: React.FC = () => {
  const [formData, setFormData] = useState({
    state: indianStates[0],
    class: '10',
    subject: subjectsByClass[10][0],
    fromYear: new Date().getFullYear() - 5,
    toYear: new Date().getFullYear() - 1,
    questionType: 'Short Answer',
    numQuestions: 5,
  });

  const [subjects, setSubjects] = useState<string[]>(subjectsByClass[10]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PredictedQuestion[]>([]);

  useEffect(() => {
    const classNum = parseInt(formData.class, 10);
    const newSubjects = subjectsByClass[classNum] || [];
    setSubjects(newSubjects);
    setFormData(prev => ({ ...prev, subject: newSubjects[0] || '' }));
  }, [formData.class]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults([]);
    try {
      const response = await predictQuestions(formData);
      setResults(response.questions);
    } catch (err) {
      setError('Failed to predict questions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-6">Predict Exam Questions</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField label="State" name="state" value={formData.state} onChange={handleChange} options={indianStates} />
          <SelectField label="Class" name="class" value={formData.class} onChange={handleChange} options={Object.keys(subjectsByClass)} />
        </div>
        <SelectField label="Subject" name="subject" value={formData.subject} onChange={handleChange} options={subjects} />
        <div className="grid grid-cols-2 gap-4">
            <InputField label="From Year" name="fromYear" type="number" value={formData.fromYear} onChange={handleChange} max={currentYear - 1} />
            <InputField label="To Year" name="toYear" type="number" value={formData.toYear} onChange={handleChange} max={currentYear} />
        </div>
        <SelectField label="Question Type" name="questionType" value={formData.questionType} onChange={handleChange} options={['MCQ', 'Short Answer', 'Long Answer']} />
        <InputField label="Number of Questions" name="numQuestions" type="number" value={formData.numQuestions} onChange={handleChange} min={1} max={20} />

        <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center">
          {isLoading ? <Spinner size="h-6 w-6" /> : 'Predict Questions'}
        </button>
      </form>

      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">Predicted Questions</h3>
          <div className="space-y-4">
            {results.map((item, index) => (
              <div key={index} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                <p className="text-slate-200 mb-2">{item.question}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Confidence</span>
                  <div className="w-1/2 bg-slate-700 rounded-full h-2.5">
                    <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${item.confidence}%` }}></div>
                  </div>
                   <span className="text-sm font-semibold text-indigo-300">{item.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper components for form fields
const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    <input {...props} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
  </div>
);

const SelectField = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    <select {...props} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export default PredictPage;
