<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PosterProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PosterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = PosterProject::latest()->get();

        return response()->json($projects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'tools' => ['nullable'],
            'category' => ['nullable', 'string', 'max:100'],
        ]);

        $validated['slug'] = Str::slug($request->title). '-' . time();

        if($request->filled('tools')){
            $validated['tools'] = $this->formatArrayInput($request->tools);
        }

        if($request->hasFile('image')){
            $validated['image'] = $request->file('image')->store('poster-projects', config('filesystems.default'));
        }

        $project = PosterProject::create($validated);

        return response()->json([
            'message' => 'Poster project created successfully.',
            'data' => $project,
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(PosterProject $posterProject)
    {
        return response()->json($posterProject);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PosterProject $posterProject)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'tools' => ['nullable'],
            'category' => ['nullable', 'string', 'max:100'],
        ]);

        if($request->title !== $posterProject->title){
            $validated['slug'] = Str::slug($request->title). '-'. time();
        }
        if($request->filled('tools')){
            $validated['tools'] = $this->formatArrayInput($request->tools);
        }
        if($request->hasFile('image')){
            if($posterProject->image){
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PosterProject $posterProject)
    {
        if($posterProject->image){
            Storage::disk(config('filesystems.default'))->delete($posterProject->image);
        }
        $posterProject->delete();

        return response()->json([
            'message' => 'Poster project deleted successfully.',
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
