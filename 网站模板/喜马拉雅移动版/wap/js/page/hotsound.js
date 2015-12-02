/// <reference path="common/paging.js" />
var hotSound = {
    paging: null,
    soundInfo: null,
    Init: function () {
        this.paging = new Paging("hotsound/get_hot_sound");
        this.paging.Init($(".get-more"), $(".list-item"), {
            page: 2,
            per_page: 30,
            category: ""
        });
        this.paging.doResetBind = this.BindPagEvent;
        this.soundInfo = new PlayInfo($("#page"), location.href);
        this.BindEvent();
    },
    BindPagEvent: function ($con) {
        $(".downloadIcon").off().on("click", function () {
            location.href = "download";
            return false;
        });
        $con.find(".item1").on("click", function () {
            var $this = $(this);
            var sound_id = $this.attr("sound_id");
            var uid = $this.attr("uid");
            var sound_url = $this.attr("sound_url"),
                sound_duration = $this.attr("sound_duration"),
                sound_large_pic = $this.attr("sound_large_pic"),
                sound_wave = $this.attr("sound_wave"),
                sound_uploadid = $this.attr("sound_uploadid"),
                sound_title = $this.find(".title").text();

            if (sound_id) {
                hotSound.soundInfo.Init(sound_id, uid, sound_url, sound_duration, sound_large_pic, sound_wave, sound_uploadid,sound_title);
            }

            return false;
        });
    },
    BindEvent: function () {
        var _this = this;

        this.BindPagEvent($("#page"));
//        $(".list-item").on("click", ".item1", function () {
//            var $this = $(this);
//            var sound_id = $this.attr("sound_id");
//            var uid = $this.attr("uid");
//            var sound_url = $this.attr("sound_url"),
//                sound_duration = $this.attr("sound_duration"),
//                sound_large_pic = $this.attr("sound_large_pic"),
//                sound_wave = $this.attr("sound_wave"),
//                sound_uploadid = $this.attr("sound_uploadid");

//            if (sound_id) {
//                _this.soundInfo.Init(sound_id, uid, sound_url, sound_duration, sound_large_pic, sound_wave, sound_uploadid);
//            }

//            return false;
//        });
    }
};

hotSound.Init();