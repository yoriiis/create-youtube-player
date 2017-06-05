![youtube-player-js](https://img.shields.io/badge/Youtube_Player_JS-v1.0.3-000000.svg?style=flat-square)
![Youtube](https://img.shields.io/badge/Youtube_API-Player|Iframe-c51109.svg?style=flat-square)

# [Youtube Player JS](http://yoriiis.github.io/youtube-player-js)

Youtube player module allow you to automatically load Youtube API (iframe_api or player_api), parse DOM and start instantiation. Each player is available with a small boilerplate (poster and play button).

You can manage all videos Youtube on your page with a global javascript object `PlayerYT`. It is write in vanillaJS, no needs to import jQuery.

## Installation

Call youtube player module in your HTML before your application and use it.

```html
<script src="js/youtube-player.js"></script>
```

## How it works

### HTML structure

Use HTML structure below without change. Replace just `{{idSelector}}` with a unique id and `{{idVideo}}` with the video id from the URL. Tag `.player-poster` is optional and integration inside can be easily modified.<br />
_For information, all player must have a unique id._

```html
<div class="container-player">
  <div class="player-yt-js">
    <div id="player-youtube-{{idSelector}}" class="player-js" data-youtube-id="{{idVideo}}"></div>
  </div>
  <div class="player-poster"></div>
</div>
```

### Options

* `api` iframe_api or player_api
* `autoLoadAPI` automatically load Youtube API
* `parsePlayer` automatically parse all Youtube players in the page
* `ignoreSelector` ignore specific player (string selector class or id)
* `multiplePlaying` disable multiple player Youtube playing in the same time
* `optionsPlayer` player parameters pass to Youtube API (`playerVars` object)

### Instanciation

```javascript
var playerYT = new PlayerYT({
    api: 'iframe_api',
    autoLoadAPI: true,
    parsePlayer: true,
    ignoreSelector: '',
    multiplePlaying: true,
    optionsPlayer: {
        'showinfo': 0,
        'modestbranding': 0,
        'autohide': 0,
        'rel': 0,
        'wmode': 'transparent',
        'controls': 1
    }
});
```

### Load Youtube API

If `autoLoadAPI` option is disabled, you must load Youtube API on your side.<br />On `onYouTubeIframeAPIReady` Youtube event, use `playerYT.reParse()` to parse all your Youtube player.

```javascript
window.onYouTubeIframeAPIReady = function(){
    playerYT.reParse();
};
```

### Parsing DOM

On module player init, with `parsePlayer` enabled, CSS class are added to every Youtube player parsed. You can re-parse the DOM with `playerYT.reParse()`.

```javascript
playerYT.reParse();
```

This method accept one parameter, a string with selector class or id to parse specific player on your page.

```javascript
playerYT.reParse('.player-yt-js');
```

### Events

There are events available with module player. If event functions exist, default behavior is overrided.

* [`onYoutubeAPIReady`](#onYoutubeAPIReady) - Event on Youtube API ready
* [`onPlayerReady`](#onPlayerReady) - Event on Youtube player ready
* [`onStateChange`](#onStateChange) - Event on player state changed
* [`onPosterClick`](#onPosterClick) - Event on player poster click

```javascript
var playerYT = new PlayerYT({
    api: 'iframe_api',
    autoLoadAPI: true,
    parsePlayer: true,
    ignoreSelector: '',
    multiplePlaying: true,
    optionsPlayer: {
        'showinfo': 0,
        'modestbranding': 0,
        'autohide': 0,
        'rel': 0,
        'wmode': 'transparent',
        'controls': 1
    },
    events: {
        onYoutubeAPIReady: onYoutubeAPIReady,
        onPlayerReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onPosterClick: onPosterClick
    }
});
```

#### <a name="onYoutubeAPIReady"></a>On Youtube API ready

Function called when Youtube API call window.onYouTubeIframeAPIReady function.

```javascript
function onYoutubeAPIReady(){ }
```

#### <a name="onPlayerReady"></a>On Youtube player ready

Function called when each player is ready and instanciated. `player` parameter is player instance.

```javascript
function onPlayerReady(player){ }
```

#### <a name="onStateChange"></a>On player state change

Function called when player status changed. There is a default behavior to show poster when video is ended. You can change this behavior with this event function.

```javascript
function onPlayerStateChange(state){ }
```

Here is the different value of `state.data`, more informations on <a href="https://developers.google.com/youtube/iframe_api_reference" title="Youtube API documentation" target="_blank">Youtube API documentation</a>.

| Value        | Status        |
| ------------ | ------------- |
| -1           | not started   |
| 0            | stop          |
| 1            | playing       |
| 2            | paused        |
| 3            | buffering     |
| 5            | queued        |

#### <a name="onPosterClick"></a>On player poster click

Function called on poster click. `e` parameter is click event, `instancePlayer` is the instance of the player. There is a default behavior to player the video and hide the poster. You can change this behavior with this event function.

```javascript
function onPosterClick(e, player){ }
```