<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\Admin\ContactMessageController;
use App\Http\Controllers\Api\Admin\EducationController;
use App\Http\Controllers\Api\Admin\ExperienceController;
use App\Http\Controllers\Api\Admin\PosterProjectController;
use App\Http\Controllers\Api\Admin\ProfileController;
use App\Http\Controllers\Api\Admin\ProjectController;
use App\Http\Controllers\Api\Admin\SkillController;
use App\Http\Controllers\Api\Admin\UxUiController;
use App\Http\Controllers\Api\Admin\UxUiProjectController;
use App\Http\Controllers\Api\PosterController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/profile', [PublicController::class, 'profile']);
Route::get('/skills', [PublicController::class, 'skills']);

Route::get('/projects', [PublicController::class, 'projects']);
Route::get('/projects/{slug}', [PublicController::class, 'projectDetails']);

Route::get('/ux-ui-projects', [PublicController::class, 'uxUiProjects']);
Route::get('/poster-projects', [PublicController::class, 'posterProjects']);

Route::get('/education', [PublicController::class, 'education']);
Route::get('/experience', [PublicController::class, 'experience']);

Route::post('/contact-messages', [PublicController::class, 'storeContactMessage']);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        /*
        |--------------------------------------------------------------------------
        | Profile
        |--------------------------------------------------------------------------
        */
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::post('/profile', [ProfileController::class, 'update']);

        /*
        |--------------------------------------------------------------------------
        | Skills CRUD
        |--------------------------------------------------------------------------
        */
        Route::get('/skills', [SkillController::class, 'index']);
        Route::post('/skills', [SkillController::class, 'store']);
        Route::get('/skills/{skill}', [SkillController::class, 'show']);
        Route::put('/skills/{skill}', [SkillController::class, 'update']);
        Route::delete('/skills/{skill}', [SkillController::class, 'destroy']);

        /*
        |--------------------------------------------------------------------------
        | Web Projects CRUD
        |--------------------------------------------------------------------------
        */
        Route::get('/projects', [ProjectController::class, 'index']);
        Route::post('/projects', [ProjectController::class, 'store']);
        Route::get('/projects/{project}', [ProjectController::class, 'show']);
        Route::put('/projects/{project}', [ProjectController::class, 'update']);
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

        /*
        |--------------------------------------------------------------------------
        | UX/UI Projects CRUD
        |--------------------------------------------------------------------------
        */
        Route::get('/ux-ui-projects', [UxUiController::class, 'index']);
        Route::post('/ux-ui-projects', [UxUiController::class, 'store']);
        Route::get('/ux-ui-projects/{uxUiProject}', [UxUiController::class, 'show']);
        Route::put('/ux-ui-projects/{uxUiProject}', [UxUiController::class, 'update']);
        Route::delete('/ux-ui-projects/{uxUiProject}', [UxUiController::class, 'destroy']);

        /*
        |--------------------------------------------------------------------------
        | Poster Projects CRUD
        |--------------------------------------------------------------------------
        */
        Route::get('/poster-projects', [PosterController::class, 'index']);
        Route::post('/poster-projects', [PosterController::class, 'store']);
        Route::get('/poster-projects/{posterProject}', [PosterController::class, 'show']);
        Route::put('/poster-projects/{posterProject}', [PosterController::class, 'update']);
        Route::delete('/poster-projects/{posterProject}', [PosterController::class, 'destroy']);

        /*
        |--------------------------------------------------------------------------
        | Education CRUD
        |--------------------------------------------------------------------------
        */
        Route::get('/education', [EducationController::class, 'index']);
        Route::post('/education', [EducationController::class, 'store']);
        Route::get('/education/{education}', [EducationController::class, 'show']);
        Route::put('/education/{education}', [EducationController::class, 'update']);
        Route::delete('/education/{education}', [EducationController::class, 'destroy']);

        /*
        |--------------------------------------------------------------------------
        | Experience CRUD
        |--------------------------------------------------------------------------
        */
        Route::get('/experience', [ExperienceController::class, 'index']);
        Route::post('/experience', [ExperienceController::class, 'store']);
        Route::get('/experience/{experience}', [ExperienceController::class, 'show']);
        Route::put('/experience/{experience}', [ExperienceController::class, 'update']);
        Route::delete('/experience/{experience}', [ExperienceController::class, 'destroy']);

        /*
        |--------------------------------------------------------------------------
        | Contact Messages
        |--------------------------------------------------------------------------
        */
        Route::get('/contact-messages', [ContactMessageController::class, 'index']);
        Route::get('/contact-messages/{contactMessage}', [ContactMessageController::class, 'show']);
        Route::patch('/contact-messages/{contactMessage}/toggle-read', [ContactMessageController::class, 'toggleRead']);
        Route::delete('/contact-messages/{contactMessage}', [ContactMessageController::class, 'destroy']);
    });
});