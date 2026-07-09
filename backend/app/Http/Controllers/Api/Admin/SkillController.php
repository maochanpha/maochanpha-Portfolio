<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::orderBy('sort_order', 'asc')->latest()->get();

        return response()->json($skills);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'category' => ['required', 'string', 'max:100'],
            'level' => ['required', 'integer', 'min:0', 'max:100'],
            'icon' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:2048'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);
        
        if($request->hasFile('icon')){
            $validated['icon'] = $request->file('icon')->store('skills', config('filesystems.default'));
        }

        $skill = Skill::create($validated);

        return response()->json([
            'message' => 'Skill created Successfully.',
            'data' => $skill,
        ], 201);
    }
    public function show(Skill $skill){
        return response()->json($skill);
    }

    public function update(Request $request, Skill $skill) {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'category' => ['required', 'string', 'max:100'],
            'level' => ['required', 'integer', 'min:0', 'max:100'],
            'icon' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:2048'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if($request->hasFile('icon')){
            if($skill->icon){
                Storage::disk(config('filesystems.default'))->delete($skill->icon);
            }
            $validated['icon'] = $request->file('icon')->store('skills', config('filesystems.default'));
        }
        $skill->update($validated);

        return response()->json([
            'message' => 'Skill updated successfully.',
            'data' => $skill,
        ]);
    }
    public function destroy(Skill $skill){
        if($skill->icon){
            Storage::disk(config('filesystems.default'))->delete($skill->icon);
        }

        $skill->delete();

        return response()->json([
            'message' => 'Skill deleted Successfully',
        ]);
    }
}
