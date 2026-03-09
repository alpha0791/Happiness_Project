import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Trophy, MessageCircle, Heart, Camera, RefreshCw, Info, Sparkles } from 'lucide-react';
import { FRIEND_QUIZ } from '../constants';
import { analyzeGroupVibe } from '../services/geminiService';

export default function FriendVibe() {
  const [currentQuestion, setCurrentQuestion] = useState(-1); // -1 means camera check
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [faceCount, setFaceCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vibeAnalysis, setVibeAnalysis] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (currentQuestion === -1) {
      startVideo();
    }
    return () => {
      stopVideo();
    };
  }, [currentQuestion]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(err => {
        console.error(err);
        setError("Camera access denied.");
      });
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(t => t.stop());
    }
  };

  const analyzeGroup = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
        
        const result = await analyzeGroupVibe(base64);
        
        setFaceCount(result.faceCount);
        setVibeAnalysis(result.analysis);
        // Bonus points for more faces and better vibe
        setScore(Math.round(result.score / 2)); // Use half the vibe score as a base
        setCurrentQuestion(0);
      }
    } catch (err: any) {
      setError(err.message || "Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnswer = (points: number) => {
    const nextScore = score + points;
    setScore(nextScore);
    
    if (currentQuestion + 1 < FRIEND_QUIZ.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(-1);
    setScore(0);
    setShowResult(false);
    setFaceCount(0);
  };

  const getResult = () => {
    const maxScore = (FRIEND_QUIZ.length * 10) + 20; // +20 for multi-face bonus
    const percentage = (score / maxScore) * 100;

    if (percentage >= 80) return { title: "Great Friend Energy!", desc: `We detected ${faceCount} faces! You're a rockstar friend! Your connections are deep and meaningful.`, icon: Trophy, color: "text-yellow-500" };
    if (percentage >= 50) return { title: "Good Vibes", desc: `Detected ${faceCount} faces. You're doing well, but maybe it's time to reach out to someone you miss.`, icon: MessageCircle, color: "text-blue-500" };
    return { title: "Time to Reconnect", desc: "Life is busy, but friendships need care. Try sending a 'thinking of you' text today.", icon: Heart, color: "text-pink-500" };
  };

  const result = getResult();

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Friend Vibe Check</h2>
        <p className="text-slate-500">How's your social battery and friendship energy?</p>
      </header>

      <div className="max-w-2xl mx-auto">
        {currentQuestion === -1 ? (
          <div className="glass-card p-8 text-center space-y-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200">
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10 bg-slate-100">
                  <Info className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500">{error}</p>
                </div>
              )}
              <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Group Vibe Scan</h3>
              <p className="text-sm text-slate-500">Gather your friends or take a solo selfie to start the vibe check!</p>
            </div>
            <button 
              onClick={analyzeGroup}
              disabled={isAnalyzing}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
              Analyze Group Vibe
            </button>
            <button onClick={() => setCurrentQuestion(0)} className="text-xs text-slate-400 hover:underline">
              Skip camera and use quiz only
            </button>
          </div>
        ) : (
          <div className="hidden">
            <video ref={videoRef} autoPlay muted />
            <canvas ref={canvasRef} />
          </div>
        )}

        {currentQuestion !== -1 && !showResult && (
          <div className="glass-card p-8 md:p-12">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Question {currentQuestion + 1} of {FRIEND_QUIZ.length}
              </span>
              <div className="flex gap-1">
                {FRIEND_QUIZ.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-8 h-1.5 rounded-full transition-colors ${i <= currentQuestion ? 'bg-blue-400' : 'bg-slate-100'}`} 
                  />
                ))}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-8 leading-tight">
              {FRIEND_QUIZ[currentQuestion].question}
            </h3>

            <div className="grid gap-4">
              {FRIEND_QUIZ[currentQuestion].options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(option.score)}
                  className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-blue-700">{option.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {showResult && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center"
          >
            <div className={`w-24 h-24 mx-auto rounded-3xl bg-slate-50 flex items-center justify-center mb-8`}>
              <result.icon className={`w-12 h-12 ${result.color}`} />
            </div>
            
            <h3 className="text-3xl font-black text-slate-900 mb-4">{result.title}</h3>
            <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-md mx-auto">
              {result.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={resetQuiz} className="btn-secondary">
                Take Again
              </button>
              <button className="btn-primary bg-blue-500 hover:bg-blue-600">
                Share Result
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
