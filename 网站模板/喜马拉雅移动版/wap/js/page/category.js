/// <reference path="../common/paging.js" />
var startX, startY, lastX, lastY, startMove = false, scrollLeft = 0, lastPos = 0, setPos = true;
var Category = {
    paging: null,
    Init: function () {
        var category = $("#page").attr("category");

        this.paging = new Paging("morecategory");
        this.paging.Init($(".get-more"), $(".tagAlbum_bd"), {
            page: 2,
            per_page: 10,
            category: category
        });
        this.BindEvent();
        this.paging.doResetBind = this.BindPagEvent;
    },
    touchend: function () {
        startMove = false;
        if (setPos) {
            lastPos = lastPos + lastX - startX;
        }
        setPos = true;
    },
    touchStart: function (e) {
        var touch = e.touches[0]; //获取第一个触点  
        var x = Number(touch.pageX); //页面触点X坐标  
        var y = Number(touch.pageY); //页面触点Y坐标  
        //记录触点初始位置  
        startX = x;
        startY = y;

        startMove = true;
    },
    touchMove: function (e) {
        var $el = $(e.currentTarget);
        var touch = e.touches[0]; //获取第一个触点  
        var x = Number(touch.pageX); //页面触点X坐标  
        var y = Number(touch.pageY); //页面触点Y坐标 
        var moves = 0;

        lastX = x;
        lastY = y;
        if (startMove) {
            if (Math.abs(lastX - startX) > Math.abs(lastY - startY)) {
                e.preventDefault();
            }
            moves = lastPos + lastX - startX;
            //左右滑动  
            if (lastX - startX > 0) {//右
                if (moves > 0) {
                    moves = lastPos = 0;
                    setPos = false;
                }
            } else {//左
                if (moves < this.width * -1 + 320) {
                    moves = lastPos = this.width * -1 + 320;
                    setPos = false;
                }
            }
            this.$tagList.css({
                "-webkit-transition": "-webkit-transform 0ms",
                "transition": "-webkit-transform 0ms",
                "-webkit-transform-origin": "0px 0px",
                "-webkit-transform": " translate(" + moves + "px, 0px) scale(1) translateZ(0px)"
            });
        }
    },
    BindPagEvent: function () {
        //专辑点击
        $(".albumWorks").off().on("click", function () {
            var url = this.attributes["data_url"];

            if (url) {
                location.href = url.nodeValue;
            }

            return false;
        });
    },
    BindEvent: function () {
        var $tagList = $(".tagList"), ul,
        _this = this;

        _this.BindPagEvent();
        //标签拖动效果
        _this.$tagListWrap = $(".tagListWrap");
        _this.$tagList = $tagList;
        if ($tagList.size()) {
            ul = $tagList[0];
            var liCount = $(ul).find("li").size();
            if (liCount > 2) {
                this.width = liCount * 120 + 20;
                $(ul).width(this.width);
                ul.addEventListener("touchstart", function (e) {
                    _this.touchStart(e);
                }, false);
                ul.addEventListener("touchmove", function (e) {
                    _this.touchMove(e);
                }, false);
                ul.addEventListener("touchend", this.touchend, false);
                ul.addEventListener("touchcancel", this.touchend, false);
            }
        }
    }
};

Category.Init();