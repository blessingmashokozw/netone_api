<?php

namespace App\Http\Controllers;

use App\Models\JobCard;
use App\Models\JobMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobMovementController extends Controller
{
    /**
     * Store a newly created movement in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_id' => 'required|exists:job_cards,id',
            'departure_location_id' => 'nullable|exists:locations,id',
            'departure_time' => 'nullable|date',
            'departure_mileage' => 'nullable|integer',
            'arrival_location_id' => 'nullable|exists:locations,id',
            'arrival_time' => 'nullable|date',
            'arrival_mileage' => 'nullable|integer',
            'departure_latitude' => 'nullable|numeric',
            'departure_longitude' => 'nullable|numeric',
            'arrival_latitude' => 'nullable|numeric',
            'arrival_longitude' => 'nullable|numeric',
        ]);

        // Authorization: only the assigned user can add movements
        $jobCard = JobCard::findOrFail($validated['job_id']);
        if ($jobCard->given_to !== Auth::id()) {
            //return response()->json(['error' => 'You are not authorized to add movements to this job.'], 403);
        }

        // Check if this is an arrival update (arrival fields provided)
        if (!empty($validated['arrival_location_id']) && !empty($validated['arrival_time'])) {
            // Find the last movement with null arrival for this job
            $movement = JobMovement::where('job_id', $validated['job_id'])
                ->whereNull('arrival_time')
                ->orderBy('departure_time', 'desc')
                ->first();

            if ($movement) {
                // Update the existing movement with arrival data
                $movement->update([
                    'arrival_location_id' => $validated['arrival_location_id'],
                    'arrival_time' => $validated['arrival_time'],
                    'arrival_mileage' => $validated['arrival_mileage'] ?? null,
                    'arrival_latitude' => $validated['arrival_latitude'] ?? null,
                    'arrival_longitude' => $validated['arrival_longitude'] ?? null,
                ]);

                return response()->json($movement, 200);
            }
        }

        // Create a new movement (departure)
        $movement = JobMovement::create([
            'job_id' => $validated['job_id'],
            'departure_location_id' => $validated['departure_location_id'],
            'departure_time' => $validated['departure_time'],
            'departure_mileage' => $validated['departure_mileage'],
            'arrival_location_id' => $validated['arrival_location_id'] ?? null,
            'arrival_time' => $validated['arrival_time'] ?? null,
            'arrival_mileage' => $validated['arrival_mileage'] ?? null,
            'departure_latitude' => $validated['departure_latitude'] ?? null,
            'departure_longitude' => $validated['departure_longitude'] ?? null,
            'arrival_latitude' => $validated['arrival_latitude'] ?? null,
            'arrival_longitude' => $validated['arrival_longitude'] ?? null,
        ]);

        return response()->json($movement, 201);
    }

    /**
     * Get movements for a specific job.
     */
    public function index($jobId)
    {
        $jobCard = JobCard::findOrFail($jobId);
        
        // Authorization: only the assigned user can view movements
        if ($jobCard->given_to !== Auth::id()) {
            return response()->json(['error' => 'You are not authorized to view movements for this job.'], 403);
        }

        $movements = JobMovement::where('job_id', $jobId)
            ->orderBy('departure_time', 'asc')
            ->get();
        
        return response()->json($movements);
    }
}
