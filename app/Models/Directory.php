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
            'paths' => [],
            'count' => 0
        ];
        $di = new RecursiveDirectoryIterator($this->path, RecursiveDirectoryIterator::SKIP_DOTS);
        $it = new RecursiveIteratorIterator($di);
        foreach ($it as $fi) {
            if (in_array(pathinfo($fi, PATHINFO_EXTENSION), $this->formats)) {
                // $fi is SplFileInfo
                $pathfilename = $fi->getPathName();
                $track = Track::where('filenamepath', '=', $pathfilename)->first();
                if (!$track) {
                    $files['paths'][] = $pathfilename;
                } else {
                    $cover = Track::getCover($track->filepath);
                    $track->update(['cover' => $cover]);
                }
            }
        }
        $files['count'] = count($files['paths']);
        $this->removeOrphans();
        return $files;
    }

    public function removeOrphans()
    {
        $tracks = Track::all();
        foreach ($tracks as $track) {
            if (!file_exists($track->filenamepath)) {
                PlaylistTrack::where('track_id', '=', $track->id)->delete();
                $track->delete();
            }
        }
    }
}
