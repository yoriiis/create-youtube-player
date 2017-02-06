(function(){

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
            'wmode': 'transparent'
        }
    });

})();