
import React, { useState } from 'react';
import { HomeRequirements, AppStatus } from '../types';
import { ChevronRight, ChevronDown, Layout, Maximize, Map, Palette, Wallet, Calendar, Eye, EyeOff } from 'lucide-react';

interface LiveBriefProps {
  requirements: HomeRequirements;
  status: AppStatus;
}

export const LiveBrief: React.FC<LiveBriefProps> = ({ requirements, status }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  const hasData = Object.keys(requirements).length > 0;

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="absolute top-6 right-6 z-30 p-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full text-slate-400 hover:text-white transition-colors shadow-2xl"
      >
        <Eye size={18} />
      </button>
    );
  }

  return (
    <div className="absolute top-6 right-6 z-30 w-72 md:w-80 pointer-events-none">
      <div className="bg-slate-950/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl pointer-events-auto">
        <header 
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-500">Live Brief</h4>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <EyeOff size={14} />
            </button>
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        </header>

        {isExpanded && (
          <div className="p-4 border-t border-slate-800/50 space-y-4 max-h-[60vh] overflow-y-auto">
            {!hasData ? (
              <div className="py-8 text-center">
                <p className="text-slate-500 italic text-sm">Status: Discovery</p>
                <p className="text-slate-400 text-xs mt-1">Collecting architectural intents...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requirements.type && <BriefItem icon={<Layout size={14} />} label="Type" value={requirements.type} />}
                {requirements.floors && <BriefItem icon={<Maximize size={14} />} label="Structure" value={`${requirements.floors} Levels`} />}
                {requirements.style && <BriefItem icon={<Palette size={14} />} label="Style" value={requirements.style} />}
                {requirements.zones && requirements.zones.length > 0 && (
                  <BriefItem icon={<Map size={14} />} label="Landscape Zones" value={requirements.zones.join(', ')} />
                )}
                {requirements.interior && <BriefItem icon={<Layout size={14} />} label="Interior" value={requirements.interior} />}
                {requirements.mood && <BriefItem icon={<Sparkles size={14} className="text-amber-500" />} label="Atmosphere" value={requirements.mood} />}
                {requirements.budget && <BriefItem icon={<Wallet size={14} />} label="Budget Projection" value={requirements.budget} />}
                {requirements.timeframe && <BriefItem icon={<Calendar size={14} />} label="Timeline" value={requirements.timeframe} />}
              </div>
            )}
            
            <div className="pt-4 border-t border-slate-800/50">
              <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                <span>Phase</span>
                <span className="text-amber-500">{status}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BriefItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex gap-3">
    <div className="mt-1 text-slate-500">{icon}</div>
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">{label}</p>
      <p className="text-sm text-slate-200 font-medium">{value}</p>
    </div>
  </div>
);

const Sparkles = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);
