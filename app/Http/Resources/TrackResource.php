<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TrackResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'fingerprint' => $this->fingerprint,
            'cover' => $this->cover,
            'artist' => $this->artist,
            'album' => $this->album,
            'title' => $this->title,
            'year' => $this->year,
            'mime_type' => $this->mime_type,
            'playtime_seconds' => $this->playtime_seconds,
            'playtime_string' => $this->playtime_string,
        ];
    }
}
