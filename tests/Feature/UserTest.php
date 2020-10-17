<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;
use App\Models\User;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @test 
     */
    public function an_authenticated_user_can_retrieve_user()
    {
        $this->withoutExceptionHandling();
        Sanctum::actingAs(
            User::factory()->create()
        );
        $response = $this->json('GET', route('user.index'));
        $response->assertOk();
    }

    /**
     * @test
     */
    public function an_unauthenticated_user_is_unauthorized()
    {
        $response = $this->json('GET', route('user.index'));
        $response->assertUnauthorized();
    }
}
