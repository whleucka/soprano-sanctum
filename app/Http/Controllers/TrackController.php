<?php

namespace App\Http\Controllers;

use App\Http\Resources\TrackResource;
use App\Models\PlaylistTrack;
use App\Models\Track;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrackController extends Controller
{
    public function stream(Track $track)
    {
        $path = ($track->fileformat !== 'mp3') ?
            $track->transcode($track->filenamepath) :
            $track->filenamepath;
        $headers = [
            'Content-Type' => mime_content_type($path),
            'Content-Disposition' => 'inline',
            'Cache-Control' => 'public, max-age=2629746',
            'Accept-Ranges' => 'bytes',
            'Content-Length' => filesize($path),
            'Content-Transfer-Encoding' => 'chunked',
            'Connection' => "Keep-Alive",
            'X-Pad' => 'avoid browser bug',
        ];
        return response()->file($path, $headers);
    }

    public function synch(Request $request)
    {
        $this->authorize('create', Track::class);
        $data = $this->validateFilePath();
        $meta = Track::analyze($data['filepath']);
        $track = Track::updateOrCreate(
            ['fingerprint' => $meta['fingerprint']],
            $meta
        );
        return $track;
    }

    public function validateSearchTerm()
    {
        return request()->validate([
            'term' => [
                'required',
                'string',
            ]
        ]);
    }
    
    public function validateArtist()
    {
        return request()->validate([
            'artist' => [
                'required',
                'string',
            ]
        ]);
    }
    
    public function validateAlbum()
    {
        return request()->validate([
            'album' => [
                'required',
                'string',
            ]
        ]);
    }
    
    public function validateGenre()
    {
        return request()->validate([
            'genre' => [
                'required',
                'string',
            ],
        ]);
    }
    
    public function validateYear()
    {
        return request()->validate([
            'year' => [
                'required',
                'string',
            ],
        ]);
    }
    
    public function validateFilePath()
    {
        return request()->validate([
            'filepath' => [
                'required', 
                'string', 
                function($attribute, $value, $fail) {
                    if (!file_exists($value)) {
                        $fail("Path not found");
                    }
                }
            ]
        ]);
    }

    public function recent_albums()
    {
        $this->authorize('viewAny', Track::class);
        $albums = DB::table('tracks')
            ->orderByDesc('created_at')
            ->groupBy('filepath')
            ->limit(24)
            ->get();
        return $albums; 
    }

    public function playlists(Track $track)
    {
        $this->authorize('viewAny', Track::class);
        $output = [];
        foreach (request()->user()->playlists as $playlist) {
            $in_playlist = PlaylistTrack::where('playlist_id', '=', $playlist->id)
                ->where('track_id', '=', $track->id)
                ->first();
            $output[$playlist->id] = ($in_playlist) ? 1 : 0;
        }
        return $output;
    } 
    
    public function artist(Request $request)
    {
        $this->authorize('viewAny', Track::class);
        $data = $this->validateArtist();
        $tracks = DB::table('tracks')
            ->where('artist', '=', "{$data['artist']}")
            ->orderBy('artist')->orderBy('album')
            ->get();
        return TrackResource::collection($tracks);
    }
    
    public function album(Request $request)
    {
        $this->authorize('viewAny', Track::class);
        $data = $this->validateAlbum();
        $tracks = DB::table('tracks')
            ->where('album', '=', "{$data['album']}")
            ->orderBy('artist')->orderBy('album')
            ->get();
        return TrackResource::collection($tracks);
    }
    
    public function year(Request $request)
    {
        $this->authorize('viewAny', Track::class);
        $data = $this->validateYear();
        $tracks = DB::table('tracks')
            ->where('year', '=', "{$data['year']}")
            ->orderBy('artist')->orderBy('album')
            ->get();
        return TrackResource::collection($tracks);
    }
    
    public function genre(Request $request)
    {
        $this->authorize('viewAny', Track::class);
        $data = $this->validateGenre();
        $tracks = DB::table('tracks')
            ->where('genre', 'like', "%{$data['genre']}%")
            ->orderBy('artist')->orderBy('album')
            ->get();
        return TrackResource::collection($tracks);
    }

    public function search(Request $request)
    {
        $this->authorize('viewAny', Track::class);
        $data = $this->validateSearchTerm();
        $tracks = DB::table('tracks')
            ->where('artist', 'like', "%{$data['term']}%")
            ->orWhere('album', 'like', "%{$data['term']}%")
            ->orWhere('title', 'like', "%{$data['term']}%")
            ->orderBy('artist')->orderBy('album')
            ->get();
        return TrackResource::collection($tracks);
    }

    public function genres(Request $request)
    {
        $genres_raw = DB::table('tracks')->distinct('genre')->orderBy('genre')->get();
        $genres = [];
        foreach ($genres_raw as $genre_raw) {
            $genre_array = explode(',', $genre_raw->genre);
            foreach ($genre_array as $genre) {
                if (!in_array($genre, $genres) && $genre !== '')
                    $genres[] = $genre;
            }
        }
        sort($genres);
        return $genres; 
    }

    public function years(Request $request)
    {
        $years_raw = DB::table('tracks')
            ->select('year')
            ->distinct('year')
            ->where('year', '!=', '')
            ->orderBy('year')
            ->get();
        $years = [];
        foreach ($years_raw as $year_raw) {
            $years[] = $year_raw->year;
        }
        return $years; 
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', Track::class);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->authorize('create', Track::class);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Track  $track
     * @return \Illuminate\Http\Response
     */
    public function show(Track $track)
    {
        $this->authorize('view', $track);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Track  $track
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Track $track)
    {
        $this->authorize('update', $track);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Track  $track
     * @return \Illuminate\Http\Response
     */
    public function destroy(Track $track)
    {
        $this->authorize('delete', $track);
    }
}
