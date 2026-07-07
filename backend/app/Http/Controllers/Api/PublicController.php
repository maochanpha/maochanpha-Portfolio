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

class PublicController extends Controller
{
    public function profile()
    {
        return response()->json(Profile::first());
    }

    public function skills()
    {
        $skills = Skill::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->latest()
            ->get();

        return response()->json($skills);
    }

    public function projects()
    {
        return response()->json(Project::latest()->get());
    }

    public function projectDetails($slug)
    {
        $project = Project::where('slug', $slug)->firstOrFail();

        return response()->json($project);
    }

    public function uxUiProjects()
    {
        $projects = UxUiProject::latest()->get();

        return response()->json($projects);
    }

    public function posterProjects()
    {
        $projects = PosterProject::latest()->get();

        return response()->json($projects);
    }

    public function education()
    {
        return response()->json(Education::latest()->get());
    }

    public function experience()
    {
        return response()->json(Experience::latest()->get());
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
}