/**
 * Sound Alert Service
 * Plays warning sounds for different alert types
 */
class SoundAlertService {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error('Web Audio API not supported:', e);
        }
    }

    // Generate beep sound
    playBeep(frequency = 800, duration = 200, volume = 0.3) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }

    // Warning sound (single beep)
    playWarning() {
        this.playBeep(800, 300, 0.4);
    }

    // Alert sound (double beep)
    playAlert() {
        this.playBeep(1000, 200, 0.5);
        setTimeout(() => this.playBeep(1000, 200, 0.5), 250);
    }

    // Emergency sound (rapid beeps)
    playEmergency() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.playBeep(1200, 150, 0.6), i * 200);
        }
    }

    // Critical sound (siren-like)
    playCritical() {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';

        // Siren effect
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(1200, this.audioContext.currentTime + 0.5);
        oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 1);

        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 1);
    }
}

export default new SoundAlertService();
