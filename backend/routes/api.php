<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\JwtAuthController;
use App\Http\Controllers\TaskController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => 'auth'], function () {
    Route::post('register', [JwtAuthController::class, 'register']);
    Route::post('login', [JwtAuthController::class, 'login']);

    Route::middleware('jwt.auth')->group(function () {
        Route::get('me', [JwtAuthController::class, 'me']);
        Route::post('logout', [JwtAuthController::class, 'logout']);
        Route::post('refresh', [JwtAuthController::class, 'refresh']);
    });
});

Route::apiResource('tasks', TaskController::class)->middleware('jwt.auth');
