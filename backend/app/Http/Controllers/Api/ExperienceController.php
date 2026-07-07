<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ExperienceController extends Controller
{
    public function index()
    {
        $experiences = Experience::latest()->get();

        return response()->json($experiences);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'organization' => ['required', 'string', 'max:200'],
            'role' => ['required', 'string', 'max:200'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'is_current' => ['nullable', 'boolean'],
            'description' => ['nullable', 'string'],
            'certificate_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        if ($request->hasFile('certificate_image')) {
            $validated['certificate_image'] = $request
                ->file('certificate_image')
                ->store('experiences', 'public');
        }

        $experience = Experience::create($validated);

        return response()->json([
            'message' => 'Experience created successfully.',
            'data' => $experience,
        ], 201);
    }

    public function show(Experience $experience)
    {
        return response()->json($experience);
    }

    public function update(Request $request, Experience $experience)
    {
        $validated = $request->validate([
            'organization' => ['required', 'string', 'max:200'],
            'role' => ['required', 'string', 'max:200'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'is_current' => ['nullable', 'boolean'],
            'description' => ['nullable', 'string'],
            'certificate_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        if ($request->hasFile('certificate_image')) {
            if ($experience->certificate_image) {
                Storage::disk('public')->delete($experience->certificate_image);
            }

            $validated['certificate_image'] = $request
                ->file('certificate_image')
                ->store('experiences', 'public');
        }

        $experience->update($validated);

        return response()->json([
            'message' => 'Experience updated successfully.',
            'data' => $experience,
        ]);
    }

    public function destroy(Experience $experience)
    {
        if ($experience->certificate_image) {
            Storage::disk('public')->delete($experience->certificate_image);
        }

        $experience->delete();

        return response()->json([
            'message' => 'Experience deleted successfully.',
        ]);
    }
}