<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PlaylistTest extends TestCase
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
    public function a_user_can_retrieve_playlists()
    {
        Sanctum::actingAs($this->user);
        $response = $this->json('GET', route('playlist.index'));
        $response->assertOk();
    }

    /**
     * @test
     */
    public function a_user_can_create_a_playlist()
    {
        Sanctum::actingAs($this->user);
        $payload = ['name' => "My super cool playlist"];
        $response = $this->json('POST', route('playlist.store'), $payload);
        $response->assertCreated();
    } 
    
    /**
     * @test
     */
    public function a_playlist_name_must_be_unique()
    {
        Sanctum::actingAs($this->user);
        $payload = ['name' => "My super cool playlist"];
        $response = $this->json('POST', route('playlist.store'), $payload);
        $response->assertCreated();
        $response = $this->json('POST', route('playlist.store'), $payload); 
        $response->assertJsonValidationErrors('name');
    }
    
    /**
     * @test
     */
    public function a_playlist_can_be_destroyed()
    {
        Sanctum::actingAs($this->user);
        $payload = ['name' => "My super cool playlist"];
        $this->user->playlists()->create($payload);
        $response = $this->json('DELETE', route('playlist.destroy', $this->user->playlists->first()->id));
        $response->assertNoContent();
    }
}
