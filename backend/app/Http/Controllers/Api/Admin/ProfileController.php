<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(){
        $profile = Profile::first();

        return response()->json($profile);
    }

    public function update(Request $request){
        $profile = Profile::first();

        if(!$profile){
            $profile = new Profile();
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'title' => ['nullable', 'string', 'max:200'],
            'short_bio' => ['nullable', 'string'],
            'about' => ['nullable', 'string'],
            'career_goal' => ['nullable', 'string'],

            'profile_photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'cv_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],

            'email' => ['nullable', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:150'],

            'github_url' => ['nullable', 'url'],
            'linkedin_url' => ['nullable', 'url'],
            'facebook_url' => ['nullable', 'url'],
            'telegram_url' => ['nullable', 'url'],
            'instagram_url' => ['nullable', 'url'],
        ]);
        if($request->hasFile('profile_photo')) {
            if($profile->profile_photo){
                Storage::disk('public')->delete($profile->profile_photo);
            }
            $validated['profile_photo'] = $request->file('profile_photo')->store('profiles', 'public');
        }
        if($request->hasFile('cv_file')){
            if($profile->cv_file){
                Storage::disk('public')->delete($profile->cv_file);
            }

            $validated['cv_file'] = $request->file('cv_file')->store('cv', 'public');
        }
        $profile->fill($validated);
        $profile->save();

        return response()->json([
            'message' => 'Profile updated successfully.',
            'data' => $profile,
        ]);
    }
}
