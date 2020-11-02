<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Playlist extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'user_id'];

    public function tracks()
    {
        return $this->belongsToMany(Track::class, 'playlist_tracks')->orderBy('artist')->orderBy('album');
    }
}
