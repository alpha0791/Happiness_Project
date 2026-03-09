import React, { useRef, useEffect, useState } from 'react';
import { Camera, RefreshCw, Smile, Info, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { MOOD_TIPS } from '../constants';
import { Mood } from '../types';
import { analyzeHappiness, AnalysisResult } from '../services/geminiService';

export default function MoodMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    startVideo();
    return () => {
      stopVideo();
    };
  }, []);

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Error accessing webcam:", err);
        setError("Could not access webcam. Please ensure you have given permission.");
      });
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Capture frame
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Match canvas size to actual video dimensions for clarity
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);

        // Extract the base64 string (removing the data:image/jpeg;base64, prefix)
        const base64 = dataUrl.split(',')[1];
        
        // Analyze with Gemini
        const result = await analyzeHappiness(base64);
        setAnalysisResult(result);

        // Save to local storage for tracker
        saveMoodToHistory(result);
      }
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err.message || "Something went wrong during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setError(null);
  };

  const saveMoodToHistory = (result: AnalysisResult) => {
    const history = JSON.parse(localStorage.getItem('mood_history') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    // Map score to a general mood category for the tracker icons
    let mood: Mood = 'neutral';
    if (result.score >= 60) mood = 'happy';
    else if (result.score < 40) mood = 'sad';

    const entry = { date: today, mood, score: result.score };
    history.push(entry);
    localStorage.setItem('mood_history', JSON.stringify(history));
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Mood Mirror</h2>
        </div>
        {capturedImage && (
          <button onClick={resetCapture} className="text-sm font-bold text-pink-500 hover:underline flex items-center gap-1">
            <RefreshCw className="w-4 h-4" /> Retake Photo
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-200 shadow-2xl border-4 border-white group">
          {error && !capturedImage ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-100 z-20">
              <Info className="w-12 h-12 text-slate-400 mb-4" />
              <p className="text-slate-600 font-medium mb-4">{error}</p>
              <button onClick={() => setError(null)} className="btn-secondary py-2">Try Again</button>
            </div>
          ) : null}

          <video
            ref={videoRef}
            autoPlay
            muted
            className={`w-full h-full object-cover ${capturedImage ? 'hidden' : 'block'}`}
          />

          {capturedImage && (
            <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
          )}

          {!capturedImage && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <button 
                onClick={captureAndAnalyze}
                disabled={isLoading}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-8 h-8 text-pink-500 animate-spin" /> : <Camera className="w-8 h-8 text-pink-500" />}
              </button>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
          
          {!capturedImage && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white text-xs font-bold uppercase tracking-widest">Live Feed</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 relative overflow-hidden">
            {analysisResult && (
              <div className="absolute top-0 right-0 p-4">
                <div className="w-16 h-16 rounded-full border-4 border-pink-100 flex items-center justify-center bg-white shadow-sm">
                  <span className="text-xl font-black text-pink-500">{analysisResult.score}</span>
                </div>
              </div>
            )}

            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">AI Vibe Analysis</h3>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-happiness-pink/20 rounded-3xl flex items-center justify-center">
                {analysisResult ? (
                  <span className="text-4xl">{analysisResult.emoji}</span>
                ) : (
                  <Sparkles className="w-10 h-10 text-happiness-pink" />
                )}
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 leading-tight block">
                  {analysisResult ? 'Analysis Complete' : 'Waiting for Snapshot...'}
                </span>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                  {analysisResult ? analysisResult.analysis : "Click the camera to let the AI read your vibe."}
                </p>
              </div>
            </div>
          </div>

          {analysisResult && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 bg-gradient-to-br from-white to-pink-50/30"
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Personalized Tips</h3>
              <ul className="space-y-4">
                {MOOD_TIPS[analysisResult.score >= 60 ? 'happy' : analysisResult.score >= 40 ? 'neutral' : 'sad']?.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-slate-700 leading-relaxed">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-happiness-pink shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
