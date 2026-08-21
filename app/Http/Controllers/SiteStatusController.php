<?php

namespace App\Http\Controllers;

use App\Models\SiteStatus;
use App\Models\SiteItem;
use Illuminate\Http\Request;

class SiteStatusController extends Controller
{
    /**
     * Store site statuses for a job.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_id' => 'required|exists:job_cards,id',
            'statuses' => 'required|array',
            'statuses.*.site_item_id' => 'required|exists:site_items,id',
            'statuses.*.location_id' => 'nullable|exists:locations,id',
            'statuses.*.value' => 'required|string',
        ]);

        $statuses = [];
        foreach ($validated['statuses'] as $statusData) {
            $status = SiteStatus::updateOrCreate(
                [
                    'job_id' => $validated['job_id'],
                    'site_item_id' => $statusData['site_item_id'],
                    'location_id' => $statusData['location_id'] ?? null,
                ],
                [
                    'value' => $statusData['value'],
                    'recorded_at' => now(),
                ]
            );
            $statuses[] = $status->load('siteItem', 'location');
        }

        return response()->json($statuses, 201);
    }

    /**
     * Get site statuses for a specific job.
     */
    public function index($jobId)
    {
        $statuses = SiteStatus::where('job_id', $jobId)
            ->with('siteItem', 'location')
            ->get();

        return response()->json($statuses);
    }

    public function get_job_location_statuses($jobId, $locationId)
    {
        $statuses = SiteStatus::where('job_id', $jobId)
            ->where('location_id', $locationId)
            ->with('siteItem', 'location')
            ->get();

        return response()->json($statuses);
    }

    /**
     * Get active site items for status recording.
     */
    public function siteItems()
    {
        $siteItems = SiteItem::where('is_active', true)->get();
        return response()->json($siteItems);
    }
}
