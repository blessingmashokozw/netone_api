<?php

namespace App\Http\Controllers;

use App\Models\JobCard;
use Auth;
use Illuminate\Http\Request;

class ApiJobCardController extends Controller
{
    /**
     * Display a listing of job cards.
     */
    public function index(Request $request)
    {
        $query = JobCard::with(['region', 'assignedTo', 'vehicles'])
            ->orderBy('created_at', 'desc');
        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('region_id')) {
            $query->where('region_id', $request->region_id);
        }

        if ($request->filled('given_to')) {
            $query->where('given_to', $request->given_to);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // If user is a Field Technician, only show jobs assigned to them
        if (Auth::user()->hasRole('Field Technician')) {
            $query->where('given_to', Auth::id());
        }

        $jobCards = $query->get();

        return response()->json($jobCards);
    }

    public function show($id)
    {
        $job = JobCard::with(['region', 'assignedTo', 'vehicles', 'movements.departureLocation', 'movements.arrivalLocation'])
            ->findOrFail($id);

        return response()->json($job);
    }

    public function update(Request $request, $id)
    {
        $jobCard = JobCard::findOrFail($id);

        // Authorization: only the assigned user can update
        if ($jobCard->given_to !== Auth::id()) {
            //abort(403, 'You are not authorized to update this job card.');
        }

        $validated = $request->validate([
            'work_perfomed' => 'nullable|string',
            'comments' => 'nullable|string',
        ]);

        $jobCard->update([
            'work_perfomed' => $validated['work_perfomed'] ?? $jobCard->work_perfomed,
            'comments' => $validated['comments'] ?? $jobCard->comments,
        ]);

        return response()->json($jobCard);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'region_id' => 'required|exists:regions,id',
            'given_to' => 'required|exists:users,id',
        ]);

        JobCard::create([
            'description' => $validated['description'],
            'region_id' => $validated['region_id'],
            'given_to' => $validated['given_to'],
            'status' => 'pending',
            'comments' => '',
        ]);

        return response()->json(['message' => 'Job card created successfully.'], 201);
    }

    /**
     * Update the status of a job card.
     */
    public function updateStatus(Request $request, $id)
    {
        $jobCard = JobCard::findOrFail($id);

        // Authorization: only the assigned user can update status
        if ($jobCard->given_to !== Auth::id() && !Auth::user()->hasRole('Network Manager')) {
            abort(403, 'You are not authorized to update this job card status.');
        }

        $validated = $request->validate([
            'status' => 'required|string|in:pending,in progress,completed,approved,closed',
        ]);

        // Additional authorization: only Network Manager can approve job cards
        if ($validated['status'] === 'approved' && !Auth::user()->hasRole('Network Manager')) {
            abort(403, 'Only Network Managers can approve job cards.');
        }

        $jobCard->update([
            'status' => $validated['status'],
        ]);

        return response()->json($jobCard);
    }
}
