import { Head, useForm, Link } from '@inertiajs/react';
import * as React from 'react';
import locations from '@/routes/locations';
import { Button } from '@/components/ui/button';

interface Region {
    id: number;
    name: string;
}

interface Location {
    id: number;
    name: string;
    latitude: number | string | null;
    longitude: number | string | null;
    region_id: number | null;
    region?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

interface IndexProps {
    locationsData: Location[];
    regions: Region[];
    totalRegions: number;
    totalLocations: number;
    filters: {
        search: string | null;
        region_id: string | null;
    };
}

export default function LocationsIndex({ locationsData, regions, totalRegions, totalLocations, filters }: IndexProps) {
    const { delete: destroy, processing } = useForm();
    const [search, setSearch] = React.useState(filters.search || '');
    const [regionId, setRegionId] = React.useState(filters.region_id || '');

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this location?')) {
            destroy(locations.destroy.url({ location: id }), {
                onSuccess: () => {
                    window.location.reload();
                },
            });
        }
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (regionId) params.append('region_id', regionId);
        window.location.href = locations.index.url() + (params.toString() ? '?' + params.toString() : '');
    };

    const clearFilters = () => {
        setSearch('');
        setRegionId('');
        window.location.href = locations.index.url();
    };

    return (
        <>
            <Head title="Locations" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Locations</h1>
                        <p className="text-muted-foreground">Manage your locations</p>
                    </div>
                    <Button onClick={() => window.location.href = locations.create.url()}>
                        Add Location
                    </Button>
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium opacity-90">Total Regions</p>
                                <p className="text-3xl font-bold">{totalRegions}</p>
                            </div>
                            <div className="text-4xl opacity-20">🗺️</div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium opacity-90">Total Locations</p>
                                <p className="text-3xl font-bold">{totalLocations}</p>
                            </div>
                            <div className="text-4xl opacity-20">📍</div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 bg-background">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label htmlFor="search" className="text-sm font-medium mb-2 block">
                                Search Locations
                            </label>
                            <input
                                id="search"
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name..."
                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="region_filter" className="text-sm font-medium mb-2 block">
                                Filter by Region
                            </label>
                            <select
                                id="region_filter"
                                value={regionId}
                                onChange={(e) => setRegionId(e.target.value)}
                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">All Regions</option>
                                {regions.map((region) => (
                                    <option key={region.id} value={region.id}>
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end gap-2">
                            <Button onClick={applyFilters} className="bg-gradient-to-r from-blue-500 to-indigo-600">
                                Apply Filters
                            </Button>
                            <Button onClick={clearFilters} variant="outline">
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                                <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Region</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Latitude</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Longitude</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locationsData.length > 0 ? (
                                locationsData.map((location) => (
                                    <tr key={location.id} className="border-b border-sidebar-border/70 dark:border-sidebar-border hover:bg-muted/50">
                                        <td className="px-6 py-4 text-sm">{location.name}</td>
                                        <td className="px-6 py-4 text-sm">
                                            {location.region ? location.region.name : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {location.latitude ? parseFloat(location.latitude).toFixed(6) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {location.longitude ? parseFloat(location.longitude).toFixed(6) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.location.href = locations.edit.url({ location: location.id })}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(location.id)}
                                                    disabled={processing}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">
                                        No locations found. Click "Add Location" to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

LocationsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Locations',
        },
    ],
};
