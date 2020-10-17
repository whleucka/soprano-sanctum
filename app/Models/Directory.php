<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

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
                $files['paths'][] = $fi->getPathName();
            }
        }
        $files['count'] = count($files['paths']);
        return $files;
    }
}
