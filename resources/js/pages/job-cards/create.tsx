import { Head, useForm } from '@inertiajs/react';
import jobCards from '@/routes/job-cards';

interface Region {
    id: number;
    name: string;
    status: string;
}

interface Employee {
    id: number;
    name: string;
    email: string;
}

interface CreateProps {
    regions: Region[];
    employees: Employee[];
}

export default function CreateJobCard({ regions, employees }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        description: '',
        region_id: '',
        given_to: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(jobCards.store.url());
    };

    return (
        <>
            <Head title="Create Job Card" />
            <div className="mx-auto max-w-2xl space-y-6 rounded-xl p-6">
                <div>
                    <h1 className="text-2xl font-bold">Create Job Card</h1>
                    <p className="text-muted-foreground">Fill in the details below to create a new job card</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="rounded-md border border-sidebar-border/70 px-4 py-2 text-sm font-medium hover:bg-muted"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            {processing ? 'Creating...' : 'Create Job Card'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateJobCard.layout = {
    breadcrumbs: [
        {
            title: 'Job Cards',
            href: jobCards.index.url(),
        },
        {
            title: 'Create',
            href: jobCards.create.url(),
        },
    ],
};
