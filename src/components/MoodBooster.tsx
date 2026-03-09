import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Wind, Lightbulb, Quote as QuoteIcon } from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../constants';

export default function MoodBooster() {
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);
  const [isBreathing, setIsBreathing] = useState(false);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setQuote(MOTIVATIONAL_QUOTES[randomIndex]);
  };

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Mood Booster</h2>
        <p className="text-slate-500">Quick tools to lift your spirits instantly.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quote Section */}
        <div className="glass-card p-8 flex flex-col justify-between min-h-[300px] relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-100 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
          
          <QuoteIcon className="w-12 h-12 text-yellow-400 mb-6 opacity-50" />
          
          <motion.div
            key={quote.text}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10"
          >
            <p className="text-2xl font-serif italic text-slate-800 leading-snug mb-4">
              "{quote.text}"
            </p>
            <p className="text-slate-500 font-medium">— {quote.author}</p>
          </motion.div>

          <button 
            onClick={getRandomQuote}
            className="mt-8 btn-secondary w-full flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            New Inspiration
          </button>
        </div>

        {/* Breathing Exercise */}
        <div className="glass-card p-8 flex flex-col items-center justify-center text-center gap-8">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Breathing Space</h3>
            <p className="text-sm text-slate-500">Inhale peace, exhale stress.</p>
          </div>

          <div className="relative w-48 h-48 flex items-center justify-center">
            <div className={`absolute inset-0 bg-blue-100 rounded-full ${isBreathing ? 'animate-breathe' : 'opacity-20'}`} />
            <div className="relative z-10 w-24 h-24 bg-happiness-blue rounded-full flex items-center justify-center shadow-xl shadow-blue-200">
              <Wind className="text-white w-10 h-10" />
            </div>
          </div>

          <button 
            onClick={() => setIsBreathing(!isBreathing)}
            className="btn-primary bg-happiness-blue hover:bg-blue-500 w-full"
          >
            {isBreathing ? 'Stop Exercise' : 'Start Breathing'}
          </button>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-8">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-bold text-slate-900">Mini Relaxation Tips</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Hydrate", desc: "Drink a glass of cold water slowly." },
            { title: "Stretch", desc: "Reach for the sky for 10 seconds." },
            { title: "Listen", desc: "Play one song that makes you dance." },
            { title: "Unplug", desc: "Put your phone away for 5 minutes." },
            { title: "Nature", desc: "Look out the window at something green." },
            { title: "Gratitude", desc: "Think of one thing you're thankful for." }
          ].map((tip, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-pink-200 transition-colors">
              <h4 className="font-bold text-slate-900 mb-1">{tip.title}</h4>
              <p className="text-sm text-slate-500">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
