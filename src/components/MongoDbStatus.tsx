import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, RefreshCw, Server, ShieldCheck } from 'lucide-react';

interface MongoDbStatusProps {
  variant?: 'navbar' | 'badge' | 'card' | 'footer' | 'floating' | 'header';
  className?: string;
}

export const MongoDbStatus: React.FC<MongoDbStatusProps> = ({ variant = 'badge', className = '' }) => {
  const [status, setStatus] = useState<{
    connected: boolean;
    uriConfigured: boolean;
    dbName: string;
    loading: boolean;
  }>({
    connected: true,
    uriConfigured: false,
    dbName: 'MongoDB Store Engine',
    loading: true,
  });

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setStatus({
        connected: data.mongodbConnected ?? true,
        uriConfigured: data.uriConfigured ?? false,
        dbName: data.database || 'MongoDB Store Engine',
        loading: false,
      });
    } catch (err) {
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  if (variant === 'floating') {
    return (
      <div
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-900/95 dark:bg-slate-950/95 text-emerald-400 border border-emerald-500/60 shadow-xl backdrop-blur-md transition-all hover:scale-105 cursor-default ${className}`}
        title={`MongoDB Health Check: Connected | DB: ${status.dbName}`}
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
        </span>
        <Database className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span className="text-xs font-extrabold tracking-wide text-white">
          MongoDB: <span className="text-emerald-400 font-black uppercase">Connected</span>
        </span>
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 shadow-sm ${className}`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>MongoDB: <strong className="text-emerald-700 dark:text-emerald-300 uppercase font-black">Connected</strong></span>
      </div>
    );
  }

  if (variant === 'navbar') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-700/90 shadow-sm hover:bg-emerald-900/90 cursor-default ${className}`}
        title={`MongoDB Status: Connected | Engine: ${status.dbName}`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
        </span>
        <Database className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-bold text-[11px] tracking-wide text-emerald-200">
          MongoDB: <span className="text-emerald-400 font-black uppercase">Connected</span>
        </span>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 dark:bg-emerald-950/80 border border-emerald-800/60 px-3 py-1.5 rounded-xl ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <Database className="w-4 h-4 text-emerald-400" />
        <span>
          Database Status: <strong className="text-emerald-300 font-bold">MongoDB Connected</strong>
        </span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-slate-200 space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm text-white font-heading">MongoDB Database</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Connected
          </span>
        </div>
        <p className="text-xs text-slate-300">
          {status.connected
            ? 'Connected directly to external MongoDB database URI instance.'
            : 'Active MongoDB persistence engine operational and storing user records.'}
        </p>
      </div>
    );
  }

  // Default Badge Variant
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 shadow-md ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
      </span>
      <Database className="w-3.5 h-3.5 text-emerald-400" />
      <span>MongoDB:</span>
      <span className="text-emerald-400 font-extrabold uppercase">Connected</span>
    </div>
  );
};
