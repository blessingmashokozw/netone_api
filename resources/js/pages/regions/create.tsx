import { Head, useForm } from '@inertiajs/react';
import * as React from 'react';
import regions from '@/routes/regions';
import { Button } from '@/components/ui/button';

interface CreateProps {}

export default function RegionCreate({}: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        status: 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(regions.store.url(), {
            onSuccess: () => {
                window.location.href = regions.index.url();
            },
        });
    };

    return (
        <>
            <Head title="Create Region" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Create Region</h1>
                        <p className="text-muted-foreground">Add a new region</p>
                    </div>
                    <Button variant="outline" onClick={() => window.location.href = regions.index.url()}>
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
                                placeholder="Enter region name"
                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                                required
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="status" className="text-sm font-medium">
                                Status
                            </label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                                required
                            >
                                <option value="active">Active</option>
                                <option value="deactivated">Deactivated</option>
                            </select>
                            {errors.status && (
                                <p className="text-sm text-destructive mt-1">{errors.status}</p>
                            )}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Region'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.location.href = regions.index.url()}
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

RegionCreate.layout = {
    breadcrumbs: [
        {
            title: 'Regions',
            href: regions.index.url(),
        },
        {
            title: 'Create',
        },
    ],
};
