(function($, window) {
	var wave = {
		$parents : [],
		render : function(options) {
			var op = options || {}, $container = op.$container, isManual = op.isManual || false, $els;
			if ($container) {
				$els = $container.find(".player_wavebox");
			} else {
				$els = $(".player_wavebox");
			}
			for ( var i = 0, len = $els.size(); i < len; i++) {
				this._draw($els.eq(i), isManual);
			}
		},
		_draw : function($el, isManual) {
			if (!isManual && ($el.closest(".player_progressbar").data("drawed") || $el.closest(".player_progressbar").is(":hidden"))) {
				return;
			}
			var $parent = $el.parents("[sound_id]"), soundId = $parent.attr("sound_id"), waveUrl = $el.attr("sound_wave"), uploadId = $el.attr("sound_uploadId");
			if (!waveUrl || !uploadId)
				return;
			$el.closest(".player_progressbar").data("drawed", true);
			this.$parents.push($parent);
			$.ajax({
				url : waveUrl,
				cache : true,
				dataType : "jsonp",
				jsonpCallback : "$.noop"
			});
		},
		draw : function(uploadId, wave) {
			this.drawItem(uploadId, wave);
		},
		drawItem : function(uploadId, wave) {
			var _this = this;
			$.each(this.$parents, function(index, $parent) {
				if ($parent && $parent.find("[sound_uploadId=" + uploadId + "]").size()) {
					var $el = $parent.find(".player_wavebox");
					if ($el) {
						var width = $el.width(), height = $el.height();
						if ($el.find(".player_playbar,player_seekbar,player_backgroundbar").size()) {
							var $bgBar = $el.find(".player_backgroundbar");
							var $seekBar = $el.find(".player_seekbar");
							var $playBar = $el.find(".player_playbar");
							var waves = [];
							if ($bgBar.size()) {
								waves.push({
									color : "#CCCCCC",
									container : $bgBar
								});
							}
							if ($seekBar.size()) {
								waves.push({
									color : "#BBBBBB",
									container : $seekBar
								});
							}
							if ($playBar.size()) {
								waves.push({
									color : "#FF6600",
									container : $playBar
								});
							}
							var wave_els = _this.drawWave({
								data : wave,
								width : width,
								height : height,
								isMask : false,
								waves : waves
							});
						} else {
							$el.html(_this.drawWave({
								data : wave,
								width : width,
								height : height,
								isMask : true,
								waves : [ {
									color : "#FFFFFF",
									container : $el
								} ]
							}));
						}
						_this.$parents[index] = undefined;
						$el.closest(".player_progressbar").addClass("is-drawed");
					}
				}
			});
		},
		drawWave : function(options) {
			// data, width, height, color
			var canvas = document.createElement("canvas");
			var rel;
			options.data.samples[options.data.samples.length - 1] = 2;
			if (canvas.getContext) {
				rel = this.drawWaveCanvas(options);
			} else {
				rel = this.drawWaveVml(options);
			}
			return rel;
		},
		drawWaveVml : function(options) {
			var minHeight = 2;
			var data = options.data, width = options.width, height = options.height, color = options.color, isMask = options.isMask, waves = options.waves;
			width = width || data.width;
			height = height || data.height;
			color = color || "#fff";
			var paths = [], part = 4, h = 0, ratio_w = width / data.width, ratio_h = (height) / data.height, wave_path = data.samples;

			for ( var i = 0, len = width, base = len / part; i < len; i++) {
				var path = "";

				h = Math.round((wave_path[Math.round(i / ratio_w)]) * ratio_h);
				h = h <= 2 ? h + 2 : h;
				var y = Math.ceil(height - h);

				if (isMask) {
					path += ' m' + i + ',-1' + ' l' + i + ',' + y;
				} else {
					path += ' m' + i + ',' + y + ' l' + i + ',' + Math.ceil(height);
				}
				var idx = Math.floor(i / base);
				if (!paths[idx]) {
					paths[idx] = "";
				}
				paths[idx] = paths[idx] + path;
			}

			var shapes = [];
			for ( var i = 0; i < waves.length; i++) {
				var shape = "", cur_color = waves[i].color;
				for ( var j = 0; j < part; j++) {
					paths[j] += " e";
					shape += '<v:shape  class="vml" style="width: ' + width + 'px; height: ' + height + 'px;" coordsize="' + [ width, height ].join(",") + '" ' + ' strokecolor="' + cur_color + '" path="' + paths[j] + '"></v:shape>';
				}
				shapes.push(shape);
			}

			for ( var i = 0; i < waves.length; i++) {
				waves[i].container.html(shapes[i]);
			}
		},
		drawWaveCanvas : function(options) {
			var minHeight = 2;
			var data = options.data, width = options.width, height = options.height, color = options.color, isMask = options.isMask, waves = options.waves;
			width = width || data.width;
			height = height || data.height;
			color = color || "#fff";
			var h = 0, ratio_w = width / data.width, ratio_h = (height) / data.height, wave_path = data.samples;

			// var canvas = document.createElement("canvas"), f = canvas.getContext("2d");
			var canvass = [], contexts = [];

			for ( var j = 0, l = waves.length; j < l; j++) {
				var wave = waves[j];
				var canvas = document.createElement("canvas"), f = canvas.getContext("2d");

				canvas.width = width;
				canvas.height = height;
				f.fillStyle = wave.color;
				canvass.push(canvas);
				contexts.push(f);
			}

			for ( var i = 0, len = width; i < len; i++) {
				h = Math.round((wave_path[Math.round(i / ratio_w)]) * ratio_h);
				h = h <= 2 ? h + 2 : h;
				var y = height - h;

				for ( var j2 = 0, l2 = canvass.length; j2 < l2; j2++) {
					f = contexts[j2];
					if (isMask) {
						f.fillRect(i, 0, 1, y);
					} else {
						f.fillRect(i, y, 1, height);
					}
				}
			}
			for ( var i = 0; i < waves.length; i++) {
				waves[i].container.html(canvass[i]);
			}
		},
		release : function() {
			var _this = this;
			$.each(this.$parents, function(index, $parent) {
				if ($parent && $parent.parents("body").size()) {
					_this.$parents[index] = undefined;
				}
			});
		}
	};
	window.wave = wave;
})($, window);