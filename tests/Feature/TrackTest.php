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

    public function a_track_can_be_streamed()
    {

    }
}