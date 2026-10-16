let sharedAudioCtx: AudioContext | null = null;

/**
 * Lazily retrieves or initializes the Web Audio API context.
 * Sets up volume master node and checks audio context state.
 * Structured with explicit browser capability checks and error handling.
 */
export function getOrCreateAudioContext(): AudioContext | null {
  // Check if execution is occurring inside a real browser DOM window
  if (typeof window === 'undefined') {
    return null;
  }

  // Attempt to instantiate the standard or webkit audio context
  try {
    if (!sharedAudioCtx) {
      const windowAudio = window.AudioContext;
      const webkitAudio = (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const AudioCtxConstructor = windowAudio || webkitAudio;

      if (AudioCtxConstructor) {
        sharedAudioCtx = new AudioCtxConstructor();
      }
    }

    // Auto-resume audio context if the browser suspended it pending user interaction
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      void sharedAudioCtx.resume().catch((resumeErr) => {
        console.warn('Silent audio resume deferred:', resumeErr);
      });
    }
  } catch (audioInitError) {
    console.warn('AudioContext failed to initialize:', audioInitError);
    return null;
  }

  // Return the active initialized audio context or null if unsupported
  return sharedAudioCtx;
}

/**
 * Synthesizes a crisp, gentle mechanical keyboard/interface click.
 * Employs bandpass filtered oscillator pulse.
 * Formatted with structured timing and envelope modulation.
 */
export function playUiClick(enabled: boolean): void {
  // Early return if user disabled sound effects in settings
  if (!enabled) {
    return;
  }

  // Ensure AudioContext is instantiated and accessible
  const audioCtx = getOrCreateAudioContext();
  if (!audioCtx) {
    return;
  }

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;
    const duration = 0.045;

    // Pitch envelope from 420Hz down to 140Hz
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + duration);

    // Amplitude decay envelope
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Audio node routing pipeline
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    // Play scheduled note
    osc.start(now);
    osc.stop(now + duration + 0.005);
  } catch (playbackError) {
    console.warn('Failed to play UI click sound:', playbackError);
  }
}

/**
 * Synthesizes an uplifting harmonic chime when an AI model completes training.
 * Creates an arpeggiated major chord with subtle release envelope.
 */
export function playTrainingCompleteChime(enabled: boolean): void {
  if (!enabled) {
    return;
  }

  const audioCtx = getOrCreateAudioContext();
  if (!audioCtx) {
    return;
  }

  try {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const startTime = audioCtx.currentTime;

    notes.forEach((freq, index) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const noteStart = startTime + index * 0.08;
      const noteEnd = noteStart + 0.35;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(0.12, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(noteStart);
      osc.stop(noteEnd + 0.02);
    });
  } catch (chimeError) {
    console.warn('Failed to play training chime:', chimeError);
  }
}

/**
 * Synthesizes a celebratory coin/funds cash sound for investor rounds or payouts.
 * Uses high twin sinusoidal frequencies with metallic decay.
 */
export function playCashRegister(enabled: boolean): void {
  if (!enabled) {
    return;
  }

  const audioCtx = getOrCreateAudioContext();
  if (!audioCtx) {
    return;
  }

  try {
    const now = audioCtx.currentTime;
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.type = 'sine';
    osc2.type = 'square';

    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc1.frequency.setValueAtTime(1318.51, now + 0.09); // E6

    osc2.frequency.setValueAtTime(1975.53, now);
    osc2.frequency.setValueAtTime(2637.02, now + 0.09);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.46);
    osc2.stop(now + 0.46);
  } catch (cashError) {
    console.warn('Failed to play cash sound:', cashError);
  }
}

/**
 * Synthesizes an urgent, high-tech breaking news alert ping.
 * Uses dual-tone modulation typical of financial & tech terminals.
 * Formatted with envelope modulation and fallbacks.
 */
export function playBreakingNewsAlert(enabled: boolean): void {
  // Check if audio alerts are activated in the simulation
  if (!enabled) {
    return;
  }

  // Verify access to the browser audio context
  const audioCtx = getOrCreateAudioContext();
  if (!audioCtx) {
    return;
  }

  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const duration = 0.22;

    // Pitch modulation from 880Hz down to 440Hz
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);

    // Gain envelope with immediate punch and short decay
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Route synthesized audio nodes to output
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    // Trigger scheduled oscillator playback
    osc.start(now);
    osc.stop(now + duration + 0.01);
  } catch (newsError) {
    console.warn('Failed to play breaking news alert:', newsError);
  }
}
