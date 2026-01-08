
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Minus, Zap, Volume2, VolumeX, Mic, Layers, MicOff, Skull, Hash } from 'lucide-react';
import { getJaneBotResponse, getJaneBotVoice } from '../services/gemini';
import { ChatMessage, ThinkingHatColor } from '../types';

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const JaneBotChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [activeHat, setActiveHat] = useState<ThinkingHatColor>(
    (localStorage.getItem('active_hat') as ThinkingHatColor) || 'Blue'
  );
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Protocol Handshake Verified. Cognition synced to Active Hat.", timestamp: Date.now() }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleShift = (e: any) => {
      setActiveHat(e.detail.hat);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Cognitive Shift Detected: ${e.detail.hat} Hat activated. Recalibrating resonance.`, 
        timestamp: Date.now() 
      }]);
    };
    window.addEventListener('cognitive_shift', handleShift);
    return () => window.removeEventListener('cognitive_shift', handleShift);
  }, []);

  const getHatColor = (hat: ThinkingHatColor) => {
    switch(hat) {
      case 'White': return 'emerald-500';
      case 'Red': return 'red-500';
      case 'Black': return 'slate-400';
      case 'Yellow': return 'yellow-400';
      case 'Green': return 'emerald-400';
      case 'Blue': return 'blue-400';
      default: return 'emerald-500';
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    if (input.includes('#fly-preset-')) {
      const preset = input.match(/#fly-preset-(\w+)/)?.[1];
      if (preset) window.dispatchEvent(new CustomEvent('afirefly_preset_trigger', { detail: { name: preset } }));
    }

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await getJaneBotResponse([...messages, userMsg], activeHat);
    
    if (response.toolCalls) {
      for (const fc of response.toolCalls) {
        if (fc.name === 'update_ui_field') {
          window.dispatchEvent(new CustomEvent('ai_stamper_execution', { detail: { args: fc.args } }));
        }
        if (fc.name === 'trigger_reality_check') {
          window.dispatchEvent(new CustomEvent('reality_check_trigger', { detail: fc.args }));
        }
      }
    }

    if (isVoiceEnabled && response.text) {
      const base64Audio = await getJaneBotVoice(response.text, activeHat);
      if (base64Audio) {
        try {
          const context = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
          const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), context, 24000, 1);
          const source = context.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(context.destination);
          source.start();
        } catch (audioError) { console.error("Audio failed:", audioError); }
      }
    }

    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: response.text || "Synced.", 
      timestamp: Date.now()
    }]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)} 
        className={`fixed bottom-10 right-10 w-20 h-20 etched-glass rounded-full flex items-center justify-center shadow-2xl z-50 group border transition-all duration-500 border-${getHatColor(activeHat)}/40 shadow-${getHatColor(activeHat)}/20`}
      >
        <Zap size={32} className={`text-${getHatColor(activeHat)} transition-all duration-500`} />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-10 right-10 z-[200] transition-all duration-700 ${isMinimized ? 'h-14 w-64' : 'h-[640px] w-[460px]'} etched-glass flex flex-col overflow-hidden rounded-[2rem] border border-${getHatColor(activeHat)}/20`}>
      <div className={`p-6 flex items-center justify-between cursor-pointer border-b border-white/5 bg-slate-900/80`} onClick={() => isMinimized && setIsMinimized(false)}>
        <div className="flex items-center gap-3">
          <Layers size={20} className={`text-${getHatColor(activeHat)} animate-pulse`} />
          <h3 className="font-black text-[11px] uppercase tracking-[0.3em] text-white">
            JaneBot: {activeHat} Shard
          </h3>
        </div>
        <div className="flex gap-1">
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-1.5 hover:bg-white/5 rounded-lg"><Minus size={16} className="text-slate-500" /></button>
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-1.5 hover:bg-white/5 rounded-lg"><X size={16} className="text-slate-500" /></button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 p-8 overflow-y-auto space-y-8 scrollbar-hide">
             {messages.map((msg, i) => (
               <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-[1.5rem] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-white/5 text-emerald-50 border border-white/5' : `bg-${getHatColor(activeHat)}/5 text-slate-300 border border-${getHatColor(activeHat)}/10`}`}>
                    {msg.content}
                  </div>
               </div>
             ))}
             {isLoading && (
               <div className="p-4 bg-white/5 rounded-full w-20 flex justify-center gap-1">
                 <div className={`w-1.5 h-1.5 rounded-full animate-bounce bg-${getHatColor(activeHat)}`} />
                 <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.2s] bg-${getHatColor(activeHat)}`} />
               </div>
             )}
          </div>

          <form onSubmit={handleSend} className="p-8 bg-slate-900/60 border-t border-white/5">
            <div className="relative flex items-center gap-3">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder={`Operating as ${activeHat} Hat...`}
                disabled={isLoading}
                className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-xs focus:outline-none focus:border-emerald-500/30 transition-all placeholder:text-slate-700"
              />
              <button type="submit" disabled={!input.trim()} className={`p-4 rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-20 bg-${getHatColor(activeHat)} text-slate-950 font-black`}>
                <Send size={18} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default JaneBotChat;
