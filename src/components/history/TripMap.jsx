import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons based on event type
const getMarkerIcon = (eventType) => {
    const colors = {
        'drowsy': '#ef4444',
        'head drop': '#dc2626',
        'phone': '#f97316',
        'smoking': '#ea580c',
        'distracted': '#f59e0b',
        'yawn': '#eab308',
        'awake': '#22c55e'
    };

    const color = colors[eventType] || '#6b7280';

    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                background-color: ${color};
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

const getVietnameseLabel = (label) => {
    const labels = {
        'awake': 'Tỉnh táo',
        'distracted': 'Mất tập trung',
        'drowsy': 'Buồn ngủ',
        'head drop': 'Gục đầu',
        'phone': 'Dùng điện thoại',
        'smoking': 'Hút thuốc',
        'yawn': 'Ngáp'
    };
    return labels[label] || label;
};

export default function TripMap({ logs }) {
    // Filter logs that have GPS location
    const logsWithLocation = logs.filter(log => log.gps_location);

    if (logsWithLocation.length === 0) {
        return (
            <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <div className="text-center p-6">
                    <span className="material-icons-round text-5xl text-slate-300 dark:text-slate-600 mb-2">location_off</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Không có dữ liệu GPS cho chuyến đi này
                    </p>
                </div>
            </div>
        );
    }

    // Parse GPS coordinates
    const markers = logsWithLocation.map(log => {
        const [lat, lng] = log.gps_location.split(',').map(parseFloat);
        return {
            ...log,
            position: [lat, lng]
        };
    });

    // Calculate center of map (average of all positions)
    const center = markers.length > 0
        ? [
            markers.reduce((sum, m) => sum + m.position[0], 0) / markers.length,
            markers.reduce((sum, m) => sum + m.position[1], 0) / markers.length
        ]
        : [10.762622, 106.660172]; // Default to HCMC

    return (
        <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map((marker, idx) => (
                    <Marker
                        key={idx}
                        position={marker.position}
                        icon={getMarkerIcon(marker.event_type)}
                    >
                        <Popup>
                            <div className="p-2">
                                <h4 className="font-bold text-sm mb-1">
                                    {getVietnameseLabel(marker.event_type)}
                                </h4>
                                <p className="text-xs text-gray-600">
                                    Độ tin cậy: {(marker.confidence * 100).toFixed(0)}%
                                </p>
                                <p className="text-xs text-gray-600">
                                    {new Date(marker.timestamp).toLocaleString('vi-VN')}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
