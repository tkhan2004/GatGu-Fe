/**
 * Vietnamese Voice Alert Service
 * Provides text-to-speech alerts in Vietnamese
 */
class VoiceAlertService {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voice = null;
        this.initVoice();
    }

    initVoice() {
        // Wait for voices to load
        const loadVoices = () => {
            const voices = this.synth.getVoices();

            // Try to find Vietnamese voice
            this.voice = voices.find(voice => voice.lang.startsWith('vi')) ||
                voices.find(voice => voice.lang.startsWith('en')) ||
                voices[0];

            console.log('Voice loaded:', this.voice?.name);
        };

        // Load voices
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = loadVoices;
        }
        loadVoices();
    }

    speak(text, priority = 'normal') {
        // Cancel previous speech if high priority
        if (priority === 'high' || priority === 'emergency') {
            this.synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);

        if (this.voice) {
            utterance.voice = this.voice;
        }

        // Set properties based on priority
        switch (priority) {
            case 'emergency':
                utterance.rate = 1.2;
                utterance.pitch = 1.2;
                utterance.volume = 1.0;
                break;
            case 'high':
                utterance.rate = 1.1;
                utterance.pitch = 1.1;
                utterance.volume = 0.9;
                break;
            default:
                utterance.rate = 1.0;
                utterance.pitch = 1.0;
                utterance.volume = 0.8;
        }

        this.synth.speak(utterance);
    }

    // Predefined alerts in Vietnamese
    alerts = {
        yawn: 'Bạn đã ngáp nhiều lần. Hãy dừng xe lại nghỉ ngơi.',
        phone: 'Bạn đang sử dụng điện thoại quá lâu. Tập trung lái xe!',
        distracted: 'Bạn đang mất tập trung. Hãy chú ý quan sát phía trước!',
        headDrop: 'Phát hiện bạn đang gật đầu. Hãy dừng xe nghỉ ngơi ngay!',
        drowsy: 'Bạn đang buồn ngủ. Nguy hiểm! Hãy dừng xe lại!',
        eyeClosure: 'KHẨN CẤP! Bạn đang nhắm mắt. Dừng xe ngay lập tức!',
        smoking: 'Phát hiện bạn đang hút thuốc. Hãy tập trung lái xe!'
    };

    alertYawn() {
        this.speak(this.alerts.yawn, 'high');
    }

    alertPhone() {
        this.speak(this.alerts.phone, 'high');
    }

    alertDistracted() {
        this.speak(this.alerts.distracted, 'normal');
    }

    alertHeadDrop() {
        this.speak(this.alerts.headDrop, 'high');
    }

    alertDrowsy() {
        this.speak(this.alerts.drowsy, 'high');
    }

    alertEyeClosure() {
        this.speak(this.alerts.eyeClosure, 'emergency');
    }

    alertSmoking() {
        this.speak(this.alerts.smoking, 'normal');
    }

    stop() {
        this.synth.cancel();
    }
}

export default new VoiceAlertService();
