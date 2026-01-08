
import React, { useRef, useEffect, useState } from 'react';
import { Camera, Zap, Target, Activity } from 'lucide-react';

const CameraGestureEngine: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [shardsDetected, setShardsDetected] = useState(0);

  const TARGET_COLOR = { r: 16, g: 185, b: 129 }; 
  const TOLERANCE = 60;

  const historyRef = useRef<{x: number, y: number, t: number}[]>([]);
  const lastGestureRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive) return;

    let animationFrame: number;
    let localStream: MediaStream | null = null;

    navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } })
      .then(s => { 
        localStream = s;
        if (videoRef.current) videoRef.current.srcObject = s; 
      })
      .catch(err => console.error("Optical Link error:", err));

    const processFrame = () => {
      if (!canvasRef.current || !videoRef.current) return;
      const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(videoRef.current, 0, 0, 320, 240);
      const frame = ctx.getImageData(0, 0, 320, 240);
      const pixels = frame.data;
      const points: { x: number, y: number }[] = [];

      for (let i = 0; i < pixels.length; i += 32) { 
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const diff = Math.abs(r - TARGET_COLOR.r) + Math.abs(g - TARGET_COLOR.g) + Math.abs(b - TARGET_COLOR.b);
        if (diff < TOLERANCE) {
          const x = (i / 4) % 320;
          const y = Math.floor((i / 4) / 320);
          if (points.length < 1 || Math.hypot(x - points[0].x, y - points[0].y) > 50) {
            points.push({ x, y });
          }
        }
        if (points.length >= 2) break;
      }

      setShardsDetected(points.length);

      if (points.length >= 1) {
        const p = points[0];
        const now = Date.now();
        historyRef.current.push({ ...p, t: now });
        if (historyRef.current.length > 30) historyRef.current.shift();

        // 1. CHOP DETECTION (Rapid Y Drop)
        if (historyRef.current.length > 5) {
          const prev = historyRef.current[historyRef.current.length - 5];
          const dy = p.y - prev.y;
          const dt = now - prev.t;
          const vy = dy / dt;
          if (vy > 0.8 && now - lastGestureRef.current > 1000) {
            window.dispatchEvent(new CustomEvent('optical_chop'));
            lastGestureRef.current = now;
          }
        }

        // 2. POINT DETECTION (Stasis)
        const isStatic = historyRef.current.length >= 20 && historyRef.current.every(hp => Math.hypot(hp.x - p.x, hp.y - p.y) < 15);
        if (isStatic && now - lastGestureRef.current > 1500) {
          window.dispatchEvent(new CustomEvent('optical_point', { detail: { x: p.x, y: p.y } }));
          lastGestureRef.current = now;
        }

        // 3. FIGURE-8 / CALIBRATION (Simplified: Circularity)
        // In a real app we'd use a more complex point-set matcher.
        // For now, let's trigger an event if they move enough.
        window.dispatchEvent(new CustomEvent('optical_gesture', { 
          detail: { 
            midX: p.x, 
            midY: p.y, 
            shards: points.length,
            distance: points.length === 2 ? Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) : 0
          } 
        }));
      }

      animationFrame = requestAnimationFrame(processFrame);
    };

    processFrame();
    return () => {
      cancelAnimationFrame(animationFrame);
      if (localStream) localStream.getTracks().forEach(t => t.stop());
    };
  }, [isActive]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[160] flex flex-col items-center">
      <button 
        onClick={() => setIsActive(!isActive)}
        className={`px-6 py-3 rounded-2xl flex items-center gap-3 transition-all border ${isActive ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'etched-glass text-slate-500 border-white/5'}`}
      >
        <Activity size={16} className={isActive ? 'animate-pulse' : ''} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">
          {isActive ? 'Kinetic Link: Online' : 'Initiate Kinetic Link'}
        </span>
      </button>

      {isActive && (
        <div className="mt-4 p-2 etched-glass rounded-2xl border-emerald-500/20 relative group">
          <video ref={videoRef} autoPlay playsInline className="w-32 h-24 object-cover grayscale opacity-30 rounded-xl" />
          <div className="absolute inset-0 flex items-center justify-center">
             <Target size={20} className="text-emerald-500/40 animate-spin-slow" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraGestureEngine;
