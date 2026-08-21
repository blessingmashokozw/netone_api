import { useState, useCallback, useEffect } from 'react';
import MapGL, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapPickerProps {
    latitude?: number;
    longitude?: number;
    onLocationChange: (latitude: number, longitude: number) => void;
}

export default function MapPicker({ latitude = -17.8292, longitude = 31.0522, onLocationChange }: MapPickerProps) {
    const [viewState, setViewState] = useState({
        latitude: latitude || -17.8292,
        longitude: longitude || 31.0522,
        zoom: 12,
    });

    useEffect(() => {
        if (latitude && longitude) {
            setViewState((prev) => ({ ...prev, latitude, longitude }));
        }
    }, [latitude, longitude]);

    const handleMapClick = useCallback((e: { lngLat: { lng: number; lat: number } }) => {
        const { lng, lat } = e.lngLat;
        setViewState((prev: typeof viewState) => ({ ...prev, latitude: lat, longitude: lng }));
        onLocationChange(lat, lng);
    }, [onLocationChange]);

    return (
        <div className="h-96 w-full rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
            <MapGL
                {...viewState}
                onMove={(evt: { viewState: typeof viewState }) => setViewState(evt.viewState)}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ''}
                onClick={handleMapClick}
                attributionControl={false}
            >
                {(latitude || viewState.latitude) && (longitude || viewState.longitude) && (
                    <Marker
                        latitude={latitude || viewState.latitude}
                        longitude={longitude || viewState.longitude}
                        anchor="bottom"
                    >
                        <div className="flex h-8 w-8 items-center justify-center">
                            <div className="h-8 w-8 rounded-full bg-red-500 border-4 border-white shadow-lg" />
                        </div>
                    </Marker>
                )}
            </MapGL>
        </div>
    );
}
