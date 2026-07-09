<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PosterProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PosterController extends Controller
{
    public function index()
    {
        $posters = PosterProject::latest()->get();

        return response()->json($posters);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'tools' => ['nullable'],
            'category' => ['nullable', 'string', 'max:100'],
        ]);

        $validated['slug'] = Str::slug($request->title) . '-' . time();

        if ($request->filled('tools')) {
            $validated['tools'] = array_map('trim', explode(',', $request->tools));
        }

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('poster-projects', config('filesystems.default'));
        }

        $poster = PosterProject::create($validated);

        return response()->json([
            'message' => 'Poster project created successfully.',
            'data' => $poster,
        ], 201);
    }

    public function show(PosterProject $posterProject)
    {
        return response()->json($posterProject);
    }

    public function update(Request $request, PosterProject $posterProject)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'tools' => ['nullable'],
            'category' => ['nullable', 'string', 'max:100'],
        ]);

        if ($request->title !== $posterProject->title) {
            $validated['slug'] = Str::slug($request->title) . '-' . time();
        }

        if ($request->filled('tools')) {
            $validated['tools'] = array_map('trim', explode(',', $request->tools));
        }

        if ($request->hasFile('image')) {
            if ($posterProject->image) {
                Storage::disk(config('filesystems.default'))->delete($posterProject->image);
            }

            $validated['image'] = $request->file('image')->store('poster-projects', config('filesystems.default'));
        }

        $posterProject->update($validated);

        return response()->json([
            'message' => 'Poster project updated successfully.',
            'data' => $posterProject,
        ]);
    }

    public function destroy(PosterProject $posterProject)
    {
        if ($posterProject->image) {
            Storage::disk(config('filesystems.default'))->delete($posterProject->image);
        }

        $posterProject->delete();

        return response()->json([
            'message' => 'Poster project deleted successfully.',
        ]);
    }
}
