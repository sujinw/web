(function ($) {
    /**
    * 判断浏览器
    */
    var matched, browser;
    jQuery.uaMatch = function (ua) {
        ua = ua.toLowerCase();
        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    };
    jQuery.wxMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(MicroMessenger)[ \/]([\w.]+)/gi.exec(ua) || /(MicroMessenger)/gi.exec(ua) || [];
        var version = match[2] || "0";



        return {
            browser: (match[1] || "").toLowerCase(),
            version: version
        };
    };

    matched = jQuery.uaMatch(navigator.userAgent);
    browser = {};
    if (matched.browser) {
        browser[matched.browser] = true;
        browser.version = matched.version;
    }

    matched = jQuery.wxMatch(navigator.userAgent);

    if (!$.browser) {
        $.browser = browser;
    }
    jQuery.cookie = function (name, value, options) {
        if (typeof value != 'undefined') {
            options = options || {};
            if (value === null) {
                value = '';
                options = $.extend({}, options);
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString();
            }
            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    };
    var isAndroid = (/android/gi).test(navigator.appVersion);
    var isIDevice = (/iphone|ipad/gi).test(navigator.appVersion);
    var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);
    var hasTouch = 'ontouchstart' in window && !isTouchPad;
    var RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize';
    var START_EV = hasTouch ? 'touchstart' : 'mousedown';
    var MOVE_EV = hasTouch ? 'touchmove' : 'mousemove';
    var END_EV = hasTouch ? 'touchend' : 'mouseup';
    var CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup';
    var isWeixin = matched["browser"] == "micromessenger";
    var verWeixin = matched["version"] || 0;

    window.helper = {
        browser: browser,
        events: {
            isAndroid: isAndroid,
            isIDevice: isIDevice,
            isWeixin: isWeixin,
            verWeixin: verWeixin,
            isTouchPad: isTouchPad,
            hasTouch: hasTouch,
            RESIZE_EV: RESIZE_EV,
            START_EV: START_EV,
            MOVE_EV: MOVE_EV,
            END_EV: END_EV,
            CANCEL_EV: CANCEL_EV,
            CLICK: 'click',
            BLUR: 'blur'
            // WHEEL_EV: this.browser.vendor == 'Moz' ? 'DOMMouseScroll' : 'mousewheel'
        },
        getTime: function (nMSec, toObj) {
            var nSec = Math.floor(nMSec / 1000),
		        min = Math.floor(nSec / 60),
		        hour = Math.floor(min / 60),
		        sec = nSec - (min * 60);
            min = min - (hour * 60);
            return (!toObj ? (hour ? (hour + ":") : "") + ((min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec)) : { 'min': min, 'sec': sec, 'hour': hour });
        },
        scrollTo: function (offset) {
            $("html, body").animate({
                scrollTop: offset
            }, 120);
        },
        doScrollTitle: function ($title) {
            var width = 0;

            $title.css("overflow", "auto");
            $title.scrollLeft($title[0].scrollWidth + 10);
            width = $title.scrollLeft();
            if (width) {
                $title.css("padding", "0 5px");
                width += 15;
                $title.scrollLeft(0);
                $title.css("overflow", "hidden");
                this.doScrollT($title, width, false);
            }
        },
        doScrollT: function ($title, width, isTop) {
            var _this = this;

            $title.animate({
                scrollLeft: isTop ? 0 : width
            }, 3000, function () {
                $title.delay(800);
                _this.doScrollT($title, width, !isTop);
            });
        },
        setLink: function () {
            $("a.iosBtn,a.androidBtn,a.wpBtn").off().on(helper.events.START_EV, function () {
                if (helper.events.isWeixin) {
                    if (helper.events.isAndroid) {
                        if (helper.events.verWeixin == 0) {
                            location.href = "../ti50.3g.qq.com/open/s@aid=jumpurl&url=http_3A_2F_2Furl.cn_2FJZFkAS";
                            return false;
                        }
                        var version = helper.events.verWeixin.replace(/\./g, "").substring(0, 2);
                        while (version.length < 3) {
                            version += "0";
                        }
                        if (version * 1 > 40) {
                            location.href = "../ti50.3g.qq.com/open/s@aid=jumpurl&url=http_3A_2F_2Furl.cn_2FJZFkAS";
                            return false;
                        }
                    } else if (helper.events.isIDevice) {
                        var version = helper.events.verWeixin.replace(/\./g, "").substring(0, 3);
                        while (version.length < 3) {
                            version += "0";
                        }
                        if (version * 1 >= 503) {
                            location.href = "../ti50.3g.qq.com/open/s@aid=jumpurl&url=" + encodeURIComponent("../url.cn/86ju3p");
                            return false;
                        }
                    }
                }
            });
        }
    };

    helper.setLink();

    return window.helper;
})($);