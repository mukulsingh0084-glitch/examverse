
import React, { useState, useCallback } from 'react';
import { PaperAnalysis } from '../types';
import { analyzePaper, extractTextFromPaper } from '../services/geminiService';
import Spinner from '../components/Spinner';
import UploadIcon from '../components/icons/UploadIcon';

const UploadPage: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PaperAnalysis | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);


  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (['image/jpeg', 'image/png'].includes(file.type)) {
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setAnalysis(null);
        setExtractedText(null);
        setError(null);
      } else {
        setError("Please upload a valid image file (JPEG or PNG).");
      }
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };
  
  const handleAnalyze = async () => {
    if (!imageFile) return;
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setExtractedText(null);
    try {
      const [analysisResult, textResult] = await Promise.all([
        analyzePaper(imageFile),
        extractTextFromPaper(imageFile),
      ]);
      setAnalysis(analysisResult);
      setExtractedText(textResult);
    } catch (err) {
      setError('Failed to analyze the paper. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-6">Upload & Analyze Paper</h2>

      {!previewUrl ? (
        <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-slate-800/50' : 'border-slate-600 bg-slate-800/20'}`}
        >
          <UploadIcon className="w-12 h-12 text-slate-400 mb-4" />
          <p className="text-slate-300 text-center mb-2">Drag & drop your question paper here</p>
          <p className="text-slate-500 text-sm mb-4">or</p>
          <label htmlFor="file-upload" className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300">
            Click to Upload
          </label>
          <input id="file-upload" type="file" className="hidden" accept="image/jpeg, image/png" onChange={(e) => handleFileChange(e.target.files)} />
        </div>
      ) : (
        <div className="space-y-4">
          <img src={previewUrl} alt="Question paper preview" className="rounded-2xl max-h-64 w-full object-contain mx-auto" />
          <button onClick={handleAnalyze} disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center">
            {isLoading ? <Spinner size="h-6 w-6" /> : 'Analyze Paper'}
          </button>
        </div>
      )}

      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      
      {(analysis || extractedText) && !isLoading && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {analysis && (
            <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Analysis</h3>
              <div className="space-y-3 text-slate-300">
                <p><strong>Topic:</strong> {analysis.topic}</p>
                <p><strong>Difficulty:</strong> {analysis.difficulty}</p>
                <p><strong>Suggested Marks:</strong> {analysis.suggestedMarks}</p>
                <div>
                  <strong className="block mb-1">Related Questions:</strong>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    {analysis.relatedQuestions.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}
          {extractedText && (
            <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Extracted Text</h3>
              <pre className="text-slate-300 whitespace-pre-wrap font-sans text-sm">{extractedText}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadPage;
