var startX, startY, lastX, lastY, lock = false, isover = false, timeid = 0;
var discover = {
    count: 0,
    maxCount: 0,
    $ul: null,
    $switchPoint: null,
    touchStart: function (e) {
        if (!lock) {
            var touch = e.touches[0]; //获取第一个触点  
            var x = Number(touch.pageX); //页面触点X坐标  
            var y = Number(touch.pageY); //页面触点Y坐标  
            //记录触点初始位置  
            startX = x;
            startY = y;
        }
    },
    touchMove: function (e) {
        var touch = e.touches[0]; //获取第一个触点  
        var x = Number(touch.pageX); //页面触点X坐标  
        var y = Number(touch.pageY); //页面触点Y坐标 

        lastX = x;
        lastY = y;
        x = Math.abs(lastX - startX);
        y = Math.abs(lastY - startY);

        if (x > y) {
            e.preventDefault();
            if (!lock) {
                if (x > 25) {
                    lock = true;
                    clearTimeout(timeid);
                    //左右滑动  
                    if (lastX > startX) {//右
                        this.count -= 1;
                    } else {//左
                        this.count += 1;
                    }
                    this.doChange();
                    return false;
                }
            }
        }
    },
    touchEnd: function (e) {
        lock = false;
        isover = false;
    },
    touchCancel: function (e) {
        lock = false;
        isover = false;
    },
    doChange: function () {
        if (this.count < 0) this.count = this.maxCount;
        else if (this.count > this.maxCount) this.count = 0;
        var width = 13 * this.count;

        this.$switchPoint.css({
            "-webkit-transition": "600ms cubic-bezier(0.1, 0.57, 0.1, 1)",
            "transition": "300ms cubic-bezier(0.1, 0.57, 0.1, 1)",
            "-webkit-transform": "translate(" + width + "px, 0px) translateZ(0px)"
        });
        width = 300 * this.count;
        this.$ul.css({
            "-webkit-transition": "600ms cubic-bezier(0.1, 0.57, 0.1, 1)",
            "transition": "300ms cubic-bezier(0.1, 0.57, 0.1, 1)",
            "-webkit-transform": "translate(-" + width + "px, 0px) translateZ(0px)"
        });
        this.AutoPlay();
    },
    doInitFocusImg: function () {
        var _this = this, type = "", pic, title, href;
        var html = [], index = 0, count = 0;
        var temp = "";

        $.ajax({
            url: "m/focus_image",
            success: function (data) {
                if (data["ret"] == 0) {
                    var $ul = $(".pic-switch ul.pic-m"), liCount = data["list"].length,
                    $switch = $(".pic-switch .switch");

                    _this.$ul = $ul;
                    _this.$switchPoint = $switch.find(".switchPoint");
                    for (var item in data["list"]) {
                        item = data["list"][item];
                        type = item["type"];
                        switch (type) {
                            case 7: //多个声音
                                href = "mutitrack/" + type + "/" + item["id"];
                                break;
                            case 6: //多个专辑
                                href = "mutialbum/" + type + "/" + item["id"];
                                break;
                            case 5: //多个用户
                                href = "mutiuser/" + type + "/" + item["id"];
                                break;
                            case 4: //链接
                                href = item["url"];
                                break;
                            case 3: //单个声音
                                href = "./" + item["uid"] + "/sound/" + item["track_id"];
                                break;
                            case 2: //单个专辑
                                href = "./" + item["uid"] + "/album/" + item["album_id"];
                                break;
                            case 1: //单个用户
                                href = "./" + item["uid"];
                                break;
                        }
                        temp = '<li>' +
                                '    <div class="pic">' +
                                '      <div class="mask"></div>' +
                                '        <a href="' + href + '">' +
                                '        <img width="300" height="130" src="' + item["pic"] + '" alt="">' +
                                '      </a>' +
                                '    </div>' +
                                '  </li>';
                        html.push(temp);
                        var img = new Image();
                        img.onload = function () {
                            count++;
                            if (count == liCount) {
                                _this.initFocusImgTouch($ul, $switch, html, liCount);
                            }
                        }
                        img.onerror = function () {
                            count++;
                            if (count == liCount) {
                                _this.initFocusImgTouch($ul, $switch, html, liCount);
                            }
                        }
                        img.src = item["pic"];
                    }
                }
            }, error: function () {

            }
        });
    },
    initFocusImgTouch: function ($ul, $switch, html, liCount) {
        var _this = this;

        $ul.empty().append(html.join(''));
        if ($ul.size()) {
            ul = $ul[0];
            ul.addEventListener("touchstart", function (e) {
                _this.touchStart(e);
            }, false);
            ul.addEventListener("touchmove", function (e) {
                _this.touchMove(e);
            }, false);
            ul.addEventListener("touchend", _this.touchEnd, false);
            ul.addEventListener("touchCancel", _this.touchCancel, false);
            $ul.width(300 * liCount);
            $switch.width(13 * liCount);
            _this.maxCount = --liCount;
        }
        _this.AutoPlay();
    },
    doInitCateImgs: function () {
        $(".category .cateBtn img").each(function () {
            var $this = $(this);
            var img = new Image();

            img.onload = function () {
                $this.attr("src", $this.attr("url")).show();
            }
            img.src = $this.attr("url");
        });
    },
    Init: function () {
        this.BindEvent();
        this.doInitCateImgs();
        this.doInitFocusImg();
        helper.setLink();
    },
    BindEvent: function () {
        $(".cateBtn.down").on("click", function () {
            $(".cateBtnCon.hidden").toggle();
            $(this).toggleClass("up");
        });
        $(".btn-search").on("click", function () {
            if (DisSearch) {
                DisSearch.init();
            }
        });
    },
    AutoPlay: function () {
        var _this = this;
        timeid = setTimeout(function () {
            _this.count++;
            _this.doChange();
        }, 3000);
    }
};

discover.Init();