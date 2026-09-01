// ============================================================
// SUIIS BEAUTY - Voice AI Engine (STT, TTS, & Audio Analyser)
// Handles real-time Speech Recognition, Speech Synthesis, and
// Web Audio API amplitude sampling for live canvas visualizers.
// ============================================================

class VoiceEngine {
  constructor() {
    this.recognition = null;
    this.synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.audioCtx = null;
    this.analyser = null;
    this.micStream = null;
    
    this.isListening = false;
    this.isSpeaking = false;
    this.isMuted = false;
    this.currentUtterance = null;
    this.lastSpokenText = "";
    this.speakEndTime = 0;

    // Callbacks
    this.onTranscriptUpdate = null; // (text, isFinal, isUser)
    this.onSpeechStateChange = null; // ({ isListening, isSpeaking })
    this.onVolumeChange = null;      // (volume: 0..100)
    this.onError = null;             // (errMessage)

    this.initSpeechRecognition();
  }

  // Helper to detect string similarity / self-echo
  isSelfEcho(text) {
    if (!text || !this.lastSpokenText) return false;
    const cleanInput = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanSpoken = this.lastSpokenText.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (cleanInput.length === 0 || cleanSpoken.length === 0) return false;

    // Direct inclusion or substring match
    if (cleanInput.includes(cleanSpoken) || cleanSpoken.includes(cleanInput)) return true;
    
    // Check key phrase overlap
    const words = cleanInput.split(/\s+/);
    const spokenWords = new Set(cleanSpoken.split(/\s+/));
    const matchCount = words.filter(w => w.length > 3 && spokenWords.has(w)).length;
    if (words.length > 0 && (matchCount / words.length) > 0.5) return true;

    return false;
  }

  // ========== STT: SPEECH RECOGNITION SETUP ==========
  initSpeechRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition API is not supported in this browser.");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      this.notifyStateChange();
    };

    this.recognition.onresult = (event) => {
      // Ignore microphone input while AI is actively speaking or right after speaking (600ms buffer)
      if (this.isSpeaking || (Date.now() - this.speakEndTime < 600)) {
        return;
      }

      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript && this.onTranscriptUpdate) {
        if (!this.isSelfEcho(interimTranscript)) {
          this.onTranscriptUpdate(interimTranscript, false, true);
        }
      }

      if (finalTranscript) {
        const trimmed = finalTranscript.trim();
        // Skip self echo or repetitive loops
        if (this.isSelfEcho(trimmed)) {
          console.log("Suppressed self-echo transcript:", trimmed);
          return;
        }

        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(trimmed, true, true);
        }
      }
    };

    this.recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      console.error("Speech recognition error:", event.error);
      if (this.onError) {
        this.onError(`Voice Recognition Error: ${event.error}`);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.notifyStateChange();
      if (this.shouldAutoRestart && !this.isMuted) {
        try {
          this.recognition.start();
        } catch (e) {}
      }
    };
  }

  // ========== START / STOP LISTENING ==========
  async startListening() {
    if (this.isMuted) return false;
    this.shouldAutoRestart = true;
    
    await this.setupMicAnalyser();

    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        return true;
      } catch (err) {
        console.warn("Recognition start error:", err.message);
      }
    }
    return false;
  }

  stopListening() {
    this.shouldAutoRestart = false;
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.isListening = false;
    this.notifyStateChange();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopListening();
      this.stopSpeaking();
    } else {
      this.startListening();
    }
    return this.isMuted;
  }

  // ========== TTS: SPEECH SYNTHESIS SETUP ==========
  getAvailableVoices() {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices().filter(v => v.lang.startsWith('en'));
  }

  speak(text, onComplete = null) {
    if (!this.synthesis || this.isMuted || !text) {
      if (onComplete) onComplete();
      return;
    }

    this.stopSpeaking();

    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/[*_#`~]/g, '')
      .trim();

    if (!cleanText) {
      if (onComplete) onComplete();
      return;
    }

    this.lastSpokenText = cleanText;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.96;
    utterance.pitch = 1.05;

    const voices = this.getAvailableVoices();
    const premiumVoice = voices.find(v => 
      /samantha|karen|victoria|zira|google uk english female|natural|female/i.test(v.name)
    ) || voices[0];
    
    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }

    let animInterval = null;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.notifyStateChange();

      animInterval = setInterval(() => {
        if (this.onVolumeChange && this.isSpeaking) {
          const simulatedVol = Math.floor(Math.random() * 60) + 30;
          this.onVolumeChange(simulatedVol);
        }
      }, 80);
    };

    utterance.onend = () => {
      clearInterval(animInterval);
      this.isSpeaking = false;
      this.speakEndTime = Date.now();
      this.currentUtterance = null;
      if (this.onVolumeChange) this.onVolumeChange(0);
      this.notifyStateChange();
      if (onComplete) onComplete();
    };

    utterance.onerror = (err) => {
      clearInterval(animInterval);
      console.warn("TTS Error:", err);
      this.isSpeaking = false;
      this.speakEndTime = Date.now();
      this.notifyStateChange();
      if (onComplete) onComplete();
    };

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.synthesis && this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.isSpeaking = false;
    this.notifyStateChange();
  }

  // ========== AUDIO ANALYSER SETUP ==========
  async setupMicAnalyser() {
    if (this.audioCtx) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.micStream = stream;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;

      const source = this.audioCtx.createMediaStreamSource(stream);
      source.connect(this.analyser);

      this.sampleMicVolume();
    } catch (e) {
      console.warn("Microphone access denied or audio analyser unavailable:", e.message);
    }
  }

  sampleMicVolume = () => {
    if (!this.analyser) return;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avg = sum / dataArray.length;
    const vol = Math.min(100, Math.round((avg / 128) * 100));

    if (this.isListening && !this.isSpeaking && this.onVolumeChange) {
      this.onVolumeChange(vol);
    }

    requestAnimationFrame(this.sampleMicVolume);
  };

  notifyStateChange() {
    if (this.onSpeechStateChange) {
      this.onSpeechStateChange({
        isListening: this.isListening,
        isSpeaking: this.isSpeaking,
        isMuted: this.isMuted
      });
    }
  }

  destroy() {
    this.stopListening();
    this.stopSpeaking();
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
    }
    if (this.audioCtx) {
      this.audioCtx.close();
    }
  }
}

export const voiceEngine = new VoiceEngine();
export default voiceEngine;
