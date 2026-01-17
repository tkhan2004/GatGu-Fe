/**
 * Enhanced Detection Tracker
 * Tracks detection events over time and triggers alerts based on thresholds
 */
class DetectionTracker {
    constructor(settings = {}) {
        this.settings = {
            yawnThreshold: 3,
            phoneUsageDuration: 5,
            distractionDuration: 3,
            headDropDuration: 3,
            eyeClosureDuration: 3,
            ...settings
        };

        this.counters = {
            yawn: 0,
            phone: 0,
            distracted: 0,
            headDrop: 0,
            eyeClosure: 0,
            drowsy: 0,
            smoking: 0
        };

        this.timers = {
            phone: null,
            distracted: null,
            headDrop: null,
            eyeClosure: null
        };

        this.startTimes = {
            phone: null,
            distracted: null,
            headDrop: null,
            eyeClosure: null
        };

        this.lastAlerts = {};
        this.alertCooldown = 10000; // 10 seconds between same alerts
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }

    processDetection(label) {
        const now = Date.now();

        switch (label) {
            case 'yawn':
                return this.handleYawn(now);

            case 'phone':
                return this.handlePhone(now);

            case 'distracted':
                return this.handleDistracted(now);

            case 'head drop':
                return this.handleHeadDrop(now);

            case 'drowsy':
                return this.handleDrowsy(now);

            case 'smoking':
                return this.handleSmoking(now);

            case 'awake':
                return this.handleAwake();

            default:
                return null;
        }
    }

    handleYawn(now) {
        this.counters.yawn++;

        if (this.counters.yawn >= this.settings.yawnThreshold) {
            if (this.shouldAlert('yawn', now)) {
                this.lastAlerts.yawn = now;
                return {
                    type: 'yawn',
                    severity: 'high',
                    message: `Đã ngáp ${this.counters.yawn} lần`,
                    action: 'alert'
                };
            }
        }
        return null;
    }

    handlePhone(now) {
        if (!this.startTimes.phone) {
            this.startTimes.phone = now;
        }

        const duration = (now - this.startTimes.phone) / 1000;

        if (duration >= this.settings.phoneUsageDuration) {
            if (this.shouldAlert('phone', now)) {
                this.lastAlerts.phone = now;
                return {
                    type: 'phone',
                    severity: 'high',
                    message: `Sử dụng điện thoại ${duration.toFixed(0)}s`,
                    action: 'alert'
                };
            }
        }
        return null;
    }

    handleDistracted(now) {
        if (!this.startTimes.distracted) {
            this.startTimes.distracted = now;
        }

        const duration = (now - this.startTimes.distracted) / 1000;

        if (duration >= this.settings.distractionDuration) {
            if (this.shouldAlert('distracted', now)) {
                this.lastAlerts.distracted = now;
                return {
                    type: 'distracted',
                    severity: 'medium',
                    message: `Mất tập trung ${duration.toFixed(0)}s`,
                    action: 'warning'
                };
            }
        }
        return null;
    }

    handleHeadDrop(now) {
        if (!this.startTimes.headDrop) {
            this.startTimes.headDrop = now;
        }

        const duration = (now - this.startTimes.headDrop) / 1000;

        if (duration >= this.settings.headDropDuration) {
            if (this.shouldAlert('headDrop', now)) {
                this.lastAlerts.headDrop = now;
                return {
                    type: 'headDrop',
                    severity: 'critical',
                    message: `Gật đầu ${duration.toFixed(0)}s`,
                    action: 'alert'
                };
            }
        }
        return null;
    }

    handleDrowsy(now) {
        if (this.shouldAlert('drowsy', now)) {
            this.lastAlerts.drowsy = now;
            return {
                type: 'drowsy',
                severity: 'critical',
                message: 'Phát hiện buồn ngủ',
                action: 'alert'
            };
        }
        return null;
    }

    handleSmoking(now) {
        if (this.shouldAlert('smoking', now)) {
            this.lastAlerts.smoking = now;
            return {
                type: 'smoking',
                severity: 'low',
                message: 'Phát hiện hút thuốc',
                action: 'warning'
            };
        }
        return null;
    }

    handleAwake() {
        // Reset timers when awake
        this.startTimes.phone = null;
        this.startTimes.distracted = null;
        this.startTimes.headDrop = null;
        this.startTimes.eyeClosure = null;
        return null;
    }

    shouldAlert(type, now) {
        const lastAlert = this.lastAlerts[type];
        return !lastAlert || (now - lastAlert) > this.alertCooldown;
    }

    reset() {
        this.counters = {
            yawn: 0,
            phone: 0,
            distracted: 0,
            headDrop: 0,
            eyeClosure: 0,
            drowsy: 0,
            smoking: 0
        };

        this.startTimes = {
            phone: null,
            distracted: null,
            headDrop: null,
            eyeClosure: null
        };

        this.lastAlerts = {};
    }

    getStats() {
        return {
            counters: { ...this.counters },
            activeTimers: Object.entries(this.startTimes)
                .filter(([_, time]) => time !== null)
                .map(([type, time]) => ({
                    type,
                    duration: (Date.now() - time) / 1000
                }))
        };
    }
}

export default DetectionTracker;
