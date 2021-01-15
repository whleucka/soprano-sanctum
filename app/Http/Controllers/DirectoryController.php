<?php

namespace App\Http\Controllers;

use App\Models\Directory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DirectoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', Directory::class);
        return request()->user()->directories;
    }

    public function scan(Directory $directory)
    {
        $this->authorize('view', $directory);
        return $directory->scan();
    } 

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->authorize('create', Directory::class);
        $data = $this->validateDirectory(); 
        $data['user_id'] = $request->user()->id;
        $directory = Directory::create($data);
        return $directory;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Directory  $directory
     * @return \Illuminate\Http\Response
     */
    public function show(Directory $directory)
    {
        $this->authorize('view', $directory);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Directory  $directory
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Directory $directory)
    {
        $this->authorize('update', $directory);
        $data = $this->validateDirectory();
        $directory->update($data);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Directory  $directory
     * @return \Illuminate\Http\Response
     */
    public function destroy(Directory $directory)
    {
        $this->authorize('delete', $directory);
        $directory->delete();
        return response([], 204);
    }
    
    public function validateDirectory()
    {
        return request()->validate([
            'path' => [
                'required',
                'string',
                Rule::unique('directories'),
                function($attribute, $value, $fail) {
                    if (!file_exists($value)) {
                        $fail("Path not found");
                    }
                }
            ]
        ]);
    }
}
