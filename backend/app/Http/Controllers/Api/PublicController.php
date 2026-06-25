<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Poster;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Skill;
use App\Models\Uxui;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function profile()
    {
        $profile = Profile::first();

        return response()->json($profile);
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
        $projects = Project::latest()->get();

        return response()->json($projects);
    }
    public function projectDetails($slug)
    {
        $projects = Project::where('slug', $slug)->firstOrFail();
        return response()->json($projects);
    }
    public function uxui()
    {
        $projects = Uxui::latest()->get();
        return response()->json($projects);
    }
    public function poster()
    {
        $projects = Poster::latest()->get();
        return response()->json($projects);
    }
    public function education()
    {
        $education = Education::latest()->get();
        return response()->json($education);
    }
    public function experience()
    {
        $experience = Experience::latest()->get();
        return response()->json($experience);
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
