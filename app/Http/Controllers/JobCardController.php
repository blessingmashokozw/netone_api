<?php

namespace App\Http\Controllers;

use App\Models\JobCard;
use App\Models\Region;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobCardController extends Controller
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

        $jobCards = $query->get();

        $regions = Region::where('status', 'active')->get();
        $employees = User::select('id', 'name', 'email')->get();

        return inertia('job-cards/index', [
            'jobCards' => $jobCards,
            'regions' => $regions,
            'employees' => $employees,
            'authUserId' => Auth::id(),
        ]);
    }

    /**
     * Show the form for creating a new job card.
     */
    public function create()
    {
        $regions = Region::where('status', 'active')->get();
        $employees = User::select('id', 'name', 'email')->get();

        return inertia('job-cards/create', [
            'regions' => $regions,
            'employees' => $employees,
        ]);
    }

    /**
     * Store a newly created job card in storage.
     */
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

        return back()->with('success', 'Job card created successfully.');
    }



    /**
     * Display the specified job card.
     */
    public function show($id)
    {
        $jobCard = JobCard::with(['region', 
        'assignedTo', 
        'vehicles', 
        'movements.departureLocation', 
        'movements.arrivalLocation',
        'site_status.siteItem',
        'site_status.location'])
        ->findOrFail($id);
        $locations = \App\Models\Location::all();

        //return response()->json($jobCard);

        return inertia('job-cards/show', [
            'jobCard' => $jobCard,
            'authUserId' => Auth::id(),
            'locations' => $locations,
        ]);
    }

    /**
     * Update the specified job card in storage.
     */
    public function update(Request $request, $id)
    {
        $jobCard = JobCard::findOrFail($id);

        // Authorization: only the assigned user can update
        if ($jobCard->given_to !== Auth::id()) {
            abort(403, 'You are not authorized to update this job card.');
        }

        $validated = $request->validate([
            'work_perfomed' => 'nullable|string',
            'comments' => 'nullable|string',
        ]);

        $jobCard->update([
            'work_perfomed' => $validated['work_perfomed'] ?? $jobCard->work_perfomed,
            'comments' => $validated['comments'] ?? $jobCard->comments,
        ]);

        return back()->with('success', 'Job card updated successfully.');
    }
}
