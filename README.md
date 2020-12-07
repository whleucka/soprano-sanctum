# Soprano

<a href='https://choosealicense.com/licenses/mit/' rel='License'>![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)</a>
<a href='https://github.com/whleucka/soprano-sanctum/issues' rel='Issues'>![GitHub issues](https://img.shields.io/github/issues/whleucka/soprano-sanctum)</a>
<a href='https://discord.com/channels/760550600777138258' rel='Discord Server'>![Discord](https://img.shields.io/discord/760550600777138258)</a>

Soprano is a client-server music playback system. Soprano features a Laravel API backend with a modern React JS frontend. Host your own Spotify&trade; clone and ditch the monthly subscription fee. Take control of your music library!

-   Live demo [here](https://soprano.williamhleucka.com/)

<!--## Screenshots-->

<!--<p align="center">-->
<!--<img src="https://i.ibb.co/1fPs3sv/s1.png" alt="playlist"><br>-->
<!--<img src="https://i.ibb.co/m8pPg4H/s2.png" alt="podcasts"><br>-->
<!--<img src="https://i.ibb.co/BCH66D6/s3.png" alt="mobile"><br>-->
<!--</p>-->

## Features

-   User authentication
-   User playlists
-   Music genres
-   Player controls
-   On-the-fly transcoding
-   Track seeking
-   Album cover art
-   Podcast support with Listen Notes

## Installation

Use the package manager [composer](https://getcomposer.org/download/) to install Soprano. You'll also need [npm](https://www.npmjs.com/) to install the javascript dependencies.

```bash
composer install
npm install
```

## Usage

-   Copy the .env.example file to .env and add your db secrets / Listen Notes API key.
-   Create a mysql database.
-   Run migrations.

```bash
php artisan migrate
```

-   You can start up a development server or deploy to a web server of your choice.

```bash
npm run watch
php artisan serve
```

### Note

-   In order to add/synchronize music directories, you must first make yourself an admin. Here is a simple example:

```mysql
UPDATE users SET is_admin=1 WHERE id = 'some_user_id'
```

### Tests

-   Run the feature tests

```php
php artisan test
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
