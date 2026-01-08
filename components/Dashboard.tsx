
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu, Activity, Layers, ArrowUpRight, ShieldAlert, Zap } from 'lucide-react';
import { useSecurityMesh } from '../hooks/useSecurityMesh';
import { SecurityAgent } from '../types';

const data = [
  { name: '00:00', traffic: 400 },
  { name: '06:00', traffic: 700 },
  { name: '12:00', traffic: 1200 },
  { name: '18:00', traffic: 900 },
  { name: '23:59', traffic: 500 },
];

const AgentCard: React.FC<{ agent: SecurityAgent }> = ({ agent }) => (
  <div className="etched-glass p-6 group">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-white/5 rounded-xl group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all">
        <Cpu size={20} />
      </div>
      <div className="text-right">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{agent.type}</span>
        <div className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${agent.status === 'Active' ? 'text-emerald-500' : 'text-slate-600'}`}>{agent.status}</div>
      </div>
    </div>
    
    <h4 className="text-base font-bold text-white mb-6">{agent.name}</h4>
    
    <div className="space-y-3">
      <div className="flex justify-between items-end text-[10px] font-black uppercase text-slate-500 tracking-widest">
        <span>Density</span>
        <span className="text-white font-mono">{Math.round(agent.load)}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${agent.load}%` }} />
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const mesh = useSecurityMesh();

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/10">
            <Layers className="text-emerald-400" size={28} />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-white uppercase">Security Mesh</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500/40 mt-1">Autonomous Orchestration</p>
          </div>
        </div>
        
        <div className="etched-glass px-6 py-4 flex items-center gap-6">
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Shard Health</p>
            <p className="text-2xl font-black text-emerald-400 tracking-tighter">{mesh.networkHealth}%</p>
          </div>
          <Activity className="text-emerald-400 animate-pulse" size={24} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="etched-glass p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3"><Activity size={18} className="text-emerald-400" /> Neural Flux</h3>
              <div className="flex gap-4 text-[9px] font-black tracking-widest text-slate-500 uppercase">
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Shard Velocity</span>
              </div>
            </div>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="rgba(255,255,255,0.02)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 9}} />
                  <YAxis hide />
                  <Area type="monotone" dataKey="traffic" stroke="#10b981" strokeWidth={2} fill="url(#glow)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mesh.agents.slice(0, 4).map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 h-full">
           <div className="etched-glass p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black uppercase tracking-tight">Anomalies</h3>
                <ShieldAlert className="text-orange-500" size={18} />
              </div>
              
              <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-hide">
                {mesh.activeTriggers.map((trig) => (
                  <div key={trig.id} className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group/item cursor-pointer">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${trig.severity === 'Critical' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'}`}>
                        {trig.severity}
                      </span>
                      <ArrowUpRight size={14} className="text-slate-600 group-hover/item:text-emerald-400 transition-colors" />
                    </div>
                    <h5 className="font-bold text-sm text-white">{trig.name}</h5>
                    <p className="text-[10px] text-slate-500 mt-1">{trig.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-4">
                 <Zap className="text-emerald-500 animate-pulse" size={20} />
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ready to Resolve</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
