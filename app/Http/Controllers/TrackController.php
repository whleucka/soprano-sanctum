<?php

namespace App\Http\Controllers;

use App\Models\Track;
use Illuminate\Http\Request;

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
