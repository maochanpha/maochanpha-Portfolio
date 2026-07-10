<?php

namespace App\Models\Concerns;

use Illuminate\Support\Facades\Storage;

trait ResolvesStorageUrls
{
    protected function storageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        $disk = (string) config('filesystems.default', 'public');

        try {
            return Storage::disk($disk)->url($path);
        } catch (\Throwable $e) {
            $baseUrl = config("filesystems.disks.{$disk}.url");

            if (is_string($baseUrl) && $baseUrl !== '') {
                return rtrim($baseUrl, '/').'/'.ltrim($path, '/');
            }

            return null;
        }
    }

    protected function storageUrls(array $paths): array
    {
        return collect($paths)
            ->map(fn ($path) => $this->storageUrl($path))
            ->filter()
            ->values()
            ->all();
    }
}
