
import React, { useState } from 'react';
import { ShieldAlert, Skull, Flame, Hammer, Bot, Wand2, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';

const Settings: React.FC = () => {
  const [isAngryMode, setIsAngryMode] = useState(localStorage.getItem('mode_cynic') === 'true');
  const [isRedTeam, setIsRedTeam] = useState(localStorage.getItem('red_team_lockdown') === 'true');

  const toggleAngryMode = () => {
    const newState = !isAngryMode;
    setIsAngryMode(newState);
    localStorage.setItem('mode_cynic', String(newState));
  };

  const toggleRedTeam = () => {
    const newState = !isRedTeam;
    setIsRedTeam(newState);
    localStorage.setItem('red_team_lockdown', String(newState));
    window.dispatchEvent(new CustomEvent('red_team_toggle', { detail: { locked: newState } }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-24 animate-in fade-in duration-1000">
      <header className="flex items-center gap-6">
        <div className={`p-5 rounded-[2rem] transition-all ${isRedTeam ? 'bg-red-500 text-white shadow-2xl shadow-red-500/40' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
          <SettingsIcon size={40} />
        </div>
        <div>
          <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic">System Core</h2>
          <p className="text-slate-500 font-medium text-lg">Autonomous Shard Orchestration & Security Mesh Tuning.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className={`text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-3 ${isRedTeam ? 'text-red-500' : 'text-slate-600'}`}>
            <ShieldAlert size={16} /> Defensive Matrix
          </h3>
          <div className={`etched-glass p-10 rounded-[3.5rem] border-2 transition-all ${isRedTeam ? 'border-red-500/40' : 'border-white/5'}`}>
            <SettingToggle 
              icon={Skull}
              title="Red Team Lockdown"
              desc="Hostile environment simulation. JaneBot enters a paranoid state, enabling deep packet inspection on all neural queries."
              active={isRedTeam}
              onToggle={toggleRedTeam}
              danger
            />
            <div className="h-px bg-white/5 my-8" />
            <SettingToggle 
              icon={Flame}
              title="Cynical Reality Check"
              desc="Enables the 'Hostile Auditor' persona globally. JaneBot will actively critique architectural inefficiency."
              active={isAngryMode}
              onToggle={toggleAngryMode}
              warning
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 flex items-center gap-3">
            <Wand2 size={16} /> AI Automation
          </h3>
          <div className="etched-glass p-10 rounded-[3.5rem] border border-white/5">
             <SettingToggle 
              icon={Hammer}
              title="AFiREfly Stamper"
              desc="Model Elevation: Allows JaneBot to directly modify Hub state and input fields via specialized presets."
              active={true}
              onToggle={() => {}}
            />
            <div className="h-px bg-white/5 my-8" />
            <SettingToggle 
              icon={ShieldCheck}
              title="Self-Purge Logic"
              desc="Automated neural path scrubbing. Prevents memory drift in high-concurrency shards."
              active={true}
              onToggle={() => {}}
            />
          </div>
        </div>
      </div>

      <div className="pt-20 text-center">
         <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.6em] text-slate-700">
           Equinex-Modmind Core v2.94 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Shard Verified
         </div>
      </div>
    </div>
  );
};

// --- Lesser Helper Components ---

const SettingToggle = ({ icon: Icon, title, desc, active, onToggle, danger, warning }: any) => (
  <div className="flex items-start justify-between gap-6 group">
    <div className="flex gap-6">
      <div className={`p-4 rounded-2xl transition-all ${danger ? 'bg-red-500/10 text-red-500' : warning ? 'bg-orange-500/10 text-orange-400' : 'bg-white/5 text-slate-500 group-hover:text-emerald-400'}`}>
        <Icon size={24} />
      </div>
      <div>
        <h4 className={`text-xl font-bold ${danger ? 'text-red-500' : warning ? 'text-orange-400' : 'text-white'}`}>{title}</h4>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-sm">{desc}</p>
      </div>
    </div>
    <button 
      onClick={onToggle}
      className={`shrink-0 w-14 h-8 rounded-full relative p-1 transition-all ${active ? (danger ? 'bg-red-500 shadow-2xl shadow-red-500/30' : 'bg-emerald-500') : 'bg-slate-800'}`}
    >
      <div className={`w-6 h-6 bg-white rounded-full transition-all duration-500 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  </div>
);

export default Settings;
