import React, { useState, useEffect } from 'react';
import { DOCTORS } from '../data/hospitalData';
import { Doctor } from '../types';
import { Star, Calendar, Clock, Award, GraduationCap, ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface DoctorsProps {
  onSelectDoctorForBooking: (doctor: Doctor) => void;
}

export const Doctors: React.FC<DoctorsProps> = ({ onSelectDoctorForBooking }) => {
  const [doctorList, setDoctorList] = useState<Doctor[]>(DOCTORS);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [activeDoctorModal, setActiveDoctorModal] = useState<Doctor | null>(null);
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/doctors');
        const data = await res.json();
        if (data.success && Array.isArray(data.doctors)) {
          setDoctorList(data.doctors);
        }
      } catch (err) {
        console.warn('Failed to fetch doctors API:', err);
      }
    };

    fetchDoctors();
    window.addEventListener('medicare_doctor_updated', fetchDoctors);
    return () => window.removeEventListener('medicare_doctor_updated', fetchDoctors);
  }, []);

  const filteredDoctors = doctorList.filter((doc) => {
    const matchesDept = selectedDeptFilter === 'all' || doc.departmentId === selectedDeptFilter;
    const matchesSearch =
      doc.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(doctorSearch.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleNext = () => {
    if (filteredDoctors.length === 0) return;
    setSliderIndex((prev) => (prev + 1) % filteredDoctors.length);
  };

  const handlePrev = () => {
    if (filteredDoctors.length === 0) return;
    setSliderIndex((prev) => (prev - 1 + filteredDoctors.length) % filteredDoctors.length);
  };

  return (
    <section id="doctors" className="py-16 lg:py-24 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-[#0B3D91] dark:text-blue-300 uppercase tracking-widest">
              World-Class Healthcare Specialists
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
              Meet Our Eminent Doctors
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base">
              Our board-certified consultants bring decades of clinical excellence, pioneering research, and dedicated patient care.
            </p>
          </div>

          {/* Search & Slider Controls */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctor name or specialty..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
              />
            </div>
            
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Previous Doctor"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Next Doctor"
              >
                <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Doctor Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.length === 0 ? (
            <div className="col-span-full py-12 px-6 text-center rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                No active doctors currently listed in the hospital directory roster.
              </p>
            </div>
          ) : (
            filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="group bg-[#F5F9FF] dark:bg-slate-800/80 rounded-3xl p-6 border border-blue-100/80 dark:border-slate-700/80 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1"
            >
              <div>
                {/* Doctor Photo & Badges */}
                <div className="relative h-64 rounded-2xl overflow-hidden mb-6 bg-slate-200 dark:bg-slate-700">
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 px-3 py-1 rounded-full text-xs font-bold text-slate-900 dark:text-white shadow-md backdrop-blur-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{doctor.rating}</span>
                    <span className="text-slate-400 font-normal">({doctor.reviewsCount})</span>
                  </div>

                  {/* Experience Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                    <Award className="w-3.5 h-3.5 text-sky-400" />
                    <span>{doctor.experienceYears}+ Yrs Experience</span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white group-hover:text-[#0B3D91] dark:group-hover:text-blue-400 transition-colors">
                    {doctor.name}
                  </h3>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {doctor.specialty}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed pt-1">
                    {doctor.bio}
                  </p>
                </div>

                {/* Details Pills */}
                <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 mb-6">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#0B3D91] dark:text-blue-400 shrink-0" />
                    <span className="truncate">{doctor.education}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Available: {doctor.availableTime}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveDoctorModal(doctor)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-white dark:hover:bg-slate-700 transition-colors text-center cursor-pointer"
                >
                  View Profile
                </button>
                <button
                  onClick={() => onSelectDoctorForBooking(doctor)}
                  className="py-2.5 px-3 rounded-xl bg-[#0B3D91] hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-sky-300" />
                  <span>Book Visit</span>
                </button>
              </div>
            </div>
          ))
        )}
        </div>
      </div>

      {/* Doctor Full Profile Modal */}
      {activeDoctorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative animate-in fade-in zoom-in-95">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <img
                src={activeDoctorModal.photo}
                alt={activeDoctorModal.name}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover shadow-lg border-2 border-slate-100 dark:border-slate-800"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-3 text-center sm:text-left flex-1">
                <div className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{activeDoctorModal.rating} ({activeDoctorModal.reviewsCount} Patient Reviews)</span>
                </div>
                <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  {activeDoctorModal.name}
                </h3>
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {activeDoctorModal.specialty}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeDoctorModal.bio}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700">
                  <div className="text-slate-400">Education & Qualifications</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-1">{activeDoctorModal.education}</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700">
                  <div className="text-slate-400">Clinical Days</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-1">{activeDoctorModal.availableDays.join(', ')}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setActiveDoctorModal(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Close Profile
                </button>
                <button
                  onClick={() => {
                    const doc = activeDoctorModal;
                    setActiveDoctorModal(null);
                    onSelectDoctorForBooking(doc);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#0B3D91] hover:bg-blue-700 text-white text-sm font-bold shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-sky-300" />
                  <span>Book Appointment with {activeDoctorModal.name.split(' ')[1]}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
