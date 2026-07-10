<?php

namespace Tests\Feature;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfileImageTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_photo_is_stored_on_s3_and_exposed_as_a_public_url(): void
    {
        Storage::fake('s3');
        config([
            'filesystems.default' => 's3',
            'filesystems.disks.s3.url' => 'https://storage.example.com/portfolio',
        ]);

        Sanctum::actingAs(User::where('email', 'admin@example.com')->firstOrFail());

        $response = $this->post('/api/admin/profile', [
            'name' => 'Mao ChanPha',
            'profile_photo' => $this->fakePng(),
        ]);

        $response->assertOk();

        $profile = Profile::firstOrFail();

        $this->assertNotSame('0', $profile->profile_photo);
        Storage::disk('s3')->assertExists($profile->profile_photo);

        $this->getJson('/api/profile')
            ->assertOk()
            ->assertJsonPath('profile_photo', $profile->profile_photo)
            ->assertJsonPath('profile_photo_url', Storage::disk('s3')->url($profile->profile_photo));
    }

    public function test_profile_photo_upload_rejects_a_local_disk(): void
    {
        Storage::fake('local');
        config(['filesystems.default' => 'local']);

        Sanctum::actingAs(User::where('email', 'admin@example.com')->firstOrFail());

        $this->post('/api/admin/profile', [
            'name' => 'Mao ChanPha',
            'profile_photo' => $this->fakePng(),
        ])
            ->assertUnprocessable()
            ->assertInvalid(['profile_photo']);
    }

    public function test_profile_can_save_nullable_fields_and_long_social_urls_without_a_file(): void
    {
        Sanctum::actingAs(User::where('email', 'admin@example.com')->firstOrFail());

        $longUrl = 'https://example.com/'.str_repeat('profile-segment/', 20);

        $this->post('/api/admin/profile', [
            'name' => 'Mao ChanPha',
            'phone' => '',
            'location' => '',
            'linkedin_url' => $longUrl,
            'profile_photo' => null,
            'cv_file' => null,
        ])
            ->assertOk()
            ->assertJsonPath('data.phone', null)
            ->assertJsonPath('data.location', null)
            ->assertJsonPath('data.linkedin_url', $longUrl);

        $this->assertDatabaseHas('profiles', [
            'name' => 'Mao ChanPha',
            'linkedin_url' => $longUrl,
        ]);
    }

    private function fakePng(): UploadedFile
    {
        return UploadedFile::fake()->createWithContent(
            'profile.png',
            base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='),
        );
    }
}
