import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { PawPrint, Dog, Cat, Play, ExternalLink, Heart, Camera, RefreshCw, Info } from 'lucide-react';
import { analyzeHappiness } from '../services/geminiService';

export default function PetHappiness() {
  const [hasPet, setHasPet] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activities = [
    { type: 'dog', title: 'Fetch Time', desc: 'A 15-minute game of fetch releases endorphins for both of you.', icon: Dog },
    { type: 'cat', title: 'Feather Chase', desc: 'Use a wand toy to mimic prey and keep your cat sharp and happy.', icon: Cat },
    { type: 'all', title: 'Cuddle Session', desc: 'Oxytocin levels rise when you simply sit and pet your companion.', icon: Heart }
  ];

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

  const runPetScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsScanning(true);
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
        
        const result = await analyzeHappiness(base64);
        setScanResult(result.score);
        setAnalysis(result.analysis);
      }
    } catch (err: any) {
      setError(err.message || "Scan failed.");
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (hasPet === true && scanResult === null) {
      startVideo();
    }
    return () => stopVideo();
  }, [hasPet, scanResult]);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Pet Happiness Zone</h2>
        <p className="text-slate-500">Because their happiness is your happiness too.</p>
      </header>

      {hasPet === null ? (
        <div className="glass-card p-12 text-center max-w-2xl mx-auto">
          <PawPrint className="w-16 h-16 text-orange-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-slate-900 mb-8">Do you have a pet at home?</h3>
          <div className="flex gap-4 justify-center">
            <button onClick={() => setHasPet(true)} className="btn-primary bg-orange-500 hover:bg-orange-600">
              Yes, I do!
            </button>
            <button onClick={() => setHasPet(false)} className="btn-secondary">
              Not yet
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {hasPet ? (
            <div className="space-y-8">
              <div className={scanResult === null ? 'block' : 'hidden'}>
                <div className="glass-card p-8 text-center space-y-6 max-w-2xl mx-auto">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-orange-200">
                    {error && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10 bg-slate-100">
                        <Info className="w-8 h-8 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-500">{error}</p>
                      </div>
                    )}
                    
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      muted 
                      className="w-full h-full object-cover" 
                    />
                    
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">Pet Bond Scan</h3>
                    <p className="text-sm text-slate-500">Look into the camera with your pet (or just your happy self) to measure your bond!</p>
                  </div>
                  <button 
                    onClick={runPetScan}
                    disabled={isScanning}
                    className="btn-primary w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
                  >
                    {isScanning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                    Start Bond Scan
                  </button>
                </div>
              </div>

              {scanResult !== null && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-8 text-center bg-gradient-to-br from-orange-50 to-white border-orange-100 max-w-2xl mx-auto"
                >
                  <div className="w-24 h-24 mx-auto rounded-full bg-white shadow-xl flex items-center justify-center mb-6 border-4 border-orange-100">
                    <span className="text-3xl font-black text-orange-500">{scanResult}%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Amazing Bond!</h3>
                  <p className="text-slate-500 mb-8">Your pet energy is off the charts today. Here are some activities to keep it up:</p>
                  <button onClick={() => setScanResult(null)} className="text-sm font-bold text-orange-500 hover:underline">
                    Scan Again
                  </button>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activities.map((act, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-6 hover:shadow-xl transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <act.icon className="w-6 h-6 text-orange-500" />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">{act.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{act.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 bg-orange-50/30 border-orange-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Play className="w-5 h-5 text-orange-500 fill-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">No pet? No problem!</h3>
                  <p className="text-sm text-slate-500">Watching cute animals is scientifically proven to reduce stress.</p>
                </div>
              </div>
              
              <div className="aspect-video rounded-2xl bg-slate-200 overflow-hidden relative group cursor-pointer">
                <img 
                  src="https://picsum.photos/seed/cute-pet/800/450" 
                  alt="Cute animals" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-orange-500 fill-orange-500" />
                  </div>
                </div>
              </div>
              
              <button className="mt-6 w-full py-4 border-2 border-dashed border-orange-200 rounded-2xl text-orange-600 font-bold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Open Pet Video Playlist
              </button>
            </div>
          )}

          <div className="glass-card p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Pet Happiness Checklist</h3>
            <div className="space-y-4">
              {[
                "Fresh water available at all times",
                "Clean bedding and safe space",
                "Regular mental stimulation (toys/puzzles)",
                "Quality time and physical affection",
                "Healthy diet and regular checkups"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-orange-200 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                  </div>
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
