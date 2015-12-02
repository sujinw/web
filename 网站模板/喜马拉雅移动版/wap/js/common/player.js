(function($, soundManager) {
	var playable = {
		$last : null,
		last : null,
		$lastSoundIds : null,
		events : {
			play : function() {
				var addeds = this.addeds;
				for ( var i = 0, len = addeds.length; i < len; i++) {
					var added = addeds[i];
					var $el = added.$el;
					var $btn = added.$btn;
					var $progressbar = added.$progressbar;
					var $soundIds = $el.closest("[sound_ids]");
					added.$soundIds = $soundIds;
					added.$btn = $btn;
					playable.$last = $el;
					playable.last = this;
					playable.$lastSoundIds = $soundIds.size() ? $soundIds : null;
					$btn.addClass("is-paused").removeClass("is-ready is-playing is-loading");
				}
				playCount.putInfo(this.soundId, (new Date()).getTime(), "onplay");
				playCount.render(this.soundId);
			},
			stop : function() {
				var addeds = this.addeds;
				for ( var i = 0, len = addeds.length; i < len; i++) {
					var added = addeds[i];
					var $btn = added.$btn;
					$btn.addClass("is-ready").removeClass("is-paused is-playing is-loading");
				}
				playCount.postInfo(this.soundId);
			},
			pause : function() {
				var addeds = this.addeds;
				for ( var i = 0, len = addeds.length; i < len; i++) {
					var added = addeds[i];
					var $btn = added.$btn;
					$btn.addClass("is-ready").removeClass("is-paused is-playing is-loading");
				}
				playCount.putInfo(this.soundId, (new Date()).getTime(), "onpause");
			},
			resume : function() {
				var addeds = this.addeds;
				for ( var i = 0, len = addeds.length; i < len; i++) {
					var added = addeds[i];
					var $btn = added.$btn;
					$btn.addClass("is-paused").removeClass("is-ready is-playing is-loading");
				}
				playCount.putInfo(this.soundId, (new Date()).getTime(), "onresume");
			},
			finish : function() {
				var addeds = this.addeds;
				for ( var i = 0, len = addeds.length; i < len; i++) {
					var added = addeds[i];
					var $btn = added.$btn;
					var $playbar = added.$playbar;
					$btn.addClass("is-ready").removeClass("is-paused is-playing is-loading");
					$playbar.css("width", "0");
				}
				var $last = playable.$last;
				var $soundIds = playable.$lastSoundIds;
				if ($soundIds) {
					var soundIds = $soundIds.attr("sound_ids").split(",");
					var lastSoundId = $last.attr("sound_id");
					var index = soundIds.indexOf(lastSoundId);
					var nextSoundId = soundIds[index + 1];
					var $next = null;
					if (nextSoundId) {
						$next = $soundIds.find("[sound_id=" + nextSoundId + "]");
						$next.trigger("click");
					}
				}
				this._last_position = 0;
				playCount.putInfo(this.soundId, (new Date()).getTime(), "onfinish");
				playCount.postInfo(this.soundId);
			},
			whileloading : $.noop,
			whileplaying : function() {
				if (this.paused)
					return;// 解决音频暂停时会有一些延时的问题。
				var addeds = this.addeds;
				for ( var i = 0, len = addeds.length; i < len; i++) {
					var added = addeds[i];
					var $progressbar = added.$progressbar;
					if (!$progressbar.size()) {
						continue;
					}
					var $playbar = added.$playbar, $seekbar = added.$seekbar, width = $progressbar.width();
					if ($playbar.size()) {
						var p = this.position / (added.duration || this.duration);
						p = p > 1 ? 1 : p;
						$playbar.css("width", 100 * p + "%");
						added.$position.text(helper.getTime(this.position));
					}
					/*
					 * if ($seekbar.size()) { var p = this.bytesLoaded / this.bytesTotal; p = p > 1 ? 1 : p; $seekbar.css("width", 100 * p + "%"); }
					 */
				}
			},
			onbufferchange : function() {
				if (this.isBuffering) {
					playCount.putInfo(this.soundId, (new Date()).getTime(), "onbuffering");
				} else {
					playCount.putInfo(this.soundId, (new Date()).getTime(), "onplay");
				}
			}
		},
		bind : function($el) {
			var _this = this;
			var soundId = $el.attr("sound_id");
			var soundURL = $el.attr("sound_url");
			var $progressbar = $el.find(".player_progressbar");
			var $btn = $el.find(".player-btn");
			var duration = $el.attr("sound_duration");
			var $last = _this.$last;
			var last = _this.last;
			$btn = $btn.size() ? $btn : $el;
			var smSound = soundManager.getSoundById("s" + soundId);
			if (!smSound) {
				smSound = soundManager.createSound({
					id : 's' + soundId,
					url : soundURL,
					multiShot : false,
					onplay : _this.events.play,
					onstop : _this.events.stop,
					onpause : _this.events.pause,
					onresume : _this.events.resume,
					onfinish : _this.events.finish,
					whileloading : _this.events.whileloading,
					whileplaying : _this.events.whileplaying
				});
				smSound.addeds = [];
				smSound._last_position = 0;
				smSound.soundId = soundId;
			}
			smSound.addeds.push({
				$el : $el,
				$btn : $btn,
				$progressbar : $progressbar,
				duration : duration,
				$playbtn : find(".playBtn,.pauseBtn"),
				$seekbar : $progressbar.find(".player_seekbar"),
				$playbar : $progressbar.find(".player_playbar"),
				$position : $el.find(".sound_position"),
				$wavebox : $el.find(".player_wavebox"),
				$nonius : $el.find(".player_nonius"),
				$noniusTime : $el.find(".player_nonius_time"),
				$noniusCover : $el.find(".player_nonius_cover")
			});
			if ($last && $last.attr("sound_id") == soundId) {
				if (last && last.playState) {
					$btn.addClass("is-paused").removeClass("is-ready is-playing is-loading");
				}
			}
			$btn.on("click", function(e) {
				var $btn = $(this);
				var $soundId = $btn.closest("[sound_id]");
				var soundId = $soundId.attr("sound_id");
				var $last = _this.$last;
				var last = _this.last;
				e.preventDefault();
				if ($btn.is(".is-ready")) {
					if ($last && $last.attr("sound_id") !== soundId) {
						if (last && last.playState) {
							last._last_position = last.position || 0;
							if (!last.paused) {
								playCount.putInfo(last.soundId, (new Date()).getTime(), "onstop");
							}
							last.stop();
							last.unload();
						}
					}
					smSound.play();
					return;
				} else if ($btn.is(".is-paused")) {
					smSound.pause();
					return;
				}
				return;
			});
			$progressbar.on(helper.events.START_EV, function(e) {
				var $sound_id = $btn.closest("[sound_id]");
				var clientX = (e.type == "touchstart") ? event.touches[0].clientX : e.clientX;
				if (!$btn.is(".is-paused")) {
					$btn.trigger("click");
					return;
				}
				var left = $progressbar.offset().left;
				var width = $progressbar.width();
				var percent = (clientX - left) / width;
				var position = duration * percent;
				smSound.setPosition(position);
				smSound._last_position = position;
				return false;
			});
		}
	};
	$.fn.playable = function(options) {
		this.each(function() {
			var $el = $(this);
			if ($el.data("is-playable-binded"))
				return;
			$el.data("is-playable-binded", true);
			playable.bind($el);
		});
		return this;
	};

	/*
	 * 统计播放时长
	 */
	var playCount = {
		infos : {},
		initInfo : function(soundId) {
			this.infos[soundId] = {};
		},
		putInfo : function(soundId, time, type) {
			if (!this.getInfo(soundId)) {
				this.initInfo(soundId);
			}
			this.getInfo(soundId)[time] = type;
		},
		getInfo : function(soundId) {
			return this.infos[soundId];
		},
		postInfo : function(soundId, isFinal) {
			var time = this.getInfo(soundId);
			var duration = this.getPlayDuration(time);
			var position = 0;
			var smSound = soundManager.getSoundById("s" + soundId);
			var async = !isFinal;
			this.initInfo(soundId);
			if (smSound) {
				position = smSound._last_position;
			}
			if (async !== false) {
				async = true;
			}
			$.ajax({
				url : 'tracks/' + soundId + '/play',
				data : {
					played_secs : Math.floor(parseInt(position, 10) / 1000),
					duration : Math.floor(parseInt(duration, 10) / 1000)
				},
				timeout : 3000,
				async : async,
				type : "post"
			});
		},
		render : function(soundId) {
			var btn = $("[sound_id=" + soundId + "]").find(".play-count").show();
			var count = parseInt(btn.eq(0).text(), 10) + 1;
			btn.text(count).attr("title", "播放" + count);
		},
		getPlayDuration : function(time) {
			var duration = 0, times = getKeys(time).sort(function(a, b) {
				return a - b;
			});
			$.each(times, function(i, v) {
				var type = time[v];
				if (type == "onpause" || type == "onstop" || type == "onfinish" || type == "onbuffering") {
					if (i > 0) {
						duration += v - times[i - 1];
					}
				}
			});
			return duration;
		}
	};
	function unload() {
		if (!window.mainPlayer)
			return;
		var sound = mainPlayer.sound();
		if (sound && sound.id) {
			var smSound = mainPlayer.smSound();
			if (smSound.playState) {
				var soundId = sound.id;
				smSound._last_position = smSound.position;
				if (!smSound.paused)
					playCount.putInfo(soundId, (new Date()).getTime(), "onstop");
				playCount.postInfo(soundId, true);
			}
		}
	}
	if ($.browser.safari) {
		window.onbeforeunload = function() {
			unload();
		};
	} else {
		$(window).unload(function() {
			unload();
		});
	}
	function getKeys(obj) {
		var keys = [];
		for ( var key in obj) {
			if (obj.hasOwnProperty(key)) {
				keys.push(key);
			}
		}
		return keys;
	}

	soundManager.setup({
		preferFlash : false,
		url : 'swf/512/default.htm',
		flashVersion : 9,
		debugMode : false,
		html5PollingInterval : 1000,
		useHighPerformance : true
	});
	soundManager.onready(function() {
		$("[sound_id]").playable();
		soundManager.isOnReady = true;
	});
	wave.render();
})($, soundManager);