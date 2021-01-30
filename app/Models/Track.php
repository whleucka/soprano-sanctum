<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\File;
use getID3;
use getid3_lib;
use SplFileInfo;
use FFMpeg;
use Exception;

class Track extends Model
{
    use HasFactory;
    
    protected $guarded = [];
    
    public function transcode(string $filepath)
    {
        error_log("Transcoding {$filepath}" . PHP_EOL);
        $storage_dir = storage_path().'/app/public/transcode/';
        if (!file_exists($storage_dir)) {
            mkdir($storage_dir);
        }
        $md5_file = $storage_dir.md5($filepath).'.mp3';
        if (!file_exists($md5_file)) {
            $ffmpeg = FFMpeg\FFMpeg::create([
                'ffmpeg.binaries' => '/usr/bin/ffmpeg',
                'ffprobe.binaries' => '/usr/bin/ffprobe',
                'timeout' => 60 * 5,
                'ffmpeg.threads' => 12,
            ]);
            $audio_channels = 2;
            $bitrate = 320;
            $audio = $ffmpeg->open($filepath);
            $format = new FFMpeg\Format\Audio\Mp3('libmp3lame');
            $format
                ->setAudioChannels($audio_channels)
                ->setAudioKiloBitrate($bitrate);
            try {
                $audio->save($format, $md5_file);
            } catch (Exception $e) {
                error_log($e->getMessage());
            }
        }
        return $md5_file;
    }


    public static function analyze(string $filepath): array
    {
        $id3 = new getID3;
        $data = $id3->analyze($filepath);
        getid3_lib::CopyTagsToComments($data);
        $cover = Track::getCover($filepath);
        $fingerprint = md5_file($filepath);
        return [
            'fingerprint' => $fingerprint,
            'filenamepath' => $data['filenamepath'],
            'filename' => $data['filename'],
            'filepath' => $data['filepath'],
            'fileformat' => $data['fileformat'],
            'filesize' => $data['filesize'],
            'cover' => $cover, 
            'bitrate' => (isset($data['bitrate'])) ? $data['bitrate'] : 0,
            'mime_type' => (isset($data['mime_type'])) ? $data['mime_type'] : '',
            'playtime_seconds' => (isset($data['playtime_seconds'])) ? $data['playtime_seconds'] : 0,
            'playtime_string' => (isset($data['playtime_string'])) ? $data['playtime_string'] : '',
            'artist' => (isset($data['comments_html']['artist'])) ? $data['comments_html']['artist'][0] : 'No Artist',
            'album' => (isset($data['comments_html']['album'])) ? $data['comments_html']['album'][0] : 'No Album', 
            'album_signature' => md5($data['filepath']),
            'title' => (isset($data['comments_html']['title'])) ? $data['comments_html']['title'][0] : 'No Title',
            'year' => (isset($data['comments_html']['year'])) ? $data['comments_html']['year'][0] : '',
            'number' => (isset($data['comments_html']['track_number'])) ? $data['comments_html']['track_number'][0] : '',
            'genre' => (isset($data['comments_html']['genre'])) ? strtoupper(implode(',', str_replace('-', ' ', $data['comments_html']['genre']))) : '',
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
