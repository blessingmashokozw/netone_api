<?php

use App\Http\Controllers\ApiJobCardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobMappingController;
use App\Http\Controllers\JobVehicleController;
use App\Http\Controllers\JobMovementController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\SiteStatusController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

// Public auth routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::resource('/api-job-cards', ApiJobCardController::class);
    Route::put('/api-job-cards/{id}/status', [ApiJobCardController::class, 'updateStatus']);
    Route::post('/job-mapping', [JobMappingController::class, 'store']);
    Route::get('/job-vehicles/{jobId}', [JobVehicleController::class, 'index']);
    Route::post('/job-vehicles', [JobVehicleController::class, 'store']);
    Route::get('/job-movements/{jobId}', [JobMovementController::class, 'index']);
    Route::post('/job-movements', [JobMovementController::class, 'store']);
    Route::post('/site-statuses', [SiteStatusController::class, 'store']);
    Route::get('/site-statuses/{jobId}', [SiteStatusController::class, 'index']);
    Route::post('/site-statuses/{jobId}', [SiteStatusController::class, 'store']);
    Route::get('/site-items', [SiteStatusController::class, 'siteItems']);
    Route::get('/api-locations', [LocationController::class, 'api_index']);
    Route::get('/site-statuses/{jobId}/{locationId}', [SiteStatusController::class, 'get_job_location_statuses']);


});
Route::get('regions', fn() => response()->json(\App\Models\Region::orderBy('name')->get(['id', 'name'])));
Route::get('users', fn() => response()->json(\App\Models\User::orderBy('name')->get(['id', 'name'])));
