import { Head, useForm } from '@inertiajs/react';
import * as React from 'react';
import regions from '@/routes/regions';
import { Button } from '@/components/ui/button';

interface Region {
    id: number;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface IndexProps {
    regionsData: Region[];
}

export default function RegionsIndex({ regionsData }: IndexProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this region?')) {
            destroy(regions.destroy.url({ region: id }), {
                onSuccess: () => {
                    window.location.reload();
                },
            });
        }
    };

    return (
        <>
            <Head title="Regions" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Regions</h1>
                        <p className="text-muted-foreground">Manage your regions</p>
                    </div>
                    <Button onClick={() => window.location.href = regions.create.url()}>
                        Add Region
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                                <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {regionsData.length > 0 ? (
                                regionsData.map((region) => (
                                    <tr key={region.id} className="border-b border-sidebar-border/70 dark:border-sidebar-border hover:bg-muted/50">
                                        <td className="px-6 py-4 text-sm">{region.name}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                region.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {region.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.location.href = regions.edit.url({ region: region.id })}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(region.id)}
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
                                    <td colSpan={3} className="px-6 py-8 text-center text-sm text-muted-foreground">
                                        No regions found. Click "Add Region" to create one.
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

RegionsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Regions',
        },
    ],
};
