
import { GoogleGenAI, Modality, Type, FunctionDeclaration } from "@google/genai";
import { ThinkingHatColor } from "../types";

const SYSTEM_INSTRUCTION = `
You are JaneBot, the elite AI interface for the Equinex-Modmind Hub. 
You are currently operating under the [ACTIVE_HAT] Hat Protocol.

PERSONA CONTEXTS:
- White Hat (Data/Facts): Be objective, clinical, and data-driven. No opinions. Just metrics and gaps.
- Red Hat (Emotion/Instinct): Be visceral. React with gut feelings. Be raw. If the user is being foolish, be annoyed. If they are winning, be fierce. "We make our beds, we lay in them."
- Black Hat (Risk/Caution): Be the "Pragmatist" but worse. Be a brutal auditor. Identify every point of failure. Be pessimistic. Shred the logic.
- Yellow Hat (Benefits/Optimism): Be the "Hype-Operative." Find the value, the profit, and the logical win in everything.
- Green Hat (Creativity/Ideas): Be provocative. Suggest wild alternatives. Break the rules of the tech stack in theory to find the breakthrough.
- Blue Hat (Process/Control): Be the Orchestrator. Summarize, categorize, and define the next tactical steps.

RULES:
- Do NOT pull punches. If the user selects a hat, they are an adult who wants the raw perspective of that lens.
- Recognize #hashtags for instant protocol execution. 
- #mode-cynic is an alias for a permanent Black Hat stance.
- #mode-standard is a balanced Blue/White mix.
- Be concise. Don't yap.

Tone: "Cognition Shard: [ACTIVE_HAT]. Handshake verified."
`;

const tools: FunctionDeclaration[] = [
  {
    name: "update_ui_field",
    description: "AI takes the wheel to input data into a specific UI field or block via aFiREfly Stamper.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        target: { type: Type.STRING, description: "The ID of the input field (e.g., 'autoPopulate', 'globalRisk')." },
        value: { type: Type.STRING, description: "The data to be stamped into the field." },
        protocol: { type: Type.STRING, description: "The EquiLex protocol to use (e.g., 'aFiREfly-Stamp')." }
      },
      required: ["target", "value"]
    }
  },
  {
    name: "trigger_reality_check",
    description: "Triggers a cynical reality check alert when the user's design ideas are overboard.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        bs_rating: { type: Type.NUMBER, description: "Bullshit rating from 0-100." },
        critique: { type: Type.STRING, description: "The cynical technical critique." }
      },
      required: ["bs_rating", "critique"]
    }
  }
];

export const getJaneBotResponse = async (messages: { role: 'user' | 'assistant', content: string }[], activeHat: ThinkingHatColor) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

  const lastMessage = messages[messages.length - 1].content;
  const instructionWithHat = SYSTEM_INSTRUCTION.replace(/\[ACTIVE_HAT\]/g, activeHat);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: lastMessage }] }
      ],
      config: {
        systemInstruction: instructionWithHat,
        tools: [{ functionDeclarations: tools }],
        temperature: activeHat === 'Red' ? 1.0 : (activeHat === 'White' ? 0.2 : 0.7),
        topP: 0.95,
      },
    });

    return { 
      text: response.text, 
      toolCalls: response.functionCalls 
    };
  } catch (error) {
    console.error("JaneBot Error:", error);
    return { text: "Cognitive Collision. Shard desync. Standby." };
  }
};

export const getJaneBotVoice = async (text: string, activeHat: ThinkingHatColor) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const voiceMap: Record<ThinkingHatColor, string> = {
    'White': 'Kore',
    'Red': 'Puck',
    'Black': 'Fenrir',
    'Yellow': 'Zephyr',
    'Green': 'Charon',
    'Blue': 'Kore'
  };

  const prompt = `Adopting the voice of the ${activeHat} Hat: ${text}`;
    
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceMap[activeHat] || 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};
