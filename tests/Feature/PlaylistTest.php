<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Directory;
use App\Models\Track;
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
    
    /**
     * @test
     */
    public function a_track_can_be_added_to_a_playlist()
    {
        Sanctum::actingAs($this->user);
        $this->user->directories()->create(['path' => env('MUSIC_DIR'), 'user_id' => $this->user->id]);
        $response = $this->json('POST', route('track.synch'), [
            'filepath' => env('TRACK_PATH')
        ]);
        $track_id = ($response['id']);
        $response = $this->json('POST', route('playlist.store'), ['name' => "My super cool playlist"]);
        $playlist_id = ($response['id']);
        $response = $this->json('POST', route('playlist.track_toggle', $playlist_id), ['track_id' => $track_id]);
        $response->assertOk();
        $response->assertExactJson(['toggle' => 1]);
    }

    /**
     * @test
     */
    public function a_track_can_be_removed_from_a_playlist()
    {
        Sanctum::actingAs($this->user);
        $this->user->directories()->create(['path' => env('MUSIC_DIR'), 'user_id' => $this->user->id]);
        $response = $this->json('POST', route('track.synch'), [
            'filepath' => env('TRACK_PATH')
        ]);
        $track_id = ($response['id']);
        $response = $this->json('POST', route('playlist.store'), ['name' => "My super cool playlist"]);
        $playlist_id = ($response['id']);
        $response = $this->json('POST', route('playlist.track_toggle', $playlist_id), ['track_id' => $track_id]);
        $response->assertOk();
        $response->assertExactJson(['toggle' => 1]);
        $response = $this->json('POST', route('playlist.track_toggle', $playlist_id), ['track_id' => $track_id]);
        $response->assertOk();
        $response->assertExactJson(['toggle' => 0]);
    }

    /**
     * @test
     */
    public function a_user_can_retrieve_a_list_of_playlists_for_a_given_track()
    {

    }
}
