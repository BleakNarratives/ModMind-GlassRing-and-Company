import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, AlertTriangle, Info, Terminal, Fingerprint, MapPin, Zap, Activity, Shield, Skull } from 'lucide-react';

const SecurityLogs: React.FC = () => {
  const initialLogs = [
    { event: 'Red Team Probe', user: 'Anonym-Shard', device: 'TOR-Exit', loc: 'Unmapped', time: '14:20:01', status: 'Purged', risk: 'Critical', agent: 'Sentinel-Prime', protocol: 'ALPHA-LOCK' },
    { event: 'Biometric Success', user: 'Operator X', device: 'iPhone 15 Pro', loc: 'Berlin, DE', time: '12:44:02', status: 'Success', risk: 'Low', agent: 'Guardian-1', protocol: 'ENIGMA-X' },
    { event: 'Autonomous Suppression', user: 'Sentinel-X', device: 'Edge Shard 4', loc: 'Tokyo, JP', time: '11:58:30', status: 'Blocked', risk: 'Critical', agent: 'Sentinel-Prime', protocol: 'ALPHA-LOCK' },
    { event: 'Login Attempt', user: 'Unknown', device: 'Web/Chrome', loc: 'Moscow, RU', time: '11:20:15', status: 'Blocked', risk: 'High', agent: 'Cerberus-01', protocol: 'LEGACY-FALLBACK' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-2xl">
            <Terminal size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">Hyper Ledger</h2>
            <p className="text-slate-500 font-medium">Immutable event stream for node <span className="text-emerald-400">Modmind-Alpha</span>.</p>
          </div>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
             Purge Legacy Logs
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <SidebarMetrics />
         <div className="lg:col-span-3 etched-glass overflow-hidden rounded-[3rem] border border-white/5 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Event Signature</th>
                    <th className="px-6 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Origin / Status</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-center">Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {initialLogs.map((log, i) => (
                    <LogEntry key={i} log={log} />
                  ))}
                </tbody>
              </table>
            </div>
         </div>
      </div>
    </div>
  );
};

const LogEntry = ({ log }: any) => (
  <tr className="hover:bg-white/[0.03] transition-all group">
    <td className="px-10 py-8">
      <div className="flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-6 ${
          log.risk === 'Critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}>
          {log.event.includes('Red Team') ? <Skull size={28} /> : (log.event.includes('Bio') ? <Fingerprint size={28} /> : <Zap size={28} />)}
        </div>
        <div>
          <p className="font-black text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors uppercase italic">{log.event}</p>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{log.user} • {log.time}</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-slate-400">
           <MapPin size={12} className="text-slate-600" />
           <span className="text-xs font-mono">{log.loc}</span>
        </div>
        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest w-fit border ${
          log.status === 'Purged' || log.status === 'Blocked' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        }`}>
          {log.status}
        </span>
      </div>
    </td>
    <td className="px-10 py-8">
      <div className="flex flex-col items-center gap-2">
         <span className="px-4 py-1.5 bg-white/5 rounded-xl text-[10px] font-mono text-slate-500 border border-white/5">
           {log.agent}
         </span>
         <p className="text-[8px] font-black text-emerald-500/50 uppercase tracking-[0.4em]">{log.protocol}</p>
      </div>
    </td>
  </tr>
);

const SidebarMetrics = () => (
  <div className="lg:col-span-1 etched-glass p-8 rounded-[3rem] border border-white/5 space-y-8">
    <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">Health Core</h4>
    <div className="space-y-6">
       {[
         { label: 'Event Velocity', val: '2.4M', icon: Activity, color: 'text-blue-400' },
         { label: 'Red Team Probes', val: '142', icon: Skull, color: 'text-red-500' },
         { label: 'Sovereign Rate', val: '98%', icon: Zap, color: 'text-emerald-400' },
       ].map((m, i) => (
         <div key={i} className="space-y-3">
            <div className="flex items-center justify-between">
               <m.icon size={18} className={m.color} />
               <p className="text-2xl font-black text-white tracking-tighter">{m.val}</p>
            </div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{m.label}</p>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <div className={`h-full ${m.color.replace('text', 'bg')} transition-all duration-1000`} style={{ width: '80%' }} />
            </div>
         </div>
       ))}
    </div>
  </div>
);

export default SecurityLogs;