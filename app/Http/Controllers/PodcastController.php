<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Podcast;
use Illuminate\Validation\Rule;

class PodcastController extends Controller
{
	public function index()
	{
		$this->authorize('viewAny', Podcast::class);
		return request()->user()->podcasts;
	}	

    public function podcast_toggle(Request $request)
    {
        $this->authorize('viewAny', Podcast::class);
        $data = $this->validatePodcast(); 
        $target = Podcast::where('podcast_id', '=', $data['podcast_id'])->where('user_id', '=', request()->user()->id)->first();
        if ($target) {
            $target->delete();
            return ['toggle' => 0];
        } else {
            $data['user_id'] = request()->user()->id;
			Podcast::factory()->create($data);
            return ['toggle' => 1];
        }     
    }
	
	public function validatePodcast()
    {
        return request()->validate([
			'podcast_id' => [
				'required',
				'string',
			],
			'title' => [
                'required',
                'string',
			],
			'image' => [
				'required',
				'string'
			],
			'publisher' => [
				'required',
				'string',
			],
        ]);
    }
}
