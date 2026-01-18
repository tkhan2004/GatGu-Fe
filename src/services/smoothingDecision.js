/**
 * Smoothing Decision Algorithm using Sliding Window + Majority Voting
 * Prevents flickering and provides stable detection results
 */
class SmoothingDecision {
    constructor(windowSize = 20, settings = {}, detectionIntervalMs = 500) {
        this.WINDOW_SIZE = windowSize;
        this.historyQueue = [];
        this.alarmState = 'NORMAL';
        this.lastAlarmTime = 0;
        this.ALARM_COOLDOWN = 3000;
        this.interval = detectionIntervalMs / 1000; // convert to seconds

        // Default settings if not provided
        this.settings = {
            yawnThreshold: settings.yawnThreshold || 3, // frames
            phoneUsageDuration: settings.phoneUsageDuration || 5, // seconds
            distractionDuration: settings.distractionDuration || 3, // seconds
            headDropDuration: settings.headDropDuration || 3, // seconds
            eyeClosureDuration: settings.eyeClosureDuration || 3, // seconds (mapped to drowsy)
            ...settings
        };
    }

    /**
     * Add new detection label to history queue
     * @param {string} newLabel - Detection label 
     * @returns {string} Current alarm state
     */
    addDetection(newLabel) {
        // 1. Update queue (FIFO)
        this.historyQueue.push(newLabel);
        if (this.historyQueue.length > this.WINDOW_SIZE) {
            this.historyQueue.shift();
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
     * Count occurrences of each label in the entire history queue (for statistics)
     * @returns {Object} Label counts
     */
    countLabels() {
        return this.countRecentLabels(this.WINDOW_SIZE * this.interval).counts;
    }

    /**
     * Count label occurrences in the most recent X seconds
     * @param {number} secondsDuration 
     * @returns {Object} { counts: Object, totalFrames: number }
     */
    countRecentLabels(secondsDuration) {
        // Calculate number of frames to look back
        // Ensure at least 1 frame
        const framesToLookBack = Math.max(1, Math.ceil(secondsDuration / this.interval));

        // Get subset of queue
        // slice(-N) takes the last N elements. If N >= length, it takes all.
        const recentFrames = this.historyQueue.slice(-framesToLookBack);

        const counts = {
            drowsy: 0,
            'head drop': 0,
            phone: 0,
            smoking: 0,
            distracted: 0,
            yawn: 0,
            awake: 0
        };

        recentFrames.forEach(label => {
            if (counts.hasOwnProperty(label)) {
                counts[label]++;
            }
        });

        return { counts, totalFrames: recentFrames.length };
    }

    /**
     * Make decision based on label counts
     * @returns {string} Alarm state
     */
    makeDecision() {
        if (this.historyQueue.length === 0) return 'NORMAL';

        // 1. Drowsy Check
        // Look back exactly the duration user set.
        // Require high confidence (e.g. 75% of frames in that window are drowsy)
        const drowsyWindow = this.countRecentLabels(this.settings.eyeClosureDuration);
        if (drowsyWindow.totalFrames > 0 &&
            (drowsyWindow.counts.drowsy / drowsyWindow.totalFrames) >= 0.75) {
            return 'ALARM_CRITICAL';
        }

        // 2. Head Drop Check
        const headDropWindow = this.countRecentLabels(this.settings.headDropDuration);
        if (headDropWindow.totalFrames > 0 &&
            (headDropWindow.counts['head drop'] / headDropWindow.totalFrames) >= 0.75) {
            return 'ALARM_CRITICAL';
        }

        // 3. Phone Check
        // Phone usage is often continuous, but detection might flicker. 60% density is reasonable.
        const phoneWindow = this.countRecentLabels(this.settings.phoneUsageDuration);
        if (phoneWindow.totalFrames > 0 &&
            (phoneWindow.counts.phone / phoneWindow.totalFrames) >= 0.6) {
            return 'ALARM_WARNING';
        }

        // 4. Distracted Check
        const distractedWindow = this.countRecentLabels(this.settings.distractionDuration);
        if (distractedWindow.totalFrames > 0 &&
            (distractedWindow.counts.distracted / distractedWindow.totalFrames) >= 0.6) {
            return 'ALARM_WARNING';
        }

        // 5. Smoking Check (Fixed 3s)
        const smokingWindow = this.countRecentLabels(3);
        if (smokingWindow.totalFrames > 0 &&
            (smokingWindow.counts.smoking / smokingWindow.totalFrames) >= 0.6) {
            return 'ALARM_WARNING';
        }

        // 6. Yawn Check
        // Yawn is a count threshold (frequency). We should check the larger window for this?
        // Or check density in a reasonable window (e.g. 10s).
        // Let's use a fixed 10s window for yawning density check or just count raw events in history?
        // User setting: "Yawn Threshold" (e.g. 3).
        // If we find 3 yawn frames in the last 10 seconds? That's what the old logic did roughly.
        // Let's look at the last 15 seconds.
        const yawnWindow = this.countRecentLabels(15);
        // Note: Yawn events are often multi-frame. 1 real yawn might be 10 frames.
        // The user setting "3" probably meant "3 yawns". If mapped to frames, it should be higher.
        // But assuming the setting is directly "frames" or "sensitivity":
        if (yawnWindow.counts.yawn >= this.settings.yawnThreshold) {
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
