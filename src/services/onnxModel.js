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

        // Reusable canvas context for preprocessing
        // This avoids creating new Canvas elements every frame
        this.preprocessCanvas = document.createElement('canvas');
        this.preprocessCanvas.width = this.inputSize;
        this.preprocessCanvas.height = this.inputSize;
        this.preprocessCtx = this.preprocessCanvas.getContext('2d', { willReadFrequently: true });
    }

    async loadModel() {
        if (this.session) {
            return true;
        }
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
        if (!this.preprocessCtx) return null;

        // Draw and resize image on the reusable canvas
        this.preprocessCtx.drawImage(imageData, 0, 0, this.inputSize, this.inputSize);

        const resizedData = this.preprocessCtx.getImageData(0, 0, this.inputSize, this.inputSize);
        const pixels = resizedData.data;

        // Convert to RGB and normalize [0, 255] -> [0, 1]
        // Pre-allocate arrays if possible or use Float32Array directly to save memory
        // For simplicity and compatibility, we keep loop but optimize

        const floatInput = new Float32Array(3 * this.inputSize * this.inputSize);
        // Channels: Red, Green, Blue
        const redOffset = 0;
        const greenOffset = this.inputSize * this.inputSize;
        const blueOffset = 2 * this.inputSize * this.inputSize;

        for (let i = 0, j = 0; i < pixels.length; i += 4, j++) {
            floatInput[redOffset + j] = pixels[i] / 255.0;
            floatInput[greenOffset + j] = pixels[i + 1] / 255.0;
            floatInput[blueOffset + j] = pixels[i + 2] / 255.0;
        }

        return new ort.Tensor('float32', floatInput, [1, 3, this.inputSize, this.inputSize]);
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

            // Process output
            // Output name is usually "output0" for YOLOv8
            const outputName = this.session.outputNames[0];
            const outputTensor = results[outputName];

            const detections = this.processYOLOOutput(
                outputTensor.data,
                outputTensor.dims,
                videoElement.videoWidth,
                videoElement.videoHeight
            );

            return detections;
        } catch (error) {
            console.error('Error during detection:', error);
            return [];
        }
    }

    processYOLOOutput(output, dims, originalWidth, originalHeight) {
        const detections = [];
        const confidenceThreshold = 0.45;
        const iouThreshold = 0.45;

        // Determine shape and stride
        // YOLOv8 default: [1, 4+nc, 8400] -> [1, 11, 8400] for 7 classes
        // YOLOv5 or Transposed: [1, 8400, 4+nc+obj] or similar

        // Check if dims is valid
        if (!dims || dims.length < 3) {
            console.error('Invalid output dimensions:', dims);
            return [];
        }

        let numAnchors, numChannels, isTransposed;

        // dims[0] is batch size (1)
        if (dims[1] < dims[2]) {
            // Shape: [1, Channels, Anchors] (Standard YOLOv8)
            numChannels = dims[1];
            numAnchors = dims[2];
            isTransposed = false;
        } else {
            // Shape: [1, Anchors, Channels] (Transposed)
            numAnchors = dims[1];
            numChannels = dims[2];
            isTransposed = true;
        }

        // Validate channels against labels
        // YOLOv8 logic: Channels = 4 (box) + num_classes
        // YOLOv5 logic: Channels = 4 (box) + 1 (objectness) + num_classes
        const hasObjectness = (numChannels === 5 + this.labels.length);

        // Helper to access data
        const getData = (anchorIdx, channelIdx) => {
            if (isTransposed) {
                return output[anchorIdx * numChannels + channelIdx];
            } else {
                return output[channelIdx * numAnchors + anchorIdx];
            }
        };

        for (let i = 0; i < numAnchors; i++) {
            // Check confidence/objectness first to optimize
            let objConf = 1.0;
            if (hasObjectness) {
                objConf = getData(i, 4);
                if (objConf < confidenceThreshold) continue;
            }

            // Find best class
            let maxClassScore = -Infinity;
            let classId = -1;
            const classStart = hasObjectness ? 5 : 4;

            for (let c = 0; c < this.labels.length; c++) {
                if (classStart + c >= numChannels) break;
                const score = getData(i, classStart + c);
                if (score > maxClassScore) {
                    maxClassScore = score;
                    classId = c;
                }
            }

            const finalConfidence = objConf * maxClassScore;

            if (finalConfidence >= confidenceThreshold) {
                // Get box coordinates (cx, cy, w, h)
                const cx = getData(i, 0);
                const cy = getData(i, 1);
                const w = getData(i, 2);
                const h = getData(i, 3);

                // Scale to original image size
                const scaleX = originalWidth / this.inputSize;
                const scaleY = originalHeight / this.inputSize;

                detections.push({
                    x: (cx - w / 2) * scaleX,
                    y: (cy - h / 2) * scaleY,
                    width: w * scaleX,
                    height: h * scaleY,
                    confidence: finalConfidence,
                    class: classId,
                    label: this.labels[classId]
                });
            }
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
