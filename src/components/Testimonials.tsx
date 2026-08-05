import React, { useState, useEffect } from 'react';
import { TESTIMONIALS } from '../data/hospitalData';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const currentTestimonial = TESTIMONIALS[currentIndex];

  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-[#F5F9FF] dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-[#0B3D91] dark:text-blue-300 uppercase tracking-widest">
            Patient Stories & Trust
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            What Our Patients Say
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Read authentic reviews from patients who experienced our compassionate care and seamless digital health portal.
          </p>
        </div>

        {/* Testimonial Card Slider */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200/80 dark:border-slate-800 relative">
          
          <Quote className="w-16 h-16 text-blue-100 dark:text-slate-800 absolute top-6 right-8 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center gap-8">
            
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={currentTestimonial.avatar}
                alt={currentTestimonial.patientName}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-blue-100 dark:border-slate-800 shadow-md"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-500 text-white shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            {/* Testimonial Details */}
            <div className="space-y-4 text-center md:text-left flex-1">
              
              {/* Star rating */}
              <div className="flex items-center justify-center md:justify-start gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 text-xs font-semibold text-slate-400">5.0 / 5.0 Rating</span>
              </div>

              {/* Quote text */}
              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 italic leading-relaxed font-normal">
                "{currentTestimonial.comment}"
              </p>

              {/* Author & Dept */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="text-lg font-bold font-heading text-slate-900 dark:text-white">
                  {currentTestimonial.patientName}
                </div>
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {currentTestimonial.role} &bull; <span className="text-slate-500">{currentTestimonial.department} Department</span>
                </div>
              </div>
            </div>

          </div>

          {/* Slider controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? 'w-8 bg-[#0B3D91] dark:bg-blue-400' : 'w-2.5 bg-slate-200 dark:bg-slate-700'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
