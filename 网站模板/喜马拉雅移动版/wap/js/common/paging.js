
var Paging = function (url) {
    this.$el = null;
    this.$container = null;
    this.data = {};
    this.maxPage = 1;
    this.locked = false;
    this.url = url;
    this.title = "";

    this.filter = new Filter(this);

    return this;
};
Paging.prototype.Init = function ($el, $container, data) {
    var _this = this;

    _this.$el = $el;
    _this.$container = $container;
    _this.data = data;
    _this.maxPage = $container.attr("maxpage") || 1;

    if (_this.maxPage <= 1) {
        _this.$el.hide();
    } else {
        $el.on("click", function () {
            if (!_this.locked) {
                _this.GetData();
            }
        });
    }
    _this.filter.Init();
};
Paging.prototype.ResetCount = function (maxPage) {
    this.maxPage = maxPage;
    if (this.maxPage <= 1) {
        this.$el.hide();
    } else {
        this.$el.show();
    }
    $("#resetcount").remove();
};
Paging.prototype.GetData = function () {
    var _this = this;
    var $div = $(document.createElement("div"));

    _this.locked = true;
    _this.$el.addClass("loading").text('');
    $.ajax({
        url: _this.url,
        dataType: "HTML",
        data: _this.data,
        type: "GET",
        success: function (data, b, c) {
            _this.data.page++;
            $div.append(data);
            _this.$container.append($div);
            _this.doResetBind($div);
            $div.find("[sound_id]").playable();
            if (_this.data.page > _this.maxPage) {
                _this.$el.hide();
                return;
            }
        },
        error: function () {
            alert("服务器忙，请稍后再试。");
        },
        complete: function () {
            _this.locked = false;
            _this.$el.removeClass("loading").text('获取更多...');
        }
    });
};
Paging.prototype.Search = function (cate) {
    if (this.cate != this.data.category) {
        this.$container.empty();
        this.data.page = 1;
        this.data.category = cate;
        this.$el.show();
        this.GetData();
    }
};
Paging.prototype.doResetBind = function () {
    
};

var Filter = function (paging) {
    this.$header = $(".header");
    this.$popover = $(".header .popover");
    this.$title = this.$header.find(".title");
    this.$i = this.$title.find("i");
    this.paging = paging;
    this.currentCate = null;
};
Filter.prototype.ToggleFilter = function (immediately) {
    if (immediately === true) {
        this.$popover.hide();
    } else {
        this.$popover.slideToggle();
    }
    this.$i.toggleClass("sup");
};
Filter.prototype.Init = function () {
    var _this = this, cate;

    _this.$title.off().on("click", function () {
        _this.ToggleFilter();
    });

    _this.$popover.on("click", "li a", function () {
        var $this = $(this);
        cate = $this.attr("category");

        if (_this.currentCate) {
            _this.currentCate.parent().removeClass("select");
        }
        _this.currentCate = $this;
        if (cate) {
            $this.parent().addClass("select");
            _this.ToggleFilter(true);
            _this.paging.Search(cate);
        }

        return false;
    });
};


function PlayInfo($page, url) {
    this.soundID = 0;
    this.uid = 0;
    this.$container = $(document.createElement("div"));
    this.$container.hide();
    $(document.body).append(this.$container);
    this.$page = $page;
    this.url = url;
    this.paging = null;
    this.scrollTop = 0;
    this.isNew = false;

    this.$container.find(".btn-back").trigger(helper.events.START_EV);
};
PlayInfo.prototype.Init = function (soundID, uid, sound_url, sound_duration, sound_large_pic, sound_wave, sound_uploadid, sound_title) {
    this.isNew = soundID != this.soundID;
    if (!this.isNew) {
        this.scrollTop = $(document.body).scrollTop();
        this.$container.show();
        this.$page.hide();
        helper.scrollTo(0);
    } else {
        this.uid = uid;
        this.soundID = soundID;
        this.renderData1(sound_url, sound_duration, sound_large_pic, sound_wave, sound_uploadid, sound_title);
    }
    this.title = document.title;
    document.title = sound_title + "（喜马拉雅）";
    ok = true;
};
PlayInfo.prototype.renderData1 = function (sound_url, sound_duration, sound_large_pic, sound_wave, sound_uploadid, sound_title) {
    var _this = this;

    _this.scrollTop = $(document.body).scrollTop();

    try {
        history.pushState({ ajaxSound: true }, "", "./" + _this.uid + "/sound/" + _this.soundID);
    } catch (e) {

    }
    _this.$container.html(templatehtm);
    _this.$container.find("#sound_large_pic").on("error", function () {
        $(this).off().remove();
    });
    _this.$container.show();
    _this.$container.find(".player").attr({
        sound_id: _this.soundID,
        sound_url: sound_url,
        sound_duration: sound_duration
    });
    _this.$container.find("#sound_large_pic").attr("src", sound_large_pic);
    _this.$container.find(".player_wavebox").attr({
        sound_wave: sound_wave,
        sound_uploadid: sound_uploadid
    });
    _this.$container.find(".title").text(sound_title);
    _this.$container.find(".time.time-whole").text(helper.getTime(sound_duration * 1));
    _this.$page.hide();
    _this.renderComment();
    _this.$container.find("[sound_id]").playable();
    wave.render();
    _this.bindBackEvent();
    helper.doScrollTitle(_this.$container.find(".header .title"));
    helper.scrollTo(0);
    if (helper.events.isIDevice) {
        $("#iframeopen").attr("src", "open@msg_type=11&track_id=" + _this.soundID);
    }
    helper.setLink();
};

