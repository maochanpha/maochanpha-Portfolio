<?php

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
