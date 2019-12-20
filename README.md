![Create Youtube Player](https://img.shields.io/badge/Create_Youtube_Player-v2.0.4-c51109.svg?style=flat-square)

# Create Youtube Player

Create Youtube Player is a lightweight Javascript library to instanciate Youtube players, without any dependencies.

## Installation

The libraryis available as the `create-youtube-player` package on <a href="https://www.npmjs.com/package/create-youtube-player" title="npm create-youtube-player">npm</a>.

```
npm install create-youtube-player --save
```

## Demo

Online demo is available on the <a href="https://yoriiis.github.io/create-youtube-player/" title="Create Youtube Player Github page" target="_blank">Create Youtube Player Github page</a>.


## How it works

### HTML structure

The minimalist HTML structure below is enough to create the Youtube player.

Replace the `{{idVideo}}` with the video id from the Youtube url.<br />For example, `idVideo` is equal to `uXLbQrK6cXw` in the address below: `https://www.youtube.com/watch?v=uXLbQrK6cXw`

```html
<div class="player" data-youtube-id="{{idVideo}}"></div>
```

### Basic usage

Every page that contains a player, has to instanciates them. The following example create one item.

```javascript
import YoutubePlayer from 'create-youtube-player'
const youtubePlayer = new YoutubePlayer();
youtubePlayer.loadAPI(() => {
    youtubePlayer.create({
        element: document.querySelector('.player')
    });
});
```

### Custom theme

To customize the player with a poster, add a div tag inside the `data-youtube-id` element.

```html
<div class="player" data-youtube-id="{{idVideo}}">
    <div class="player-poster">
      <img src="" alt="" />
    </div>
</div>
```

### Options

You can pass configuration options to the constructor. Example below show all default values. Allowed values are as follows:

```javascript
{
    multiplePlaying: true
}
```

* `multiplePlaying` - {Boolean} - Disable multiple player Youtube playing in the same time

## Available methods

Each player instanciations returns the instance of the class with somes available methods to easily manipulate the element.

### Create the player

The `create()` function create the Youtube player. __The function need before to use the Youtube API.__

If the Youtube API is already available, you can call the function directly. Else, call the `create()` function inside the `loadAPI()` callback function.

```javascript
youtubePlayer.create({
    element: document.querySelector('.player')
});
```

#### Options

You can pass configuration options to the `create()` function.<br />Example below show all default values. Allowed values are as follows:

```javascript
{
    element: null,
    width: '100%',
    height: '100%',
    playerVars: {
        'showinfo': 0,
        'modestbranding': 0,
        'autohide': 0,
        'rel': 0,
        'wmode': 'transparent',
        'controls': 1
    },
    selectors: {
        posterWrapper: '.player-poster'
    }
}
```

* `element` - {Object} - DOM element reference
* `width` - {String} - Width of the player (with unity)
* `height` - {String} - Height of the player (with unity)
* `playerVars` - {Object} - Parameters of the Youtube player
* `selectors` - {Object} - Configuration of selectors used by the library
    * `posterWrapper` - {String} - Selector of the poster wrapper

More informations about player parameters in the <a href="https://developers.google.com/youtube/player_parameters?hl=fr#Parameters" title="Youtube API documentation" target="_blank">Youtube API documentation</a>.

### Load Youtube API

The `loadAPI()` function load the Youtube API.

```javascript
youtubePlayer.loadAPI(() => {
    // Youtube API is ready
});
```

## Callback functions

There are callbacks function available with the library.

### Youtube player ready

The `onPlayerReady` function is called when the player is ready and instanciated.

```javascript
youtubePlayer.create({
    element: document.querySelector('.player'),
    events: {
        onPlayerReady: (player) => {
            // Youtube player is ready
        }
    }
});
```

Parameters:
* `player` - {Object} - Youtube player instance

### Youtube player state change

The `onPlayerStateChange` function is called when the player status changed.

```javascript
youtubePlayer.create({
    element: document.querySelector('.player'),
    events: {
        onPlayerStateChange: (state) => {
            // Youtube player state changed
        }
    }
});
```

Parameters:
* `state` - {Object} - Youtube player state

Possible values of the `state`:

| Value        | Status        |
| ------------ | ------------- |
| -1           | not started   |
| 0            | stop          |
| 1            | playing       |
| 2            | paused        |
| 3            | buffering     |
| 5            | queued        |

More informations in the <a href="https://developers.google.com/youtube/iframe_api_reference" title="Youtube API documentation" target="_blank">Youtube API documentation</a>.

### Player poster click

The `onPosterClick` function is called when the poster is clicked.<br />There is a default behavior to play the video and hide the poster.
Declaring this function will disable the default behavior.

```javascript
youtubePlayer.create({
    element: document.querySelector('.player'),
    events: {
        onPosterClick: (e, player) => {
            // Poster is clicked
            e.target.style.display = 'none';
            player.playVideo();
        }
    }
});
```

Parameters:
* `e` - {Object} - Event listener datas
* `player` - {Object} - Youtube player instance