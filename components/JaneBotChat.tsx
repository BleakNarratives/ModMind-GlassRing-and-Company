
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Minus, Zap, Volume2, VolumeX, Mic, Layers, MicOff, Skull, Hash, Brain, Terminal, ShieldAlert, Activity } from 'lucide-react';
import { getJaneBotResponse, getJaneBotVoice } from '../services/gemini';
import { ChatMessage, ThinkingHatColor } from '../types';

const JaneBotChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [activeHat, setActiveHat] = useState<ThinkingHatColor>((localStorage.getItem('active_hat') as ThinkingHatColor) || 'Blue');
  const [isRedTeam, setIsRedTeam] = useState(localStorage.getItem('red_team_lockdown') === 'true');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Neural handshake verified. Sovereign link established. Shard active.", timestamp: Date.now() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [dpiLogs, setDpiLogs] = useState<string[]>(["[NET]: Shard Link 10.0.1.5", "[SEC]: Zero-Trust Encrypted"]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleShift = (e: any) => {
      setActiveHat(e.detail.hat);
      logDpi(`COGNITION_SHIFT: ${e.detail.hat}`);
    };
    const handleRedTeam = (e: any) => setIsRedTeam(e.detail.locked);
    window.addEventListener('cognitive_shift', handleShift);
    window.addEventListener('red_team_toggle', handleRedTeam);
    return () => {
      window.removeEventListener('cognitive_shift', handleShift);
      window.removeEventListener('red_team_toggle', handleRedTeam);
    };
  }, []);

  const logDpi = (msg: string) => {
    setDpiLogs(prev => [...prev.slice(-3), `[${new Date().toLocaleTimeString()}]: ${msg}`]);
  };

  const getHatColor = (hat: ThinkingHatColor) => {
    if (isRedTeam) return 'red-500';
    switch(hat) {
      case 'White': return 'emerald-50';
      case 'Red': return 'red-500';
      case 'Black': return 'slate-500';
      case 'Yellow': return 'yellow-400';
      case 'Green': return 'emerald-400';
      case 'Blue': return 'blue-500';
      default: return 'emerald-500';
    }
  };

  const color = getHatColor(activeHat);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    logDpi("PACKET_OUT: SOVEREIGN_REQ");

    const response = await getJaneBotResponse([...messages, userMsg], activeHat, isRedTeam);
    
    if (response.toolCalls) {
      for (const fc of response.toolCalls) {
        logDpi(`TOOL_EXEC: ${fc.name}`);
        if (fc.name === 'trigger_lockdown') {
          setIsMinimized(true);
          window.dispatchEvent(new CustomEvent('red_team_toggle', { detail: { locked: true } }));
          setMessages(prev => [...prev, { role: 'assistant', content: "THREAT DETECTED. SOVEREIGN LOCKDOWN ACTIVATED.", timestamp: Date.now() }]);
        }
        if (fc.name === 'update_ui_field') {
          window.dispatchEvent(new CustomEvent('ai_stamper_execution', { detail: { args: fc.args } }));
        }
      }
    }

    if (isVoiceEnabled && response.text) {
      const base64Audio = await getJaneBotVoice(response.text, activeHat);
      if (base64Audio) playAudio(base64Audio);
    }

    setMessages(prev => [...prev, { role: 'assistant', content: response.text || "Synced.", timestamp: Date.now() }]);
    setIsLoading(false);
    logDpi("PACKET_IN: SHARD_ACK");
  };

  const playAudio = async (base64: string) => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      const buffer = await decodeAudioData(decodeBase64(base64), context, 24000, 1);
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start();
    } catch {}
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)} 
        className={`fixed bottom-10 right-10 w-24 h-24 etched-glass rounded-full flex items-center justify-center shadow-2xl z-50 group border transition-all duration-700 border-${color}/40 shadow-${color}/20 active:scale-90`}
      >
        {isRedTeam ? <ShieldAlert size={36} className="text-red-500 animate-pulse" /> : <Brain size={36} className={`text-${color} transition-all duration-700`} />}
      </button>
    );
  }

  return (
    <div className={`fixed bottom-10 right-10 z-[200] transition-all duration-700 ${isMinimized ? 'h-16 w-72' : 'h-[780px] w-[540px]'} etched-glass flex flex-col overflow-hidden rounded-[3rem] border border-${color}/30 shadow-2xl`}>
      <div className={`p-8 flex items-center justify-between cursor-pointer border-b border-white/5 bg-slate-900/95 backdrop-blur-3xl`} onClick={() => isMinimized && setIsMinimized(false)}>
        <div className="flex items-center gap-4">
          <Activity size={24} className={`text-${color} animate-pulse`} />
          <div className="flex flex-col">
             <h3 className="font-black text-xs uppercase tracking-[0.4em] text-white">JaneBot Shard</h3>
             <span className={`text-[8px] font-black uppercase tracking-widest text-${color}`}>{isRedTeam ? 'DEFENSIVE MATRIX' : `${activeHat} SHARD`}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-2 hover:bg-white/5 rounded-xl text-slate-500"><Minus size={18} /></button>
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-2 hover:bg-white/5 rounded-xl text-slate-500"><X size={18} /></button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="bg-black/60 px-10 py-3 border-b border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-4 overflow-hidden">
               <Terminal size={14} className="text-slate-600 shrink-0" />
               <div className="flex gap-4">
                 {dpiLogs.map((log, i) => (
                   <span key={i} className="text-[9px] font-mono text-slate-600 whitespace-nowrap opacity-60">{log}</span>
                 ))}
               </div>
             </div>
             {isRedTeam && <Skull size={14} className="text-red-500 animate-pulse" />}
          </div>

          <div className="flex-1 p-10 overflow-y-auto space-y-12 scrollbar-hide">
             {messages.map((msg, i) => (
               <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-400`}>
                  <div className={`max-w-[90%] p-7 rounded-[2.5rem] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-white/5 text-emerald-50 border border-white/10' : `bg-${color}/10 text-slate-200 border border-${color}/20`}`}>
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-slate-600 mt-3 font-black uppercase tracking-[0.3em] mx-6">
                    {msg.role === 'user' ? 'Operator' : 'JaneBot'}
                  </span>
               </div>
             ))}
             <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-10 bg-slate-900/90 border-t border-white/5 backdrop-blur-2xl">
            <div className="relative flex items-center gap-5">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder={isRedTeam ? "Defensive Matrix Active..." : "Input Shard Query..."}
                disabled={isLoading}
                className="flex-1 bg-white/5 border border-white/5 rounded-3xl px-8 py-6 text-sm focus:outline-none focus:border-emerald-500/30 transition-all placeholder:text-slate-700"
              />
              <button type="submit" disabled={!input.trim()} className={`p-6 rounded-3xl transition-all shadow-xl active:scale-95 disabled:opacity-20 bg-${color} text-slate-950 font-black`}>
                <Send size={22} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

// --- Helpers ---
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

export default JaneBotChat;
