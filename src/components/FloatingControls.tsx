import React, { useState, useEffect } from 'react';
import { ArrowUp, Calendar } from 'lucide-react';

interface FloatingControlsProps {
  onOpenBooking: () => void;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({ onOpenBooking }) => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 400) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  if (!showScroll) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Scroll To Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="p-3.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        title="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Floating Sticky Book Appointment Pill */}
      <button
        onClick={onOpenBooking}
        className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#0B3D91] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-2xl transition-all transform hover:scale-105 cursor-pointer border-2 border-white/20"
      >
        <Calendar className="w-4 h-4 text-sky-300" />
        <span>Book Appointment</span>
      </button>
    </div>
  );
};
