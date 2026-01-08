
import React, { useState, useEffect, useRef } from 'react';
import { Ghost, Heart, Shield, Sun, Leaf, Cog, Info, Zap, Mic } from 'lucide-react';
import { ThinkingHat, ThinkingHatColor } from '../types';

const HATS_DATA: ThinkingHat[] = [
  { type: 'White', label: 'White Hat', focus: 'Data & Facts', description: 'Objective information, stats, and logical gaps.', active: false },
  { type: 'Red', label: 'Red Hat', focus: 'Emotion & Instinct', description: 'Gut feelings, hunches, and emotional nuances.', active: true },
  { type: 'Black', label: 'Black Hat', focus: 'Caution & Risk', description: 'Critical judgment, risk assessment, and flaws.', active: false },
  { type: 'Yellow', label: 'Yellow Hat', focus: 'Benefits & Value', description: 'Optimism, logical benefits, and constructive energy.', active: false },
  { type: 'Green', label: 'Green Hat', focus: 'Creativity & Ideas', description: 'Alternatives, provocations, and new solutions.', active: false },
  { type: 'Blue', label: 'Blue Hat', focus: 'Process & Control', description: 'Orchestration, summaries, and next steps.', active: false },
];

const ThinkingHats: React.FC = () => {
  const [activeHat, setActiveHat] = useState<ThinkingHatColor>(
    (localStorage.getItem('active_hat') as ThinkingHatColor) || 'Blue'
  );
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const switchHat = (type: ThinkingHatColor) => {
    setActiveHat(type);
    localStorage.setItem('active_hat', type);
    window.dispatchEvent(new CustomEvent('cognitive_shift', { detail: { hat: type } }));
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log("Cognitive Listener Captured:", transcript);

        // Command mapping
        const commands = [
          { cmd: 'white', focus: 'data', hat: 'White' },
          { cmd: 'red', focus: 'emotion', hat: 'Red' },
          { cmd: 'black', focus: 'risk', hat: 'Black' },
          { cmd: 'yellow', focus: 'benefit', hat: 'Yellow' },
          { cmd: 'green', focus: 'creative', hat: 'Green' },
          { cmd: 'blue', focus: 'process', hat: 'Blue' },
        ];

        for (const c of commands) {
          if (transcript.includes(c.cmd) || transcript.includes(c.focus)) {
            switchHat(c.hat as ThinkingHatColor);
            break;
          }
        }
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const getHatStyles = (type: ThinkingHatColor) => {
    switch (type) {
      case 'White': return { color: 'text-white', border: 'border-white/40', bg: 'bg-white/10', glow: 'shadow-[0_0_30px_rgba(255,255,255,0.2)]', icon: <Info /> };
      case 'Red': return { color: 'text-red-400', border: 'border-red-500/40', bg: 'bg-red-500/10', glow: 'shadow-[0_0_30px_rgba(248,113,113,0.3)]', icon: <Heart /> };
      case 'Black': return { color: 'text-slate-200', border: 'border-slate-500/40', bg: 'bg-black/40', glow: 'shadow-[0_0_30px_rgba(0,0,0,0.5)]', icon: <Shield /> };
      case 'Yellow': return { color: 'text-yellow-400', border: 'border-yellow-500/40', bg: 'bg-yellow-500/10', glow: 'shadow-[0_0_30px_rgba(250,204,21,0.3)]', icon: <Sun /> };
      case 'Green': return { color: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', glow: 'shadow-[0_0_30_rgba(52,211,153,0.3)]', icon: <Leaf /> };
      case 'Blue': return { color: 'text-blue-400', border: 'border-blue-500/40', bg: 'bg-blue-500/10', glow: 'shadow-[0_0_30px_rgba(96,165,250,0.3)]', icon: <Cog /> };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
            <Ghost size={12} /> Protocol: Cognition Shifting
          </div>
          <button 
            onClick={toggleListening}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all ${isListening ? 'bg-red-500/10 border-red-500/40 text-red-400' : 'bg-white/5 border-white/10 text-slate-500'}`}
          >
            <Mic size={12} className={isListening ? 'animate-pulse' : ''} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{isListening ? 'Listener Live' : 'Enable Voice Command'}</span>
          </button>
        </div>
        <h2 className="text-5xl font-black tracking-tighter text-white uppercase">Six Thinking Hats</h2>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-sm">
          Select your shard of truth. Speak "Switch to [Color] Hat" or "Activate [Focus]". 
          Warning: Persona constraints are absolute.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {HATS_DATA.map((hat) => {
          const styles = getHatStyles(hat.type);
          const isActive = activeHat === hat.type;
          
          return (
            <button 
              key={hat.type}
              onClick={() => switchHat(hat.type)}
              className={`glass p-8 rounded-[3rem] border transition-all duration-500 text-left group relative overflow-hidden ${
                isActive ? `${styles.bg} ${styles.border} ${styles.glow} scale-[1.02]` : 'border-white/5 hover:border-white/20'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 p-8 opacity-20">
                  <Zap size={80} className={`${styles.color} animate-pulse`} />
                </div>
              )}
              
              <div className={`w-14 h-14 rounded-2xl ${styles.bg} ${styles.color} flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110`}>
                {styles.icon}
              </div>
              
              <h3 className={`text-xl font-bold ${styles.color}`}>{hat.label}</h3>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-1">{hat.focus}</p>
              <p className="text-sm text-slate-500 mt-4 leading-relaxed">{hat.description}</p>
              
              <div className={`mt-8 h-1 w-full bg-white/5 rounded-full overflow-hidden transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                <div className={`h-full ${styles.bg.replace('/10', '')} transition-all duration-1000`} style={{ width: '100%' }} />
              </div>
            </button>
          );
        })}
      </div>

      <div className={`glass p-10 rounded-[4rem] border transition-all duration-1000 flex flex-col md:flex-row items-center gap-10 ${getHatStyles(activeHat).border}`}>
        <div className="shrink-0 relative">
          <div className={`w-32 h-32 rounded-full border-4 border-dashed animate-[spin_10s_linear_infinite] ${getHatStyles(activeHat).color.replace('text-', 'border-')}`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-20 h-20 rounded-[2rem] glass flex items-center justify-center shadow-2xl ${getHatStyles(activeHat).color}`}>
              {getHatStyles(activeHat).icon}
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
             <span className={`text-3xl font-black tracking-tighter uppercase ${getHatStyles(activeHat).color}`}>ACTIVE PERSPECTIVE: {activeHat}</span>
             <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest border border-emerald-500/20">Link Verified</span>
          </div>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            Syntax AI is currently locked into the <span className={getHatStyles(activeHat).color}>{activeHat} Hat</span> lens. Expect zero-compromise reasoning based on this shard's philosophy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThinkingHats;
