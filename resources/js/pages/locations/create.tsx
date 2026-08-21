import { Head, useForm } from '@inertiajs/react';
import * as React from 'react';
import locations from '@/routes/locations';
import { Button } from '@/components/ui/button';
import MapPicker from '@/components/MapPicker';

interface Region {
    id: number;
    name: string;
}

interface CreateProps {
    regions: Region[];
}

export default function LocationCreate({ regions }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        latitude: '',
        longitude: '',
        region_id: '',
    });

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setData('latitude', position.coords.latitude.toString());
                    setData('longitude', position.coords.longitude.toString());
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get your location. Please enable location services or enter coordinates manually.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser. Please enter coordinates manually.');
        }
    };

    React.useEffect(() => {
        getCurrentLocation();
    }, []);

    const handleLocationChange = (lat: number, lng: number) => {
        setData('latitude', lat.toString());
        setData('longitude', lng.toString());
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(locations.store.url(), {
            onSuccess: () => {
                window.location.href = locations.index.url();
            },
        });
    };

    return (
        <>
            <Head title="Create Location" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Create Location</h1>
                        <p className="text-muted-foreground">Add a new location</p>
                    </div>
                    <Button variant="outline" onClick={() => window.location.href = locations.index.url()}>
                        Back
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6 max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="text-sm font-medium">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter location name"
                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                                required
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="region_id" className="text-sm font-medium">
                                Region
                            </label>
                            <select
                                id="region_id"
                                value={data.region_id}
                                onChange={(e) => setData('region_id', e.target.value)}
                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                            >
                                <option value="">Select a region</option>
                                {regions.map((region) => (
                                    <option key={region.id} value={region.id}>
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                            {errors.region_id && (
                                <p className="text-sm text-destructive mt-1">{errors.region_id}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="latitude" className="text-sm font-medium">
                                    Latitude
                                </label>
                                <input
                                    id="latitude"
                                    type="number"
                                    step="any"
                                    value={data.latitude}
                                    onChange={(e) => setData('latitude', e.target.value)}
                                    placeholder="Enter latitude or select on map"
                                    className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                                />
                                {errors.latitude && (
                                    <p className="text-sm text-destructive mt-1">{errors.latitude}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="longitude" className="text-sm font-medium">
                                    Longitude
                                </label>
                                <input
                                    id="longitude"
                                    type="number"
                                    step="any"
                                    value={data.longitude}
                                    onChange={(e) => setData('longitude', e.target.value)}
                                    placeholder="Enter longitude or select on map"
                                    className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                                />
                                {errors.longitude && (
                                    <p className="text-sm text-destructive mt-1">{errors.longitude}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={getCurrentLocation}
                                className="mb-2"
                            >
                                Use My Current Location
                            </Button>
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Select Location on Map
                            </label>
                            <p className="text-xs text-muted-foreground mt-1 mb-2">Click on the map to select coordinates</p>
                            <MapPicker
                                latitude={data.latitude ? parseFloat(data.latitude) : undefined}
                                longitude={data.longitude ? parseFloat(data.longitude) : undefined}
                                onLocationChange={handleLocationChange}
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Location'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.location.href = locations.index.url()}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

LocationCreate.layout = {
    breadcrumbs: [
        {
            title: 'Locations',
            href: locations.index.url(),
        },
        {
            title: 'Create',
        },
    ],
};
