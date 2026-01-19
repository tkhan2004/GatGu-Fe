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

        // Small canvas for brightness analysis (64x64)
        this.analyzeCanvas = document.createElement('canvas');
        this.analyzeCanvas.width = 64;
        this.analyzeCanvas.height = 64;
        this.analyzeCtx = this.analyzeCanvas.getContext('2d', { willReadFrequently: true });
    }

    async loadModel() {
        if (this.session) {
            return true;
        }
        try {
            console.log('🔄 Loading ONNX model from:', this.modelPath);
            console.log('📦 ONNX Runtime version:', ort.env.versions);

            this.session = await ort.InferenceSession.create(this.modelPath, {
                executionProviders: ['webgl', 'wasm'],
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
        if (!this.preprocessCtx || !this.analyzeCtx) return null;

        // --- Step 1: Analyze Brightness (Downsampling) ---
        // Resize to 64x64 for fast analysis
        this.analyzeCtx.drawImage(imageData, 0, 0, 64, 64);
        const analyzeData = this.analyzeCtx.getImageData(0, 0, 64, 64);
        const brightness = this.calculateBrightness(analyzeData.data);

        // --- Step 2: Adaptive Processing Setup ---
        // Reset filters
        this.preprocessCtx.filter = 'none';

        let applyGammaValue = null;
        let applyCLAHEValue = null;
        let applySharpen = false;

        // Apply Logic based on Algorithm
        if (brightness < 60) {
            // Environment: Dark (Tunnel/Night)
            // 1. Gamma 2.0
            applyGammaValue = 2.0;
            // 2. Gaussian Blur (kernel 5x5) -> approx via canvas filter
            this.preprocessCtx.filter = 'blur(2px)';
            // 3. CLAHE 3.0
            applyCLAHEValue = 3.0;
        } else if (brightness > 180) {
            // Environment: Bright (Backlight)
            // 1. Gamma 0.6
            applyGammaValue = 0.6;
            // 2. Gaussian Blur (kernel 3x3) -> approx via canvas filter
            this.preprocessCtx.filter = 'blur(1px)';
            // 3. CLAHE 1.5
            applyCLAHEValue = 1.5;
        } else {
            // Environment: Normal
            // 1. Sharpen
            applySharpen = true;
        }

        // --- Step 3: Draw and Get Data ---
        // Draw to main canvas (applying Blur if set via ctx.filter)
        this.preprocessCtx.drawImage(imageData, 0, 0, this.inputSize, this.inputSize);

        const resizedData = this.preprocessCtx.getImageData(0, 0, this.inputSize, this.inputSize);
        const pixels = resizedData.data;

        // --- Step 4: Apply Pixel-level Filters ---
        if (applyGammaValue) {
            this.applyGamma(pixels, applyGammaValue);
        }

        if (applyCLAHEValue) {
            this.applyCLAHE(pixels, applyCLAHEValue);
        }

        if (applySharpen) {
            this.applySharpen(pixels, this.inputSize, this.inputSize);
        }

        // --- Step 5: Normalization [0, 255] -> [0, 1] ---
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

    // --- Helper Algorithms ---

    calculateBrightness(data) {
        let sum = 0;
        let count = 0;
        // Sample with step 4 (every pixel) or more for speed
        for (let i = 0; i < data.length; i += 4) {
            // weighted RGB to Gray
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // Y = 0.299R + 0.587G + 0.114B
            sum += (0.299 * r + 0.587 * g + 0.114 * b);
            count++;
        }
        return count > 0 ? sum / count : 0;
    }

    applyGamma(pixels, gamma) {
        const lut = new Uint8Array(256);
        for (let i = 0; i < 256; i++) {
            lut[i] = Math.max(0, Math.min(255, Math.pow(i / 255, 1 / gamma) * 255));
        }
        for (let i = 0; i < pixels.length; i += 4) {
            pixels[i] = lut[pixels[i]];
            pixels[i + 1] = lut[pixels[i + 1]];
            pixels[i + 2] = lut[pixels[i + 2]];
        }
    }

    applySharpen(pixels, w, h) {
        // Simple 3x3 Sharpen Kernel:
        //  0 -1  0
        // -1  5 -1
        //  0 -1  0

        // Clone source to not read modified pixels
        const src = new Uint8ClampedArray(pixels);

        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                const idx = (y * w + x) * 4;

                // Helper to get pixel val
                const getVal = (ox, oy, channel) => src[((y + oy) * w + (x + ox)) * 4 + channel];

                for (let c = 0; c < 3; c++) {
                    const val =
                        -1 * getVal(0, -1, c) +
                        -1 * getVal(-1, 0, c) +
                        5 * getVal(0, 0, c) +
                        -1 * getVal(1, 0, c) +
                        -1 * getVal(0, 1, c);

                    pixels[idx + c] = Math.max(0, Math.min(255, val));
                }
                // Alpha remains same
            }
        }
    }

    // Simplified CLAHE (Global Contrast Limited Histogram Equalization)
    applyCLAHE(pixels, clipLimitValue) {
        // 1. Calculate L channel Histogram
        const histogram = new Uint32Array(256).fill(0);
        const totalPixels = pixels.length / 4;

        for (let i = 0; i < pixels.length; i += 4) {
            const l = Math.round(0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]);
            histogram[l]++;
        }

        // 2. Clip Histogram
        // Clip Limit calculation: simplistic approach
        // If uniform, each bin has totalPixels/256. 
        // clipLimitValue is a factor (e.g. 3.0x average)
        const limit = Math.max(1, Math.round(clipLimitValue * (totalPixels / 256)));
        let excess = 0;

        for (let i = 0; i < 256; i++) {
            if (histogram[i] > limit) {
                excess += histogram[i] - limit;
                histogram[i] = limit;
            }
        }

        // 3. Redistribute Excess uniformly
        const increase = excess / 256;
        for (let i = 0; i < 256; i++) {
            histogram[i] += increase;
        }

        // 4. CDF & Mapping
        const mapping = new Uint8Array(256);
        let cdf = 0;
        for (let i = 0; i < 256; i++) {
            cdf += histogram[i];
            mapping[i] = Math.max(0, Math.min(255, Math.round((cdf / totalPixels) * 255)));
        }

        // 5. Apply Mapping (Preserving Color Ratios)
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const l = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

            const newL = mapping[l];

            if (l === 0) continue;

            // Scale RGB by newL / oldL to preserve color 
            const scale = newL / l;

            pixels[i] = Math.max(0, Math.min(255, r * scale));
            pixels[i + 1] = Math.max(0, Math.min(255, g * scale));
            pixels[i + 2] = Math.max(0, Math.min(255, b * scale));
        }
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
