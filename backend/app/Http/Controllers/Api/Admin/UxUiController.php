<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\UxUiProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UxUiController extends Controller
{
    public function index()
    {
        $projects = UxUiProject::latest()->get();

        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'tools' => ['nullable'],
            'images.*' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'figma_url' => ['nullable', 'url'],
            'category' => ['nullable', 'string', 'max:100'],
        ]);

        $validated['slug'] = Str::slug($request->title) . '-' . time();

        if ($request->filled('tools')) {
            $validated['tools'] = array_map('trim', explode(',', $request->tools));
        }

        if ($request->hasFile('images')) {
            $imagePaths = [];

            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('ux-ui-projects', 'public');
            }

            $validated['images'] = $imagePaths;
        }

        $project = UxUiProject::create($validated);

        return response()->json([
            'message' => 'UX/UI project created successfully.',
            'data' => $project,
        ], 201);
    }

    public function show(UxUiProject $uxUiProject)
    {
        return response()->json($uxUiProject);
    }

    public function update(Request $request, UxUiProject $uxUiProject)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'tools' => ['nullable'],
            'images.*' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'figma_url' => ['nullable', 'url'],
            'category' => ['nullable', 'string', 'max:100'],
        ]);

        if ($request->title !== $uxUiProject->title) {
            $validated['slug'] = Str::slug($request->title) . '-' . time();
        }

        if ($request->filled('tools')) {
            $validated['tools'] = array_map('trim', explode(',', $request->tools));
        }

        if ($request->hasFile('images')) {
            if ($uxUiProject->images) {
                foreach ($uxUiProject->images as $oldImage) {
                    Storage::disk('public')->delete($oldImage);
                }
            }

            $imagePaths = [];

            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('ux-ui-projects', 'public');
            }

            $validated['images'] = $imagePaths;
        }

        $uxUiProject->update($validated);

        return response()->json([
            'message' => 'UX/UI project updated successfully.',
            'data' => $uxUiProject,
        ]);
    }

    public function destroy(UxUiProject $uxUiProject)
    {
        if ($uxUiProject->images) {
            foreach ($uxUiProject->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $uxUiProject->delete();

        return response()->json([
            'message' => 'UX/UI project deleted successfully.',
        ]);
    }
}