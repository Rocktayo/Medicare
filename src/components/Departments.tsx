import React, { useState } from 'react';
import { DEPARTMENTS } from '../data/hospitalData';
import { Department } from '../types';
import { IconRenderer } from './IconRenderer';
import { Calendar, UserCheck, ArrowRight, Search } from 'lucide-react';

interface DepartmentsProps {
  onSelectDepartmentForBooking: (deptName: string) => void;
}

export const Departments: React.FC<DepartmentsProps> = ({ onSelectDepartmentForBooking }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDeptModal, setActiveDeptModal] = useState<Department | null>(null);

  const filteredDepartments = DEPARTMENTS.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="departments" className="py-16 lg:py-24 bg-[#F5F9FF] dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-[#0B3D91] dark:text-blue-300 uppercase tracking-widest">
              Specialized Medical Centers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
              Our Medical Departments
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base">
              Explore state-of-the-art departments led by world-renowned medical experts equipped with the latest diagnostic technology.
            </p>
          </div>

          {/* Search Filter */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
            />
          </div>
        </div>

        {/* Departments Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDepartments.map((dept) => (
            <div
              key={dept.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Department Image & Icon */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={dept.image}
                    alt={dept.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                  
                  {/* Floating Icon */}
                  <div className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 text-[#0B3D91] dark:text-blue-400 backdrop-blur-md shadow-md">
                    <IconRenderer name={dept.iconName} className="w-5 h-5" />
                  </div>

                  {/* Patient Count pill */}
                  <div className="absolute bottom-3 left-4 text-xs font-medium text-white/90 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    {dept.patientCount}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white group-hover:text-[#0B3D91] dark:group-hover:text-blue-400 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {dept.description}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium border-t border-slate-100 dark:border-slate-800">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Head: <strong className="text-slate-700 dark:text-slate-200">{dept.headDoctor}</strong></span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveDeptModal(dept)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center cursor-pointer"
                >
                  Learn More
                </button>
                <button
                  onClick={() => onSelectDepartmentForBooking(dept.name)}
                  className="py-2.5 px-3 rounded-xl bg-[#0B3D91] hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-sky-300" />
                  <span>Book</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Detail Modal */}
      {activeDeptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 relative animate-in fade-in zoom-in-95">
            <div className="relative h-56">
              <img
                src={activeDeptModal.image}
                alt={activeDeptModal.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-widest mb-1">
                  Department Profile
                </div>
                <h3 className="text-2xl font-bold font-heading">{activeDeptModal.name}</h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Overview</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeDeptModal.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Key Specialized Services</h4>
                <div className="grid grid-cols-2 gap-2">
                  {activeDeptModal.services.map((srv, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-blue-50/60 dark:bg-slate-800/60 p-2.5 rounded-xl border border-blue-100 dark:border-slate-700">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-xs text-slate-500">Department Chair</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{activeDeptModal.headDoctor}</div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveDeptModal(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const name = activeDeptModal.name;
                      setActiveDeptModal(null);
                      onSelectDepartmentForBooking(name);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#0B3D91] hover:bg-blue-700 text-white text-sm font-semibold shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-sky-300" />
                    <span>Book Appointment</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
