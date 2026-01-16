import * as ort from 'onnxruntime-web';

class ONNXModelService {
    constructor() {
        this.session = null;
        this.labels = [
            'awake',
            'distracted',
            'drowsy',
            'head drop',
            'phone',
            'smoking',
            'yawn'
        ];
        this.modelPath = '/bestf.onnx';
        this.inputSize = 640; // YOLO default input size
    }

    async loadModel() {
        try {
            console.log('🔄 Loading ONNX model from:', this.modelPath);
            console.log('📦 ONNX Runtime version:', ort.env.versions);

            this.session = await ort.InferenceSession.create(this.modelPath, {
                executionProviders: ['wasm'],
                graphOptimizationLevel: 'all',
            });

            console.log('✅ ONNX model loaded successfully!');
            console.log('📥 Input names:', this.session.inputNames);
            console.log('📤 Output names:', this.session.outputNames);

            return true;
        } catch (error) {
            console.error('❌ Error loading ONNX model:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            return false;
        }
    }

    preprocessImage(imageData, width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = this.inputSize;
        canvas.height = this.inputSize;
        const ctx = canvas.getContext('2d');

        // Draw and resize image
        ctx.drawImage(imageData, 0, 0, this.inputSize, this.inputSize);

        const resizedData = ctx.getImageData(0, 0, this.inputSize, this.inputSize);
        const pixels = resizedData.data;

        // Convert to RGB and normalize [0, 255] -> [0, 1]
        const red = [];
        const green = [];
        const blue = [];

        for (let i = 0; i < pixels.length; i += 4) {
            red.push(pixels[i] / 255.0);
            green.push(pixels[i + 1] / 255.0);
            blue.push(pixels[i + 2] / 255.0);
        }

        // Combine into CHW format (channels, height, width)
        const input = Float32Array.from([...red, ...green, ...blue]);

        return new ort.Tensor('float32', input, [1, 3, this.inputSize, this.inputSize]);
    }

    async detect(videoElement) {
        if (!this.session) {
            console.error('Model not loaded');
            return [];
        }

        try {
            // Preprocess image
            const inputTensor = this.preprocessImage(videoElement, videoElement.videoWidth, videoElement.videoHeight);

            // Run inference
            const feeds = { images: inputTensor };
            const results = await this.session.run(feeds);

            // Process output (YOLO format: [batch, num_detections, 85])
            // 85 = x, y, w, h, confidence, ...class_scores
            const output = results.output0.data;
            const detections = this.processYOLOOutput(output, videoElement.videoWidth, videoElement.videoHeight);

            return detections;
        } catch (error) {
            console.error('Error during detection:', error);
            return [];
        }
    }

    processYOLOOutput(output, originalWidth, originalHeight) {
        const detections = [];
        const numDetections = output.length / 85;
        const confidenceThreshold = 0.5;
        const iouThreshold = 0.4;

        // Parse detections
        for (let i = 0; i < numDetections; i++) {
            const offset = i * 85;
            const confidence = output[offset + 4];

            if (confidence < confidenceThreshold) continue;

            // Get class scores
            const classScores = output.slice(offset + 5, offset + 5 + this.labels.length);
            const maxScore = Math.max(...classScores);
            const classId = classScores.indexOf(maxScore);
            const finalConfidence = confidence * maxScore;

            if (finalConfidence < confidenceThreshold) continue;

            // Get bounding box (convert from center format to corner format)
            const x = output[offset];
            const y = output[offset + 1];
            const w = output[offset + 2];
            const h = output[offset + 3];

            // Scale to original image size
            const scaleX = originalWidth / this.inputSize;
            const scaleY = originalHeight / this.inputSize;

            detections.push({
                x: (x - w / 2) * scaleX,
                y: (y - h / 2) * scaleY,
                width: w * scaleX,
                height: h * scaleY,
                confidence: finalConfidence,
                class: classId,
                label: this.labels[classId]
            });
        }

        // Apply NMS (Non-Maximum Suppression)
        return this.applyNMS(detections, iouThreshold);
    }

    applyNMS(detections, iouThreshold) {
        // Sort by confidence
        detections.sort((a, b) => b.confidence - a.confidence);

        const keep = [];
        const suppressed = new Set();

        for (let i = 0; i < detections.length; i++) {
            if (suppressed.has(i)) continue;

            keep.push(detections[i]);

            for (let j = i + 1; j < detections.length; j++) {
                if (suppressed.has(j)) continue;

                const iou = this.calculateIOU(detections[i], detections[j]);
                if (iou > iouThreshold) {
                    suppressed.add(j);
                }
            }
        }

        return keep;
    }

    calculateIOU(box1, box2) {
        const x1 = Math.max(box1.x, box2.x);
        const y1 = Math.max(box1.y, box2.y);
        const x2 = Math.min(box1.x + box1.width, box2.x + box2.width);
        const y2 = Math.min(box1.y + box1.height, box2.y + box2.height);

        const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
        const area1 = box1.width * box1.height;
        const area2 = box2.width * box2.height;
        const union = area1 + area2 - intersection;

        return intersection / union;
    }

    getLabelColor(label) {
        const colors = {
            'awake': '#10b981',      // green
            'distracted': '#f59e0b', // orange
            'drowsy': '#ef4444',     // red
            'head drop': '#dc2626',  // dark red
            'phone': '#f59e0b',      // orange
            'smoking': '#f59e0b',    // orange
            'yawn': '#eab308'        // yellow
        };
        return colors[label] || '#6b7280';
    }
}

export default new ONNXModelService();
