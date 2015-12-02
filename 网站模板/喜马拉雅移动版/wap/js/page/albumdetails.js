/// <reference path="../common/paging.js" />
var albumdetails = {
    paging: null,
    albumId: 0,
    soundInfo: null,
    Init: function () {
        var $page = $("#page"), albumId = $page.attr("album_id");

        this.paging = new Paging("../../album_details/get_more");
        this.paging.Init($(".get-more"), $(".list-item"), {
            page: 1,
            per_page: 30,
            album_id: albumId
        });
        this.paging.doResetBind = this.BindPagEvent;
        this.albumId = albumId;
        this.soundInfo = new PlayInfo($page, location.href);
        this.BindEvent();
        this.BindPagEvent($page);
        //this.paging.GetData();
        helper.doScrollTitle($(".header .title"));
        if (helper.events.isIDevice) {
            $("#iframeopen").attr("src", "../../open@msg_type=13&album_id=" + albumId);
        }
    },
    BindPagEvent: function ($con) {
        $(".downloadIcon").off().on("click", function () {
            location.href = "../../download";
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
                albumdetails.soundInfo.Init(sound_id, uid, sound_url, sound_duration, sound_large_pic, sound_wave, sound_uploadid, sound_title);
            }

            return false;
        });
    },
    BindEvent: function () {
        var _this = this;

        $(".user").on("click", function () {
            var url = $(this).attr("uid");
            if (url) {
                location.href = "../../" + url;
                return false;
            }
        });
    }
};

if (soundManager.isOnReady) {
    albumdetails.Init();
} else {
    soundManager.onready(function () {
        albumdetails.Init();
    });
}