<?php

namespace Tests\Feature;

use App\Models\PosterProject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PosterAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_delete_poster_project(): void
    {
        $user = User::factory()->create();
        $poster = PosterProject::create([
            'title' => 'Test Poster',
            'slug' => 'test-poster',
            'description' => 'A test poster',
            'tools' => ['Photoshop'],
            'category' => 'Social Media',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson('/api/admin/poster-projects/' . $poster->id);

        $response->assertOk()
            ->assertJsonFragment(['message' => 'Poster project deleted successfully.']);

        $this->assertDatabaseMissing('posters', ['id' => $poster->id]);
    }
}
