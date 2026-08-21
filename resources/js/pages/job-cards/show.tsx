import { Head, useForm, usePage } from '@inertiajs/react';
import * as React from 'react';
import jobCards from '@/routes/job-cards';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Info, Car, MapPin, Activity, Building2, Calendar, User, Fuel, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Region {
    id: number;
    name: string;
}

interface AssignedTo {
    id: number;
    name: string;
    email: string;
}

interface Vehicle {
    id: number;
    job_id: number;
    vehicle_number: string;
    mileage: number;
    fuel_drawn: number;
    created_at: string;
    updated_at: string;
}

interface Location {
    id: number;
    name: string;
    latitude: number | null;
    longitude: number | null;
    created_at: string;
    updated_at: string;
}

interface Movement {
    id: number;
    job_id: number;
    departure_location_id: number;
    departure_time: string;
    departure_mileage: number;
    arrival_location_id: number | null;
    arrival_time: string | null;
    arrival_mileage: number | null;
    departure_latitude: number | null;
    departure_longitude: number | null;
    arrival_latitude: number | null;
    arrival_longitude: number | null;
    departure_location: Location;
    arrival_location: Location | null;
    created_at: string;
    updated_at: string;
}

interface SiteItem {
    id: number;
    name: string;
    data_type: string;
    optional: number;
    is_active: number;
    created_at: string;
    updated_at: string;
}

interface SiteStatus {
    id: number;
    job_id: number;
    site_item_id: number;
    location_id: number;
    value: string;
    recorded_at: string;
    created_at: string;
    updated_at: string;
    site_item: SiteItem;
    location: Location;
}

interface JobCard {
    id: number;
    description: string;
    region_id: number;
    given_to: number | null;
    status: string;
    comments: string;
    work_perfomed: string | null;
    created_at: string;
    updated_at: string;
    region: Region;
    assigned_to: AssignedTo | null;
    vehicles: Vehicle[];
    movements: Movement[];
    site_status: SiteStatus[];
}

interface ShowProps {
    jobCard: any;
    authUserId: number | null;
    locations: Location[];
}

