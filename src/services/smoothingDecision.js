/**
 * Smoothing Decision Algorithm using Sliding Window + Majority Voting
 * Prevents flickering and provides stable detection results
 */
class SmoothingDecision {
    constructor(windowSize = 10) {
        this.WINDOW_SIZE = windowSize;
        this.historyQueue = [];
        this.alarmState = 'NORMAL';
        this.lastAlarmTime = 0;
        this.ALARM_COOLDOWN = 3000; // 3 seconds between alarms
    }

    /**
     * Add new detection label to history queue
     * @param {string} newLabel - Detection label (awake, drowsy, head drop, etc.)
     * @returns {string} Current alarm state
     */
    addDetection(newLabel) {
        // 1. Update queue (FIFO)
        this.historyQueue.push(newLabel);
        if (this.historyQueue.length > this.WINDOW_SIZE) {
            this.historyQueue.shift(); // Remove oldest element
        }

        // 2. Count occurrences of each label in window
        const counts = this.countLabels();

        // 3. Decision Logic
        const alarmState = this.makeDecision(counts);

        // Update state
        this.alarmState = alarmState;

        return alarmState;
    }

    /**
     * Count occurrences of each label in history queue
     * @returns {Object} Label counts
     */
    countLabels() {
        const counts = {
            drowsy: 0,
            'head drop': 0,
            phone: 0,
            smoking: 0,
            distracted: 0,
            yawn: 0,
            awake: 0
        };

        this.historyQueue.forEach(label => {
            if (counts.hasOwnProperty(label)) {
                counts[label]++;
            }
        });

        return counts;
    }

    /**
     * Make decision based on label counts
     * @param {Object} counts - Label counts
     * @returns {string} Alarm state
     */
    makeDecision(counts) {
        const totalFrames = this.historyQueue.length;

        // Critical: Drowsy or Head Drop > 60% of window
        const criticalCount = counts.drowsy + counts['head drop'];
        if (criticalCount > totalFrames * 0.6) {
            return 'ALARM_CRITICAL';
        }

        // Warning: Phone usage > 50% of window
        if (counts.phone > totalFrames * 0.5) {
            return 'ALARM_WARNING';
        }

        // Warning: Smoking > 50% of window
        if (counts.smoking > totalFrames * 0.5) {
            return 'ALARM_WARNING';
        }

        // Warning: Distracted > 50% of window
        if (counts.distracted > totalFrames * 0.5) {
            return 'ALARM_WARNING';
        }

        // Caution: Yawn > 40% of window
        if (counts.yawn > totalFrames * 0.4) {
            return 'ALARM_CAUTION';
        }

        return 'NORMAL';
    }

    /**
     * Check if should trigger alarm (with cooldown)
     * @returns {boolean}
     */
    shouldTriggerAlarm() {
        const now = Date.now();
        if (this.alarmState !== 'NORMAL' && now - this.lastAlarmTime > this.ALARM_COOLDOWN) {
            this.lastAlarmTime = now;
            return true;
        }
        return false;
    }

    /**
     * Get current alarm state
     * @returns {string}
     */
    getAlarmState() {
        return this.alarmState;
    }

    /**
     * Get statistics about current window
     * @returns {Object}
     */
    getStatistics() {
        const counts = this.countLabels();
        const totalFrames = this.historyQueue.length;

        return {
            windowSize: this.WINDOW_SIZE,
            currentFrames: totalFrames,
            counts,
            percentages: {
                drowsy: (counts.drowsy / totalFrames * 100).toFixed(1),
                'head drop': (counts['head drop'] / totalFrames * 100).toFixed(1),
                phone: (counts.phone / totalFrames * 100).toFixed(1),
                awake: (counts.awake / totalFrames * 100).toFixed(1)
            },
            alarmState: this.alarmState
        };
    }

    /**
     * Reset history queue
     */
    reset() {
        this.historyQueue = [];
        this.alarmState = 'NORMAL';
    }
}

export default SmoothingDecision;
