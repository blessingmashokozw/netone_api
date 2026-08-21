<?php

namespace App\Http\Controllers;

use App\Models\JobMapping;
use Illuminate\Http\Request;

class JobMappingController extends Controller
{
    /**
     * Store a newly created job mapping in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_id' => 'required|exists:job_cards,id',
            'path_data' => 'required|array',
            'path_data.*.latitude' => 'required|numeric',
            'path_data.*.longitude' => 'required|numeric',
            'path_data.*.timestamp' => 'required|date',
            'path_data.*.speed' => 'nullable|numeric',
            'path_data.*.altitude' => 'nullable|numeric',
            'path_data.*.accuracy' => 'nullable|numeric',
        ]);

        $mapping = JobMapping::create([
            'job_id' => $validated['job_id'],
            'path_data' => $validated['path_data'],
            'started_at' => $validated['path_data'][0]['timestamp'],
            'ended_at' => $validated['path_data'][count($validated['path_data']) - 1]['timestamp'],
            'total_distance_km' => $this->calculateTotalDistance($validated['path_data']),
        ]);

        return response()->json($mapping, 201);
    }

    private function calculateTotalDistance(array $pathData): float
    {
        $distance = 0;
        for ($i = 1; $i < count($pathData); $i++) {
            $distance += $this->haversineDistance(
                $pathData[$i - 1]['latitude'],
                $pathData[$i - 1]['longitude'],
                $pathData[$i]['latitude'],
                $pathData[$i]['longitude']
            );
        }
        return $distance;
    }

    private function haversineDistance($lat1, $lon1, $lat2, $lon2): float
    {
        $earthRadius = 6371; // km
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat/2) * sin($dLat/2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon/2) * sin($dLon/2);
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        return $earthRadius * $c;
    }
}
