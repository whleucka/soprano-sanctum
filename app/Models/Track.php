<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use getID3;
use getid3_lib;

class Track extends Model
{
    use HasFactory;
    
    protected $guarded = [];

    public function stream()
    {
        // Implement me!
    }

    public static function analyze(string $filepath): array
    {
        $id3 = new getID3;
        $data = $id3->analyze($filepath);
        getid3_lib::CopyTagsToComments($data);
        return [
            'fingerprint' => md5($data['filenamepath']),
            'filenamepath' => $data['filenamepath'],
            'filename' => $data['filename'],
            'filepath' => $data['filepath'],
            'fileformat' => $data['fileformat'],
            'filesize' => $data['filesize'],
            'bitrate' => $data['bitrate'],
            'mime_type' => $data['mime_type'],
            'playtime_seconds' => $data['playtime_seconds'],
            'playtime_string' => $data['playtime_string'],
            'artist' => $data['comments_html']['artist'][0],
            'album' => $data['comments_html']['album'][0], 
            'title' => $data['comments_html']['title'][0],
            'year' => $data['comments_html']['year'][0],
            'number' => $data['comments_html']['track_number'][0],
            'genre' => implode(',', $data['comments_html']['genre']),
        ];
    }
}
