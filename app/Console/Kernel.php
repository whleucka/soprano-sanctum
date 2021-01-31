<?php

namespace App\Console;

use App\Models\Directory;
use App\Models\Track;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // Directory scan
        $schedule->call(function() {
            $directories = Directory::all();
            foreach ($directories as $directory) {
                $files = $directory->scan();
                foreach ($files['paths'] as $path) {
                    $meta = Track::analyze($path);
                    $track = Track::updateOrCreate(
                        ['fingerprint' => md5_file($path)],
                        $meta
                    );
                    if ($track->wasRecentlyCreated && $track->wasChanged()) {
                        error_log("Soprano Synchronize: Update " . print_r([$track->artist, $track->album, $track->title], true));
                    } elseif ($track->wasRecentlyCreated) {
                        error_log("Soprano Synchronize: New file! " . print_r([$track->artist, $track->album, $track->title], true));
                    }
                }
            }
        })->everyTenMinutes();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
