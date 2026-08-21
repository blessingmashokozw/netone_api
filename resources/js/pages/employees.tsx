import { Head, useForm } from '@inertiajs/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

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

interface EmployeesProps {
    users: User[];
    roles: Role[];
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    filters: {
        search: string | null;
        role: string | null;
        status: string | null;
    };
}

export default function Employees({ users, roles, totalEmployees, activeEmployees, inactiveEmployees, filters }: EmployeesProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState(filters.search || '');
    const [roleFilter, setRoleFilter] = React.useState(filters.role || '');
    const [statusFilter, setStatusFilter] = React.useState(filters.status || '');
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        ec_number: '',
        position: '',
        status: 'active',
        password: '',
        role: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/employees', {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (roleFilter) params.append('role', roleFilter);
        if (statusFilter) params.append('status', statusFilter);
        window.location.href = '/employees' + (params.toString() ? '?' + params.toString() : '');
    };

    const clearFilters = () => {
        setSearch('');
        setRoleFilter('');
        setStatusFilter('');
        window.location.href = '/employees';
    };

    return (
        <>
            <Head title="Employees" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Employees</h1>
                        <p className="text-muted-foreground">Manage users and their roles</p>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>Add Employee</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Add New Employee</DialogTitle>
                                <DialogDescription>
                                    Create a new user account and assign a role.
                                </DialogDescription>
                            </DialogHeader>
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
                                        <option value="">Select a role</option>
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
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter password"
                                        className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                                        required
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-destructive mt-1">{errors.password}</p>
                                    )}
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Employee'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium opacity-90">Total Employees</p>
                                <p className="text-3xl font-bold">{totalEmployees}</p>
                            </div>
                            <div className="text-4xl opacity-20">👥</div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium opacity-90">Active</p>
                                <p className="text-3xl font-bold">{activeEmployees}</p>
                            </div>
                            <div className="text-4xl opacity-20">✅</div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-gradient-to-br from-gray-500 to-slate-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium opacity-90">Inactive</p>
                                <p className="text-3xl font-bold">{inactiveEmployees}</p>
                            </div>
                            <div className="text-4xl opacity-20">⏸️</div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 bg-background">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label htmlFor="search" className="text-sm font-medium mb-2 block">
                                Search Employees
                            </label>
                            <input
                                id="search"
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or email..."
                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="role_filter" className="text-sm font-medium mb-2 block">
                                Filter by Role
                            </label>
                            <select
                                id="role_filter"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">All Roles</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="status_filter" className="text-sm font-medium mb-2 block">
                                Filter by Status
                            </label>
                            <select
                                id="status_filter"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full rounded-md border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
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

                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-sidebar-border/70 bg-muted/50 dark:border-sidebar-border">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">EC Number</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Position</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-sidebar-border/50 hover:bg-muted/30 dark:border-sidebar-border">
                                        <td className="px-4 py-3 text-sm font-medium">{user.name}</td>
                                        <td className="px-4 py-3 text-sm">{user.email}</td>
                                        <td className="px-4 py-3 text-sm">{user.ec_number || '-'}</td>
                                        <td className="px-4 py-3 text-sm">{user.position || '-'}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {user.roles.length > 0 ? (
                                                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                    {user.roles[0].name}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                user.status === 'active' 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                            }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.location.href = `/employees/${user.id}/edit`}
                                            >
                                                Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {users.length === 0 && (
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <p>No employees found</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Employees.layout = {
    breadcrumbs: [
        {
            title: 'Employees',
            href: '/employees',
        },
    ],
};
