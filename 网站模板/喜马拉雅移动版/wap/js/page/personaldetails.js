/// <reference path="../common/paging.js" />
var personaldetails = {
    paging: null,
    uid: 0,
    soundInfo: null,
    Init: function () {
        var uid = $("#page").attr("uid");

        this.paging = new Paging("../../../../personal_details/get_more");
        this.paging.Init($(".get-more"), $(".list-item"), {
            page: 2,
            per_page: 30,
            uid: uid
        });
        this.paging.doResetBind = this.BindPagEvent;
        this.uid = uid;
        this.soundInfo = new PlayInfo($("#page"), location.href);
        this.BindEvent();
        if (helper.events.isIDevice) {
            $("#iframeopen").attr("src", "../../../../open@msg_type=12&uid=" + uid);
        }
    },
    BindPagEvent: function ($con) {
        $(".attentionIcon,.letter,.pdCount,.downloadIcon").off().on("click", function (e) {
            var target = e.currentTarget, type = 0;

            switch (target.className) {
                case "attentionIcon": //"想关注TA？看TA资料？\n立即下载喜马拉雅手机客户端\n就可以实现！"
                    type = 1;
                    break;
                case "letter": //"想和TA聊天?\n立即下载喜马拉雅手机客户端\n就可以实现！"
                    type = 2;
                    break;
                case "pdCount":
                    type = 1;
                    break;
                default:
                    break;
            }

            location.href = "../../../../download@type=" + type;

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
                personaldetails.soundInfo.Init(sound_id, uid, sound_url, sound_duration, sound_large_pic, sound_wave, sound_uploadid,sound_title);
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

personaldetails.Init();
