<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Throwable;

class ProfileController extends Controller
{
    public function show()
    {
        $profile = Profile::first();

        return response()->json($profile);
    }

    public function update(Request $request)
    {
        $profile = Profile::first();

        if (! $profile) {
            $profile = new Profile;
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'title' => ['nullable', 'string', 'max:200'],
            'short_bio' => ['nullable', 'string'],
            'about' => ['nullable', 'string'],
            'career_goal' => ['nullable', 'string'],

            'profile_photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'cv_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],

            'email' => ['nullable', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:150'],

            'github_url' => ['nullable', 'url'],
            'linkedin_url' => ['nullable', 'url'],
            'facebook_url' => ['nullable', 'url'],
            'telegram_url' => ['nullable', 'url'],
            'instagram_url' => ['nullable', 'url'],
        ]);
        try {
            if ($request->hasFile('profile_photo')) {
                $validated['profile_photo'] = $this->storeUpload(
                    $request->file('profile_photo'),
                    'profiles',
                    'profile_photo',
                    $profile->profile_photo,
                );
            }

            if ($request->hasFile('cv_file')) {
                $validated['cv_file'] = $this->storeUpload(
                    $request->file('cv_file'),
                    'cv',
                    'cv_file',
                    $profile->cv_file,
                );
            }
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            report($exception);

            $response = [
                'message' => 'The profile file could not be uploaded.',
                'errors' => [
                    'profile_photo' => ['S3 or Supabase storage rejected the upload. Check the storage credentials and bucket permissions.'],
                ],
            ];

            if (config('app.debug')) {
                $response['debug'] = [
                    'exception' => $exception::class,
                    'message' => $exception->getMessage(),
                    'code' => $exception->getCode(),
                ];
            }

            return response()->json($response, 422);
        }

        $profile->fill($validated);

        try {
            $profile->save();
        } catch (Throwable $exception) {
            report($exception);

            $response = [
                'message' => 'The profile could not be saved.',
                'errors' => [
                    'profile' => ['The database rejected the profile update. Verify that all profile migrations have run.'],
                ],
            ];

            if (config('app.debug')) {
                $response['debug'] = [
                    'exception' => $exception::class,
                    'message' => $exception->getMessage(),
                    'code' => $exception->getCode(),
                ];
            }

            return response()->json($response, 500);
        }

        return response()->json([
            'message' => 'Profile updated successfully.',
            'data' => $profile,
        ]);
    }

    private function storeUpload($file, string $directory, string $field, ?string $oldPath): string
    {
        $diskName = (string) config('filesystems.default');
        $disk = Storage::disk($diskName);

        if (config("filesystems.disks.{$diskName}.driver") !== 's3') {
            throw ValidationException::withMessages([
                $field => ['Uploads must use the configured S3 or Supabase storage disk.'],
            ]);
        }

        $path = $file->store($directory, $diskName);

        if (! is_string($path) || $path === '') {
            throw ValidationException::withMessages([
                $field => ['The file could not be uploaded to S3 or Supabase storage. Check the storage credentials and bucket permissions.'],
            ]);
        }

        if ($oldPath && $oldPath !== '0') {
            $disk->delete($oldPath);
        }

        return $path;
    }
}
