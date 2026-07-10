<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Throwable;

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
        } catch (Throwable $exception) {
            Log::error('Admin login could not query the users table.', [
                'exception' => $exception,
            ]);

            return $this->serviceUnavailableResponse(
                'Authentication service is unavailable. Verify the database connection and run the migrations.',
                $exception,
            );
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
        } catch (Throwable $exception) {
            Log::error('Admin login could not create a Sanctum token.', [
                'user_id' => $user->getKey(),
                'exception' => $exception,
            ]);

            return $this->serviceUnavailableResponse(
                'Token service is unavailable. Verify that the personal_access_tokens migration has run.',
                $exception,
            );
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

    private function serviceUnavailableResponse(string $message, Throwable $exception)
    {
        $response = ['message' => $message];

        if (config('app.debug')) {
            $response['debug'] = [
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
                'code' => $exception->getCode(),
            ];

            if ($exception instanceof QueryException) {
                $response['debug']['sql_state'] = $exception->errorInfo[0] ?? null;
                $response['debug']['driver_code'] = $exception->errorInfo[1] ?? null;
            }
        }

        return response()->json($response, 503);
    }
}
