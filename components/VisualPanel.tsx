
import React, { useState } from 'react';
import { AppStatus, HomeRequirements, Visualization } from '../types';
import { LiveBrief } from './LiveBrief';
import { MOTIVATION_IMAGES } from '../constants';
import { Loader2, Box, Image as ImageIcon, History, X } from 'lucide-react';

interface VisualPanelProps {
  status: AppStatus;
  requirements: HomeRequirements;
  visualizations: Visualization[];
  isGenerating: boolean;
}

export const VisualPanel: React.FC<VisualPanelProps> = ({ 
  status, 
  requirements, 
  visualizations, 
  isGenerating 
}) => {
  const [galleryIndex, setGalleryIndex] = React.useState(0);
  const currentVisualization = visualizations[0];
  const history = visualizations.slice(1);

  React.useEffect(() => {
    if (status === 'discovery') {
      const interval = setInterval(() => {
        setGalleryIndex((prev) => (prev + 1) % MOTIVATION_IMAGES.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const renderContent = () => {
    if (isGenerating) {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="relative">
              <Loader2 className="w-20 h-20 text-amber-500 animate-spin" />
              <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-amber-500" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-serif font-bold text-white mb-2">Creating Architectural Visualization...</h3>
              <p className="text-slate-400 text-sm animate-pulse">Calculating geometry, materials and lighting</p>
            </div>
            <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>
      );
    }

    if (status === 'discovery' || status === 'briefing') {
      return (
        <div className="relative w-full h-full overflow-hidden bg-black">
          <img
            key={galleryIndex}
            src={MOTIVATION_IMAGES[galleryIndex]}
            className="w-full h-full object-cover opacity-60 animate-subtle-zoom transition-opacity duration-1000"
            alt="Premium Interior"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
            <h2 className="text-4xl md:text-6xl font-serif italic text-white mb-4 drop-shadow-2xl">Visualizing Excellence</h2>
            <p className="text-slate-300 tracking-[0.3em] uppercase text-xs md:text-sm">Architecture for your legacy</p>
          </div>
        </div>
      );
    }

    if (currentVisualization) {
      return (
        <div className="relative w-full h-full bg-slate-950">
          <img
            src={currentVisualization.url}
            className="w-full h-full object-cover"
            alt="Current Home Visualization"
          />
          <div className="absolute top-6 left-6 z-20">
            <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-amber-500/30 rounded-lg flex items-center gap-2">
              <ImageIcon className="text-amber-500" size={18} />
              <span className="text-white text-sm font-medium">Render Active</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative">
        {renderContent()}
        <LiveBrief requirements={requirements} status={status} />
      </div>

      {history.length > 0 && (
        <div className="h-40 bg-slate-900/90 border-t border-slate-800 p-4 overflow-x-auto">
          <div className="flex items-center gap-3 mb-3 px-2">
            <History size={14} className="text-slate-500" />
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Architecture History</span>
          </div>
          <div className="flex gap-4">
            {history.map((viz) => (
              <div 
                key={viz.id} 
                className="flex-shrink-0 w-48 aspect-video rounded-lg overflow-hidden border border-slate-700 hover:border-amber-500/50 transition-colors cursor-pointer group relative"
              >
                <img src={viz.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold uppercase tracking-tighter">View Concept</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
