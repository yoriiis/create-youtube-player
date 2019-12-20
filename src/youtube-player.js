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

class YoutubePlayer {
	/**
	 * @param {options}
	 */
	constructor(userParams) {

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
	loadAPI(callback) {

		// Declare function called by Youtube when API is ready
		window.onYouTubeIframeAPIReady = () => {

			this.youtubeAPIReady = true;

			// Excecute the callback function if it is available
			if (typeof callback === 'function') {
				callback();
			}

		};

		// Inject Youtube API script tag
		let tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		tag.async = true;
		document.getElementsByTagName('body')[0].appendChild(tag);

	}

	/**
	 * Create the Youtube player
	 * @param {Object} userParams Options to create a player
	 */
	create(userParams) {

		// Merge default params with user params
		const params = Object.assign({
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
		}, userParams || {});

		// Generate unique ID for every player
		const generatedId = new Date().getTime();
		const selectorId = `youtube-${generatedId}`;
		params.element['YT_ID'] = selectorId;
		params.element.insertAdjacentHTML('afterbegin', `<div id="${selectorId}" class="yt-iframe"></div>`);

		// Init Youtube player
		this.players.push(new YT.Player(selectorId, {
			videoId: params.element.getAttribute('data-youtube-id'),
			width: params.width,
			height: params.height,
			playerVars: params.playerVars,
			events: {
				'onReady': data => {

					// Excecute the callback function on ready, if it is available
					if (typeof params.events.onPlayerReady === 'function') {
						params.events.onPlayerReady(data);
					}

				},
				'onStateChange': state => {

					// Store ID of players playing in an array
					if (state.data === 1) {
						this.playerOnPlaying.push(selectorId);
					} else {
						this.updateArrayPlayersPlaying(selectorId);
					}

					// Pause others players if the constructor option is enabled
					if (!this.options.multiplePlaying && state.data === 1) {
						this.pauseOtherVideo(selectorId);
					}

					// Excecute the callback function on state change, if it is available
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
		}));

		// Default behavior on click to the poster (hide poster and play the video)
		const playerPoster = params.element.querySelector(params.selectors.posterWrapper);
		if (playerPoster !== null) {
			playerPoster.addEventListener('click', e => {

				e.preventDefault();

				// Get the Youtube instance
				const instancePlayer = YT.get(e.currentTarget.parentNode['YT_ID'])

				// Excecute the callback function on poster click, if it is available
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
	updateArrayPlayersPlaying(currentSelectorId) {

		this.playerOnPlaying.forEach((playerId, index) => {
			if (playerId === currentSelectorId) {
				this.playerOnPlaying.splice(index, 1);
			}
		});

	}

	/**
	 * Pause other playing players
	 * @param {String} currentSelectorId ID of the current player
	 */
	pauseOtherVideo(currentSelectorId) {

		if (this.playerOnPlaying.length) {
			this.playerOnPlaying.forEach(playerId => {
				// Prevent pause current player
				if (playerId !== currentSelectorId) {
					YT.get(playerId).pauseVideo()
				}
			});
		}

	}

}

export default YoutubePlayer;