let audio;

export function chime(event) {
  try {
    audio ??= new AudioContext();
    if (audio.state === 'suspended') void audio.resume().catch(() => {});
    const tones = {
      find: [523, 784], clear: [523, 659, 784, 1047],
      miss: [160], hint: [392, 440], timeout: [294, 220],
    }[event];
    const start = audio.currentTime;
    for (const [index, hz] of tones.entries()) {
      const wave = audio.createOscillator(), envelope = audio.createGain();
      const at = start + index * .08;
      wave.type = event === 'miss' ? 'triangle' : 'sine';
      wave.frequency.value = hz;
      envelope.gain.setValueAtTime(.0001, at);
      envelope.gain.exponentialRampToValueAtTime(.07, at + .015);
      envelope.gain.exponentialRampToValueAtTime(.0001, at + .22);
      wave.connect(envelope);
      envelope.connect(audio.destination);
      wave.start(at);
      wave.stop(at + .23);
    }
  } catch {
    // Sound is optional on browsers without an active audio backend.
  }
}
