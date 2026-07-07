<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Education;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    public function index()
    {
        $education = Education::latest()->get();

        return response()->json($education);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'institution' => ['required', 'string', 'max:200'],
            'degree' => ['nullable', 'string', 'max:200'],
            'major' => ['nullable', 'string', 'max:200'],
            'start_year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'end_year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'is_current' => ['nullable', 'boolean'],
            'description' => ['nullable', 'string'],
        ]);

        $education = Education::create($validated);

        return response()->json([
            'message' => 'Education created successfully.',
            'data' => $education,
        ], 201);
    }

    public function show(Education $education)
    {
        return response()->json($education);
    }

    public function update(Request $request, Education $education)
    {
        $validated = $request->validate([
            'institution' => ['required', 'string', 'max:200'],
            'degree' => ['nullable', 'string', 'max:200'],
            'major' => ['nullable', 'string', 'max:200'],
            'start_year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'end_year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'is_current' => ['nullable', 'boolean'],
            'description' => ['nullable', 'string'],
        ]);

        $education->update($validated);

        return response()->json([
            'message' => 'Education updated successfully.',
            'data' => $education,
        ]);
    }

    public function destroy(Education $education)
    {
        $education->delete();

        return response()->json([
            'message' => 'Education deleted successfully.',
        ]);
    }
}