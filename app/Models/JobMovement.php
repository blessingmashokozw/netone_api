<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobMovement extends Model
{
    protected $fillable = [
        'job_id',
        'departure_location_id',
        'departure_time',
        'departure_mileage',
        'arrival_location_id',
        'arrival_time',
        'arrival_mileage',
        'departure_latitude',
        'departure_longitude',
        'arrival_latitude',
        'arrival_longitude',
    ];

    protected $casts = [
        'departure_mileage' => 'integer',
        'arrival_mileage' => 'integer',
        'departure_time' => 'datetime',
        'arrival_time' => 'datetime',
        'departure_latitude' => 'decimal:8',
        'departure_longitude' => 'decimal:8',
        'arrival_latitude' => 'decimal:8',
        'arrival_longitude' => 'decimal:8',
    ];

    public function job(): BelongsTo
    {
        return $this->belongsTo(JobCard::class, 'job_id');
    }

    public function departureLocation(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'departure_location_id');
    }

    public function arrivalLocation(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'arrival_location_id');
    }
}
