<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobCard extends Model
{
    protected $fillable = [
        'description',
        'region_id',
        'given_to',
        'work_perfomed',
        'status',
        'comments',
        'approved_by',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    protected $with = ['region', 'assignedTo'];

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'given_to');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function vehicles(): HasMany
    {
        return $this->hasMany(JobVehicle::class, 'job_id');
    }

    public function movements(): HasMany
    {
        return $this->hasMany(JobMovement::class, 'job_id');
    }

    public function site_status(){
        return $this->hasMany(SiteStatus::class,'job_id');
    }
}
