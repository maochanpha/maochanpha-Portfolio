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

if (isset($_GET['__vercel_route'])) {
    $route = trim((string) $_GET['__vercel_route'], '/');
    $query = $_GET;

    unset($query['__vercel_route'], $_GET['__vercel_route'], $_REQUEST['__vercel_route']);

    $requestUri = '/'.ltrim($route, '/');

    if ($requestUri === '//') {
        $requestUri = '/';
    }

    if ($query !== []) {
        $requestUri .= '?'.http_build_query($query);
    }

    $_SERVER['REQUEST_URI'] = $requestUri;
    $_SERVER['PATH_INFO'] = parse_url($requestUri, PHP_URL_PATH) ?: '/';
    $_SERVER['QUERY_STRING'] = http_build_query($query);
}

$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = __DIR__.'/../public/index.php';
$_SERVER['PHP_SELF'] = '/index.php';

require_once __DIR__ . '/../public/index.php';
