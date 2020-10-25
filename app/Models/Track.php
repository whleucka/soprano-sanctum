<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\File;
use getID3;
use getid3_lib;
use SplFileInfo;

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
            'cover' => Track::getCover($filepath),
            'artist' => (isset($data['comments_html']['artist'])) ? $data['comments_html']['artist'][0] : 'No Artist',
            'album' => (isset($data['comments_html']['album'])) ? $data['comments_html']['album'][0] : 'No Album', 
            'title' => (isset($data['comments_html']['title'])) ? $data['comments_html']['title'][0] : 'No Title',
            'year' => (isset($data['comments_html']['year'])) ? $data['comments_html']['year'][0] : '',
            'number' => (isset($data['comments_html']['track_number'])) ? $data['comments_html']['track_number'][0] : '',
            'genre' => (isset($data['comments_html']['genre'])) ? implode(',', $data['comments_html']['genre']) : '',
        ];
    }

   public static function getCover(string $filepath): string
   {
        $fi = new SplFileInfo($filepath); 
        $path = $fi->getpath(); 

        $covers = [
            $path.'/cover.jpeg',
            $path.'/cover.jpg',
            $path.'/cover.png'
        ];
        foreach ($covers as $cover) {
            if (file_exists($cover)) {
                // This cover exists in the same directory as the audio file
                // Get some file information
                $cover_info = pathinfo($cover);
                $cover_ext = $cover_info['extension'];
                $cover_name = md5($cover);
                // Make the storage dir if it doesn't exist
                $storage_dir = storage_path().'/app/public/covers/';
                if (!file_exists($storage_dir)) {
                    mkdir($storage_dir);
                }
                $storage_path = $storage_dir.$cover_name.'.'.$cover_ext;
                $public_path = '/storage/covers/'.$cover_name.'.'.$cover_ext;
                if (!file_exists($storage_path)) {
                    File::copy($cover, $storage_path);
                    return $public_path;
                } else {
                    return $public_path;
                }
            }
        }
        return '/img/no-album.png';
    } 
}