PlayInfo.prototype.renderData = function () {
    var _this = this;

    $.ajax({
        url: "playings/get_base_playing",
        type: "GET",
        dataType: "HTML",
        data: {
            id: _this.soundID,
            per_page: 5
        },
        success: function (html) {
            history.pushState({ ajaxSound: true }, "", "./" + _this.uid + "/sound/" + _this.soundID);
            _this.$container.html(html).show();
            _this.$page.hide();
            _this.renderComment();
            _this.$container.find("[sound_id]").playable();
            wave.render();
            _this.bindBackEvent();
        },
        error: function () {
            alert("服务器忙，请稍后再试。");
            _this.soundID = 0;
        }
    });
};
PlayInfo.prototype.renderComment = function () {
    var $commentShareInfo = this.$container.find("#comment"), _this = this;

    helper.setLink();
    $commentShareInfo.append("<div class='loading'></div>");
    $.ajax({
        url: "playings/get_intro_and_comment",
        type: "GET",
        dataType: "HTML",
        data: {
            id: _this.soundID,
            per_page: 5
        },
        success: function (html) {
            $commentShareInfo.html(html);
            $commentShareInfo.find(".commentcon img").remove();
            _this.paging = new Paging("playings/get_comments");
            _this.paging.Init($commentShareInfo.find(".get-more"), $commentShareInfo.find(".comment-list"), {
                page: 2,
                per_page: 5,
                id: _this.soundID
            });
            _this.bindEvent();
        },
        error: function () {
            alert("服务器忙，请稍后再试。");
        }
    });
};
PlayInfo.prototype.bindBackEvent = function () {
    var _this = this;

    _this.$container.find(".btn-back").on("click", function () {
        document.title = _this.title;
        _this.$container.find(".player-btn.is-paused").trigger("click");
        _this.$page.show();
        _this.$container.hide();
        if (ok === true) {
            try {
                history.replaceState(null, "", _this.url);
                if (_this.isNew) {
                    history.back(-1);
                }
            } catch (e) {

            }
            //history.pushState({ ajaxSound: false }, "", _this.url);
        } else {
            //history.pushState(null, "", _this.url);
        }
        helper.scrollTo(_this.scrollTop);
    });
};
PlayInfo.prototype.bindEvent = function () {
    var _this = this;

    _this.$container.find(".play-item-outter").on("click", function () {
        if (_this.uid) {
            location.href = "./" + _this.uid;
        }

        return false;
    });
    _this.$container.find(".share").on("click", function (e) {
        location.href = "download@type=3";

        return false;
    });
    _this.$container.find(".player-like").on("click", function () {
        location.href = "download@type=4";

        return false;
    });
};
var ok = true;
window.addEventListener('popstate', function (e) {
    if (history.state) {
        var state = e.state;
        if (state) {
            if (state.ajaxSound === true) {
                $(".btn-back").trigger("click");
            } else if (state.ajaxSound === false) {
                $(".btn-back").trigger("click");
            }
        }
    } else {
        ok = false;
        $(".btn-back").trigger("click");
    }
}, false);
window.addEventListener('unload', function (e) {
    $(".btn-back").trigger("click");
}, false);
