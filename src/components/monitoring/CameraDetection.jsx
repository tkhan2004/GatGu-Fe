import { useEffect, useRef, useState } from 'react';
import onnxModel from '../../services/onnxModel';
import SmoothingDecision from '../../services/smoothingDecision';

export default function CameraDetection({ onDetection }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [detections, setDetections] = useState([]);
    const [fps, setFps] = useState(0);
    const [alarmState, setAlarmState] = useState('NORMAL');
    const [availableCameras, setAvailableCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const animationFrameRef = useRef(null);
    const lastTimeRef = useRef(Date.now());
    const fpsCounterRef = useRef(0);
    const frameCountRef = useRef(0);
    const smoothingRef = useRef(new SmoothingDecision(10));
    const SKIP_FRAMES = 10; // Increased to improve FPS

    // List available cameras on mount
    useEffect(() => {
        const listCameras = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const cameras = devices.filter(device => device.kind === 'videoinput');
                setAvailableCameras(cameras);
                console.log('📷 Available cameras:', cameras.map(c => c.label || c.deviceId));
            } catch (err) {
                console.error('Error listing cameras:', err);
            }
        };
        listCameras();
    }, []);

    useEffect(() => {
        let stream = null;

        const initCamera = async () => {
            try {
                // Load ONNX model
                const modelLoaded = await onnxModel.loadModel();
                if (!modelLoaded) {
                    throw new Error('Failed to load ONNX model');
                }

                // Get camera access with optimized settings
                const constraints = {
                    video: {
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        facingMode: 'user',
                        frameRate: { ideal: 30, max: 30 }
                    }
                };

                // If a specific camera is selected, use it
                if (selectedCamera) {
                    constraints.video.deviceId = { exact: selectedCamera };
                }

                stream = await navigator.mediaDevices.getUserMedia(constraints);

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play();
                        setIsLoading(false);
                        startDetection();
                    };
                }
            } catch (err) {
                console.error('Error initializing camera:', err);
                setError(err.message);
                setIsLoading(false);
            }
        };

        const startDetection = async () => {
            let lastDetections = [];
            let isDetecting = false;

            const detect = async () => {
                if (!videoRef.current || !canvasRef.current) return;

                const video = videoRef.current;
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');

                // Set canvas size
                if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                }

                // Draw video frame
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Run detection every SKIP_FRAMES
                frameCountRef.current++;
                if (frameCountRef.current % SKIP_FRAMES === 0 && !isDetecting) {
                    isDetecting = true;

                    onnxModel.detect(video).then(results => {
                        lastDetections = results;
                        setDetections(results);

                        // Apply Smoothing Decision Algorithm
                        if (results.length > 0) {
                            const primaryDetection = results.reduce((prev, current) =>
                                (prev.confidence > current.confidence) ? prev : current
                            );

                            const newAlarmState = smoothingRef.current.addDetection(primaryDetection.label);
                            setAlarmState(newAlarmState);

                            const shouldAlert = smoothingRef.current.shouldTriggerAlarm();

                            if (onDetection) {
                                const stats = smoothingRef.current.getStatistics();
                                onDetection({
                                    detections: results,
                                    alarmState: newAlarmState,
                                    statistics: stats,
                                    triggerAlarm: shouldAlert
                                });
                            }
                        }

                        isDetecting = false;
                    }).catch(err => {
                        console.error('Detection error:', err);
                        isDetecting = false;
                    });
                }

                // Draw bounding boxes
                lastDetections.forEach(detection => {
                    const { x, y, width, height, label, confidence } = detection;
                    const color = onnxModel.getLabelColor(label);

                    ctx.strokeStyle = color;
                    ctx.lineWidth = 3;
                    ctx.strokeRect(x, y, width, height);

                    const labelText = `${label} ${(confidence * 100).toFixed(0)}%`;
                    ctx.font = 'bold 14px Inter';
                    const textMetrics = ctx.measureText(labelText);
                    const textHeight = 18;
                    const padding = 4;

                    ctx.fillStyle = color;
                    ctx.fillRect(x, y - textHeight - padding, textMetrics.width + padding * 2, textHeight + padding);

                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(labelText, x + padding, y - padding);
                });

                // Calculate FPS
                fpsCounterRef.current++;
                const now = Date.now();
                if (now - lastTimeRef.current >= 1000) {
                    setFps(fpsCounterRef.current);
                    fpsCounterRef.current = 0;
                    lastTimeRef.current = now;
                }

                animationFrameRef.current = requestAnimationFrame(detect);
            };

            detect();
        };

        initCamera();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [onDetection, selectedCamera]);

    const getAlarmColor = () => {
        switch (alarmState) {
            case 'ALARM_CRITICAL': return 'bg-red-600';
            case 'ALARM_WARNING': return 'bg-orange-500';
            case 'ALARM_CAUTION': return 'bg-yellow-500';
            default: return 'bg-green-600';
        }
    };

    const getAlarmText = () => {
        switch (alarmState) {
            case 'ALARM_CRITICAL': return 'NGUY HIỂM!';
            case 'ALARM_WARNING': return 'CẢNH BÁO';
            case 'ALARM_CAUTION': return 'CHÚ Ý';
            default: return 'AN TOÀN';
        }
    };

    if (error) {
        return (
            <div className="relative bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                <div className="text-center text-white p-6">
                    <span className="material-icons-round text-6xl text-red-500 mb-4">error</span>
                    <p className="text-lg font-semibold mb-2">Camera Error</p>
                    <p className="text-sm text-gray-400">{error}</p>
                    {availableCameras.length > 0 && (
                        <div className="mt-4">
                            <p className="text-xs text-gray-500 mb-2">Available cameras:</p>
                            {availableCameras.map((cam, idx) => (
                                <p key={idx} className="text-xs text-gray-400">{cam.label || `Camera ${idx + 1}`}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                    <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-lg font-semibold">Loading AI Model...</p>
                        <p className="text-sm text-gray-400 mt-2">Initializing camera and detection system</p>
                    </div>
                </div>
            )}

            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                playsInline
                muted
                style={{ display: 'none' }}
            />

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* FPS Counter */}
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-green-500/30">
                <span className="text-green-400 font-mono text-sm font-bold">FPS: {fps}</span>
            </div>

            {/* Alarm State Indicator */}
            <div className={`absolute top-3 left-1/2 transform -translate-x-1/2 ${getAlarmColor()} px-6 py-2 rounded-full shadow-lg ${alarmState !== 'NORMAL' ? 'animate-pulse' : ''}`}>
                <span className="text-white text-sm font-bold tracking-wider">{getAlarmText()}</span>
            </div>

            {/* Detection Status */}
            {detections.length > 0 && (
                <div className="absolute top-16 left-3 space-y-2 max-w-xs">
                    {detections.slice(0, 3).map((det, idx) => (
                        <div
                            key={idx}
                            className="bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg border-l-4 animate-slide-in"
                            style={{ borderColor: onnxModel.getLabelColor(det.label) }}
                        >
                            <p className="text-white font-bold text-sm uppercase tracking-wide">{det.label}</p>
                            <p className="text-gray-300 text-xs">{(det.confidence * 100).toFixed(0)}%</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Live Indicator */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-full shadow-lg">
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="text-white text-xs font-bold">LIVE</span>
            </div>

            {/* Camera Info */}
            {availableCameras.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs text-gray-300">
                    📷 {availableCameras.length} cameras detected
                </div>
            )}
        </div>
    );
}
