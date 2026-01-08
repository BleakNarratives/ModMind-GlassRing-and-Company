
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  trustScore: number;
  lastLogin: string;
  status: 'Active' | 'Locked' | 'Review';
}

export interface AuthSession {
  id: string;
  device: string;
  location: string;
  timestamp: string;
  method: 'Biometric' | 'Passkey' | 'OAuth' | 'Hardware';
  risk: 'Low' | 'Medium' | 'High';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  intent?: string;
  audio?: string; // base64 pcm
  toolCall?: {
    name: string;
    args: any;
  };
}

export interface SecurityAgent {
  id: string;
  name: string;
  status: 'Operational' | 'Standby' | 'Suppressed' | 'Active';
  type: 'Guardian' | 'Sentinel' | 'Overseer' | 'Orchestrator' | 'Scout';
  load: number;
  health: number;
  lastPing: number;
}

export interface SecurityTrigger {
  id: string;
  agentId: string;
  name: string;
  severity: 'Critical' | 'Warning' | 'Info';
  timestamp: number;
  description: string;
  resolved: boolean;
}

export interface RiskMeshState {
  globalRisk: number;
  activeTriggers: SecurityTrigger[];
  agents: SecurityAgent[];
  networkHealth: number;
  detectedIntent?: string;
}

export interface WearableShard {
  id: string;
  type: 'Watch' | 'Vape' | 'Ring';
  label: string;
  battery: number;
  metric: string;
  value: string | number;
  lastSync: number;
}

export interface AfireflyPreset {
  id: string;
  name: string;
  pos: { x: number, y: number };
  scale: number;
  opacity: number;
}

export interface NatMetric {
  id: string;
  label: string;
  value: number; // 0-100
  nuance: 'Subtle' | 'Overt' | 'Anomalous';
  weight: number;
}

export interface RemoteLink {
  id: string;
  name: string;
  role: 'Family' | 'Nanny' | 'Supervisor';
  accessLevel: number;
  status: 'Linked' | 'Pending';
}

export type ThinkingHatColor = 'White' | 'Red' | 'Black' | 'Yellow' | 'Green' | 'Blue';

export interface ThinkingHat {
  type: ThinkingHatColor;
  label: string;
  focus: string;
  description: string;
  active: boolean;
}

export type UiTone = 'Emerald' | 'Amber' | 'Crimson' | 'Ghost' | 'Cyber';

export interface ResonanceProfile {
  voiceWarmth: number; // 0-100
  uiOpacity: number; // 0-100
  tone: UiTone;
}
