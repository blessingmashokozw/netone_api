import { Head, useForm, router } from '@inertiajs/react';
import * as React from 'react';
import jobCards from '@/routes/job-cards';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

interface Region {
    id: number;
    name: string;
}

interface AssignedTo {
    id: number;
    name: string;
    email: string;
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
}

interface IndexProps {
    jobCards: JobCard[];
    regions: Region[];
    employees: AssignedTo[];
    authUserId: number | null;
}

export default function JobCardsIndex({ jobCards: jobCardsData, regions, employees, authUserId }: IndexProps) {
    const [open, setOpen] = React.useState(false);
    const [filterOpen, setFilterOpen] = React.useState(false);
    
    const [filters, setFilters] = React.useState({
        status: '',
        region_id: '',
        given_to: '',
        date_from: '',
        date_to: '',
    });

    const { data, setData, post, processing, errors, reset } = useForm({
        description: '',
        region_id: '',
        given_to: '',
    });

    const applyFilters = () => {
        router.get(jobCards.index.url(), filters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            region_id: '',
            given_to: '',
            date_from: '',
            date_to: '',
        });
        router.get(jobCards.index.url(), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(jobCards.store.url(), {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };
    return (
        <>
            <Head title="Job Cards" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Job Cards</h1>
                        <p className="text-muted-foreground">Manage and track job cards</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setFilterOpen(!filterOpen)}
                            className="border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                            {filterOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                        </Button>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">Create Job Card</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Create Job Card</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details below to create a new job card
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="description" className="text-sm font-medium">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={4}
                                            className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Enter job description..."
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-destructive">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="region_id" className="text-sm font-medium">
                                            Region
                                        </label>
                                        <select
                                            id="region_id"
                                            value={data.region_id}
                                            onChange={(e) => setData('region_id', e.target.value)}
                                            className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="">Select a region</option>
                                            {regions.map((region) => (
                                                <option key={region.id} value={region.id}>
                                                    {region.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.region_id && (
                                            <p className="text-sm text-destructive">{errors.region_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="given_to" className="text-sm font-medium">
                                            Assign To
                                        </label>
                                        <select
                                            id="given_to"
                                            value={data.given_to}
                                            onChange={(e) => setData('given_to', e.target.value)}
                                            className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="">Select an employee</option>
                                            {employees.map((employee) => (
                                                <option key={employee.id} value={employee.id}>
                                                    {employee.name} ({employee.email})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.given_to && (
                                            <p className="text-sm text-destructive">{errors.given_to}</p>
                                        )}
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setOpen(false);
                                                reset();
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Creating...' : 'Create Job Card'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Filter Section */}
                {filterOpen && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <Filter className="w-5 h-5 text-blue-500" />
                                Filter Job Cards
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Clear All
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="filter-status" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Status
                                </label>
                                <select
                                    id="filter-status"
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="in progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="approved">Approved</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="filter-region" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Region
                                </label>
                                <select
                                    id="filter-region"
                                    value={filters.region_id}
                                    onChange={(e) => setFilters({ ...filters, region_id: e.target.value })}
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Regions</option>
                                    {regions.map((region) => (
                                        <option key={region.id} value={region.id}>
                                            {region.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="filter-assignee" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Assigned To
                                </label>
                                <select
                                    id="filter-assignee"
                                    value={filters.given_to}
                                    onChange={(e) => setFilters({ ...filters, given_to: e.target.value })}
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Employees</option>
                                    {employees.map((employee) => (
                                        <option key={employee.id} value={employee.id}>
                                            {employee.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="filter-date-from" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Date Range
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        id="filter-date-from"
                                        value={filters.date_from}
                                        onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                                        className="w-1/2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="date"
                                        value={filters.date_to}
                                        onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                                        className="w-1/2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <Button
                                onClick={applyFilters}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                )}

                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-sidebar-border/70 bg-muted/50 dark:border-sidebar-border">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Region</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Assigned To</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobCardsData.map((jobCard) => (
                                    <tr 
                                        key={jobCard.id} 
                                        className="border-b border-sidebar-border/50 hover:bg-muted/30 dark:border-sidebar-border cursor-pointer"
                                        onClick={() => window.location.href = jobCards.show.url({ job_card: jobCard.id })}
                                    >
                                        <td className="px-4 py-3 text-sm">{jobCard.id}</td>
                                        <td className="px-4 py-3 text-sm max-w-xs truncate">{jobCard.description}</td>
                                        <td className="px-4 py-3 text-sm">{jobCard.region?.name || '-'}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {jobCard.assigned_to ? (
                                                <div>
                                                    <div className="font-medium">{jobCard.assigned_to.name}</div>
                                                    <div className="text-xs text-muted-foreground">{jobCard.assigned_to.email}</div>
                                                </div>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                jobCard.status === 'pending' 
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    : jobCard.status === 'in progress'
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                    : jobCard.status === 'completed'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : jobCard.status === 'approved'
                                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                                    : jobCard.status === 'closed'
                                                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                            }`}>
                                                {jobCard.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{new Date(jobCard.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {jobCardsData.length === 0 && (
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <p>No job cards found</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

JobCardsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Job Cards',
            href: jobCards.index.url(),
        },
    ],
};
