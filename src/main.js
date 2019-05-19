import YoutubePlayer from '../dist/youtube-player.js'

const youtubePlayer = new YoutubePlayer({
	multiplePlaying: false
});

youtubePlayer.loadAPI(() => {

	youtubePlayer.create({
		element: document.querySelector('.player-1')
	});

	youtubePlayer.create({
		element: document.querySelector('.player-2')
	});

})