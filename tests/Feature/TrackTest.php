<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TrackTest extends TestCase
{
    use RefreshDatabase;
    protected $user;

    public function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()
             ->create(['is_admin' => true]);
        $this->user->directories()
             ->create(['path' => env('MUSIC_DIR')]);   
    }

    /**
     * @test
     */    
    public function a_track_can_be_synchronized()
    {
        Sanctum::actingAs($this->user);
        $response = $this->json('POST', route('track.synch'), [
            'filepath' => env('TRACK_PATH')
        ]);
        $response->assertCreated();
        // Since updateOrCreate is called, we should
        // expect it to be updated with the next call
        $response = $this->json('POST', route('track.synch'), [
            'filepath' => env('TRACK_PATH')
        ]);
        $response->assertOk();
    }

    /**
     * @test
     */
    public function a_track_must_exist()
    {
        Sanctum::actingAs($this->user);
        $response = $this->json('POST', route('track.synch'), [
            'filepath' => 'HaveAGoodDay'
        ]);
        $response->assertJsonValidationErrors('filepath');
    }
    
    /**
     * @test
     */
    public function a_user_can_retrieve_a_list_of_playlists_for_a_given_track()
    {
        Sanctum::actingAs($this->user);
        $this->user->directories()->create(['path' => env('MUSIC_DIR'), 'user_id' => $this->user->id]);
        $response = $this->json('POST', route('track.synch'), [
            'filepath' => env('TRACK_PATH')
        ]);
        $track_id = ($response['id']);
        $fingerprint = ($response['fingerprint']);
        $response = $this->json('POST', route('playlist.store'), ['name' => "My super cool playlist"]);
        $playlist_id = ($response['id']);
        $response = $this->json('POST', route('playlist.track_toggle', $playlist_id), ['track_id' => $track_id]);
        $response->assertOk();
        $response->assertExactJson(['toggle' => 1]);
        $response = $this->json('GET', route('track.playlists', $fingerprint));
        dd($response);
    }
}
