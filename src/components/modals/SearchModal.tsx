import React, { useState, useEffect } from 'react';
import { DEPARTMENTS, DOCTORS, QUICK_FEATURES } from '../../data/hospitalData';
import { X, Search, Calendar, Stethoscope, Building2, ArrowRight } from 'lucide-react';
import { Doctor } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDoctor: (doc: Doctor) => void;
  onSelectDept: (deptName: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectDoctor,
  onSelectDept,
}) => {
  const [query, setQuery] = useState('');
  const [searchDoctors, setSearchDoctors] = useState<Doctor[]>(DOCTORS);

  useEffect(() => {
    if (!isOpen) return;
    const fetchSearchDocs = async () => {
      try {
        const res = await fetch('/api/doctors');
        const data = await res.json();
        if (data.success && Array.isArray(data.doctors)) {
          setSearchDoctors(data.doctors);
        }
      } catch (err) {
        console.warn('Failed to fetch search doctors:', err);
      }
    };
    fetchSearchDocs();
  }, [isOpen]);

  if (!isOpen) return null;

  const docsToSearch = searchDoctors.length > 0 ? searchDoctors : DOCTORS;

  const matchedDoctors = docsToSearch.filter(
    (d) =>
      d.name?.toLowerCase().includes(query.toLowerCase()) ||
      d.specialty?.toLowerCase().includes(query.toLowerCase())
  );

  const matchedDepartments = DEPARTMENTS.filter(
    (dept) =>
      dept.name.toLowerCase().includes(query.toLowerCase()) ||
      dept.description.toLowerCase().includes(query.toLowerCase())
  );

  const matchedServices = QUICK_FEATURES.filter(
    (f) =>
      f.title.toLowerCase().includes(query.toLowerCase()) ||
      f.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative animate-in fade-in zoom-in-95">
        
        {/* Header Search Bar */}
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search doctors, departments, clinical services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
          />
          <button
            onClick={onClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1 text-left">
          
          {/* Doctors Match */}
          {matchedDoctors.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                <span>Consultant Doctors ({matchedDoctors.length})</span>
              </div>
              <div className="space-y-2">
                {matchedDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      onClose();
                      onSelectDoctor(doc);
                    }}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={doc.photo} alt={doc.name} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#0B3D91] dark:group-hover:text-blue-400">
                          {doc.name}
                        </div>
                        <div className="text-xs text-slate-500">{doc.specialty}</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#0B3D91] dark:text-blue-400 flex items-center gap-1">
                      Book Visit <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Departments Match */}
          {matchedDepartments.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Departments ({matchedDepartments.length})</span>
              </div>
              <div className="space-y-2">
                {matchedDepartments.map((dept) => (
                  <div
                    key={dept.id}
                    onClick={() => {
                      onClose();
                      onSelectDept(dept.name);
                    }}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between cursor-pointer group transition-colors"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#0B3D91] dark:group-hover:text-blue-400">
                        {dept.name}
                      </div>
                      <div className="text-xs text-slate-500">{dept.headDoctor}</div>
                    </div>
                    <span className="text-xs font-semibold text-[#0B3D91] dark:text-blue-400 flex items-center gap-1">
                      View Dept <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedDoctors.length === 0 && matchedDepartments.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              No matching doctors or departments found for "{query}". Try searching "Cardiology" or "Dr. Robert".
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
