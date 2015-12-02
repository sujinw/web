/**
 * Created with JetBrains WebStorm.
 * User: xiaoqing
 * Date: 13-8-21
 * Time: 上午10:37
 * To change this template use File | Settings | File Templates.
 */
var DisSearch = {
    _isInit: false,
    scope: "all",
    maxHistory: 8,
    cookieName: "search_history",
    init: function () {
        if (!this._isInit) {
            this._isInit = true;
            var $con = $("#page3");
            this.$container = $con;
            this.$discoverPage = $("#page");

            this.$input = $con.find(".searchPanel input[type=text]");
            this.$result = $con.find(".searchList");
            this.$noResult = $con.find(".searchNoResult");
            this.$clearHistory = $con.find(".searchClear");
            this.scope = "all";
            this.bindEvents();
        }
        this.$input.val("");
        this.$container.show();
        this.$discoverPage.hide();
        this.initHistoryList();
        $con.find(".btn-back").css("visibility", "hidden");
    },
    bindEvents: function () {
        var _this = this,
            $con = this.$container;
        //清空 x
        $con.on("click", ".closeBtn", function () {
            _this.clearSearch();
            _this.initHistoryList();
        });
        //取消
       /* $con.on("click", ".btn-back", function () {
            _this.clearSearch();
            _this.backToDiscover();
            return false;
        });*/
        //搜索框 事件
        this.$input.on("input", function () {
            _this.holdSearch();
        });
        //搜索类型
        $con.on("click", ".searchType a", function () {
            var $btn = $(this);
            if ($btn.hasClass("on")) {
                return;
            }
            _this.scope = $btn.attr('data-scope');
            $btn.parent().find(".on").removeClass("on");
            $btn.addClass("on");
            _this.holdSearch();
        });
        $con.on("click", ".searchBtn", function () {
            _this.onSearch();
        });
        //清除历史
        this.$clearHistory.on("click", function () {
            _this.chearHistory();
        });
        //搜索结果列表点击
        this.$result.on("click", "li a", function () {
            var $a = $(this),
                title = $a.attr("data-title");
            _this.setHistory(title);
        });
    },
    clearSearch: function () {
        this.$input.val("");
        this.clearResultList();
    },
    clearResultList: function () {
        this.$result.html("");
        this.$clearHistory.hide();
        this.$noResult.hide();
    },
    renderResultList: function (html) {
        this.$result.html(html);
        this.$clearHistory.hide();
    },
    //搜索历史
    initHistoryList: function () {
        var history = this.getHistory();
        if (!history) {
            this.$clearHistory.hide();
            return;
        }
        var data = {
            list: history
        };
        var html = this.getHistoryList(data);
        this.renderResultList(html);
        this.$clearHistory.show();
    },
    chearHistory: function () {
        $.cookie(this.cookieName, "");
        this.clearResultList();
    },
    //cooki中获取搜索历史数据
    getHistory: function () {
        var cookie = $.cookie(this.cookieName);
        if (!cookie) {
            return;
        }
        var items = cookie.split("||");
        var history = [];
        for (var i = 0, l = items.length; i < l; i++) {
            var item = items[i];
            if($.trim(item)){
                var h = {
                    title: decodeURIComponent(item),
                    icon: ""
                };
                history.push(h);
            }
        }
        return history;
    },
    //设置搜索数据
    setHistory: function (title) {
        if(!$.trim(title)) return;
        var cookie = $.cookie(this.cookieName) || "";
        var current = encodeURIComponent(title);
        if (cookie.indexOf(current) >= 0) {
            //如果有重复的 就把老的删掉
            cookie = cookie.replace(current, "");
        }
        if (cookie) {
            cookie = "||" + cookie;
        }
        cookie = current + cookie;
        cookie = cookie.replace(/\|{4}/g, "||");
        var arr = cookie.split("||");
        if (arr.length > this.maxHistory) {
            arr.length = this.maxHistory;
            cookie = arr.join("||");
        }
        $.cookie(this.cookieName, cookie);
    },
    holdSearch: function () {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        var _this = this;
        this.timer = setTimeout(function () {
            _this.doSearch();
        }, 100);
    },
    onSearch: function () {
        var condition = this.$input.val(),
            href = "search/search_result@condition="+encodeURIComponent(condition)+"&scope="+this.scope;
        if(!condition) return;
        this.setHistory(condition);
        window.location.href = href;
    },
    doSearch: function () {
        //?keywords=a&scope=album
        //scope :user voice album all
        var _this = this,
            keywords = this.$input.val(),
            data = {
                keywords: keywords,
                scope: this.scope
            };
        if (!keywords) {
            this.initHistoryList();
            return;
        }
        _this._currentKey = keywords;
        $.ajax({
            type: "post",
            url: "s/search/suggest",
            dataType: "json",
            data: data,
            success: function (data) {
                if (_this.scope == data.scope && _this._currentKey == keywords) {
                    _this.searchCallback(data);
                }
            },
            error: function () {
            }
        });
    },
    searchCallback: function (data) {
        var html = "";
        switch (this.scope) {
            case "all":
                html = this.getVoiceList(data.sound);
                html += this.getUserList(data.user);
                html += this.getAlbumList(data.album);
                break;
            case "voice":
                html = this.getVoiceList(data);
                break;
            case "user":
                html = this.getUserList(data);
                break;
            case "album":
                html = this.getAlbumList(data);
                break;
            default :
                break;
        }
        if (html) {
            this.$noResult.hide();
            this.renderResultList(html);
        } else {
            this.$noResult.hide();
            this.initHistoryList();
        }
    },
    _listItem: '<li><a href="{href}" data-title="{title}" data-icon="{icon}"><span class="{icon}"></span>{title}</a></li>',
    getListItem: function (data) {
        return this._listItem.replace(/\{(.*?)\}/g, function (a, b, c) {
            return data[b] || "";
        });
    },
    getVoiceList: function (data) {
        var param = {
            title: function (doc) {
                return doc.title;
            },
            href:function(doc){
                return "sound/"+doc.id;
            },
            icon: "soundIcon2"
        };
        return this.getList(data, param);
    },
    getUserList: function (data) {
        var param = {
            title: function (doc) {
                return doc.title;
            },
            href:function(doc){
                return "./"+doc.id;
            },
            icon: "userIcon2"
        };
        return this.getList(data, param);
    },
    getAlbumList: function (data) {
        var param = {
            title: function (doc) {
                return doc.title;
            },
            href:function(doc){
                return "album/"+doc.id;
            },
            icon: "albumIcon2"
        };
        return this.getList(data, param);
    },
    getList: function (data, param) {
        var list = data.list,
            html = "";
        if (!list) {
            return "";
        }
        for (var i = 0, l = list.length; i < l; i++) {
            var doc = list[i],
                title =  param ? param.title(doc) : doc.title,
                dd = {
                    title: title,
                    icon: param.icon,
                    href:param.href(doc)
                };
            html += this.getListItem(dd);
        }
        return html;
    },
    getHistoryList:function(data){
        var list = data.list,
            html = "";
        if (!list) {
            return "";
        }
        for (var i = 0, l = list.length; i < l; i++) {
            var doc = list[i],
                title =  doc.title,
                dd = {
                    title: title,
                    href:'search/search_result@condition='+encodeURIComponent(title)+'&scope='+this.scope
                };
            html += this.getListItem(dd);
        }
        return html;
    },
    backToDiscover: function () {
        this.$container.hide();
       this.$discoverPage.show();
    }
};