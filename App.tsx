
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import IdentityHub from './components/IdentityHub';
import SecurityLogs from './components/SecurityLogs';
import Settings from './components/Settings';
import AuthPortal from './components/AuthPortal';
import JaneBotChat from './components/JaneBotChat';
import AFiREflyOverlay from './components/AFiREflyOverlay';
import CameraGestureEngine from './components/CameraGestureEngine';
import NeuralBoard from './components/NeuralBoard';
import WearableSync from './components/WearableSync';
import RealityCheckAlert from './components/RealityCheckAlert';
import { LayoutGrid, ShieldCheck, Activity, Settings as SettingsIcon, Zap, Menu, Bell, LogOut, BrainCircuit, Users, Loader2, Ghost, Skull } from 'lucide-react';

const NatHub = lazy(() => import('./components/NatHub'));
const RemoteOversight = lazy(() => import('./components/RemoteOversight'));

const ShutterTransition = () => {
  const location = useLocation();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const timer = setTimeout(() => setActive(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className={`shutter-overlay flex items-center justify-center ${active ? 'shutter-active pointer-events-auto' : ''}`}>
       <div className="relative">
         <div className="w-32 h-32 rounded-full border-4 border-emerald-500/20 animate-ping" />
         <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400" size={48} />
       </div>
    </div>
  );
};

const Sidebar = ({ isOpen, toggle, onLogout, isAngry }: { isOpen: boolean, toggle: () => void, onLogout: () => void, isAngry: boolean }) => {
  const location = useLocation();
  const navItems = [
    { icon: <LayoutGrid size={20} />, label: 'Dashboard', path: '/' },
    { icon: <ShieldCheck size={20} />, label: 'Identity Hub', path: '/identity' },
    { icon: <BrainCircuit size={20} />, label: 'NatHub Diagnostics', path: '/nat' },
    { icon: <Users size={20} />, label: 'Remote Oversight', path: '/remote' },
    { icon: <Activity size={20} />, label: 'Security Logs', path: '/logs' },
    { icon: <SettingsIcon size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-white/5 transition-transform duration-500 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full">
        <div className="p-8 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl transition-all ${isAngry ? 'bg-red-500 shadow-red-500/30' : 'bg-emerald-500 shadow-emerald-500/30'} ring-2 ring-white/10 group hover:rotate-12`}>
            {isAngry ? <Skull className="text-white" size={28} /> : <Zap className="text-white fill-white" size={28} />}
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white leading-tight">Equinex</h1>
            <p className={`text-[10px] uppercase tracking-[0.3em] font-black ${isAngry ? 'text-red-400' : 'text-emerald-400'}`}>
              {isAngry ? 'Cynic Beta-Link' : 'Modmind Alpha'}
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => toggle()}
              className={`flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-500 ${
                location.pathname === item.path 
                  ? `${isAngry ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'} border shadow-lg` 
                  : 'text-slate-500 hover:bg-white/5 hover:text-white translate-x-0 hover:translate-x-2'
              }`}
            >
              <div className={location.pathname === item.path ? (isAngry ? 'text-red-400' : 'text-emerald-400') : 'text-slate-600'}>
                {item.icon}
              </div>
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="glass p-4 rounded-[1.8rem] flex items-center gap-3 border border-white/5 shadow-inner">
            <div className="relative">
              <img src="https://picsum.photos/seed/jane/120/120" className={`w-10 h-10 rounded-xl border-2 ${isAngry ? 'border-red-500/20' : 'border-emerald-500/20'}`} alt="User" />
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${isAngry ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-white">Tom Equinex</p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Root Operator</p>
            </div>
            <button onClick={onLogout} className="p-2 text-slate-600 hover:text-red-400 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = ({ toggleSidebar, isAngry }: { toggleSidebar: () => void, isAngry: boolean }) => (
  <header className="sticky top-0 z-40 w-full h-20 glass border-b border-white/5 px-6 md:px-8 flex items-center justify-between">
    <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white">
      <Menu size={24} />
    </button>
    <div className="flex-1 lg:pl-6" />
    <div className="flex items-center gap-4">
       {isAngry && (
         <div className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-lg text-[8px] font-black text-red-400 uppercase tracking-widest animate-pulse">
           Reality Link: Critical
         </div>
       )}
      <button className="relative p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
        <Bell size={20} />
        <span className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ring-4 ring-slate-950 ${isAngry ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
      </button>
    </div>
  </header>
);

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAngryMode, setIsAngryMode] = useState(localStorage.getItem('mode_cynic') === 'true');

  useEffect(() => {
    const session = localStorage.getItem('modmind_session');
    if (session) setIsAuthenticated(true);

    const handleModeShift = (e: any) => setIsAngryMode(e.detail.angry);
    window.addEventListener('janebot_mode_shift', handleModeShift);
    return () => window.removeEventListener('janebot_mode_shift', handleModeShift);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('modmind_session', 'active');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('modmind_session');
  };

  return (
    <HashRouter>
      <ShutterTransition />
      <div className={`min-h-screen flex text-slate-100 selection:bg-emerald-500/30 transition-colors duration-1000 ${isAngryMode ? 'bg-[#050000] reality-active' : 'bg-slate-950'}`}>
        {!isAuthenticated ? (
          <Routes>
            <Route path="*" element={<AuthPortal onLogin={handleLogin} />} />
          </Routes>
        ) : (
          <>
            <Sidebar 
              isOpen={sidebarOpen} 
              toggle={() => setSidebarOpen(!sidebarOpen)} 
              onLogout={handleLogout}
              isAngry={isAngryMode}
            />
            
            <main className="flex-1 flex flex-col lg:ml-72 relative min-w-0 overflow-hidden">
              <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isAngry={isAngryMode} />
              
              <div className="flex-1 p-6 md:p-8 overflow-y-auto scrollbar-hide">
                <Suspense fallback={
                  <div className="h-full flex flex-col items-center justify-center space-y-4 animate-pulse">
                     <Loader2 size={40} className={`animate-spin ${isAngryMode ? 'text-red-500' : 'text-emerald-500'}`} />
                     <p className="text-[10px] font-black uppercase tracking-[0.3em]">Neuralizing Shards...</p>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/identity" element={<IdentityHub />} />
                    <Route path="/nat" element={<NatHub />} />
                    <Route path="/remote" element={<RemoteOversight />} />
                    <Route path="/logs" element={<SecurityLogs />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/auth" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </div>
            </main>
          </>
        )}

        <JaneBotChat />
        <AFiREflyOverlay />
        <RealityCheckAlert />
        {isAuthenticated && (
          <>
            <CameraGestureEngine />
            <NeuralBoard onInput={() => {}} onDelete={() => {}} onEnter={() => {}} />
            <WearableSync />
          </>
        )}
        
        {/* Global Reality Mode Glow */}
        {isAngryMode && (
          <div className="fixed inset-0 pointer-events-none opacity-20 bg-gradient-to-b from-red-500/10 via-transparent to-red-500/5" />
        )}
      </div>
    </HashRouter>
  );
};

export default App;
