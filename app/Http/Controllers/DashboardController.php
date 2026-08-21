<?php

namespace App\Http\Controllers;

use App\Models\JobCard;
use App\Models\Region;
use App\Models\Location;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with metrics.
     */
    public function index()
    {
        // Job Card Metrics
        $totalJobs = JobCard::count();
        $pendingJobs = JobCard::where('status', 'pending')->count();
        $inProgressJobs = JobCard::where('status', 'in progress')->count();
        $completedJobs = JobCard::where('status', 'completed')->count();
        $approvedJobs = JobCard::where('status', 'approved')->count();
        $closedJobs = JobCard::where('status', 'closed')->count();

        // Jobs by Status
        $jobsByStatus = [
            'pending' => $pendingJobs,
            'in_progress' => $inProgressJobs,
            'completed' => $completedJobs,
            'approved' => $approvedJobs,
            'closed' => $closedJobs,
        ];

        // Jobs by Region
        $jobsByRegion = JobCard::select('regions.name', \DB::raw('COUNT(*) as count'))
            ->join('regions', 'job_cards.region_id', '=', 'regions.id')
            ->groupBy('regions.id', 'regions.name')
            ->orderBy('count', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'count' => $item->count,
                ];
            })
            ->toArray();

        // Recent Jobs (last 7 days)
        $recentJobs = JobCard::with(['region', 'assignedTo'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'description' => $job->description,
                    'status' => $job->status,
                    'region' => $job->region->name ?? 'N/A',
                    'assigned_to' => $job->assignedTo->name ?? 'Unassigned',
                    'created_at' => $job->created_at->format('M d, Y'),
                ];
            })
            ->toArray();

        // Region Metrics
        $totalRegions = Region::count();
        $activeRegions = Region::where('status', 'active')->count();

        // Location Metrics
        $totalLocations = Location::count();

        // User Metrics
        $totalUsers = User::count();
        $activeUsers = User::where('status', 'active')->count();

        // Jobs created in last 7 days
        $jobsLast7Days = JobCard::where('created_at', '>=', now()->subDays(7))->count();

        // Jobs created in last 30 days
        $jobsLast30Days = JobCard::where('created_at', '>=', now()->subDays(30))->count();

        return inertia('dashboard', [
            // Job Metrics
            'totalJobs' => $totalJobs,
            'pendingJobs' => $pendingJobs,
            'inProgressJobs' => $inProgressJobs,
            'completedJobs' => $completedJobs,
            'approvedJobs' => $approvedJobs,
            'closedJobs' => $closedJobs,
            'jobsByStatus' => $jobsByStatus,
            'jobsByRegion' => $jobsByRegion,
            'recentJobs' => $recentJobs,
            'jobsLast7Days' => $jobsLast7Days,
            'jobsLast30Days' => $jobsLast30Days,

            // Region Metrics
            'totalRegions' => $totalRegions,
            'activeRegions' => $activeRegions,

            // Location Metrics
            'totalLocations' => $totalLocations,

            // User Metrics
            'totalUsers' => $totalUsers,
            'activeUsers' => $activeUsers,
        ]);
    }
}
