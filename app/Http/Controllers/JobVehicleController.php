<?php

namespace App\Http\Controllers;

use App\Models\JobCard;
use App\Models\JobVehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobVehicleController extends Controller
{
    /**
     * Store a newly created vehicle in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_id' => 'required|exists:job_cards,id',
            'vehicle_number' => 'required|string',
            'mileage' => 'required|integer',
            'fuel_drawn' => 'nullable|integer',
        ]);

        // Authorization: only the assigned user can add vehicles
        $jobCard = JobCard::findOrFail($validated['job_id']);
        if ($jobCard->given_to !== Auth::id()) {
           // return response()->json(['error' => 'You are not authorized to add vehicles to this job.'], 403);
        }

        // Check if vehicle already exists for this job
        $existingVehicle = JobVehicle::where('job_id', $validated['job_id'])->first();
        if ($existingVehicle) {
            return response()->json(['error' => 'A vehicle already exists for this job. Please update the existing vehicle instead.'], 400);
        }

        $vehicle = JobVehicle::create([
            'job_id' => $validated['job_id'],
            'vehicle_number' => $validated['vehicle_number'],
            'mileage' => $validated['mileage'],
            'fuel_drawn' => $validated['fuel_drawn'] ?? 0,
        ]);

        return response()->json($vehicle, 201);
    }

    /**
     * Get vehicles for a specific job.
     */
    public function index($jobId)
    {
        $jobCard = JobCard::findOrFail($jobId);
        
        // Authorization: only the assigned user can view vehicles
        if ($jobCard->given_to !== Auth::id()) {
            return response()->json(['error' => 'You are not authorized to view vehicles for this job.'], 403);
        }

        $vehicles = JobVehicle::where('job_id', $jobId)->get();
        
        return response()->json($vehicles);
    }
}
