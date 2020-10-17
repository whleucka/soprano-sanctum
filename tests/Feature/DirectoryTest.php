<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DirectoryTest extends TestCase
{
    use RefreshDatabase;
    protected $user;

    public function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create(['is_admin' => true]);
    }

    /**
     * @test
     */
    public function an_administrator_can_retrieve_directories()
    {
        Sanctum::actingAs($this->user);
        $response = $this->json('GET', route('directory.index'));
        $response->assertOk();
    }
    /**
     * @test
     */
    public function a_non_administrator_user_cannot_retrieve_directories()
    {
        Sanctum::actingAs(User::factory()->create());
        $response = $this->json('GET', route('directory.index'));
        $response->assertForbidden();
    }

    /**
     * @test
     */
    public function a_directory_can_be_created()
    {
        Sanctum::actingAs($this->user);
        $payload = ['path' => env('MUSIC_DIR')];
        $response = $this->json('POST', route('directory.store'), $payload);
        $response->assertCreated();
    }

    /**
     * @test
     */
    public function a_directory_path_must_exist()
    {
        Sanctum::actingAs($this->user);
        $payload = ['path' => 'HaveAGoodDay'];
        $response = $this->json('POST', route('directory.store'), $payload);
        $response->assertJsonValidationErrors('path');
    }
    
    /**
     * @test
     */
    public function a_directory_path_must_be_unique()
    {
        Sanctum::actingAs($this->user);
        $payload = ['path' => env('MUSIC_DIR')];
        $response = $this->json('POST', route('directory.store'), $payload);
        $response->assertCreated();
        $response = $this->json('POST', route('directory.store'), $payload); 
        $response->assertJsonValidationErrors('path');
    }

    /**
     * @test
     */
    public function a_directory_path_can_be_updated()
    {
        $this->withoutExceptionHandling();
        Sanctum::actingAs($this->user); 
        $this->user->directories()->create(['path' => env('MUSIC_DIR')]);
        $payload = ['path' => '/tmp'];
        $response = $this->json('PATCH', route('directory.update', $this->user->directories->first()->id), $payload);
        $response->assertOk();
    }
    
    /**
     * @test
     */
    public function a_directory_can_be_destroyed()
    {
        Sanctum::actingAs($this->user);
        $payload = ['path' => env('MUSIC_DIR')];
        $this->user->directories()->create($payload);
        $response = $this->json('DELETE', route('directory.destroy', $this->user->directories->first()->id));
        $response->assertNoContent();
    }
    /**
     * @test
     */
    public function a_directory_can_be_scanned()
    {
        $this->withoutExceptionHandling();
        Sanctum::actingAs($this->user);
        $payload = ['path' => env('MUSIC_DIR')];
        $this->user->directories()->create($payload);
        $response = $this->json('GET', route('directory.scan', $this->user->directories->first()->id));
        $response->assertOk();
    }
}
