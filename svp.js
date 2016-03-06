(function () {
    "use strict";

    var OPTIONS = {
            fps: 10,
            totalFrames: 0,
            videoName: ''
        },
        SVP_SELECTOR = '.svp',
        CONTROLS_SELECTOR = '.svp-controls',
        IMAGE_SELECTOR = '.svp-image',
        PLAY_SELECTOR = CONTROLS_SELECTOR + ' .play',
        STOP_SELECTOR = CONTROLS_SELECTOR + ' .stop',
        LEFT_SELECTOR = CONTROLS_SELECTOR + ' .left',
        RIGHT_SELECTOR = CONTROLS_SELECTOR + ' .right',
        PAUSE_SELECTOR = CONTROLS_SELECTOR + ' .pause',
        NUM_IMAGES = 7,
        MID_IMAGE = Math.ceil(NUM_IMAGES / 2) - 1,
        SIDE_IMAGES = NUM_IMAGES - MID_IMAGE,
        SMALL = 'small',
        MEDIUM = 'medium',
        LARGE = 'large',
        VIDEO_PATH = 'stills/%NAME%/%SIZE%/%NAME%%INDEX%.jpg';

    var SVP = function ($svp) {
        this.$svp = $svp;
        this.frameIndex = 0;
        this.$images = $svp.find(IMAGE_SELECTOR);
        this.controls = {
            $play: $svp.find(PLAY_SELECTOR),
            $stop: $svp.find(STOP_SELECTOR),
            $pause: $svp.find(PAUSE_SELECTOR),
            $left: $svp.find(LEFT_SELECTOR),
            $right: $svp.find(RIGHT_SELECTOR)
        };
        this.attachEvents();
    };
    SVP.prototype = {
        loadVideo: function (data) {
            this.options = $.extend({}, OPTIONS, data);
            this.stop();
        },
        attachEvents: function () {
            this.controls.$play.click($.proxy(this, 'play'));
            this.controls.$stop.click($.proxy(this, 'stop'));
            this.controls.$left.click($.proxy(this, 'left'));
            this.controls.$right.click($.proxy(this, 'right'));
            this.controls.$pause.click($.proxy(this, 'pause'));
            this.$images.click($.proxy(this, 'onImageClicked'));
        },
        getImagePath: function (size, index) {
            return VIDEO_PATH
                .replaceAll('%NAME%', this.options.videoName)
                .replaceAll('%SIZE%', size)
                .replaceAll('%INDEX%', index);
        },
        onImageClicked: function (event) {
            var $img = $(event.target);
            var imageIndex = $img.index() + 1;
            var midImageIndex = (Math.ceil(NUM_IMAGES / 2));
            var frameDiff = imageIndex - midImageIndex;

            this.skip(this.frameIndex + frameDiff);
        },
        skip: function (frameIndex) {
            this.frameIndex = Math.max(0, frameIndex);
            this.pause();
        },
        setImage: function (imageIndex, frameIndex) {
            var size = (MID_IMAGE === imageIndex) ? MEDIUM : SMALL;
            this.$images.eq(imageIndex).attr('src', this.getImagePath(size, frameIndex));
        },
        play: function () {
            this.playTimer = setInterval($.proxy(this, 'tick'), 1000 / this.options.fps);
        },
        pause: function () {
            clearInterval(this.playTimer);
            this.render();
        },
        stop: function () {
            this.pause();
            this.frameIndex = 0;
            this.render();
        },
        left: function () {
            this.pause();
            this.prev();
        },
        right: function () {
            this.pause();
            this.next();
        },
        prev: function () {
            this.frameIndex = Math.max(0, this.frameIndex - 1);
            this.render();
        },
        next: function () {
            this.frameIndex = Math.min(this.options.totalFrames - NUM_IMAGES, this.frameIndex + 1);
            this.render();
        },
        tick: function () {
            if (this.frameIndex >= this.options.totalFrames) {
                this.pause();
            } else {
                this.next();
            }
        },
        render: function () {
            if (this.options.videoName) {
                var that = this;
                this.$images.each(function (i) {
                    that.setImage(i, that.frameIndex + i);
                });
            }
        }
    };

    SVP.init = function ($el) {
        var svp = new SVP($el);
        var data = $el.data('svp');
        svp.loadVideo(data);
    };

    window.SVP = SVP;

    //Initialize
    $(SVP_SELECTOR).each(function () {
        SVP.init($(this));
    });
})();
