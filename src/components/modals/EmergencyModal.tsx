import React, { useState } from 'react';
import { X, PhoneCall, Ambulance, MapPin, Clock, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [ambulanceRequested, setAmbulanceRequested] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-red-500/40 relative animate-in fade-in zoom-in-95">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Emergency Banner Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-red-600 text-white shadow-lg animate-pulse">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
              24/7 Priority Emergency Triage
            </span>
            <h3 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
              MediCare Emergency Care
            </h3>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          For critical trauma, chest pain, stroke symptoms, or severe accidents, contact our 24/7 Hotline immediately or request rapid ambulance dispatch.
        </p>

        {/* Direct Call Button */}
        <a
          href="tel:18006334227"
          className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-lg shadow-xl flex items-center justify-center gap-3 transition-transform transform hover:scale-[1.02] mb-4 cursor-pointer"
        >
          <PhoneCall className="w-6 h-6 animate-bounce" />
          <span>Call Hotline: 1-800-MEDICARE</span>
        </a>

        {/* Dispatch Ambulance Button */}
        {!ambulanceRequested ? (
          <button
            onClick={() => setAmbulanceRequested(true)}
            className="w-full py-3 px-6 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer mb-6"
          >
            <Ambulance className="w-5 h-5 text-amber-400" />
            <span>Dispatch GPS Ambulance to My Location</span>
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold space-y-2 mb-6 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Ambulance Unit #04 Dispatched!</span>
            </div>
            <div>Estimated Arrival: <strong>7-9 Minutes</strong> &bull; Driver Contact: +1 (555) 019-8812</div>
          </div>
        )}

        {/* Hospital Address */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Emergency Room Location</span>
          </div>
          <div className="text-slate-600 dark:text-slate-300">
            500 Healthcare Blvd, Suite 100 &bull; Trauma Bay Entrance B
          </div>
        </div>

      </div>
    </div>
  );
};
