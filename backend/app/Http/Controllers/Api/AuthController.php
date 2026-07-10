<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        try {
            $user = User::where('email', $credentials['email'])->first();
        } catch (QueryException $exception) {
            Log::error('Admin login could not query the users table.', [
                'exception' => $exception,
            ]);

            return response()->json([
                'message' => 'Authentication service is unavailable. Verify the database connection and run the migrations.',
            ], 503);
        }

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
                'errors' => [
                    'email' => ['Invalid email or password.'],
                ],
            ], 422);
        }

        try {
            $token = $user->createToken('admin-token')->plainTextToken;
        } catch (QueryException $exception) {
            Log::error('Admin login could not create a Sanctum token.', [
                'user_id' => $user->getKey(),
                'exception' => $exception,
            ]);

            return response()->json([
                'message' => 'Token service is unavailable. Verify that the personal_access_tokens migration has run.',
            ], 503);
        }

        return response()->json([
            'message' => 'Login successful.',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successfully',
        ]);
    }
}
