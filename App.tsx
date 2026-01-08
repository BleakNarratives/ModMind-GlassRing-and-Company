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
import ThinkingHats from './components/ThinkingHats';
import { LayoutGrid, ShieldCheck, Activity, Settings as SettingsIcon, Zap, Menu, Bell, LogOut, BrainCircuit, Users, Loader2, Ghost, Skull, Brain, BookOpen, Terminal, ShieldAlert } from 'lucide-react';
import { ThinkingHatColor } from './types';

// Lazy loaded high-complexity components
const NatHub = lazy(() => import('./components/NatHub'));
const RemoteOversight = lazy(() => import('./components/RemoteOversight'));
const Documentation = lazy(() => import('./components/Documentation'));
const SetupTutorial = lazy(() => import('./components/SetupTutorial'));

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRedTeamMode, setIsRedTeamMode] = useState(localStorage.getItem('red_team_lockdown') === 'true');
  const [activeHat, setActiveHat] = useState<ThinkingHatColor>(
    (localStorage.getItem('active_hat') as ThinkingHatColor) || 'Blue'
  );

  useEffect(() => {
    const session = localStorage.getItem('modmind_session');
    if (session) setIsAuthenticated(true);

    const handleShift = (e: any) => setActiveHat(e.detail.hat);
    const handleRedTeam = (e: any) => setIsRedTeamMode(e.detail.locked);
    
    window.addEventListener('cognitive_shift', handleShift);
    window.addEventListener('red_team_toggle', handleRedTeam);
    return () => {
      window.removeEventListener('cognitive_shift', handleShift);
      window.removeEventListener('red_team_toggle', handleRedTeam);
    };
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('modmind_session', 'active');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('modmind_session');
  };

  const getVignetteColor = (hat: ThinkingHatColor) => {
    if (isRedTeamMode) return 'rgba(239, 68, 68, 0.15)';
    switch(hat) {
      case 'White': return 'rgba(255,255,255,0.02)';
      case 'Red': return 'rgba(239,68,68,0.05)';
      case 'Black': return 'rgba(0,0,0,0.2)';
      case 'Yellow': return 'rgba(234,179,8,0.02)';
      case 'Green': return 'rgba(16,185,129,0.02)';
      case 'Blue': return 'rgba(59,130,246,0.02)';
      default: return 'transparent';
    }
  };

  return (
    <HashRouter>
      <ShutterTransition />
      <div className={`min-h-screen flex text-slate-100 selection:bg-emerald-500/30 transition-all duration-1000 ${isRedTeamMode ? 'bg-[#080000]' : 'bg-slate-950'}`}>
        
        {/* Global Cognitive Vignette */}
        <div 
          className="fixed inset-0 pointer-events-none z-[60] transition-all duration-1000" 
          style={{ boxShadow: `inset 0 0 150px ${getVignetteColor(activeHat)}` }} 
        />

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
              activeHat={activeHat}
              redTeam={isRedTeamMode}
            />
            
            <main className="flex-1 flex flex-col lg:ml-72 relative min-w-0 overflow-hidden">
              <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} activeHat={activeHat} redTeam={isRedTeamMode} />
              
              <div className="flex-1 p-6 md:p-8 overflow-y-auto scrollbar-hide">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/hats" element={<ThinkingHats />} />
                    <Route path="/identity" element={<IdentityHub />} />
                    <Route path="/nat" element={<NatHub />} />
                    <Route path="/remote" element={<RemoteOversight />} />
                    <Route path="/logs" element={<SecurityLogs />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/docs" element={<Documentation />} />
                    <Route path="/setup" element={<SetupTutorial />} />
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
      </div>
    </HashRouter>
  );
};

// --- Lesser Helper Components ---

const LoadingFallback = () => (
  <div className="h-full flex flex-col items-center justify-center space-y-4 animate-pulse">
    <Loader2 size={40} className="animate-spin text-emerald-500" />
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Syncing Shard Paths...</p>
  </div>
);

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

const Sidebar = ({ isOpen, toggle, onLogout, activeHat, redTeam }: any) => {
  const location = useLocation();
  const getHatColor = (hat: ThinkingHatColor) => {
    if (redTeam) return 'red-500';
    switch(hat) {
      case 'White': return 'emerald-500';
      case 'Red': return 'red-500';
      case 'Black': return 'slate-600';
      case 'Yellow': return 'yellow-400';
      case 'Green': return 'emerald-400';
      case 'Blue': return 'blue-500';
      default: return 'emerald-500';
    }
  };

  const navItems = [
    { icon: <LayoutGrid size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Brain size={20} />, label: 'Thinking Hats', path: '/hats' },
    { icon: <ShieldCheck size={20} />, label: 'Identity Hub', path: '/identity' },
    { icon: <BookOpen size={20} />, label: 'Knowledge Base', path: '/docs' },
    { icon: <Terminal size={20} />, label: 'Security Ledger', path: '/logs' },
    { icon: <SettingsIcon size={20} />, label: 'System Core', path: '/settings' },
  ];

  const color = getHatColor(activeHat);

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-white/5 transition-transform duration-500 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full">
        <div className="p-8 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl transition-all bg-${color} shadow-${color}/30 ring-2 ring-white/10`}>
            {redTeam ? <ShieldAlert className="text-white" size={28} /> : <Zap className="text-white fill-white" size={28} />}
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white leading-tight">Equinex</h1>
            <p className={`text-[10px] uppercase tracking-[0.3em] font-black text-${color}`}>
              {redTeam ? 'RED TEAM ACTIVE' : `${activeHat} Shard`}
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
                  ? `bg-${color}/10 text-${color} border-${color}/20 border shadow-lg` 
                  : 'text-slate-500 hover:bg-white/5 hover:text-white translate-x-0 hover:translate-x-2'
              }`}
            >
              <div className={location.pathname === item.path ? `text-${color}` : 'text-slate-600'}>
                {item.icon}
              </div>
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <Link to="/setup" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-400 transition-colors">
            <Zap size={14} /> Setup Tutorial
          </Link>
          <div className="glass p-4 rounded-[1.8rem] flex items-center gap-3 border border-white/5 shadow-inner">
            <img src="https://picsum.photos/seed/jane/120/120" className={`w-10 h-10 rounded-xl border-2 border-${color}/20`} alt="User" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-white">Operator X</p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Root Level</p>
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

const Header = ({ toggleSidebar, activeHat, redTeam }: any) => (
  <header className="sticky top-0 z-40 w-full h-20 glass border-b border-white/5 px-6 md:px-8 flex items-center justify-between">
    <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white">
      <Menu size={24} />
    </button>
    <div className="flex-1 lg:pl-6" />
    <div className="flex items-center gap-4">
       {redTeam && (
         <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-[9px] font-black text-red-500 uppercase tracking-[0.2em] animate-pulse flex items-center gap-2">
           <Skull size={12} /> RED TEAM LOCKDOWN
         </div>
       )}
      <button className="relative p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
        <Bell size={20} />
        <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full ring-4 ring-slate-950 bg-emerald-500"></span>
      </button>
    </div>
  </header>
);

export default App;