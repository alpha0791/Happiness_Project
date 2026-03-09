import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Calendar, TrendingUp, History, Smile, Frown, Meh } from 'lucide-react';
import { MoodEntry, Mood } from '../types';

export default function MoodTracker() {
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('mood_history') || '[]');
    setHistory(savedHistory);
  }, []);

  const handleManualMoodSelect = (mood: Mood) => {
    const today = new Date().toISOString().split('T')[0];
    const scoreMap: Record<Mood, number> = {
      happy: 85, surprised: 70, neutral: 45, sad: 30, fearful: 20, angry: 15, disgusted: 10
    };
    
    const newEntry: MoodEntry = { date: today, mood, score: scoreMap[mood] };
    const updatedHistory = [...history.filter(h => h.date !== today), newEntry];
    
    setHistory(updatedHistory);
    localStorage.setItem('mood_history', JSON.stringify(updatedHistory));
    setSelectedMood(mood);
  };

  const moodIcons: Record<string, any> = {
    happy: { icon: Smile, color: 'text-green-500', bg: 'bg-green-50' },
    neutral: { icon: Meh, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    sad: { icon: Frown, color: 'text-blue-500', bg: 'bg-blue-50' },
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Mood Tracker</h2>
        <p className="text-slate-500">Visualize your emotional journey over time.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Selection */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-pink-500" />
            <h3 className="font-bold text-slate-900">How are you today?</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {(['happy', 'neutral', 'sad'] as Mood[]).map((mood) => {
              const Config = moodIcons[mood];
              return (
                <button
                  key={mood}
                  onClick={() => handleManualMoodSelect(mood)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all ${
                    selectedMood === mood 
                      ? 'bg-slate-900 text-white scale-105 shadow-lg' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <Config.icon className={`w-8 h-8 ${selectedMood === mood ? 'text-white' : Config.color}`} />
                  <span className="text-xs font-bold capitalize">{mood}</span>
                </button>
              );
            })}
          </div>
          
          <p className="text-xs text-slate-400 text-center italic">
            Your daily mood is stored locally on your device.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="font-bold text-slate-900">Happiness Trend</h3>
            </div>
            <div className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">
              Last 7 Days
            </div>
          </div>

          <div className="h-[250px] w-full">
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history.slice(-7)}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFB7C5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FFB7C5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    tickFormatter={(str) => str.split('-').slice(1).join('/')}
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#FFB7C5" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                <History className="w-8 h-8 opacity-20" />
                <p className="text-sm">No data yet. Start tracking today!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="glass-card p-8">
        <h3 className="font-bold text-slate-900 mb-6">Recent History</h3>
        <div className="space-y-4">
          {history.slice().reverse().map((entry, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${moodIcons[entry.mood]?.bg || 'bg-slate-100'}`}>
                  {React.createElement(moodIcons[entry.mood]?.icon || History, { 
                    className: `w-5 h-5 ${moodIcons[entry.mood]?.color || 'text-slate-400'}` 
                  })}
                </div>
                <div>
                  <p className="font-bold text-slate-900 capitalize">{entry.mood}</p>
                  <p className="text-xs text-slate-500">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-700">{entry.score}/100</span>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Happiness Score</p>
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <p className="text-center text-slate-400 py-8 italic">Your history will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
