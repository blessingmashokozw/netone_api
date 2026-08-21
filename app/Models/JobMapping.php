<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobMapping extends Model
{
    protected $fillable = [
        'job_id',
        'path_data',
        'started_at',
        'ended_at',
        'total_distance_km',
    ];

    protected $casts = [
        'path_data' => 'array',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'total_distance_km' => 'decimal:2',
    ];

    public function job(): BelongsTo
    {
        return $this->belongsTo(JobCard::class, 'job_id');
    }
}
