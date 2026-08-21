<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobVehicle extends Model
{
    protected $fillable = [
        'job_id',
        'vehicle_number',
        'mileage',
        'fuel_drawn',
    ];

    protected $casts = [
        'mileage' => 'integer',
        'fuel_drawn' => 'integer',
    ];

    public function job(): BelongsTo
    {
        return $this->belongsTo(JobCard::class, 'job_id');
    }
}
