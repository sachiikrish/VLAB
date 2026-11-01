import { useEffect, useRef } from "react";

const SR = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
export const voiceSupported = () => !!SR;

// Listens to the microphone while "enabled" is true and sends each phrase to onText
export function useRecognition(enabled, onText) {
  useEffect(() => {
    if (!enabled || !SR) return;
    let alive = true;
    const r = new SR();
    r.continuous = true;
    r.lang = "en-IN";
    r.onresult = (e) => onText(e.results[e.results.length - 1][0].transcript.trim().toLowerCase());
    r.onend = () => { if (alive) { try { r.start(); } catch { /* already started */ } } };
    try { r.start(); } catch { /* already started */ }
    return () => { alive = false; r.stop(); };
  }, [enabled]);
}

// Runs handler(text) each time a new voice phrase arrives
export function useVoiceCommand(voice, handler) {
  const last = useRef(voice.n);
  useEffect(() => {
    if (voice.n !== last.current) { last.current = voice.n; handler(voice.text); }
  }, [voice.n]);
}
