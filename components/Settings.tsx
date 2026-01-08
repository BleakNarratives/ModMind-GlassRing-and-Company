
import React, { useState, useEffect } from 'react';
import { Power, Shield, Cpu, Share2, Eye, Bot, AlertCircle, Layers, Flame, Settings as SettingsIcon, Package, ChevronRight, Hammer, Wand2, Skull } from 'lucide-react';

const SettingItem = ({ icon: Icon, title, desc, action, danger, warning }: any) => (
  <div className={`flex items-start justify-between py-6 border-b border-white/5 last:border-0 group ${danger ? 'hover:bg-red-500/5 px-4 -mx-4 rounded-xl transition-all' : ''} ${warning ? 'hover:bg-orange-500/5 px-4 -mx-4 rounded-xl transition-all' : ''}`}>
    <div className="flex gap-4">
      <div className={`p-3 rounded-2xl transition-all ${danger ? 'bg-red-500/10 text-red-400' : warning ? 'bg-orange-500/10 text-orange-400' : 'bg-white/5 text-slate-400 group-hover:text-emerald-400'}`}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className={`font-bold ${danger ? 'text-red-400' : warning ? 'text-orange-400' : ''}`}>{title}</h4>
        <p className="text-sm text-slate-500 mt-1 max-w-md">{desc}</p>
      </div>
    </div>
    <div className="flex items-center self-center">
      {action}
    </div>
  </div>
);

const Settings: React.FC = () => {
  const [isAngryMode, setIsAngryMode] = useState(localStorage.getItem('mode_cynic') === 'true');

  const toggleAngryMode = () => {
    const newState = !isAngryMode;
    setIsAngryMode(newState);
    localStorage.setItem('mode_cynic', String(newState));
    window.dispatchEvent(new CustomEvent('janebot_mode_shift', { detail: { angry: newState } }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl transition-colors ${isAngryMode ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
          <Layers size={32} />
        </div>
        <div>
          <h2 className="text-4xl font-extrabold tracking-tighter text-white">System Core</h2>
          <p className="text-slate-500 font-medium">Fine-tune the Modmind autonomous security mesh.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className={`text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${isAngryMode ? 'text-red-400' : 'text-slate-500'}`}>
          <Skull size={16} /> Beta Testing: Reality Protocols
        </h3>
        <div className={`glass rounded-[2.5rem] px-8 border overflow-hidden transition-colors ${isAngryMode ? 'border-red-500/20' : 'border-white/10'}`}>
          <SettingItem 
            warning
            icon={Skull}
            title="Angry Reviewer Mode"
            desc="Enables a cynical, pragmatic AI persona that shreds overboard design ideas. Use this to reel in scope-creep and avoid 'baby toy' UX."
            action={
              <button 
                onClick={toggleAngryMode}
                className={`w-12 h-6 rounded-full relative transition-all ${isAngryMode ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAngryMode ? 'right-1' : 'left-1'}`}></div>
              </button>
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
          <Wand2 size={16} /> AI Model Elevation
        </h3>
        <div className="glass rounded-[2.5rem] px-8 border border-white/10 overflow-hidden">
          <SettingItem 
            icon={Hammer}
            title="AI Model Wheel Elevation"
            desc="Allows Syntax AI and sub-models to take the wheel and enter input directly into hub blocks."
            action={<div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>}
          />
          <SettingItem 
            icon={Flame}
            title="aFiREfly Stamper"
            desc="Enable executing setup functions on the fly via end-to-end AI wrappers."
            action={<div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
          <Bot size={16} /> Agent Orchestration
        </h3>
        <div className="glass rounded-[2.5rem] px-8 border border-white/10 overflow-hidden">
          <SettingItem 
            icon={Bot}
            title="Sub-Agent Autonomous Mode"
            desc="Allows security agents to trigger lockdown protocols without operator confirmation when risk > 75%."
            action={<div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>}
          />
          <SettingItem 
            icon={Cpu}
            title="Quantum-Safe Tunneling"
            desc="Force post-quantum crypto handshake for all cross-node shard migrations."
            action={<div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex items-center gap-4 text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">
          <span>Build 2.94.5-Stable</span>
          <div className="w-1 h-1 bg-slate-800 rounded-full" />
          <span>Equinex-Modmind Core</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
