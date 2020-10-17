<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTracksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tracks', function (Blueprint $table) {
            $table->id();
            $table->char('fingerprint', 32)
                  ->unique()
                  ->index();
            $table->string('filenamepath');
            $table->string('filename');
            $table->string('filepath');
            $table->string('fileformat');
            $table->integer('filesize');
            $table->double('bitrate');
            $table->string('mime_type');
            $table->double('playtime_seconds');
            $table->string('playtime_string');
            $table->string('artist')
                  ->index();
            $table->string('album')
                  ->index();
            $table->string('title')
                  ->index();
            $table->string('year')
                  ->nullable();
            $table->string('number')
                  ->nullable();
            $table->string('genre')
                  ->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tracks');
    }
}
