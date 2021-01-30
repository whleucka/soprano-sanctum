<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use App\Models\Track;
use App\Models\PlaylistTrack;

class Directory extends Model
{
    use HasFactory;
    protected $fillable = ['path', 'user_id'];
    protected $formats = ['mp3', 'wav', 'ogg', 'm4a', 'flac'];

    public function tracks()
    {
        return $this->hasMany(Track::class);
    }

    public function scan(): array
    {
        $files = [
            'count' => 0,
            'covers' => 0,
            'removed' => 0,
            'paths' => [],
        ];
        $di = new RecursiveDirectoryIterator($this->path, RecursiveDirectoryIterator::SKIP_DOTS);
        $it = new RecursiveIteratorIterator($di);
        foreach ($it as $fi) {
            if (in_array(pathinfo($fi, PATHINFO_EXTENSION), $this->formats)) {
                // $fi is SplFileInfo
                $path = $fi->getRealPath();
                $track = Track::where('filenamepath', '=', $path)->first();
                if (!$track) {
                    $files['paths'][] = $path;  
                } else {
                    $cover = Track::getCover($path);
                    if ($cover != $track->cover) {
                        $files['covers']++;    
                        $track->cover = $cover; 
                        $track->save(); 
                    }
                }
            }
        }
        $files['count'] = count($files['paths']);
        $files['removed'] = $this->removeOrphans();
        return $files;
    }

    public function removeOrphans()
    {
        $tracks = Track::all();
        $removed = 0;
        foreach ($tracks as $track) {
            if (!file_exists($track->filenamepath)) {
                $removed++;
                PlaylistTrack::where('track_id', '=', $track->id)->delete();
                $track->delete();
            }
        }
        return $removed;
    }
}
