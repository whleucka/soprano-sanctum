<nav class="navbar navbar-dark bg-dark shadow-sm">
    <div class="container-fluid">
        <span class="navbar-brand">
            <img src="{{ asset('img/music.png') }}" alt="soprano" class="music-note mr-2" />
            <span>{{ config('app.name', 'Laravel') }}</span>
        </span>
        <!-- Left Side Of Navbar -->
        <ul class="navbar-nav mr-auto">

        </ul>
        <!-- Right Side Of Navbar -->
        <ul class="navbar-nav ml-auto" style="display: flex; flex-direction: row;">
            @guest
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('login') }}">{{ __('Login') }}</a>
                </li>
                @if (Route::has('register'))
                    <li class="nav-item">
                        <a class="nav-link pl-3" href="{{ route('register') }}">{{ __('Register') }}</a>
                    </li>
                @endif
            @else
                <li class="nav-item">
                    <div class="dropdown">
                      <button class="btn dropdown-toggle" style="color:#999;" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span id="avatar"></span> {{ Auth::user()->name }}
                      </button>
                      <div style="position:absolute;" class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" href="{{ route('logout') }}"
                                                 onclick="event.preventDefault();
                                                 document.getElementById('logout-form').submit();">
                            {{ __('Logout') }}
                        </a>

                        <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                            @csrf
                        </form>
                      </div>
                    </div>
                </li>
            @endguest
        </ul>
    </div>
</nav>