export default function JobCardShow({ jobCard, authUserId, locations }: ShowProps) {
    const { data: updateData, setData: setUpdateData, put: update, processing: updateProcessing, errors: updateErrors, reset: updateReset } = useForm({
        work_perfomed: jobCard.work_perfomed || '',
        comments: jobCard.comments || '',
    });

    const { data: vehicleData, setData: setVehicleData, post: postVehicle, processing: vehicleProcessing, errors: vehicleErrors, reset: vehicleReset } = useForm({
        job_id: jobCard.id.toString(),
        vehicle_number: '',
        mileage: '',
        fuel_drawn: '',
    });

    const { data: movementData, setData: setMovementData, post: postMovement, processing: movementProcessing, errors: movementErrors, reset: movementReset } = useForm({
        job_id: jobCard.id.toString(),
        departure_location_id: '',
        departure_time: '',
        departure_mileage: '',
        arrival_location_id: '',
        arrival_time: '',
        arrival_mileage: '',
    });

    // Group site status by location
    const groupedSiteStatus = jobCard.site_status?.reduce((acc, status) => {
        const locationName = status.location?.name || 'Unknown';
        if (!acc[locationName]) {
            acc[locationName] = [];
        }
        acc[locationName].push(status);
        return acc;
    }, {} as Record<string, SiteStatus[]>);

    // Modal states
    const [updateWorkOpen, setUpdateWorkOpen] = React.useState(false);
    const [addVehicleOpen, setAddVehicleOpen] = React.useState(false);
    const [addMovementOpen, setAddMovementOpen] = React.useState(false);

    const handleUpdateWork = (e: React.FormEvent) => {
        e.preventDefault();
        update(jobCards.update.url({ job_card: jobCard.id }), {
            onSuccess: () => {
                updateReset();
                setUpdateWorkOpen(false);
            },
        });
    };

    const handleAddVehicle = (e: React.FormEvent) => {
        e.preventDefault();
        postVehicle('/api/job-vehicles', {
            onSuccess: () => {
                vehicleReset();
                setAddVehicleOpen(false);
                window.location.reload();
            },
        });
    };

    const handleAddMovement = (e: React.FormEvent) => {
        e.preventDefault();
        postMovement('/api/job-movements', {
            onSuccess: () => {
                movementReset();
                setAddMovementOpen(false);
                window.location.reload();
            },
        });
    };

    return (
        <>
            <Head title={`Job Card #${jobCard.id}`} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-2">
                <div className="max-w-8xl mx-auto">
                    {/* Header */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <Activity className="w-8 h-8" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Job Card #{jobCard.id}</h1>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Created {new Date(jobCard.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" onClick={() => window.history.back()} className="border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                                Back
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Job Information Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Info className="w-5 h-5 text-white" />
                                        <h2 className="text-lg font-semibold text-white">Job Information</h2>
                                    </div>
                                    {authUserId === jobCard.given_to && (
                                        <Dialog open={updateWorkOpen} onOpenChange={setUpdateWorkOpen}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Update
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Update Work</DialogTitle>
                                                    <DialogDescription>Update work performed and add comments</DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={handleUpdateWork} className="space-y-4">
                                                    <div>
                                                        <label htmlFor="work_perfomed" className="text-sm font-medium">
                                                            Work Performed
                                                        </label>
                                                        <textarea
                                                            id="work_perfomed"
                                                            value={updateData.work_perfomed}
                                                            onChange={(e) => setUpdateData('work_perfomed', e.target.value)}
                                                            rows={4}
                                                            className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                                                            placeholder="Describe the work performed..."
                                                        />
                                                        {updateErrors.work_perfomed && (
                                                            <p className="text-sm text-destructive mt-1">{updateErrors.work_perfomed}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label htmlFor="comments" className="text-sm font-medium">
                                                            Comments
                                                        </label>
                                                        <textarea
                                                            id="comments"
                                                            value={updateData.comments}
                                                            onChange={(e) => setUpdateData('comments', e.target.value)}
                                                            rows={3}
                                                            className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                                                            placeholder="Add any additional comments..."
                                                        />
                                                        {updateErrors.comments && (
                                                            <p className="text-sm text-destructive mt-1">{updateErrors.comments}</p>
                                                        )}
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="submit" disabled={updateProcessing}>
                                                            {updateProcessing ? 'Updating...' : 'Update'}
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <tbody>
                                            <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-4 px-4 text-sm font-medium text-slate-500 dark:text-slate-400 w-1/3">Description</td>
                                                <td className="py-4 px-4 text-sm text-slate-900 dark:text-slate-100">{jobCard.description}</td>
                                            </tr>
                                            <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-4 px-4 text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                    <Building2 className="w-4 h-4" />
                                                    Region
                                                </td>
                                                <td className="py-4 px-4 text-sm text-slate-900 dark:text-slate-100">{jobCard.region?.name || '-'}</td>
                                            </tr>
                                            <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-4 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Status</td>
                                                <td className="py-4 px-4 text-sm">
                                                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                                                        jobCard.status === 'active' 
                                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                                            : jobCard.status === 'completed'
                                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                    }`}>
                                                        <span className={`w-2 h-2 rounded-full ${
                                                            jobCard.status === 'active' ? 'bg-emerald-500' : 
                                                            jobCard.status === 'completed' ? 'bg-blue-500' : 'bg-amber-500'
                                                        } animate-pulse`}></span>
                                                        {jobCard.status.charAt(0).toUpperCase() + jobCard.status.slice(1)}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-4 px-4 text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    Assigned To
                                                </td>
                                                <td className="py-4 px-4 text-sm text-slate-900 dark:text-slate-100">
                                                    {jobCard.assigned_to ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                                {jobCard.assigned_to.name.charAt(0)}
                                                            </div>
                                                            <span>{jobCard.assigned_to.name}</span>
                                                        </div>
                                                    ) : '-'}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-4 px-4 text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    Created
                                                </td>
                                                <td className="py-4 px-4 text-sm text-slate-900 dark:text-slate-100">{new Date(jobCard.created_at).toLocaleString()}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Vehicles Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Car className="w-5 h-5 text-white" />
                                        <h2 className="text-lg font-semibold text-white">Vehicles</h2>
                                    </div>
                                    {authUserId === jobCard.given_to && (
                                        <Dialog open={addVehicleOpen} onOpenChange={setAddVehicleOpen}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add Vehicle
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Add Vehicle</DialogTitle>
                                                    <DialogDescription>Add a vehicle to this job card</DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={handleAddVehicle} className="space-y-4">
                                                    <div>
                                                        <label className="text-sm font-medium">Vehicle Number</label>
                                                        <input
                                                            type="text"
                                                            value={vehicleData.vehicle_number}
                                                            onChange={(e) => setVehicleData('vehicle_number', e.target.value)}
                                                            placeholder="Enter vehicle number"
                                                            className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                                                            required
                                                        />
                                                        {vehicleErrors.vehicle_number && (
                                                            <p className="text-sm text-destructive mt-1">{vehicleErrors.vehicle_number}</p>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-sm font-medium">Mileage (km)</label>
                                                            <input
                                                                type="number"
                                                                value={vehicleData.mileage}
                                                                onChange={(e) => setVehicleData('mileage', e.target.value)}
                                                                placeholder="Enter mileage"
                                                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                                                                required
                                                            />
                                                            {vehicleErrors.mileage && (
                                                                <p className="text-sm text-destructive mt-1">{vehicleErrors.mileage}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="text-sm font-medium">Fuel Drawn (L)</label>
                                                            <input
                                                                type="number"
                                                                value={vehicleData.fuel_drawn}
                                                                onChange={(e) => setVehicleData('fuel_drawn', e.target.value)}
                                                                placeholder="Enter fuel drawn"
                                                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                                                            />
                                                            {vehicleErrors.fuel_drawn && (
                                                                <p className="text-sm text-destructive mt-1">{vehicleErrors.fuel_drawn}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="submit" disabled={vehicleProcessing}>
                                                            {vehicleProcessing ? 'Adding...' : 'Add Vehicle'}
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                                <th className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-left">Vehicle No</th>
                                                <th className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-left">Mileage</th>
                                                <th className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-left">Fuel Drawn</th>
                                                <th className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-left">Added</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobCard.vehicles && jobCard.vehicles.length > 0 ? (
                                                jobCard.vehicles.map((vehicle) => (
                                                    <tr key={vehicle.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="px-4 py-4 text-sm text-slate-900 dark:text-slate-100 font-medium">{vehicle.vehicle_number}</td>
                                                        <td className="px-4 py-4 text-sm text-slate-700 dark:text-slate-300">{vehicle.mileage} km</td>
                                                        <td className="px-4 py-4 text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                            <Fuel className="w-4 h-4 text-amber-500" />
                                                            {vehicle.fuel_drawn}L
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(vehicle.created_at).toLocaleDateString()}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="px-4 py-12 text-center">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                                                <Car className="w-6 h-6 text-slate-400" />
                                                            </div>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">No vehicles added yet</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Movements Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-white" />
                                        <h2 className="text-lg font-semibold text-white">Movements</h2>
                                    </div>
                                    {authUserId === jobCard.given_to && (
                                        <Dialog open={addMovementOpen} onOpenChange={setAddMovementOpen}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add Movement
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Add Movement</DialogTitle>
                                                    <DialogDescription>Add a movement record to this job card</DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={handleAddMovement} className="space-y-4">
                                                    <div className="space-y-3">
                                                        <label className="text-sm font-medium">Departure</label>
                                                        <div>
                                                            <select
                                                                value={movementData.departure_location_id}
                                                                onChange={(e) => setMovementData('departure_location_id', e.target.value)}
                                                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                                required
                                                            >
                                                                <option value="">Select departure location</option>
                                                                {locations.map((location) => (
                                                                    <option key={location.id} value={location.id.toString()}>
                                                                        {location.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {movementErrors.departure_location_id && (
                                                                <p className="text-sm text-destructive mt-1">{movementErrors.departure_location_id}</p>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <input
                                                                    type="datetime-local"
                                                                    value={movementData.departure_time}
                                                                    onChange={(e) => setMovementData('departure_time', e.target.value)}
                                                                    className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                                    required
                                                                />
                                                                {movementErrors.departure_time && (
                                                                    <p className="text-sm text-destructive mt-1">{movementErrors.departure_time}</p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <input
                                                                    type="number"
                                                                    value={movementData.departure_mileage}
                                                                    onChange={(e) => setMovementData('departure_mileage', e.target.value)}
                                                                    placeholder="Mileage (km)"
                                                                    className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                                    required
                                                                />
                                                                {movementErrors.departure_mileage && (
                                                                    <p className="text-sm text-destructive mt-1">{movementErrors.departure_mileage}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3 pt-3 border-t">
                                                        <label className="text-sm font-medium">Arrival</label>
                                                        <div>
                                                            <select
                                                                value={movementData.arrival_location_id}
                                                                onChange={(e) => setMovementData('arrival_location_id', e.target.value)}
                                                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                            >
                                                                <option value="">Select arrival location (optional)</option>
                                                                {locations.map((location) => (
                                                                    <option key={location.id} value={location.id.toString()}>
                                                                        {location.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {movementErrors.arrival_location_id && (
                                                                <p className="text-sm text-destructive mt-1">{movementErrors.arrival_location_id}</p>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <input
                                                                    type="datetime-local"
                                                                    value={movementData.arrival_time}
                                                                    onChange={(e) => setMovementData('arrival_time', e.target.value)}
                                                                    className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                                />
                                                                {movementErrors.arrival_time && (
                                                                    <p className="text-sm text-destructive mt-1">{movementErrors.arrival_time}</p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <input
                                                                    type="number"
                                                                    value={movementData.arrival_mileage}
                                                                    onChange={(e) => setMovementData('arrival_mileage', e.target.value)}
                                                                    placeholder="Mileage (km)"
                                                                    className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                                />
                                                                {movementErrors.arrival_mileage && (
                                                                    <p className="text-sm text-destructive mt-1">{movementErrors.arrival_mileage}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="submit" disabled={movementProcessing}>
                                                            {movementProcessing ? 'Adding...' : 'Add Movement'}
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                                <th className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-left">Route</th>
                                                <th className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-left">Departure</th>
                                                <th className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-left">Dep. Mileage</th>
                                                <th className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-left">Arrival</th>
                                                <th className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-left">Arr. Mileage</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobCard.movements && jobCard.movements.length > 0 ? (
                                                jobCard.movements.map((movement) => (
                                                    <tr key={movement.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="px-4 py-4 text-sm text-slate-900 dark:text-slate-100 font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-4 h-4 text-purple-500" />
                                                                {movement.departure_location?.name || 'Unknown'} → {movement.arrival_location?.name || 'Not arrived'}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-slate-700 dark:text-slate-300">{new Date(movement.departure_time).toLocaleString()}</td>
                                                        <td className="px-4 py-4 text-sm text-slate-700 dark:text-slate-300">{movement.departure_mileage} km</td>
                                                        <td className="px-4 py-4 text-sm text-slate-700 dark:text-slate-300">
                                                            {movement.arrival_time ? new Date(movement.arrival_time).toLocaleString() : <span className="text-slate-400 italic">Pending</span>}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-slate-700 dark:text-slate-300">{movement.arrival_mileage || '-'} km</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="px-4 py-12 text-center">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                                                <MapPin className="w-6 h-6 text-slate-400" />
                                                            </div>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">No movements recorded yet</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Site Status Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Settings className="w-5 h-5 text-white" />
                                    <h2 className="text-lg font-semibold text-white">Site Status</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                {groupedSiteStatus && Object.keys(groupedSiteStatus).length > 0 ? (
                                    <div className="space-y-6">
                                        {Object.entries(groupedSiteStatus).map(([locationName, statuses]) => (
                                            <div key={locationName} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                                    <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-amber-500" />
                                                        {locationName}
                                                    </h3>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full border-collapse table-fixed">
                                                        <colgroup>
                                                            <col className="w-[40%]" />
                                                            <col className="w-[30%]" />
                                                            <col className="w-[30%]" />
                                                        </colgroup>
                                                        <thead>
                                                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                                                <th className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-left">Site Item</th>
                                                                <th className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-left">Value</th>
                                                                <th className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-left">Recorded At</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {statuses.map((status) => (
                                                                <tr key={status.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors last:border-0">
                                                                    <td className="px-4 py-4 text-sm text-slate-900 dark:text-slate-100 font-medium flex items-center gap-2">
                                                                        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white text-xs flex-shrink-0">
                                                                            {status.site_item?.name?.charAt(0) || '?'}
                                                                        </div>
                                                                        <span className="truncate">{status.site_item?.name || '-'}</span>
                                                                    </td>
                                                                    <td className="px-4 py-4 text-sm text-slate-700 dark:text-slate-300">
                                                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-semibold">
                                                                            {status.value || '-'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                                        {status.recorded_at ? new Date(status.recorded_at).toLocaleString() : '-'}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 py-12">
                                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                            <Settings className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">No site status recorded yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

JobCardShow.layout = {
    breadcrumbs: [
        {
            title: 'Job Cards',
            href: jobCards.index.url(),
        },
        {
            title: 'Details',
        },
    ],
};
