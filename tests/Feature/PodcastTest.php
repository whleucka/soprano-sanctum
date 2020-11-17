<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Podcast;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PodcastTest extends TestCase
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
    public function a_user_can_retrieve_podcasts()
    {
        Sanctum::actingAs($this->user);
        Podcast::factory()->create(['user_id' => $this->user->id]);
        $response = $this->json('GET', route('podcast.index'));
        $response->assertOk();
    }

   /**
    * @test
    */ 
    public function a_podcast_can_be_added_to_collection()
    {
        Sanctum::actingAs($this->user);
        $response = $this->json('POST', route('podcast.podcast_toggle'), [
            'podcast_id' => '8758da9be6c8452884a8cab6373b007c',
            'title' => 'The Rough Cut',
            'image' => 'https://cdn-images-1.listennotes.com/podcasts/the-rough-cut-PmR84dsqcbj-53MLh7NpAwm.1400x1400.jpg',
            'publisher' => 'Matt Feury',
        ]);
        $response->assertOk();
        $response->assertExactJson(['toggle' => 1]);
    }

    /**
     * @test
     */
    public function a_podcast_can_be_removed_from_collection()
    {
        $this->withoutExceptionHandling();
        Sanctum::actingAs($this->user);
        Podcast::factory()->create(['user_id' => $this->user->id]);
        $response = $this->json('POST', route('podcast.podcast_toggle'), [
            'podcast_id' => '8758da9be6c8452884a8cab6373b007c',
            'title' => 'The Rough Cut',
            'image' => 'https://cdn-images-1.listennotes.com/podcasts/the-rough-cut-PmR84dsqcbj-53MLh7NpAwm.1400x1400.jpg',
            'publisher' => 'Matt Feury',
        ]);
        $response->assertOk();
        $response->assertExactJson(['toggle' => 0]);
    }
}
