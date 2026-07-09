<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::latest()->get();

        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'description' => ['required', 'string'],
            'technologies' => ['nullable'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'github_url' => ['nullable', 'url'],
            'live_demo_url' => ['nullable', 'url'],
            'category' => ['nullable', 'string', 'max:100'],
            'is_featured' => ['nullable', 'boolean'],
        ]);

        $validated['slug'] = Str::slug($request->title) . '-' . time();

        if ($request->filled('technologies')) {
            $validated['technologies'] = $this->formatArrayInput($request->technologies);
        }

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('projects', config('filesystems.default'));
        }

        $project = Project::create($validated);

        return response()->json([
            'message' => 'Project created successfully.',
            'data' => $project,
        ], 201);
    }

    public function show(Project $project)
    {
        return response()->json($project);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'description' => ['required', 'string'],
            'technologies' => ['nullable'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'github_url' => ['nullable', 'url'],
            'live_demo_url' => ['nullable', 'url'],
            'category' => ['nullable', 'string', 'max:100'],
            'is_featured' => ['nullable', 'boolean'],
        ]);

        if ($request->title !== $project->title) {
            $validated['slug'] = Str::slug($request->title) . '-' . time();
        }

        if ($request->filled('technologies')) {
            $validated['technologies'] = $this->formatArrayInput($request->technologies);
        }

        if ($request->hasFile('image')) {
            if ($project->image) {
                Storage::disk(config('filesystems.default'))->delete($project->image);
            }

            $validated['image'] = $request->file('image')->store('projects', config('filesystems.default'));
        }

        $project->update($validated);

        return response()->json([
            'message' => 'Project updated successfully.',
            'data' => $project,
        ]);
    }

    public function destroy(Project $project)
    {
        if ($project->image) {
            Storage::disk(config('filesystems.default'))->delete($project->image);
        }

        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully.',
        ]);
    }

    private function formatArrayInput($value): array
    {
        if (is_array($value)) {
            return $value;
        }

        return array_map('trim', explode(',', $value));
    }
}
