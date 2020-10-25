<?php

namespace App\Http\Controllers;

use App\Models\Track;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrackController extends Controller
{
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
    
    public function stream(Track $track)
    {
        $path = ($track->fileformat !== 'mp3') ?
            $this->transcode($track->filenamepath) :
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

    public function search(Request $request)
    {
        $this->authorize('viewAny', Track::class);
        $data = $this->validateSearchTerm();
        $tracks = DB::table('tracks')
            ->where('artist', 'like', "{$data['term']}%")
            ->orWhere('album', 'like', "{$data['term']}%")
            ->orWhere('title', 'like', "%{$data['term']}%")
            ->orWhere('genre', 'like', "%{$data['term']}%")
            ->orWhere('year', '=', $data['term'])
            ->orderBy('artist')->orderBy('album')
            ->get();
        return $tracks;
    }

    public function genres(Request $request)
    {
        $genres_raw = DB::table('tracks')->distinct('genre')->get();
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
