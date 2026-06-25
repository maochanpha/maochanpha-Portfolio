<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Uxui;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UxUiController extends Controller
{
    public function index(){
        $projects = Uxui::latest()->get();
    }

    public function store(Request $request){
        $validated = $request->validate([
        'title' => ['required', 'string', 'max:200'],
        'description' => ['nullable', 'string'],
        'tools' => ['nullable'],
        'images.*' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        'figma_url' => ['nullable', 'url'],
        'category' => ['nullable', 'string', 'max:100'],
        ]);
        $validated['slug'] = Str::slug($request->title). '-' . time();
        
        if($request->filled('tools')){
            $validated['tools'] = $this->formatArrayInput($request->tools);
        }

        if($request->hasFile('images')){
            $imagePaths = [];

            foreach ($request->file('images') as $image){
                $imagePaths[] = $image->store('ux-ui-projects', 'public');
            }

            $validated['images'] = $imagePaths;
        }

        $project = Uxui::create($validated);

        return response()->json([
            'message' => 'UX/UI Project Created Successfully.',
            'data' => $project,
        ], 201);
    }

    public function show(Uxui $uxui){
        return response()->json($uxui);
    }
    public function update(Request $request, Uxui $uxui)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'tools' => ['nullable'],
            'images.*' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'figma_url' => ['nullable', 'url'],
            'category' => ['nullable', 'string', 'max:100'],
        ]);

        if ($request->title !== $uxui->title) {
            $validated['slug'] = Str::slug($request->title) . '-' . time();
        }

        if ($request->filled('tools')) {
            $validated['tools'] = $this->formatArrayInput($request->tools);
        }

        if ($request->hasFile('images')) {
            if ($uxui->images) {
                foreach ($uxui->images as $oldImage) {
                    Storage::disk('public')->delete($oldImage);
                }
            }

            $imagePaths = [];

            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('ux-ui-projects', 'public');
            }

            $validated['images'] = $imagePaths;
        }

        $uxui->update($validated);

        return response()->json([
            'message' => 'UX/UI project updated successfully.',
            'data' => $uxui,
        ]);
    }

    public function destroy(Uxui $uxui){
        if($uxui->images){
            foreach($uxui->images as $image){
                Storage::disk('public')->delete($image);
            }
        }

        $uxui->delete();

        return response()->json([
            'message' => 'UX/UI Project deleted Successfully.',
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
