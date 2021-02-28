# Vinylr for Plex
### Scrobble plays from vinyl albums to Plex/Last.fm

Keeping statistics on your music plays is fun, and a nice way to see your favorite artists and albums over time. However, these stats become skewed if they only include a portion of the music you listen to, and much of it goes unlogged.

Vinylr is a way to keep track of your plays from vinyl albums, or any other offline source, to your Plex server. It allows you to search your library for albums and use the same naming and tags already present, just how you set them. This allows you to have more accurate statistics on most listened albums or artists across media formats. If your Plex account is [linked with Last.fm](https://plex.tv/users/other-services), plays will also scrobble there.

[Try now - conorahern.me](https://conorahern.me/vinylr)

![Image of Vinylr](https://conorahern.me/projects/plex-vinyl-scrobbler.jpg)

## Running Vinylr on your own server
I currently have an instance of Vinylr already running at the link above, but if you'd prefer to run things yourself, Vinylr can run on any basic LAMP webserver setup. Simply clone this repository into a directory named "vinylr" at the root of your webserver, and change the callback URL to your own domain in welcome.php (replacing the conorahern.me domain with your own).
