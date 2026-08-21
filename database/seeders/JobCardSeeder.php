<?php

namespace Database\Seeders;

use App\Models\JobCard;
use App\Models\JobVehicle;
use App\Models\JobMovement;
use App\Models\SiteStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JobCardSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing data for relationships
        $regions = DB::table('regions')->pluck('id', 'name')->toArray();
        $users = DB::table('users')->pluck('id')->toArray();
        $locationsByRegion = DB::table('locations')->get()->groupBy('region_id')->map(function($locations) {
            return $locations->pluck('id')->toArray();
        })->toArray();
        $siteItems = DB::table('site_items')->pluck('id')->toArray();

        $descriptions = [
            'Power failure in sector 10',
            'Network connectivity issues',
            'Generator maintenance required',
            'Fiber optic cable damage',
            'UPS battery replacement',
            'Server room cooling system failure',
            'Network equipment upgrade',
            'Power distribution unit malfunction',
            'Backup generator testing',
            'Electrical panel inspection',
            'Site power outage',
            'Network switch replacement',
            'Cable infrastructure repair',
            'Power surge damage assessment',
            'Emergency power system check',
            'Site equipment installation',
            'Network configuration update',
            'Power quality monitoring',
            'Site security system maintenance',
            'Communication system repair',
        ];

        $workPerformed = [
            'Replaced faulty components and tested system functionality',
            'Installed new network equipment and configured routing',
            'Performed routine maintenance and calibration',
            'Repaired damaged cables and restored connectivity',
            'Replaced aging batteries and tested backup systems',
            'Fixed cooling system and restored optimal temperature',
            'Upgraded network infrastructure for better performance',
            'Repaired power distribution unit and verified operation',
            'Conducted comprehensive generator testing',
            'Inspected electrical panel and replaced worn components',
            'Restored power supply and identified root cause',
            'Replaced network switch and updated firmware',
            'Repaired cable infrastructure and improved signal quality',
            'Assessed surge damage and implemented protection',
            'Checked emergency power systems and verified functionality',
            'Installed new equipment and integrated with existing systems',
            'Updated network configuration for improved security',
            'Monitored power quality and implemented corrections',
            'Maintained security systems and updated access controls',
            'Repaired communication equipment and restored service',
        ];

        $comments = [
            'Install failure prediction system for early detection',
            'Schedule regular maintenance to prevent future issues',
            'Consider upgrading equipment for better reliability',
            'Document all changes for future reference',
            'Train staff on new equipment operation',
            'Implement monitoring system for proactive maintenance',
            'Update documentation with latest configurations',
            'Review power consumption patterns',
            'Establish backup procedures for critical systems',
            'Coordinate with vendors for warranty claims',
        ];

        $vehicleNumbers = [
            'ABC1234',
            'AEF5678',
            'AHI9012',
            'AKL3456',
            'ANO7890',
            'AQR2345',
            'AGA6789',
            'AAX0123',
            'AZA4567',
            'ACD8901',
            'AFG2345',
            'AAJ6789',
            'ALM0123',
            'AGP4567',
            'ABS8901',
            'ACV2345',
            'AEY6789',
            'AAB0123',
            'ADE4567',
            'AGH8901',
        ];

        $statuses = ['pending', 'in progress', 'completed', 'approved', 'closed'];

        $siteItemValues = [
            'float' => [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
            'string' => ['ok', 'good', 'excellent', 'fair', 'needs attention', 'critical'],
        ];

        // Generate 200 job cards
        for ($i = 0; $i < 200; $i++) {
            $regionName = array_rand($regions);
            $regionId = $regions[$regionName];
            $givenTo = $users[array_rand($users)];
            $status = $statuses[array_rand($statuses)];

            // Get locations for this region
            $regionLocations = $locationsByRegion[$regionId] ?? [];
            if (empty($regionLocations)) {
                continue; // Skip if no locations for this region
            }

            $jobCard = JobCard::create([
                'description' => $descriptions[array_rand($descriptions)] . ' - Job #' . ($i + 1),
                'fault_reporting_time' => $this->randomDate('-30 days', '-25 days'),
                'attending_fault_time' => in_array($status, ['in progress', 'completed', 'approved', 'closed']) ? $this->randomDate('-24 days', '-20 days') : null,
                'fault_clearing_time' => in_array($status, ['completed', 'approved', 'closed']) ? $this->randomDate('-19 days', '-15 days') : null,
                'region_id' => $regionId,
                'given_to' => $givenTo,
                'work_perfomed' => $workPerformed[array_rand($workPerformed)],
                'status' => $status,
                'approved_by' => in_array($status, ['approved', 'closed']) ? $users[array_rand($users)] : null,
                'comments' => $comments[array_rand($comments)],
                'network_manager' => in_array($status, ['approved', 'closed']) ? 'Manager ' . rand(1, 5) : null,
                'signature_date' => in_array($status, ['approved', 'closed']) ? $this->randomDate('-14 days', '-10 days') : null,
                'created_at' => $this->randomDate('-30 days', '-25 days'),
                'updated_at' => now(),
            ]);

            // Add 1-3 vehicles per job
            // $numVehicles = rand(1, 3);
            //for ($j = 0; $j < $numVehicles; $j++) {
            JobVehicle::create([
                'job_id' => $jobCard->id,
                'vehicle_number' => $vehicleNumbers[array_rand($vehicleNumbers)] . rand(10, 99),
                'mileage' => rand(10000, 150000),
                'fuel_drawn' => rand(20, 150),
                'created_at' => $this->randomDate('-24 days', '-20 days'),
                'updated_at' => now(),
            ]);
            //}

            // Add 1-4 movements per job - use locations from the same region
            $numMovements = rand(1, 4);
            $baseMileage = rand(500, 2000);
            
            // Track previous arrival for continuity
            $previousArrivalLocation = null;
            $previousArrivalMileage = $baseMileage;
            $previousArrivalTime = null;
            $previousArrivalLat = null;
            $previousArrivalLng = null;
            
            // Available locations to choose from (to avoid repeats)
            $availableLocations = $regionLocations;

            for ($j = 0; $j < $numMovements; $j++) {
                // If we have a previous arrival, use it as departure
                if ($previousArrivalLocation !== null) {
                    $departureLocation = $previousArrivalLocation;
                    $departureMileage = $previousArrivalMileage;
                    $departureTime = $previousArrivalTime;
                    $departureLat = $previousArrivalLat;
                    $departureLng = $previousArrivalLng;
                } else {
                    // First movement - pick random departure
                    $departureLocation = $regionLocations[array_rand($regionLocations)];
                    $departureMileage = $baseMileage;
                    $departureTime = $this->randomDate('-23 days', '-18 days');
                    $departureLat = $this->randomLatitude();
                    $departureLng = $this->randomLongitude();
                }
                
                // Pick arrival location different from departure
                $possibleArrivals = array_filter($availableLocations, function($loc) use ($departureLocation) {
                    return $loc != $departureLocation;
                });
                
                if (empty($possibleArrivals)) {
                    $possibleArrivals = $regionLocations; // Fallback if all locations used
                }
                
                $arrivalLocation = null;
                $arrivalTime = null;
                $arrivalMileage = null;
                $arrivalLat = null;
                $arrivalLng = null;
                
                if (in_array($status, ['in progress', 'completed', 'approved', 'closed'])) {
                    $arrivalLocation = $possibleArrivals[array_rand($possibleArrivals)];
                    $arrivalTime = $this->randomDate('-17 days', '-12 days');
                    $arrivalMileage = $departureMileage + rand(50, 500);
                    $arrivalLat = $this->randomLatitude();
                    $arrivalLng = $this->randomLongitude();
                }

                JobMovement::create([
                    'job_id' => $jobCard->id,
                    'departure_location_id' => $departureLocation,
                    'departure_time' => $departureTime,
                    'departure_mileage' => $departureMileage,
                    'departure_latitude' => $departureLat,
                    'departure_longitude' => $departureLng,
                    'arrival_location_id' => $arrivalLocation,
                    'arrival_time' => $arrivalTime,
                    'arrival_mileage' => $arrivalMileage,
                    'arrival_latitude' => $arrivalLat,
                    'arrival_longitude' => $arrivalLng,
                    'created_at' => $departureTime,
                    'updated_at' => $arrivalTime ?? now(),
                ]);

                // Update previous arrival for next iteration
                $previousArrivalLocation = $arrivalLocation;
                $previousArrivalMileage = $arrivalMileage ?? $departureMileage;
                $previousArrivalTime = $arrivalTime;
                $previousArrivalLat = $arrivalLat;
                $previousArrivalLng = $arrivalLng;
            }

            // Add site status for 2-4 locations per job - use locations from the same region
            $numLocations = min(rand(2, 4), count($regionLocations));
            $selectedLocationKeys = array_rand($regionLocations, $numLocations);
            
            if (!is_array($selectedLocationKeys)) {
                $selectedLocationKeys = [$selectedLocationKeys];
            }
            
            foreach ($selectedLocationKeys as $locationKey) {
                $locationId = $regionLocations[$locationKey];
                $recordedAt = $this->randomDate('-20 days', '-15 days');
                
                foreach ($siteItems as $siteItemId) {
                    $siteItem = DB::table('site_items')->where('id', $siteItemId)->first();
                    
                    if ($siteItem) {
                        $value = '';
                        if ($siteItem->data_type === 'float') {
                            $value = $siteItemValues['float'][array_rand($siteItemValues['float'])];
                        } else {
                            $value = $siteItemValues['string'][array_rand($siteItemValues['string'])];
                        }
                        
                        SiteStatus::create([
                            'job_id' => $jobCard->id,
                            'site_item_id' => $siteItemId,
                            'location_id' => $locationId,
                            'value' => $value,
                            'recorded_at' => $recordedAt,
                            'created_at' => $recordedAt,
                            'updated_at' => $recordedAt,
                        ]);
                    }
                }
            }
        }
    }

    private function randomDate($start, $end)
    {
        return \Carbon\Carbon::createFromTimestamp(rand(strtotime($start), strtotime($end)));
    }

    private function randomLatitude()
    {
        return -19.0 + (rand(0, 10000) / 100000);
    }

    private function randomLongitude()
    {
        return 32.5 + (rand(0, 10000) / 100000);
    }
}
