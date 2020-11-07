<?php

namespace App\Http\Controllers;

use App\Http\Resources\TrackResource;
use App\Models\Playlist;
use App\Models\PlaylistTrack;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PlaylistController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', Playlist::class);
        return request()->user()->playlists;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->authorize('create', Playlist::class);
        $data = $this->validatePlaylist();
        $data['user_id'] = $request->user()->id;
        $playlist = Playlist::factory()->create($data);
        return $playlist;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Playlist  $playlist
     * @return \Illuminate\Http\Response
     */
    public function show(Playlist $playlist)
    {
        $this->authorize('view', $playlist);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Playlist  $playlist
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Playlist $playlist)
    {
        $this->authorize('update', $playlist);
        $data = $this->validatePlaylist();
        $playlist->update($data);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Playlist  $playlist
     * @return \Illuminate\Http\Response
     */
    public function destroy(Playlist $playlist)
    {
        $this->authorize('delete', $playlist);
        $playlist->delete();
        return response([], 204);
    }

    public function track_toggle(Playlist $playlist) 
    {
        $this->authorize('update', $playlist);
        $data = $this->validateTrack(); 
        $target = PlaylistTrack::where('playlist_id', '=', $playlist->id)->where('track_id', '=', $data['track_id'])->first();
        if ($target) {
            $target->delete();
            return ['toggle' => 0];
        } else {
            $data['playlist_id'] = $playlist->id;
            PlaylistTrack::factory()->create($data);
            return ['toggle' => 1];
        }     
    }

    public function load(Playlist $playlist) 
    {
        $this->authorize('view', $playlist);
        return TrackResource::collection($playlist->tracks);
    }

    public function save(Playlist $playlist)
    {
        $this->authorize('update', $playlist);
        $data = $this->validateTracks();
        foreach ($data['tracks'] as $track) { 
            $target = PlaylistTrack::where('playlist_id', '=', $playlist->id)->where('track_id', '=', $track)->first();
            if (!$target) {
                $new = ['track_id' => $track, 'playlist_id' => $playlist->id];
                PlaylistTrack::factory()->create($new);
            }
        }        
        return TrackResource::collection($playlist->tracks);
    }

    public function validateTracks()
    {
        return request()->validate([
            'tracks' => ['required', 'array'],
        ]);
    }

    public function validateTrack()
    {
        return request()->validate([
            'track_id' => ['required', 'integer'],
        ]);
    }
    
    public function validatePlaylist()
    {
        return request()->validate([
            'name' => [
                'required',
                'string',
                Rule::unique('playlists'),
            ]
        ]);
    }
}
