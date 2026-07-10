<?php

$runtimeBase = '/tmp/laravel';
$cacheDir = $runtimeBase . '/bootstrap/cache';
$viewDir = $runtimeBase . '/framework/views';
$frameworkCacheDir = $runtimeBase . '/framework/cache';
$sessionDir = $runtimeBase . '/framework/sessions';

foreach ([$cacheDir, $viewDir, $frameworkCacheDir, $sessionDir] as $dir) {
    if (! is_dir($dir)) {
        mkdir($dir, 0777, true);
    }
}

$runtimeEnv = [
    'APP_SERVICES_CACHE' => $cacheDir . '/services.php',
    'APP_PACKAGES_CACHE' => $cacheDir . '/packages.php',
    'APP_CONFIG_CACHE' => $cacheDir . '/config.php',
    'APP_ROUTES_CACHE' => $cacheDir . '/routes.php',
    'APP_EVENTS_CACHE' => $cacheDir . '/events.php',
    'VIEW_COMPILED_PATH' => $viewDir,
    'SESSION_FILES' => $sessionDir,
    'CACHE_STORE' => 'array',
    'SESSION_DRIVER' => 'array',
    'QUEUE_CONNECTION' => 'sync',
];

foreach ($runtimeEnv as $key => $value) {
    putenv($key . '=' . $value);
    $_ENV[$key] = $value;
    $_SERVER[$key] = $value;
}

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withProviders([
        Illuminate\View\ViewServiceProvider::class,
    ])
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(function (Request $request, \Throwable $e) {
            return true;
        });
    })->create();
