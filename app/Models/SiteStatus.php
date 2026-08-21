<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SiteStatus extends Model
{
    protected $fillable = [
        'job_id',
        'site_item_id',
        'location_id',
        'value',
        'recorded_at',
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
    ];

    public function job(): BelongsTo
    {
        return $this->belongsTo(JobCard::class, 'job_id');
    }

    public function siteItem(): BelongsTo
    {
        return $this->belongsTo(SiteItem::class, 'site_item_id');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'location_id');
    }
}
