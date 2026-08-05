import React, { useState } from 'react';
import { QUICK_FEATURES } from '../data/hospitalData';
import { FeatureItem } from '../types';
import { IconRenderer } from './IconRenderer';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';

export const QuickFeatures: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);

  return (
    <section id="services" className="py-16 lg:py-24 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-[#0B3D91] dark:text-blue-300 uppercase tracking-widest">
            Comprehensive Hospital Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            Intelligent Features for Modern Healthcare
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            MediCare HMS integrates patient experience, clinical workflows, and administrative logistics into one unified digital ecosystem.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {QUICK_FEATURES.map((feature) => (
            <div
              key={feature.id}
              onClick={() => setSelectedFeature(feature)}
              className="group relative p-6 rounded-2xl bg-[#F5F9FF] dark:bg-slate-800/80 border border-blue-100/60 dark:border-slate-700/60 hover:border-[#0B3D91] dark:hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-[#0B3D91] text-white flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors shadow-md">
                  <IconRenderer name={feature.iconName} className="w-6 h-6 text-sky-300" />
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2 group-hover:text-[#0B3D91] dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {feature.description}
                </p>
              </div>

              {/* Card Footer Link */}
              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center text-xs font-semibold text-[#0B3D91] dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                <span>Explore Capabilities</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Details Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedFeature(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-[#0B3D91] text-white">
                <IconRenderer name={selectedFeature.iconName} className="w-7 h-7 text-sky-300" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Feature Breakdown
                </span>
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                  {selectedFeature.title}
                </h3>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
              {selectedFeature.description}
            </p>

            <div className="space-y-3 mb-6 bg-[#F5F9FF] dark:bg-slate-800/60 p-4 rounded-2xl border border-blue-100 dark:border-slate-700">
              <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                Key System Capabilities:
              </div>
              {selectedFeature.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedFeature(null)}
              className="w-full py-3 rounded-xl bg-[#0B3D91] hover:bg-blue-700 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
