/**
 * @license MIT
 * @name create-youtube-player
 * @version 2.0.4
 * @author: Yoriiis aka Joris DANIEL <joris.daniel@gmail.com>
 * @description: Easy way to load and manage multiple Youtube players with API
 * {@link https://github.com/yoriiis/create-youtube-player}
 * @copyright 2019 Joris DANIEL
 **/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var YoutubePlayer =
/*#__PURE__*/
function () {
  /**
   * @param {options}
   */
  function YoutubePlayer(userParams) {
    _classCallCheck(this, YoutubePlayer);

    // Merge default params with user params
    this.options = Object.assign({
      multiplePlaying: true
    }, userParams || {});
    this.youtubeAPIReady = false;
    this.players = [];
    this.playerOnPlaying = [];
  }
  /**
   * Load Youtube API
   * @param {Function} callback Callback function to excecute when Youtube API is ready
   */


  _createClass(YoutubePlayer, [{
    key: "loadAPI",
    value: function loadAPI(callback) {
      var _this = this;

      // Declare function called by Youtube when API is ready
      window.onYouTubeIframeAPIReady = function () {
        _this.youtubeAPIReady = true; // Excecute the callback function if it is available

        if (typeof callback === 'function') {
          callback();
        }
      }; // Inject Youtube API script tag


      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.getElementsByTagName('body')[0].appendChild(tag);
    }
    /**
     * Create the Youtube player
     * @param {Object} userParams Options to create a player
     */

  }, {
    key: "create",
    value: function create(userParams) {
      var _this2 = this;

      // Merge default params with user params
      var params = Object.assign({
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
        },
        events: {}
      }, userParams || {}); // Generate unique ID for every player

      var generatedId = new Date().getTime();
      var selectorId = "youtube-".concat(generatedId);
      params.element['YT_ID'] = selectorId;
      params.element.insertAdjacentHTML('afterbegin', "<div id=\"".concat(selectorId, "\" class=\"yt-iframe\"></div>")); // Init Youtube player

      this.players.push(new YT.Player(selectorId, {
        videoId: params.element.getAttribute('data-youtube-id'),
        width: params.width,
        height: params.height,
        playerVars: params.playerVars,
        events: {
          'onReady': function onReady(data) {
            // Excecute the callback function on ready, if it is available
            if (typeof params.events.onPlayerReady === 'function') {
              params.events.onPlayerReady(data);
            }
          },
          'onStateChange': function onStateChange(state) {
            // Store ID of players playing in an array
            if (state.data === 1) {
              _this2.playerOnPlaying.push(selectorId);
            } else {
              _this2.updateArrayPlayersPlaying(selectorId);
            } // Pause others players if the constructor option is enabled


            if (!_this2.options.multiplePlaying && state.data === 1) {
              _this2.pauseOtherVideo(selectorId);
            } // Excecute the callback function on state change, if it is available


            if (typeof params.events.onStateChange === 'function') {
              params.events.onStateChange(state);
            } else {
              //On video ended, show poster video if element exist
              if (state.data === 0 && playerPoster !== false) {
                playerPoster.style.display = 'block';
              }
            }
          }
        }
      })); // Default behavior on click to the poster (hide poster and play the video)

      var playerPoster = params.element.querySelector(params.selectors.posterWrapper);

      if (playerPoster !== null) {
        playerPoster.addEventListener('click', function (e) {
          e.preventDefault(); // Get the Youtube instance

          var instancePlayer = YT.get(e.currentTarget.parentNode['YT_ID']); // Excecute the callback function on poster click, if it is available

          if (typeof params.events.onPosterClick === 'function') {
            params.events.onPosterClick(e, instancePlayer);
          } else {
            instancePlayer.playVideo();
            e.currentTarget.style.display = 'none';
          }
        });
      }
    }
    /**
     * Update the array of playing players
     * @param {String} currentSelectorId ID of the current player
     */

  }, {
    key: "updateArrayPlayersPlaying",
    value: function updateArrayPlayersPlaying(currentSelectorId) {
      var _this3 = this;

      this.playerOnPlaying.forEach(function (playerId, index) {
        if (playerId === currentSelectorId) {
          _this3.playerOnPlaying.splice(index, 1);
        }
      });
    }
    /**
     * Pause other playing players
     * @param {String} currentSelectorId ID of the current player
     */

  }, {
    key: "pauseOtherVideo",
    value: function pauseOtherVideo(currentSelectorId) {
      if (this.playerOnPlaying.length) {
        this.playerOnPlaying.forEach(function (playerId) {
          // Prevent pause current player
          if (playerId !== currentSelectorId) {
            YT.get(playerId).pauseVideo();
          }
        });
      }
    }
  }]);

  return YoutubePlayer;
}();

var _default = YoutubePlayer;
exports["default"] = _default;
module.exports = exports.default;
