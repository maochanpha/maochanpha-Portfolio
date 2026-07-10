<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class AdminLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_log_in_and_receive_a_sanctum_token(): void
    {
        $admin = User::where('email', 'admin@example.com')->firstOrFail();

        $this->assertTrue(Hash::check('password123', $admin->password));

        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@example.com',
            'password' => 'password123',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('user.id', $admin->id)
            ->assertJsonStructure(['message', 'token', 'user']);

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $admin->id,
            'name' => 'admin-token',
        ]);
    }

    public function test_invalid_admin_credentials_return_json_without_creating_a_token(): void
    {
        User::where('email', 'admin@example.com')->firstOrFail();

        $this->postJson('/api/admin/login', [
            'email' => 'admin@example.com',
            'password' => 'wrong-password',
        ])
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Invalid email or password.');

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_missing_sanctum_table_returns_a_clear_json_error(): void
    {
        config(['app.debug' => false]);

        User::where('email', 'admin@example.com')->firstOrFail();

        Schema::drop('personal_access_tokens');

        $this->postJson('/api/admin/login', [
            'email' => 'admin@example.com',
            'password' => 'password123',
        ])
            ->assertServiceUnavailable()
            ->assertJsonMissingPath('debug')
            ->assertJsonPath(
                'message',
                'Token service is unavailable. Verify that the personal_access_tokens migration has run.',
            );
    }

    public function test_debug_mode_includes_the_token_exception_details(): void
    {
        config(['app.debug' => true]);

        User::where('email', 'admin@example.com')->firstOrFail();
        Schema::drop('personal_access_tokens');

        $this->postJson('/api/admin/login', [
            'email' => 'admin@example.com',
            'password' => 'password123',
        ])
            ->assertServiceUnavailable()
            ->assertJsonPath('debug.exception', 'Illuminate\\Database\\QueryException')
            ->assertJsonPath('debug.sql_state', 'HY000')
            ->assertJsonStructure([
                'message',
                'debug' => ['exception', 'message', 'code', 'sql_state', 'driver_code'],
            ]);
    }

    public function test_login_validation_errors_are_json(): void
    {
        $this->postJson('/api/admin/login', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);
    }
}
