import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { 
    Briefcase, 
    Users, 
    MapPin, 
    Building2, 
    Clock, 
    CheckCircle, 
    AlertCircle,
    TrendingUp,
    Activity
} from 'lucide-react';

interface DashboardProps {
    // Job Metrics
    totalJobs: number;
    pendingJobs: number;
    inProgressJobs: number;
    completedJobs: number;
    approvedJobs: number;
    closedJobs: number;
    jobsByStatus: Record<string, number>;
    jobsByRegion: Array<{ name: string; count: number }>;
    recentJobs: Array<{
        id: number;
        description: string;
        status: string;
        region: string;
        assigned_to: string;
        created_at: string;
    }>;
    jobsLast7Days: number;
    jobsLast30Days: number;

    // Region Metrics
    totalRegions: number;
    activeRegions: number;

    // Location Metrics
    totalLocations: number;

    // User Metrics
    totalUsers: number;
    activeUsers: number;
}

export default function Dashboard({
    totalJobs,
    pendingJobs,
    inProgressJobs,
    completedJobs,
    approvedJobs,
    closedJobs,
    jobsByStatus,
    jobsByRegion,
    recentJobs,
    jobsLast7Days,
    jobsLast30Days,
    totalRegions,
    activeRegions,
    totalLocations,
    totalUsers,
    activeUsers,
}: DashboardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'in progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'approved':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'closed':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'in progress':
                return <Activity className="w-4 h-4" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4" />;
            case 'approved':
                return <CheckCircle className="w-4 h-4" />;
            case 'closed':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of system metrics and job card statistics</p>
                </div>

                {/* Job Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total Jobs</p>
                                <p className="text-3xl font-bold mt-2">{totalJobs}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Briefcase className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-blue-100">
                            <TrendingUp className="w-4 h-4" />
                            <span>+{jobsLast7Days} this week</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-100 text-sm font-medium">Completed</p>
                                <p className="text-3xl font-bold mt-2">{completedJobs}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-emerald-100">
                            <span>{((completedJobs / totalJobs) * 100).toFixed(1)}% completion rate</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-100 text-sm font-medium">Pending</p>
                                <p className="text-3xl font-bold mt-2">{pendingJobs}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-amber-100">
                            <span>{((pendingJobs / totalJobs) * 100).toFixed(1)}% pending</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">In Progress</p>
                                <p className="text-3xl font-bold mt-2">{inProgressJobs}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Activity className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-purple-100">
                            <span>{((inProgressJobs / totalJobs) * 100).toFixed(1)}% active</span>
                        </div>
                    </div>
                </div>

                {/* System Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Regions</p>
                                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{totalRegions}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">{activeRegions} active</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Locations</p>
                                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{totalLocations}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Users</p>
                                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{totalUsers}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">{activeUsers} active</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Last 30 Days</p>
                                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{jobsLast30Days}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">new jobs</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts and Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Jobs by Status */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Jobs by Status</h3>
                        <div className="space-y-3">
                            {Object.entries(jobsByStatus).map(([status, count]) => (
                                <div key={status} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white">
                                        {getStatusIcon(status)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{status}</span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400">{count}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${status === 'pending' ? 'bg-amber-500' : status === 'in progress' ? 'bg-blue-500' : status === 'completed' ? 'bg-emerald-500' : status === 'approved' ? 'bg-purple-500' : 'bg-gray-500'}`}
                                                style={{ width: `${(count / totalJobs) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Jobs by Region */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Jobs by Region</h3>
                        <div className="space-y-3">
                            {jobsByRegion.map((region) => (
                                <div key={region.name} className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                        {region.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{region.name}</span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400">{region.count}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                                style={{ width: `${(region.count / totalJobs) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Jobs */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Jobs</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">ID</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Description</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Region</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Assigned To</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentJobs.map((job) => (
                                    <tr key={job.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100 font-medium">#{job.id}</td>
                                        <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 max-w-xs truncate">{job.description}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(job.status)}`}>
                                                {getStatusIcon(job.status)}
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{job.region}</td>
                                        <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{job.assigned_to}</td>
                                        <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{job.created_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
