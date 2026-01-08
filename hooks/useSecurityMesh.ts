
import { useState, useEffect, useCallback } from 'react';
import { RiskMeshState, SecurityAgent, SecurityTrigger, NatMetric } from '../types';

const INITIAL_AGENTS: SecurityAgent[] = [
  { id: 'mod-1', name: 'ModMind Core', status: 'Active', type: 'Overseer', load: 12, health: 100, lastPing: Date.now() },
  { id: 'syn-1', name: 'Syntax Orchestrator', status: 'Active', type: 'Orchestrator', load: 45, health: 99, lastPing: Date.now() },
  { id: 'aeg-1', name: 'Aegis Compliance', status: 'Operational', type: 'Guardian', load: 30, health: 100, lastPing: Date.now() },
  { id: 'scout-1', name: 'aFiREfly Scout', status: 'Active', type: 'Scout', load: 68, health: 95, lastPing: Date.now() },
];

export const useSecurityMesh = () => {
  const [state, setState] = useState<RiskMeshState>({
    globalRisk: 8,
    activeTriggers: [],
    agents: INITIAL_AGENTS,
    networkHealth: 99.98,
    detectedIntent: 'Standby',
  });

  const [natMetrics, setNatMetrics] = useState<NatMetric[]>([
    { id: 'n1', label: 'Nuance Variance', value: 45, nuance: 'Subtle', weight: 0.8 },
    { id: 'n2', label: 'Intent Velocity', value: 12, nuance: 'Subtle', weight: 1.2 },
    { id: 'n3', label: 'Stress Echo', value: 5, nuance: 'Subtle', weight: 0.5 },
  ]);

  const generateTrigger = useCallback(() => {
    const names = ['Encrypted Leak Detected', 'Hierarchy Violation', 'Shard Desync', 'Repugnant Activity'];
    const agent = INITIAL_AGENTS[Math.floor(Math.random() * INITIAL_AGENTS.length)];
    
    const newTrigger: SecurityTrigger = {
      id: `trig-${Math.random().toString(36).substr(2, 9)}`,
      agentId: agent.id,
      name: names[Math.floor(Math.random() * names.length)],
      severity: Math.random() > 0.8 ? 'Critical' : 'Warning',
      timestamp: Date.now(),
      description: `Autonomous intervention required on node ${agent.name}. Protocol EquiLex engaged.`,
      resolved: false,
    };

    setState(prev => ({
      ...prev,
      activeTriggers: [newTrigger, ...prev.activeTriggers].slice(0, 5),
      globalRisk: Math.min(prev.globalRisk + (newTrigger.severity === 'Critical' ? 20 : 8), 100),
      detectedIntent: newTrigger.severity === 'Critical' ? 'Hostile Probe' : 'System Inquiry',
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        agents: prev.agents.map(a => ({
          ...a,
          load: Math.max(5, Math.min(95, a.load + (Math.random() * 8 - 4))),
          lastPing: Date.now(),
        })),
        globalRisk: Math.max(5, prev.globalRisk - 0.2),
      }));

      // Update Nat Metrics
      setNatMetrics(prev => prev.map(m => ({
        ...m,
        value: Math.max(0, Math.min(100, m.value + (Math.random() * 10 - 5)))
      })));

      if (Math.random() > 0.95) generateTrigger();
    }, 2500);

    return () => clearInterval(interval);
  }, [generateTrigger]);

  const resolveTrigger = (id: string) => {
    setState(prev => ({
      ...prev,
      activeTriggers: prev.activeTriggers.filter(t => t.id !== id),
      globalRisk: Math.max(prev.globalRisk - 12, 5),
    }));
  };

  const panicReset = () => {
    setState(prev => ({
      ...prev,
      activeTriggers: [],
      globalRisk: 5,
      networkHealth: 100,
      detectedIntent: 'Stable',
    }));
  };

  return { ...state, natMetrics, resolveTrigger, panicReset };
};
