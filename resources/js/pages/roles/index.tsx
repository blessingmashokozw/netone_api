import { Head, useForm } from '@inertiajs/react';
import * as React from 'react';
import roles from '@/routes/roles';
import { Button } from '@/components/ui/button';

interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

interface IndexProps {
    rolesData: Role[];
}

export default function RolesIndex({ rolesData }: IndexProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this role?')) {
            destroy(roles.destroy.url({ role: id }), {
                onSuccess: () => {
                    window.location.reload();
                },
            });
        }
    };

    return (
        <>
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Roles</h1>
                        <p className="text-muted-foreground">Manage user roles</p>
                    </div>
                    <Button onClick={() => window.location.href = roles.create.url()}>
                        Add Role
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                                <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Guard</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rolesData.length > 0 ? (
                                rolesData.map((role) => (
                                    <tr key={role.id} className="border-b border-sidebar-border/70 dark:border-sidebar-border hover:bg-muted/50">
                                        <td className="px-6 py-4 text-sm">{role.name}</td>
                                        <td className="px-6 py-4 text-sm">{role.guard_name}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.location.href = roles.edit.url({ role: role.id })}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(role.id)}
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
                                        No roles found. Click "Add Role" to create one.
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

RolesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Roles',
        },
    ],
};
