<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Education;
use App\Models\Experience;
use App\Models\PosterProject;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Skill;
use App\Models\UxUiProject;
use Illuminate\Http\Request;
use Throwable;

class PublicController extends Controller
{
    public function profile()
    {
        return $this->safeJson(
            fn () => Profile::first(),
            null,
        );
    }

    public function skills()
    {
        return $this->safeJson(
            fn () => Skill::where('is_active', true)
                ->orderBy('sort_order', 'asc')
                ->latest()
                ->get(),
            [],
        );
    }

    public function projects()
    {
        return $this->safeJson(
            fn () => Project::latest()->get(),
            [],
        );
    }

    public function projectDetails($slug)
    {
        return $this->safeJson(
            fn () => Project::where('slug', $slug)->first(),
            null,
        );
    }

    public function uxUiProjects()
    {
        return $this->safeJson(
            fn () => UxUiProject::latest()->get(),
            [],
        );
    }

    public function posterProjects()
    {
        return $this->safeJson(
            fn () => PosterProject::latest()->get(),
            [],
        );
    }

    public function education()
    {
        return $this->safeJson(
            fn () => Education::latest()->get(),
            [],
        );
    }

    public function experience()
    {
        return $this->safeJson(
            fn () => Experience::latest()->get(),
            [],
        );
    }

    public function storeContactMessage(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150'],
            'subject' => ['nullable', 'string', 'max:200'],
            'message' => ['required', 'string'],
        ]);

        $message = ContactMessage::create($validated);

        return response()->json([
            'message' => 'Your message has been sent successfully.',
            'data' => $message,
        ], 201);
    }

    protected function safeJson(callable $callback, mixed $fallback, int $status = 200)
    {
        try {
            return response()->json($callback(), $status);
        } catch (Throwable $e) {
            report($e);

            return response()->json($fallback, $status);
        }
    }
}
