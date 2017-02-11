/**
 *
 * Module: Youtube player js
 * @version 1.0.0
 * @author: Joris DANIEL
 * @fileoverview: Easy way to load and manage multiple Youtube player with API
 * Compatibilities : Youtube API (iframe & player)
 *
 * Copyright (c) 2017 Joris DANIEL
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 **/

(function(){

    var PlayerYT = function( options ){

        this.youtubeAPIReady = false;
        this.players = [];
        this.playerOnPlaying = [];

        var defaultOptions = {
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
        };

        this.options = utils.extend({}, defaultOptions, options);

        this.reParse = function(selector){
            this.parsePlayer(selector);
        }

        if( this.options.autoLoadAPI ){
            this.loadYoutubeAPI();
        }

    };

    PlayerYT.prototype.loadYoutubeAPI = function(){

        var _this = this;

        window.onYouTubeIframeAPIReady = function(){
            _this.onYouTubeIframeAPIReadyCallback();
        }

        if( this.options.autoLoadAPI ){
            var urlAPI = 'https://youtube.com/' + _this.options.api;
            if( this.autocomplete ){
                urlAPI += '&libraries=places';
            }
            var tag = document.createElement('script');
            tag.async = true;
            tag.type = 'text/javascript';
            tag.src = urlAPI;
            document.getElementsByTagName('body')[0].appendChild(tag);
        }


    };

    PlayerYT.prototype.onYouTubeIframeAPIReadyCallback = function(){

        this.youtubeAPIReady = true;

        if (typeof this.onCallbackYoutubeAPIReady === 'function') {
            this.onCallbackYoutubeAPIReady();
        }

        if( this.options.parsePlayer ){
            this.parsePlayer();
        }

    };

    PlayerYT.prototype.parsePlayer = function(selector){

        var _this = this,
            instancePlayer = null;

        //Parse specific player
        if( typeof selector !== 'undefined' ){
            var selector = document.querySelectorAll(selector);
        }else{
            //Parse all selector by default
            var selectorString = '.player-yt-js:not(.parsed)';
            if( this.options.ignoreSelector !== '' ){
                var selectorIgnoredArray = this.options.ignoreSelector.split(',');
                for( var j = 0, lengthIgnoreSelector = selectorIgnoredArray.length; j < lengthIgnoreSelector; j++ ){
                    selectorString += ':not(' + selectorIgnoredArray[j] + ')';
                }
            }
            var selector = document.querySelectorAll(selectorString);
        }

        for( var i = 0, lengthSelector = selector.length; i < lengthSelector; i++ ){

            var element = selector[i],
                selectorId = element.querySelector('.player-js').getAttribute('id'),
                videoId = element.querySelector('.player-js').getAttribute('data-id'),
                playerPoster = element.parentNode.querySelector('.player-poster');

            utils.addClass('parsed', element);

            //Init Youtube player
            instancePlayer = new YT.Player(selectorId, {
                videoId: videoId,
                height: '100%',
                width: '100%',
                playerVars: this.options.optionsPlayer,
                events: {
                    'onReady': function(data){
                        if (typeof _this.onCallbackPlayerReady === 'function') {
                            _this.onCallbackPlayerReady(data);
                        }
                    },
                    'onStateChange': function(state){

                        var currentParentIframe = state.target.getIframe().parentNode.parentNode,
                            selectorId = currentParentIframe.querySelector('.player-js').getAttribute('id'),
                            playerPoster = currentParentIframe.querySelector('.player-poster');

                        //All player playing are saved in array
                        if( state.data === 1 ){
                            _this.playerOnPlaying.push(selectorId);
                        }else{
                            _this.updateArrayPlayersPlaying(selectorId);
                        }

                        if(!_this.options.multiplePlaying && state.data === 1){
                            _this.pauseOtherVideo(selectorId);
                        }

                        if (typeof _this.onCallbackPlayerStateChange === 'function') {
                            _this.onCallbackPlayerStateChange(state);
                        }else{
                            //On video ended, show poster video
                            if( state.data === 0 ){
                                playerPoster.style.display = 'block';
                            }
                        }

                    }
                }
            });

            element.setAttribute('data-yt-key', _this.players.length);
            this.players.push(instancePlayer);

            //Start video on poster click, and hide it
            playerPoster.addEventListener('click', function(e){

                var instancePlayer = _this.players[e.currentTarget.parentNode.querySelector('.player-yt-js').getAttribute('data-yt-key')];

                e.preventDefault();

                if (typeof _this.onCallbackPlayerClickPoster === 'function') {
                    _this.onCallbackPlayerClickPoster(e, instancePlayer);
                }else{
                    instancePlayer.playVideo();
                    e.currentTarget.style.display = 'none';
                }

            });

        }

    };


    //If player is paused or ended, removed from array
    PlayerYT.prototype.updateArrayPlayersPlaying = function(currentSelectorId){

        for( var i = 0, lengthPlayerPlaying = this.playerOnPlaying.length; i < lengthPlayerPlaying; i++ ){
            if( this.playerOnPlaying[i] === currentSelectorId ){
                this.playerOnPlaying.splice(i, 1);
            }
        }

    };

    //If multiplePlaying option is disabled, pause all other video before play current video
    PlayerYT.prototype.pauseOtherVideo = function(currentSelectorId){

        if( this.playerOnPlaying.length > 1 ){
            for( var i = 0, lengthPlayerPlaying = this.playerOnPlaying.length; i < lengthPlayerPlaying; i++ ){
                //Prevent pause current player
                if( this.playerOnPlaying[i] !== currentSelectorId ){
                    var currentPlayerKey = document.querySelector('#' + this.playerOnPlaying[i]).parentNode.getAttribute('data-yt-key')
                    var instancePlayer = this.players[currentPlayerKey];
                    instancePlayer.pauseVideo()
                }
            }
        }

    };

    var utils = {
        addClass: function(className, selector) {
            if (selector.classList){
                selector.classList.add(className);
            }else{
                selector.className += ' ' + className;
            }
        },
        extend: function(out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                var obj = arguments[i];

                if (!obj){
                    continue;
                }

                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object'){
                            out[key] = this.extend(out[key], obj[key]);
                        }else{
                            out[key] = obj[key];
                        }
                    }
                }
            }

            return out;
        }
    };

    window.PlayerYT = PlayerYT;

})();