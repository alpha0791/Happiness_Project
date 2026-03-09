import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Flame, Coffee, Sparkles, Camera, RefreshCw, Info } from 'lucide-react';
import { COUPLE_QUIZ } from '../constants';
import { analyzeCoupleVibe } from '../services/geminiService';

export default function CoupleCompatibility() {
  const [currentQuestion, setCurrentQuestion] = useState(-1); // -1 for camera
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faceData, setFaceData] = useState<{ count: number, analysis: string } | null>(null);

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

  const analyzeCouple = async () => {
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
        
        const result = await analyzeCoupleVibe(base64);
        
        if (result.faceCount === 0) {
          setError("No faces detected. Get closer!");
        } else {
          setFaceData({ count: result.faceCount, analysis: result.analysis });
          
          // Bonus points for 2 faces and happiness
          let bonus = Math.round(result.score / 2.5); // Use a portion of the vibe score as bonus
          if (result.faceCount === 2) bonus += 10;
          
          setScore(bonus);
          setCurrentQuestion(0);
        }
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
    
    if (currentQuestion + 1 < COUPLE_QUIZ.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(-1);
    setScore(0);
    setShowResult(false);
    setFaceData(null);
  };

  const getResult = () => {
    const maxScore = (COUPLE_QUIZ.length * 10) + 40; // +40 for camera bonus
    const percentage = Math.min(100, Math.round((score / maxScore) * 100));

    if (percentage >= 80) return { percentage, title: "Soulmates!", desc: "You two are perfectly in sync. Keep nurturing this beautiful bond.", icon: Flame, color: "text-red-500" };
    if (percentage >= 50) return { percentage, title: "Strong Connection", desc: "You have a solid foundation. A little more communication will make it even better.", icon: Coffee, color: "text-orange-500" };
    return { percentage, title: "Work in Progress", desc: "Every relationship has its ups and downs. Try a fun date night to reconnect!", icon: Heart, color: "text-pink-500" };
  };

  const result = getResult();

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Couple Compatibility</h2>
        <p className="text-slate-500">Discover the magic between you and your partner.</p>
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
              <h3 className="text-xl font-bold text-slate-900">Couple Vibe Scan</h3>
              <p className="text-sm text-slate-500">Both of you look into the camera for a compatibility scan!</p>
            </div>
            <button 
              onClick={analyzeCouple}
              disabled={isAnalyzing}
              className="btn-primary w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50"
            >
              {isAnalyzing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
              Scan Compatibility
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
          <div className="glass-card p-8 md:p-12 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Step {currentQuestion + 1} of {COUPLE_QUIZ.length}
                </span>
                <Heart className="w-5 h-5 text-red-300 animate-pulse" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-8 leading-tight">
                {COUPLE_QUIZ[currentQuestion].question}
              </h3>

              <div className="grid gap-4">
                {COUPLE_QUIZ[currentQuestion].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option.score)}
                    className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-red-200 hover:bg-red-50/50 transition-all group"
                  >
                    <span className="text-slate-700 font-medium group-hover:text-red-700">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {showResult && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-pink-50/50 -z-10" />
            
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 rounded-full border-8 border-white shadow-xl flex items-center justify-center bg-white">
                <span className="text-4xl font-black text-red-500">{result.percentage}%</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <result.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl font-black text-slate-900 mb-4">{result.title}</h3>
            <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-md mx-auto">
              {result.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={resetQuiz} className="btn-secondary">
                Try Again
              </button>
              <button className="btn-primary bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Get Date Ideas
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
