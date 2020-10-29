<?php

namespace App\Http\Controllers;

use App\Models\Playlist;
use Illuminate\Http\Request;
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
