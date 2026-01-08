
import React from 'react';
import { Search, Filter, CheckCircle2, AlertTriangle, Info, Terminal, Fingerprint, MapPin, Zap, Activity, Shield } from 'lucide-react';

const SecurityLogs: React.FC = () => {
  const logs = [
    { event: 'Biometric Success', user: 'Tom Equinex', device: 'iPhone 15 Pro', loc: 'Berlin, DE', time: '12:44:02', status: 'Success', risk: 'Low', agent: 'Guardian-1', protocol: 'ENIGMA-X' },
    { event: 'Autonomous Suppression', user: 'Sentinel-X', device: 'Edge Shard 4', loc: 'Tokyo, JP', time: '11:58:30', status: 'Blocked', risk: 'Critical', agent: 'Sentinel-Prime', protocol: 'ALPHA-LOCK' },
    { event: 'Login Attempt', user: 'Unknown', device: 'Web/Chrome', loc: 'Moscow, RU', time: '11:20:15', status: 'Blocked', risk: 'High', agent: 'Cerberus-01', protocol: 'LEGACY-FALLBACK' },
    { event: 'Geo-fence Trigger', user: 'Tom Equinex', device: 'iPad Pro', loc: 'Paris, FR', time: '10:15:11', status: 'Warning', risk: 'Medium', agent: 'Aegis-Alpha', protocol: 'DRIFT-SYNC' },
    { event: 'Key Rotation', user: 'System', device: 'Cloud Node 4', loc: 'N/A', time: '09:00:00', status: 'Completed', risk: 'Info', agent: 'Core-AI', protocol: 'QUANTUM-ROT' },
    { event: 'Bio-Hash Inconsistency', user: 'Sarah M.', device: 'MacBook M3', loc: 'London, UK', time: '08:55:22', status: 'Blocked', risk: 'High', agent: 'Void-Watcher', protocol: 'NEURAL-SHIELD' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success': return <CheckCircle2 size={16} className="text-emerald-400" />;
      case 'Blocked': return <AlertTriangle size={16} className="text-red-400" />;
      case 'Warning': return <Zap size={16} className="text-orange-400" />;
      default: return <Info size={16} className="text-blue-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
            <Terminal size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-extrabold tracking-tighter text-white">Hyper Ledger</h2>
            <p className="text-slate-500 font-medium text-lg">Immutable event logs for node <span className="text-emerald-400">Modmind-A1</span>.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Query the ledger..." 
              className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-w-[320px] transition-all placeholder:text-slate-600"
            />
          </div>
          <button className="px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-300 hover:text-white transition-all flex items-center gap-2 group">
            <Filter size={18} className="group-hover:rotate-180 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="lg:col-span-1 glass p-6 rounded-[2.5rem] border border-white/10 space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Ledger Metrics</h4>
            <div className="space-y-4">
               {[
                 { label: 'Total Events', val: '2.4M', icon: Activity, color: 'text-blue-400' },
                 { label: 'Anomalies Detected', val: '142', icon: Shield, color: 'text-orange-400' },
                 { label: 'Auto-Resolved', val: '98%', icon: Zap, color: 'text-emerald-400' },
               ].map((m, i) => (
                 <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <m.icon size={18} className={m.color} />
                    <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{m.label}</p>
                       <p className="text-lg font-bold text-white tracking-tight">{m.val}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="lg:col-span-3 glass overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">Event Signature</th>
                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">Agent / Protocol</th>
                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">Geo Metadata</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.map((log, i) => (
                    <tr key={i} className="hover:bg-white/[0.03] transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${
                            log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400' :
                            log.status === 'Blocked' ? 'bg-red-500/10 text-red-400' :
                            log.status === 'Warning' ? 'bg-orange-500/10 text-orange-400' :
                            'bg-blue-500/10 text-blue-400'
                          }`}>
                            {log.event.includes('Bio') ? <Fingerprint size={22} /> : <Zap size={22} />}
                          </div>
                          <div>
                            <p className="font-bold text-sm tracking-tight text-white group-hover:text-emerald-400 transition-colors">{log.event}</p>
                            <p className="text-xs text-slate-500 font-medium">{log.user}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <span className="px-2.5 py-1 bg-white/5 rounded-lg text-[9px] font-mono text-slate-400 border border-white/5">
                            {log.agent}
                          </span>
                          <p className="text-[8px] font-black text-emerald-500/50 uppercase tracking-[0.2em]">{log.protocol}</p>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-slate-400">
                          <MapPin size={14} className="text-slate-600" />
                          <span className="text-xs font-mono">{log.loc}</span>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-1 font-mono uppercase tracking-tighter">{log.device}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-3">
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                            log.status === 'Success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                            log.status === 'Blocked' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                            log.status === 'Warning' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                            'bg-blue-500/10 border-blue-500/20 text-blue-400'
                          }`}>
                            {getStatusIcon(log.status)}
                            <span className="text-[10px] font-bold uppercase tracking-widest">{log.status}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SecurityLogs;
