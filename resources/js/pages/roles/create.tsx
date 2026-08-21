import { Head, useForm } from '@inertiajs/react';
import * as React from 'react';
import roles from '@/routes/roles';
import { Button } from '@/components/ui/button';

interface CreateProps {}

export default function RoleCreate({}: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(roles.store.url(), {
            onSuccess: () => {
                window.location.href = roles.index.url();
            },
        });
    };

    return (
        <>
            <Head title="Create Role" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Create Role</h1>
                        <p className="text-muted-foreground">Add a new role</p>
                    </div>
                    <Button variant="outline" onClick={() => window.location.href = roles.index.url()}>
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
                                placeholder="Enter role name"
                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                                required
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Role'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.location.href = roles.index.url()}
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

RoleCreate.layout = {
    breadcrumbs: [
        {
            title: 'Roles',
            href: roles.index.url(),
        },
        {
            title: 'Create',
        },
    ],
};
