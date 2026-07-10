<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Portfolio API is running',
    ]);
});

Route::fallback(function () {
    return response()->json([
        'message' => 'Not Found',
    ], 404);
});
