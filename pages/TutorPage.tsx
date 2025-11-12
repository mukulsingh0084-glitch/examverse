
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { createTutorChat } from '../services/geminiService';
import Spinner from '../components/Spinner';
import { Chat } from '@google/genai';

const TutorPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = createTutorChat();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
  }

  const sendMessage = async () => {
    if ((!input.trim() && !image) || isLoading) return;

    setIsLoading(true);
    const userMessage: ChatMessage = { role: 'user', text: input, imageUrl: previewUrl || undefined };
    setMessages(prev => [...prev, userMessage]);

    const promptParts: (string | { inlineData: { data: string; mimeType: string; } })[] = [];
    if (input.trim()) {
        promptParts.push(input);
    }
    if (image) {
        const base64EncodedDataPromise = new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(image);
        });
        promptParts.push({ inlineData: { data: await base64EncodedDataPromise, mimeType: image.type } });
    }

    setInput('');
    setImage(null);
    setPreviewUrl(null);

    try {
      if (chatRef.current) {
        const result = await chatRef.current.sendMessage(promptParts);
        const responseText = result.text;
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-fadeIn">
      <h2 className="text-2xl font-bold text-white p-6 pb-4 text-center">AI Tutor (EduBrain)</h2>
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-popIn`}>
            <div className={`max-w-xs md:max-w-md p-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
              {msg.imageUrl && <img src={msg.imageUrl} alt="User upload" className="rounded-lg mb-2 max-h-48" />}
              {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-slate-200 p-4 rounded-2xl rounded-bl-none">
              <Spinner size="h-5 w-5" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700">
        {previewUrl && (
          <div className="relative w-24 h-24 mb-2">
            <img src={previewUrl} className="w-full h-full object-cover rounded-lg" alt="preview" />
            <button onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">&times;</button>
          </div>
        )}
        <div className="flex items-center bg-slate-800 rounded-2xl p-2">
          <label htmlFor="tutor-file" className="p-2 text-slate-400 hover:text-indigo-400 cursor-pointer">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </label>
          <input id="tutor-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything..."
            className="flex-grow bg-transparent text-white placeholder-slate-400 outline-none px-2"
          />
          <button onClick={sendMessage} disabled={isLoading} className="p-2 bg-indigo-600 rounded-xl text-white disabled:bg-indigo-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorPage;
