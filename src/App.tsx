/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smile, 
  Zap, 
  Users, 
  Heart, 
  PawPrint, 
  BarChart3, 
  Camera, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Components
import MoodMirror from './components/MoodMirror';
import MoodBooster from './components/MoodBooster';
import FriendVibe from './components/FriendVibe';
import CoupleCompatibility from './components/CoupleCompatibility';
import PetHappiness from './components/PetHappiness';
import MoodTracker from './components/MoodTracker';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Section = 'mirror' | 'booster' | 'friend' | 'couple' | 'pet' | 'tracker';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('mirror');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'mirror', label: 'Mood Mirror', icon: Camera, color: 'text-pink-500' },
    { id: 'booster', label: 'Mood Booster', icon: Zap, color: 'text-yellow-500' },
    { id: 'friend', label: 'Friend Vibe', icon: Users, color: 'text-blue-500' },
    { id: 'couple', label: 'Couple Check', icon: Heart, color: 'text-red-500' },
    { id: 'pet', label: 'Pet Zone', icon: PawPrint, color: 'text-orange-500' },
    { id: 'tracker', label: 'Mood Tracker', icon: BarChart3, color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-happiness-pink rounded-lg flex items-center justify-center">
            <Smile className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg">Happiness AI</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className={cn(
        "fixed inset-0 z-40 bg-white md:relative md:flex md:w-64 md:flex-col border-r transition-transform duration-300 ease-in-out",
        isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="hidden md:flex items-center gap-3 p-8 mb-4">
          <div className="w-10 h-10 bg-happiness-pink rounded-xl flex items-center justify-center shadow-lg shadow-pink-200">
            <Smile className="text-white w-6 h-6" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">Happiness AI</h1>
        </div>

        <div className="flex flex-col gap-1 px-4 mt-20 md:mt-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id as Section);
                setIsMenuOpen(false);
              }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                activeSection === item.id 
                  ? "bg-slate-100 text-slate-900 font-semibold shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform group-hover:scale-110",
                activeSection === item.id ? item.color : "text-slate-400"
              )} />
              <span>{item.label}</span>
              {activeSection === item.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-900"
                />
              )}
            </button>
          ))}
        </div>

        <div className="mt-auto p-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-yellow-50 border border-pink-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600">Daily Tip</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              "A smile is a curve that sets everything straight."
            </p>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto bg-happiness-bg">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {activeSection === 'mirror' && <MoodMirror />}
              {activeSection === 'booster' && <MoodBooster />}
              {activeSection === 'friend' && <FriendVibe />}
              {activeSection === 'couple' && <CoupleCompatibility />}
              {activeSection === 'pet' && <PetHappiness />}
              {activeSection === 'tracker' && <MoodTracker />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
