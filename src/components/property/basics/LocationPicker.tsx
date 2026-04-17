import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

interface Props {
    initialCoords: { lat: number, lng: number };
    onChange: (coords: { lat: number, lng: number }) => void;
}

function MapEvents({ onChange }: { onChange: (c: { lat: number, lng: number }) => void }) {
    useMapEvents({
        click(e) {
            onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });
    return null;
}

export default function LocationPicker({ initialCoords, onChange }: Props) {
    const [position, setPosition] = useState(initialCoords);

    const handleMove = (coords: { lat: number, lng: number }) => {
        setPosition(coords);
        onChange(coords);
    };

    return (
        <MapContainer
            center={[position.lat, position.lng]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[position.lat, position.lng]} icon={DefaultIcon} />
            <MapEvents onChange={handleMove} />
        </MapContainer>
    );
}