'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bot, LogOut, ArrowRight, Loader2, Sparkles, ActivitySquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

export default function AILabPage() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
    }
  }, [token, user, router]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setAnalysis(null);
    try {
      const res = await api.post('/ai/analyze-symptoms', { symptoms });
      setAnalysis(res.data.result);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to analyze symptoms. Make sure GEMINI_API_KEY is configured on the backend.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans p-6 sm:p-12 relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 pointer-events-none" />

      <header className="flex items-center justify-between mb-16 max-w-5xl mx-auto relative z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/dashboard')}>
           <div className="bg-pink-600 p-2.5 rounded-xl text-white shadow-lg shadow-pink-500/30">
              <Sparkles className="w-6 h-6" />
           </div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Vet Assistant</h1>
        </div>
        
        <div className="flex items-center gap-4">
           <Button variant="outline" onClick={() => router.push('/dashboard')} className="border-slate-200">
             Dashboard
           </Button>
           <Button variant="outline" onClick={() => { logout(); router.push('/login'); }}>
             <LogOut className="w-4 h-4" />
           </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        
        {/* Input Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
           <div className="space-y-4">
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Instantly decode your pet's symptoms.
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Powered by Gemini 1.5, our AI veterinarian analyzes text to provide emergency assessment and actionable next steps.
              </p>
           </div>
           
           <form onSubmit={handleAnalyze} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 space-y-6">
              <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Describe the symptoms</label>
                 <textarea 
                   rows={5}
                   value={symptoms}
                   onChange={(e) => setSymptoms(e.target.value)}
                   placeholder="E.g., My 3-year-old golden retriever has been lethargic today and vomited twice. He's not eating..."
                   className="w-full rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 text-base focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                 />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading || !symptoms.trim()}
                className="w-full h-14 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/25 transition-all text-lg"
              >
                {isLoading ? <Loader2 className="animate-spin w-6 h-6 mr-2" /> : <Bot className="w-6 h-6 mr-2" />}
                {isLoading ? 'Analyzing...' : 'Analyze Symptoms'}
              </Button>
           </form>
           
           <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl flex gap-3 text-amber-800 dark:text-amber-300 text-sm">
             <ActivitySquare className="w-5 h-5 flex-shrink-0" />
             <p><strong>Disclaimer:</strong> This is an AI-powered estimation. It is not a substitute for professional veterinary diagnosis.</p>
           </div>
        </motion.div>

        {/* Output Section */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-full">
           <div className="h-full w-full min-h-[500px] bg-slate-900 rounded-3xl p-8 relative overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
              
              <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
                 <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse" />
                 <h3 className="text-white font-semibold">Gemini Intelligence</h3>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar text-slate-300 prose prose-invert max-w-none">
                 {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                      <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                      <p className="animate-pulse">Consulting AI models...</p>
                    </div>
                 ) : analysis ? (
                    <div className="leading-relaxed">
                       <ReactMarkdown>
                          {analysis}
                       </ReactMarkdown>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600 text-center space-y-4">
                       <Bot className="w-16 h-16 opacity-20" />
                       <p>Awaiting symptom input.<br/>Results will appear here.</p>
                    </div>
                 )}
              </div>
           </div>
        </motion.div>

      </main>
    </div>
  );
}
