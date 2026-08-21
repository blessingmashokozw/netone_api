import { Head, useForm } from '@inertiajs/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';

interface Role {
    id: number;
    name: string;
    guard_name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    ec_number: string | null;
    position: string | null;
    status: string;
    roles: Array<{ name: string }>;
}

interface EditProps {
    user: User;
    roles: Role[];
}

export default function EmployeeEdit({ user, roles }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        ec_number: user.ec_number || '',
        position: user.position || '',
        status: user.status,
        password: '',
        role: user.roles.length > 0 ? user.roles[0].name : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/employees/${user.id}`, {
            onSuccess: () => {
                window.location.href = '/employees';
            },
        });
    };

    return (
        <>
            <Head title="Edit Employee" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Edit Employee</h1>
                        <p className="text-muted-foreground">Update user details and role</p>
                    </div>
                    <Button variant="outline" onClick={() => window.location.href = '/employees'}>
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
                                placeholder="Enter name"
                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                                required
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Enter email"
                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                                required
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="ec_number" className="text-sm font-medium">
                                EC Number
                            </label>
                            <input
                                id="ec_number"
                                type="text"
                                value={data.ec_number}
                                onChange={(e) => setData('ec_number', e.target.value)}
                                placeholder="Enter EC number"
                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                            />
                            {errors.ec_number && (
                                <p className="text-sm text-destructive mt-1">{errors.ec_number}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="position" className="text-sm font-medium">
                                Position
                            </label>
                            <input
                                id="position"
                                type="text"
                                value={data.position}
                                onChange={(e) => setData('position', e.target.value)}
                                placeholder="Enter position"
                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                            />
                            {errors.position && (
                                <p className="text-sm text-destructive mt-1">{errors.position}</p>
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
                                <option value="inactive">Inactive</option>
                            </select>
                            {errors.status && (
                                <p className="text-sm text-destructive mt-1">{errors.status}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="role" className="text-sm font-medium">
                                Role
                            </label>
                            <select
                                id="role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                                required
                            >
                                {roles.map((role) => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            {errors.role && (
                                <p className="text-sm text-destructive mt-1">{errors.role}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="text-sm font-medium">
                                Password (leave blank to keep current)
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter new password"
                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Employee'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.location.href = '/employees'}
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

EmployeeEdit.layout = {
    breadcrumbs: [
        {
            title: 'Employees',
            href: '/employees',
        },
        {
            title: 'Edit',
        },
    ],
};
