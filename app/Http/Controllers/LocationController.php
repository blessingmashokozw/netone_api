<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Region;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * Display a listing of locations.
     */
    public function index(Request $request)
    {
        $query = Location::with('region');

        // Search by name
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter by region
        if ($request->has('region_id') && $request->region_id) {
            $query->where('region_id', $request->region_id);
        }

        $locations = $query->orderBy('name')->get();
        $regions = Region::orderBy('name')->get();
        $totalRegions = Region::count();
        $totalLocations = Location::count();

        return inertia('locations/index', [
            'locationsData' => $locations,
            'regions' => $regions,
            'totalRegions' => $totalRegions,
            'totalLocations' => $totalLocations,
            'filters' => [
                'search' => $request->search,
                'region_id' => $request->region_id,
            ],
        ]);
    }

     public function api_index()
    {
        $locations = Location::with('region')->orderBy('name')->get();
        return response()->json($locations);
    }



    /**
     * Show the form for creating a new location.
     */
    public function create()
    {
        $regions = Region::orderBy('name')->get();
        
        return inertia('locations/create', [
            'regions' => $regions,
        ]);
    }

    /**
     * Store a newly created location in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:locations,name',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'region_id' => 'nullable|exists:regions,id',
        ]);

        Location::create($validated);

        return redirect()->route('locations.index')->with('success', 'Location created successfully.');
    }

    /**
     * Show the form for editing the specified location.
     */
    public function edit($id)
    {
        $location = Location::with('region')->findOrFail($id);
        $regions = Region::orderBy('name')->get();

        return inertia('locations/edit', [
            'location' => $location,
            'regions' => $regions,
        ]);
    }

    /**
     * Update the specified location in storage.
     */
    public function update(Request $request, $id)
    {
        $location = Location::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|unique:locations,name,' . $id,
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'region_id' => 'nullable|exists:regions,id',
        ]);

        $location->update($validated);

        return redirect()->route('locations.index')->with('success', 'Location updated successfully.');
    }

    /**
     * Remove the specified location from storage.
     */
    public function destroy($id)
    {
        $location = Location::findOrFail($id);
        $location->delete();

        return redirect()->route('locations.index')->with('success', 'Location deleted successfully.');
    }
}
